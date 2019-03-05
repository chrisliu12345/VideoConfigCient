'use strict'

app.controller('AddGroCtrl', function ($rootScope, $scope, $modal, $http, $resource, $modalInstance, $state, Gro) {
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
        {name: "1：{{'fanyi224'|translate}}行政区划", value: "1"},
        {name: "2：{{'fanyi224'|translate}}业务分组", value: "2"},
        {name: "3：{{'fanyi224'|translate}}虚拟组织", value: "3"}
    ];
    //组选择
    this.selectquanxian = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/groups/groupsTree.html',
            controller: 'AddZtreeCtrl',
            controllerAs: 'zTreeNodesVm',
            backdrop: "static"
        });
    }


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


        if ($rootScope.getzTreeNode === undefined) {
            $scope.gro.ParentID = $scope.gro.GroupID;
        } else {
            $scope.gro.ParentID = $rootScope.getzTreeNode.id;
            $scope.gro.ParentOrgID = $scope.getzTreeNode.ParentOrgID;

        }

        $http({
            url: "/ma/groups",
            method: "POST",
            data: $scope.gro
        }).then(
            function success(response) {
                $modalInstance.dismiss('cancel');
                $state.go('app.groups', {}, {reload: true});
            }, function error() {
                console.log("error");
            });
    };
    //取消
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});