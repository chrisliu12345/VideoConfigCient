/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteAlarmRightCtrl', function ($scope,$rootScope, $http,$modalInstance, $state, OrgService) {

    $scope.submit = function () {
        $http({
            url: "/ma/res/deleteAlarm",
            method: "POST",
            data:$rootScope.channel_camid
        }).then(function success(response) {
            alert("已删除");
            $modalInstance.close();

        }, function error() {
            console.log("error");
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


