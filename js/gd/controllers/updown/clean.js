/**
 * Created by Administrator on 2018/1/31 0031.
 */

app.controller('CleanUpDownCtrl', function ($scope, $modalInstance, $state, $http,UpDownService, UpDown) {
    var vm=this;

    this.submit = function () {
        $http({
            url: "/ma/updown/clear1",
            method: 'POST',
            data:$scope.selectDownNodes
        }).success(function (response) {
            $modalInstance.dismiss('cancel');
            $state.go('app.updown', {}, {reload: true});
            alert("设备清空完成！");
        }).error(function () {
            alert("请求错误！");
        });

    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ztreeOnAsyncSuccess1 = function (event, treeId, treeNode) {
        var zTreeObj = $.fn.zTree.getZTreeObj("tree8");
        var checkNodes = zTreeObj.getNodesByParam('pId',treeNode.id,null);
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
app.directive('myDirV', function ($http) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function ($scope, element, attrs, ngModel) {
            $http({
                url: '/ma/orgtree/updownTree',
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
                       /* onExpand: $scope.ztreeOnAsyncSuccess1,*/
                        onCheck: function (event, treeId, treeNode, clickFlag) {
                            $scope.$apply(function () {
                                var treeObj = $.fn.zTree.getZTreeObj("tree8"),
                                    nodes = treeObj.getCheckedNodes(true);
                                var t=[];
                                var cc={};
                                for (var i = 0; i < nodes.length; i++) {
                                    /* cc=nodes[i].id+","+nodes[i].cameraNodes+","+nodes[i].name+","+nodes[i].ParentOrgID;*/

                                    // treeObj.cancelSelectedNode(nodes[0]);
                                    t.push(nodes[i].id);
                                }
                                console.log(t);
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
        },

    };
});
