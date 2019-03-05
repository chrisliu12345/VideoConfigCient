app.controller('plaTreeCtrl', function ($modalInstance, $scope, $http, $rootScope) {

    this.cancel = function () {
        //alert($rootScope.username + "" + $rootScope.password);

        $modalInstance.dismiss('cancel');
    };
    this.submit = function () {

        $rootScope.getzTree1 = $scope.selectNodePlace;
        console.log($rootScope.getzTree1);
        $modalInstance.dismiss('cancel');
    }
    $scope.ztreeOnAsyncSuccess1 = function (event, treeId, treeNode) {
        console.log(treeNode);
        var zTreeObj = $.fn.zTree.getZTreeObj("tree3");
        var checkNodes = zTreeObj.getNodesByParam('pId',treeNode.id,null);
        console.log(checkNodes);
        if(checkNodes===null||checkNodes.length<=0){
            $http({
                url: "/ma/orgtree/getCtree1/" + treeNode.id,
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

app.directive('myDir3', function ($http) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function ($scope, element, attrs, ngModel) {
            $http({
                url: '/ma/orgtree/zTreeCmaera/camera',
                method: 'POST',
            }).success(function (response) {
                var setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    check: {
                        enable: true
                    },
                    callback: {
                        beforeClick: beforeClick,
                        /*onClick: $scope.ztreeOnAsyncSuccess1,*/
                        onExpand:$scope.ztreeOnAsyncSuccess1,
                        onCheck: function (event, treeId, treeNode, clickFlag) {
                            $scope.$apply(function () {
                                var treeObj = $.fn.zTree.getZTreeObj("tree3"),
                                    nodes = treeObj.getCheckedNodes(true);
                                var c={};
                                for(var i=0;i<nodes.length;i++){

                                        c=nodes[i];


                                }
                                ngModel.$setViewValue(c);

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
