/**
 * Created by Administrator on 2017/12/15 0015.
 */
'use strict';

app.controller('addChannel1RightCtrl', function ($rootScope,$scope, $resource, $http, $state, $modalInstance, OrgService) {
    //查询摄像机所属设备是DVR还是NVR
     //获取的是摄像机的属性
    $scope.camera= OrgService.get();
    /* alert($rootScope.channel_NvrID);*/
    //
    this.submit = function () {
        $scope.channel.CamID=$scope.camera.ResID;
       $scope.channel.NvrID= $scope.channel_NvrID;
        $http({
            url:"/ma/channel/update",
            method:"POST",
            data:$scope.channel
        }).then(function success(response){
            //$state.go('app.camera', {}, {reload: true});
            alert("添加成功");
            $modalInstance.close();
        },function error(){
            console.log("error");
        })
    };


    //查询摄像机关联的设备ID
    $http({
        url: "/ma/res/queryOne",
        method: "POST",
        data:$scope.camera.ResID //摄像机ID
    }).then(
        function success(response) {
            $scope.channel_NvrID=response.data.data ;
            console.log("1."+$scope.channel_NvrID);
            //查询是否还有可用通道
            $http({
                url: "/ma/common/CamId",
                method: "POST",
                data:$scope.channel_NvrID
            }).then(
                function success(response) {
                    if(response.data.code=='null'){
                        alert("无可用通道,不可添加！");
                        $modalInstance.close();
                        return false;
                    }
                    $scope.site1 = response.data.data;
                }, function error() {
                    console.log("error");
                });
            $http({
                url: "/ma/channel/NvrID",
                method: "POST",
                data:$scope.channel_NvrID
            }).then(
                function success(response) {
                    $scope.NVRorDVR = response.data.data;

                }, function error() {
                    console.log("error");
                });
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

