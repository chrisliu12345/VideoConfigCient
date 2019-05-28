'use strict';

app.controller('ViewResCtrl', function ($scope, $resource, $modalInstance,Res, ResService) {


    $scope.res = ResService.get();

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});