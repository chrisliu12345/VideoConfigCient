'use strict';

app.controller('editResAttrRightCtrl', function ($scope, $rootScope,$resource, $http, $state, $modalInstance,OrgService) {

    $scope.res = OrgService.get();

    this.submit = function () {
        $scope.res.accountName=$rootScope.currentAccountUserinfo.accountName;
        $http({
            url:"/ma/res/update",
            method:"POST",
            data:$scope.res
        }).then(function success(response){
            alert("修改成功！");
            $modalInstance.close();
        },function error(){
            console.log("error");
        })
    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };



});

