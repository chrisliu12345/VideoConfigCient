'use strict';

app.controller('viewRightCtrl', function ($http,$scope, $resource, $modalInstance,OrgService) {

    $scope.items=[];
    $scope.camera = OrgService.get();
    //查询该摄像机对应的设备ID
    $http({
        url: "/ma/camera/CameraToResID",
        method: "POST",
        data:$scope.camera.ResID
    }).then(
        function success(response) {
            $scope.camera.NvrID=response.data.data.ResID;
            $scope.camera.IPAddress=response.data.data.IPAddress;
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
        });
    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});