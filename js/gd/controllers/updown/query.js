/**
 * Created by Administrator on 2018/2/6 0006.
 */

app.controller('QueryUpDownCtrl', function ($scope, $modalInstance, $state, $http,UpDownService, UpDown) {
    var vm=this;
    var url="";
    $http({
        url: "/ma/updown/MyPlatFormId",
        method: 'GET',
    }).success(function (response) {
        $scope.MyPlatFormId=response.data;
         url=$scope.MyPlatFormId.IPAddress;
    }).error(function () {
        alert("error");
    });
    this.submit = function () {

        $http({
            url: "http://"+url+":5066/Catalog?CatalogType="+$scope.QueryOrSubscribe+"&platformid="+$scope.selectQueryNodes+"&startTime=&endTime",
            method: 'GET',
        }).success(function () {
            alert("查询信息已发送！预计数据传输速度为1000条/分钟");
            $modalInstance.dismiss('cancel');
            $state.go('app.updown', {}, {reload: true});
        }).error(function () {
            alert("与服务端连接失败！请重试");
            $modalInstance.dismiss('cancel');
            $state.go('app.updown', {}, {reload: true});
        });
    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

   $scope.ztreeOnAsyncSuccess1 = function (event, treeId, treeNode) {
        var zTreeObj = $.fn.zTree.getZTreeObj("treeAE");
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

app.directive('myDirC', function ($http) {
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
                        chkStyle: "radio",  //单选框
                        radioType: "all"

                    },
                    callback: {
                        beforeClick: beforeClick,
                        onCheck: function (event, treeId, treeNode, clickFlag) {
                            $scope.$apply(function () {
                                var treeObj = $.fn.zTree.getZTreeObj("treeAE"),
                                    nodes = treeObj.getCheckedNodes(true);
                                ngModel.$setViewValue(nodes[0].id);

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
