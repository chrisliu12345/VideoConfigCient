'use strict';

app.controller('ViewGroCtrl', function ($scope, $resource, $modalInstance, Gro, GroService) {


    $scope.gro = GroService.get();

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});