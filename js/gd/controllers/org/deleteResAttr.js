/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteResRightCtrl', function ($scope,$rootScope, $http,$modalInstance, $state, OrgService) {

    $scope.currentApp = OrgService.get();

    var appId = $scope.currentApp.ResID;
    $scope.currentApp.accountName=$rootScope.currentAccountUserinfo.accountName;
    $scope.submit = function () {
       /* if($scope.currentApp.ResType===134){
            $http({
                url: "/ma/res/deleteEncoder",
                method: "POST",
                data:appId
            }).then(function success(response) {
                $modalInstance.close();

            }, function error() {
                console.log("error");
            });
        }else{*/
            $http({
                url: "/ma/res/delete",
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


