/**
 * Created by 郄梦岩 on 2017/8/6.
 */
app.controller('DeleteAllSaveCtrl', function ($scope, $modalInstance, $rootScope,SaveService,$state,$http) {
    $scope.selectPlans=SaveService.get();

    $scope.delete_change=function(){
        $http({
            method: 'POST',
            url: '/ma/save/deleteAll',
            data:$scope.selectPlans
        }).then(function successCallback() {

            $state.go('app.save', {}, {reload: true});
            $modalInstance.close();
        },function errorCallback(response) {
            alert("error");
        });
    };


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});