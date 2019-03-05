/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteGroRightCtrl', function ($scope,$rootScope, $modalInstance,$http, $state, OrgTempService) {

    $scope.currentApp = OrgTempService.get();
    $scope.currentApp.accountName=$rootScope.currentAccountUserinfo.accountName;
    var appId = $scope.currentApp.GroupID;

    $scope.submit = function () {

        $http({
            url:"/ma/groups/delete",
            method:"POST",
            data:$scope.currentApp
        }).then(function success(response){
            $modalInstance.close();
        },function error(){
            console.log("error");
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


