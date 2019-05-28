/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteGroCtrl', function ($scope, $modalInstance, $state, GroService, Gro) {

    $scope.currentApp = GroService.get();

    var appId = $scope.currentApp.GroupID;

    $scope.submit = function () {

        Gro.delete({}, {id: appId}, function () {
            $state.go('app.groups', {}, {reload: true});
            $modalInstance.close();
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


