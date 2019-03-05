/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteAlarmCtrl', function ($scope, $modalInstance, $state,$http,AlarmService) {

    $scope.currentApp = AlarmService.get();

    var appId = $scope.currentApp.Id;

    $scope.submit = function () {
            $http({
                method: 'POST',
                url: '/ma/alarm/delete',
                data:appId
            }).then(function successCallback() {
                $state.go('app.alarm', {}, {reload: true});
                $modalInstance.close();
            },function errorCallback(response) {
                alert("error");
            });
        };


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


