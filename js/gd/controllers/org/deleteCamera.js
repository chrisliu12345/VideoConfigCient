/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteCameraRightCtrl', function ($scope,$rootScope, $http,$modalInstance, $state, OrgService) {

    $scope.currentApp = OrgService.get();
    $scope.currentApp.accountName=$rootScope.currentAccountUserinfo.accountName;
    var appId = $scope.currentApp.ResID;

    $scope.submit = function () {

      /*  Camera.delete({}, {id: appId}, function () {
            $state.go('app.camera', {}, {reload: true});
            $modalInstance.close();
        });*/
        $http({
            url: "/ma/camera/delete",
            method: "POST",
            data:$scope.currentApp
        }).then(function success(response) {
            $modalInstance.close();

        }, function error() {
            console.log("error");
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


