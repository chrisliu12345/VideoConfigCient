'use strict';

app.controller('viewResAttrRightCtrl', function ($scope, $resource, $modalInstance,OrgService) {


    $scope.res = OrgService.get();

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});