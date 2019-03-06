app.controller('camTreeAlarmCtrl', function ($modalInstance, $scope, $http, $rootScope) {

    this.cancel = function () {
        //alert($rootScope.username + "" + $rootScope.password);

        $modalInstance.dismiss('cancel');
    };
    this.submit = function () {

        $rootScope.selectLinkCamera = $scope.LinkCamera;
        console.log($rootScope.selectLinkCamera);
        $modalInstance.dismiss('cancel');
    }
    $scope.ztreeOnAsyncSuccess1 = function (event, treeId, treeNode) {
        var zTreeObj = $.fn.zTree.getZTreeObj("tree10");
        var checkNodes = zTreeObj.getNodesByParam('pId',treeNode.id,null);
        if(checkNodes===null||checkNodes.length<=0){
            //获取场所的子节点
            $http({
                url: "/ma/orgtree/getCtree/" + treeNode.id,
                method: 'POST',
                data:$rootScope.currentAccountUserinfo.accountName
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

app.directive('myDirL', function ($http,$rootScope) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function ($scope, element, attrs, ngModel) {
            $http({
                url: '/ma/orgtree/zTreeCmaera/1',
                method: 'POST',
                data:$rootScope.currentAccountUserinfo.accountName
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
                        chkboxType: { "Y": "", "N": ""  }
                    },
                    callback: {
                        beforeClick: beforeClick,
                        onExpand: $scope.ztreeOnAsyncSuccess1,
                        onCheck: function (event, treeId, treeNode, clickFlag) {
                            $scope.$apply(function () {
                                var treeObj = $.fn.zTree.getZTreeObj("tree10"),
                                    nodes = treeObj.getCheckedNodes(true);
                                var t=[];
                                var cc={};
                                for (var i = 0; i < nodes.length; i++) {
                                    if(nodes[i].icon==='/img/camera.jpg'||nodes[i].ResType==='132'){
                                        cc=nodes[i].id;
                                        t.push(cc);
                                    }else{
                                        alert("请选择摄像机");
                                        nodes[i].checked=false;
                                        return false;
                                    }

                                }
                                console.log(t);
                                ngModel.$setViewValue(t);

                            });
                        },
                    }
                };

                function beforeClick(treeId, treeNode, clickFlag) {
                    //return (treeNode.click !== false);
                    return !treeNode.isParent;
                }

                $scope.treemenus = response;
                $.fn.zTree.init(element, setting, response);
            }).error(function (data) {
                console.log("error" + data);
            });
        },

    };
});
