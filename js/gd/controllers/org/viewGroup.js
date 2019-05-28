'use strict';

app.controller('ViewGroRightCtrl', function ($scope, $resource, $modalInstance,OrgTempService) {


    $scope.gro = OrgTempService.get();

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});