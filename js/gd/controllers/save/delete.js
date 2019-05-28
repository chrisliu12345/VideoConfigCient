/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteSaveCtrl', function ($scope, $modalInstance, $state,$http,SaveService) {

    $scope.currentApp = SaveService.get();

    var appId = $scope.currentApp.PlanID;

    $scope.submit = function () {
            $http({
                method: 'POST',
                url: '/ma/save/delete',
                data:appId
            }).then(function successCallback() {
                $state.go('app.save', {}, {reload: true});
                $modalInstance.close();
            },function errorCallback(response) {
                alert("error");
            });
        };


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


