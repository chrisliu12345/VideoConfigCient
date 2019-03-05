'use strict';

app.controller('addChannelCtrl', function ($rootScope,$scope, $resource, $http, $state, $modalInstance, Camera, CameraService) {
     //查询该摄像机是NVR设备还是DVR设备？
    $http({
        url: "/ma/channel/NvrID",
        method: "POST",
        data:$rootScope.channel_NvrID
    }).then(
        function success(response) {
            $scope.NVRorDVR = response.data.data;
        }, function error() {
            console.log("error");
        });


    this.submit = function () {
        $scope.channel.CamID=$rootScope.channel_camid;
        $scope.channel.NvrID=$rootScope.channel_NvrID;
        $http({
            url:"/ma/channel/update",
            method:"POST",
            data:$scope.channel
        }).then(function success(response){
            $modalInstance.close();
            alert("添加成功！");
            $state.go('app.camera', {}, {reload: true});

        },function error(){
            console.log("error");
        })
    };
    $http({
        url: "/ma/common/CamId",
        method: "POST",
        data:$rootScope.channel_NvrID
    }).then(
        function success(response) {
            $scope.site1 = response.data.data;
            $scope.channel.NvrChannelID=$scope.site1[0];
        }, function error() {
            console.log("error");
        });
    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.details=false;
    $scope.zhedie=function(){
        $scope.details=false;
    }
    $scope.gaoji=function () {
            $scope.details=true;
    }
    //拼接PLAYURL
    this.select=function () {
        if($scope.NVRorDVR==='111'){
            $scope.channel.PlayUrl="TCP://"+$scope.channel.NvrChannelID+":"+$scope.maliu;
        }
        if($scope.NVRorDVR==='118'){
            $scope.channel.PlayUrl="TCP://"+$scope.channel.NvrChannelID+":1";
        }
        if($scope.NVRorDVR==='132'){
            $scope.channel.PlayUrl="TCP://"+$scope.channel.NvrChannelID+":"+$scope.maliu;
        }

    }


});

