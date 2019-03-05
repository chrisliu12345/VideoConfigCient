'use strict';

app.controller('ViewAlarmCtrl', function ($http,$scope, $resource, $modalInstance, AlarmService) {

    $scope.alarm = AlarmService.get();
    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});