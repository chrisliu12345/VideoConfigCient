'use strict';

app.controller('ViewUpDownCtrl', function ($scope, $resource, $modalInstance, UpDown, UpDownService) {


    $scope.updown = UpDownService.get();

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});