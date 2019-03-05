app.controller('plaTreeCtrl', function ($modalInstance, $scope, $http, $rootScope) {

    this.cancel = function () {
        //alert($rootScope.username + "" + $rootScope.password);

        $modalInstance.dismiss('cancel');
    };
    this.submit = function () {

        $rootScope.selectNodePlace = $scope.selectPlaNode;
        console.log($rootScope.selectNodePlace);
        $modalInstance.dismiss('cancel');
    }
    $scope.ztreeOnAsyncSuccess1 = function (event, treeId, treeNode) {
        console.log(treeNode);
        var zTreeObj = $.fn.zTree.getZTreeObj("tree1");
        var checkNodes = zTreeObj.getNodesByParam('pId',treeNode.id,null);
        console.log(checkNodes);
        if(checkNodes===null||checkNodes.length<=0){
            $http({
                url: "/ma/place/" + treeNode.id,
                method: 'POST',
            }).success(function (response) {
                zTreeObj.addNodes(treeNode, response,true);

                zTreeObj.expandNode(treeNode, true);// 将新获取的子节点展开

            }).error(function () {
                alert("请求错误！");
            });
        }else{
            return;
        }

    };


});

app.directive('myDir4', function ($http) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function ($scope, element, attrs, ngModel) {
            $http({
                url: '/ma/place',
                method: 'GET',
            }).success(function (response) {
                var setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    check: {
                        enable: true,
                        /*chkStyle: "checkbox",
                        chkboxType: { "Y": "s", "N": "s" }*/
                        chkStyle: "radio",  //单选框
                        radioType: "all"
                    },
                    callback: {
                        beforeClick: beforeClick,
                        /*onClick: $scope.ztreeOnAsyncSuccess1,*/
                        onExpand:$scope.ztreeOnAsyncSuccess1,
                        onCheck: function (event, treeId, treeNode, clickFlag) {
                            $scope.$apply(function () {
                                var treeObj = $.fn.zTree.getZTreeObj("tree1"),
                                    nodes = treeObj.getCheckedNodes(true);
                                var t={};
                                for (var i = 0; i < nodes.length; i++) {
                                    t=nodes[i];
                                    /*t.pId=nodes[i].pId;*/
                                }
                                ngModel.$setViewValue(t);

                            });
                        },

                    }
                };
                function beforeClick(treeId, treeNode, clickFlag) {
                    return (treeNode.click !== false);
                }
                $scope.treemenus = response;
                $.fn.zTree.init(element, setting, response);
            }).error(function (data) {
                console.log("error" + data);
            });

        }
    };
});
