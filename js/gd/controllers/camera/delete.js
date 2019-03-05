/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteCameraCtrl', function ($scope, $modalInstance, $state, CameraService, Camera) {

    $scope.currentApp = CameraService.get();

    var appId = $scope.currentApp.ResID;

    $scope.submit = function () {

        Camera.delete({}, {id: appId}, function () {
            $state.go('app.camera', {}, {reload: true});
            $modalInstance.close();
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


