/**
 * Created by 郄梦岩 on 2017/8/6.
 */
app.controller('DeleteAllAlarmCtrl', function ($scope, $modalInstance, $rootScope,AlarmService,$state,$http) {
    $scope.selectPlans=AlarmService.get();

    $scope.delete_change=function(){
        $http({
            method: 'POST',
            url: '/ma/alarm/deleteAll',
            data:$scope.selectPlans
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