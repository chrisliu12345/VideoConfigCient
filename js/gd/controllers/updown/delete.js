/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteUpDownCtrl', function ($scope, $modalInstance, $state, UpDownService, UpDown) {

    $scope.currentApp = UpDownService.get();

    var appId = $scope.currentApp.PlatformId;

    $scope.submit = function () {

        UpDown.delete({}, {id: appId}, function () {
            $state.go('app.updown', {}, {reload: true});
            $modalInstance.close();
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


