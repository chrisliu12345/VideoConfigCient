'use strict';

app.controller('EditResCtrl', function ($scope, $resource, $http, $state, $modalInstance, Res, ResService) {

    $scope.res = ResService.get();

    this.submit = function () {

        $http({
            url:"/ma/res/update",
            method:"POST",
            data:$scope.res
        }).then(function success(response){
            $state.go('app.res', {}, {reload: true});
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

