'use strict'

app.controller('AddGroRightCtrl', function ($rootScope, $scope, $modal, $http, $resource, $modalInstance, $state,OrgTempService,OrgService) {
    //初始化数据
    $http({
        url: "/ma/groups",
        method: "GET",
    }).then(
        function success(response) {
            $scope.Roles = response.data.data;
            /*$scope.gro.ParentOrgID="";
             $scope.gro.BusinessGroupID = "";*/
            $scope.bus = false;
        }, function error() {
            console.log("error");
        });
    //类型选择
    $scope.sites = [
        {name: "1：行政区划", value: "1"},
        {name: "2：业务分组", value: "2"},
        {name: "3：虚拟组织", value: "3"}
    ];
    this.changeCS = function () {

        for (var i in $scope.gro) {
            if (i === 'Type') {
                //如果是1,3则显示要选择的父组ID
                if ($scope.gro[i] === '1' || $scope.gro[i] === null || $scope.gro[i] === '') {
                    $scope.bus = false;
                }
                if ($scope.gro[i] === '2' || $scope.gro[i] === '3') {
                    $scope.bus = true;

                }
            }
        }

    }
    //提交


    this.submit = function () {
            //添加子组
            $scope.gro.ParentID = OrgService.get().id;

            $scope.gro.accountName=$rootScope.currentAccountUserinfo.accountName;
            $scope.gro.accountId= $rootScope.currentAccountUserinfo.accountId;
            console.log($rootScope.currentAccountUserinfo.accountId);
           $scope.gro.root="no root";
           $scope.gro.ParentOrgID = OrgTempService.get().VirtualOrgID;
        $http({
            url: "/ma/groups",
            method: "POST",
            data: $scope.gro
        }).then(
            function success(response) {
                $modalInstance.dismiss('cancel');
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                var civil=OrgService.get();
                if(civil.children !==undefined){
                    treeObj.addNodes(civil, response.data.data, true);
                    treeObj.expandNode(civil, true);
                }else{
                    $scope.expandNodes2();
                }
            }, function error() {
                alert("虚拟组ID已存在，请重新填写。");
            });
    };
    //取消
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //展开所选的节点
    $scope.expandNodes2 = function (event, treeId, treeNode) {
        var tt=OrgService.get();
       // console.log(tt);
        $http({
            url: "/ma/orgtree/getCtree/" + tt.id,
            method: 'POST',
            data:$rootScope.currentAccountUserinfo.accountName
        }).success(function (response) {
            var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
            zTreeObj.addNodes(tt, response, true);
            zTreeObj.expandNode(tt, true);// 将新获取的子节点展开

        }).error(function () {
            alert("请求错误！");
        });
    };
});