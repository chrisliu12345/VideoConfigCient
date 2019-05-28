'use strict';

app.controller('EditChannelCtrl', function ($scope, $resource, $http, $state, $modalInstance, Channel,  ChannelService) {

    $scope.channel =  ChannelService.get();
    this.submit = function () {
        $http({
            url:"/ma/channel/update",
            method:"POST",
            data:$scope.channel
        }).then(function success(response){
            $state.go('app.channel', {}, {reload: true});
            $modalInstance.close();
        },function error(){
            console.log("error");
        })
    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };



});

app.controller('DetailsCameraCtrl', function ($scope, $resource, $http, $state, $modalInstance, Camera, CameraService) {

    $scope.camera = CameraService.get();
    this.submit = function () {

        var appId = $scope.camera.ResID;
        $http({
            url:"ma/camera/",
            method:"POST",
            data:$scope.camera
        }).then(function success(response){
            console.log("OK");
        },function error(){
            console.log("error");
        })   };
    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };



});