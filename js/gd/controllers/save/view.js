'use strict';

app.controller('ViewSaveCtrl', function ($http,$scope, $resource, $modalInstance, SaveService) {

    $scope.items=[];
    $scope.saves = SaveService.get();
    //查询该摄像机对应的设备ID
    /*$http({
        url: "/ma/camera/CameraToResID",
        method: "POST",
        data:$scope.camera.ResID
    }).then(
        function success(response) {
            $scope.camera.NvrID=response.data.data.ResID;
        }, function error() {
            console.log("error");
        });
    //查询该摄像机对应的通道信息
    $http({
        url: "/ma/camera/CameraToChannel",
        method: "POST",
        data:$scope.camera.ResID
    }).then(
        function success(response) {
           $scope.urls=response.data.data;
           for(var i=0;i<$scope.urls.length;i++){
               $scope.items.push("通道号:"+$scope.urls[i].NvrChannelID+";\n\rPlayURL:"+$scope.urls[i].PlayUrl);
           }

        }, function error() {
            console.log("error");
        });*/
    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});