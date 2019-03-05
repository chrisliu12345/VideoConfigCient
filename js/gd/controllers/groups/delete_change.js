/**
 * Created by 郄梦岩 on 2017/8/6.
 */
app.controller('Delete_changeCtrl', function ($scope, $modalInstance, $rootScope,$state,$http) {

    $scope.delete_change=function(){
        $http({
            method: 'POST',
            url: '/ma/groups/delete_change',
            data:$rootScope.codec_ALL1
        }).then(function successCallback() {

            $state.go('app.groups', {}, {reload: true});
            $modalInstance.close();
        },function errorCallback(response) {
            alert("error");
        });
    };


    $scope.delete_All=function(){
        $http({
            method: 'POST',
            url: '/ma/groups/delete_change',
            data:$rootScope.arraygr
        }).then(function successCallback() {

            $state.go('app.groups', {}, {reload: true});
            $modalInstance.close();
        },function errorCallback(response) {
            alert("error");
        });
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});