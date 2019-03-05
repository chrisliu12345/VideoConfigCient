'use strict'

app.controller('AddParentGroRightCtrl', function ($rootScope, $scope, $modal, $http, $resource, $modalInstance, $state,OrgService) {
    //初始化数据
    $scope.parentadd=true;
    $http({
        url: "/ma/groups",
        method: "GET",
    }).then(
        function success(response) {
            $scope.Roles = response.data.data;
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
            //添加根组
        $scope.gro.ParentID=$scope.gro.GroupID;
        $scope.gro.accountName=$rootScope.currentAccountUserinfo.accountName;
        $scope.gro.accountId= $rootScope.currentAccountUserinfo.accountId;
        $scope.gro.root="root";
        $http({
            url: "/ma/groups",
            method: "POST",
            data: $scope.gro
        }).then(
            function success(response) {
                $modalInstance.dismiss('cancel');
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                    treeObj.addNodes(null, response.data.data, true);
                    treeObj.expandNode(response.data.data, true);

            }, function error() {
                alert("组ID已存在，请重新填写。");
            });
    };
    //取消
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});