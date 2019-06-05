'use strict';

app.controller('EditUpDownCtrl', function ($scope, $resource, $http, $state, $modalInstance, UpDown,  UpDownService) {

    $scope.updown =  UpDownService.get();
   /* if($scope.updown.SignalTransportType===1){
        $scope.updown.SignalTransportType="TCP";
    }else if($scope.updown.SignalTransportType===0){
        $scope.updown.SignalTransportType="UDP";
    }
    if($scope.updown.StreamTransportType===0){
        $scope.updown.StreamTransportType="UDP";
    }else if($scope.updown.StreamTransportType===1) {
        $scope.updown.StreamTransportType="TCP";
    }*/
  /*  if($scope.updown.ConnectState===0){
        $scope.updown.ConnectState="无对接";
    }else if($scope.updown.ConnectState===1){
        $scope.updown.ConnectState="上联";
    }else if($scope.updown.ConnectState===2){
        $scope.updown.ConnectState="下联";
    }else if($scope.updown.ConnectState===3){
        $scope.updown.ConnectState="互联";
    }*/
    this.submit = function () {


          $http.post("/ma/updown/updateUpDown", $scope.updown)
                .success(function () {
                    alert("更新成功！");
                    $modalInstance.dismiss('cancel');
                    $state.go('app.updown', {}, {reload: true});
                });

    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});