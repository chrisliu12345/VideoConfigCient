'use strict';

app.controller('EditGroRightCtrl', function ($scope,$rootScope, $resource, $http, $state, $modalInstance,OrgTempService) {

    $scope.gro = OrgTempService.get();
    $scope.gro.accountName=$rootScope.currentAccountUserinfo.accountName;
    this.submit = function () {
        $http({
            url:"/ma/groups/update",
            method:"POST",
            data:$scope.gro
        }).then(function success(response){
            //$state.go('app.groups', {}, {reload: true});
            $modalInstance.close();
        },function error(){
            console.log("error");
        });
    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});