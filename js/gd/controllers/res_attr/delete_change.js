/**
 * Created by 郄梦岩 on 2017/8/6.
 */
app.controller('DeleteResCtrl1', function ($scope, $modalInstance, $rootScope,$state,$http) {

    $scope.delete_change=function(){
        $http({
            method: 'POST',
            url: '/ma/res/delete_change',
            data:$rootScope.arrayres
        }).then(function successCallback() {

            $state.go('app.res', {}, {reload: true});
            $modalInstance.close();
        },function errorCallback(response) {
            alert("error");
        });
    };


    $scope.delete_All=function(){
        $http({
            method: 'POST',
            url: '/ma/res/delete_change',
            data:$rootScope.codec_ALLres
        }).then(function successCallback() {

            $state.go('app.res', {}, {reload: true});
            $modalInstance.close();
        },function errorCallback(response) {
            alert("error");
        });
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});