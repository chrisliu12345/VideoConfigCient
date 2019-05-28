/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteResCtrl', function ($scope, $modalInstance, $state, ResService, Res) {

    $scope.currentApp = ResService.get();

    var appId = $scope.currentApp.ResID;

    $scope.submit = function () {

        Res.delete({}, {id: appId}, function () {
            $state.go('app.res', {}, {reload: true});
            $modalInstance.close();
        });


    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


