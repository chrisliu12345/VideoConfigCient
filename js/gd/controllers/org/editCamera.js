'use strict';

app.controller('editRightCtrl', function ($scope, $resource,$rootScope, $http, $state, $modalInstance,OrgService) {

    $scope.camera = OrgService.get();
    $scope.showSelect=false;
    $http({
        url: "/ma/place",
        method: "GET",
    }).then(
        function success(response) {
            console.log(response.data);
            $scope.site6 = response.data;

        }, function error() {
            console.log("error");
        });
    //选择场所类型（子）
    $scope.chanegPlace=function () {
        $http({
            url: "/ma/place/" + $scope.PlaceParent,
            method: 'POST'
        }).then(
            function success(response) {
                if(response.data==='noData'){
                    alert("该父场所下无子场所类型，请重新选择");
                    $scope.showSelect=false;
                    return false;
                }else{
                    $scope.showSelect=true;
                    $scope.site7 = response.data;
                }
            }, function error() {
                console.log("error");
            });
    }
//根据当前的Streamid去获取当前转发服务的名字
    $http({
        url: "/ma/res/sipName",
        method: "POST",
        data:$scope.camera.StreamingID
    }).then(
        function success(response) {
            console.log(response.data.data);
            $scope.StreamIDName = response.data.data;
        }, function error() {
            console.log("error");
        });

    //获取所有转发服务IP
    $http({
        url: "/ma/res/sip1",
        method: "GET",
    }).then(
        function success(response) {
            $scope.site5 = response.data.data;
        }, function error() {
            console.log("error");
        });

    //摄像机对应的设备ID
    $http({
        url: "/ma/camera/CameraToResID",
        method: "POST",
        data:$scope.camera.ResID
    }).then(
        function success(response) {
            $scope.camera.NvrID=response.data.data.ResID;//设备ID
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
            //如果没有选择，则付默认值
            $scope.camera.NvrChannelID=$scope.urls[0].NvrChannelID;
            $scope.camera.PlayUrl=$scope.urls[0].PlayUrl;
        }, function error() {
            console.log("error");
        });

    $http({
        url: "/ma/camera/CameraToPlaceId",
        method: "POST",
        data:$scope.camera.PlaceID
    }).then(
        function success(response) {
            $scope.nowPlaceID=response.data.data;
        }, function error() {
            console.log("error");
        });
    //当更改通道时，默认更新PLAYURL
    this.selectChannel=function (x) {
        var a0=x.split("|");
        $scope.camera.NvrChannelID=a0[0];
        $scope.camera.PlayUrl=a0[1];

    }
    this.submit = function () {
        if($scope.StreamId===0){

        }else{
            $scope.camera.StreamingID=$scope.StreamId;
        }
        $scope.camera.accountName=$rootScope.currentAccountUserinfo.accountName;
        $http({
            url:"/ma/camera/update1",
            method:"POST",
            data:$scope.camera
        }).then(function success(response){
            alert("修改成功！");
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