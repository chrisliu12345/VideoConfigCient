'use strict';

app.controller('ViewAccountCtrl', function ($scope, $modalInstance, AccountService) {

    $scope.account = AccountService.get();
    $scope.items=$scope.account.place;

    $scope.ok = function () {
        $modalInstance.close();
    };
});