'use strict';

app.controller('EditUpDownCtrl', function ($scope, $resource, $http, $state, $modalInstance, UpDown,  UpDownService) {

    $scope.updown =  UpDownService.get();

    this.submit = function () {


          $http.post("/ma/updown/updateUpDown", $scope.updown)
                .success(function () {
                    $modalInstance.dismiss('cancel');
                    $state.go('app.updown', {}, {reload: true});
                });

    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});