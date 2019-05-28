app.controller('plaTreeEditCtrl', function ($modalInstance, $scope, $http, $rootScope) {
    $rootScope.EditAllotPlace=null;
    $scope.ztreeOnAsyncSuccess1 = function (event, treeId, treeNode) {
        var zTreeObj = $.fn.zTree.getZTreeObj("tree6");
        var checkNodes = zTreeObj.getNodesByParam('pId',treeNode.id,null);
        console.log(checkNodes);
        if(checkNodes===null||checkNodes.length<=0){
            //获取场所的子节点
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
    this.cancel = function () {
        //alert($rootScope.username + "" + $rootScope.password);
        $scope.EditPlaceNodes=null;
        $modalInstance.dismiss('cancel');
    };
    this.submit = function () {
        $rootScope.EditAllotPlace = $scope.EditPlaceNodes;
        console.log($scope.PlaceNodes);
        $modalInstance.dismiss('cancel');
    }


});

app.directive('myDirQ', function ($http) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function ($scope, element, attrs, ngModel) {
            /*获取场所的父节点*/
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
                        chkStyle: "checkbox",
                        chkboxType: { "Y": "s", "N": "s" }
                    },
                    callback: {
                        beforeClick: beforeClick,
                        onExpand: $scope.ztreeOnAsyncSuccess1,
                        onCheck: function (event, treeId, treeNode, clickFlag) {
                            $scope.$apply(function () {
                                var treeObj = $.fn.zTree.getZTreeObj("tree6"),
                                    nodes = treeObj.getCheckedNodes(true);
                                var c = [];
                                for (var i = 0; i < nodes.length; i++) {
                                    /*t.pId=nodes[i].pId;*/
                                    c.push(nodes[i].id);
                                }
                               console.log(c);
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
        },

    };
});
