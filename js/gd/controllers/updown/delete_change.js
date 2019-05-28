/**
 * Created by 郄梦岩 on 2017/8/6.
 */
app.controller('Delete_changeUCtrl', function ($scope, $modalInstance, $rootScope,$state,$http) {

    $scope.delete_change=function(){
        $http({
            method: 'POST',
            url: '/ma/updown/delete_ALL',
            data:$rootScope.UpDown_SELECT
        }).then(function successCallback() {

            $state.go('app.updown', {}, {reload: true});
            $modalInstance.close();
        },function errorCallback(response) {
            alert("error");
        });
    };


    $scope.delete_All=function(){
        $http({
            method: 'POST',
            url: '/ma/updown/delete_ALL',
            data:$rootScope.Updown_All
        }).then(function successCallback() {

            $state.go('app.updown', {}, {reload: true});
            $modalInstance.close();
        },function errorCallback(response) {
            alert("error");
        });
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});