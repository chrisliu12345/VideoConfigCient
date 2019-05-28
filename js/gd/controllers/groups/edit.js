'use strict';

app.controller('EditGroCtrl', function ($scope, $resource, $http, $state, $modalInstance, Gro, GroService) {

    $scope.gro = GroService.get();
    this.submit = function () {
        $http({
            url:"/ma/groups/update",
            method:"POST",
            data:$scope.gro
        }).then(function success(response){
            $state.go('app.groups', {}, {reload: true});
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