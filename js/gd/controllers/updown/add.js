'use strict'

app.controller('AddUpDownCtrl', function ($rootScope, $scope, $http, $resource, $modalInstance, $state, UpDown, $modal) {
    /*设置ConnectState为1*/
    /*设置Status为OFF*/
    this.submitUp = function () {
        $scope.updown.Status = "OFF";
        $scope.updown.ConnectState = 1;
        var yanzheng = $scope.updown.SipID.substring(10, 13);

        if ($scope.updown.PlatformName === null || $scope.updown.PlatformName === '') {
            alert("平台名称不能为空");
            return;
        } else if ($scope.updown.IPAddress === null || $scope.updown.IPAddress === '') {
            alert("IP地址不能为空");
            return;
        } else if ($scope.updown.PlatformPort === null || $scope.updown.PlatformPort === '') {
            alert("端口号不能为空");
            return;
     /*   } else if (yanzheng !== '200') {
            alert("平台ID的11~13位应为：200，请修改");
            return;*/
        }
        else {
            UpDown.save({}, $scope.updown, function () {
                alert("添加成功");
                $modalInstance.dismiss('cancel');
                $state.go('app.updown', {}, {reload: true});
            });

        }
    };
    this.submitDown = function () {
        $scope.down.Status = "OFF";
        $scope.down.ConnectState = 2;
        var yanzheng = $scope.down.SipID.substring(10, 13);
        if ($scope.down.PlatformName === null || $scope.down.PlatformName === '') {
            alert("平台名称不能为空");
            return;
        } else if ($scope.down.IPAddress === null || $scope.down.IPAddress === '') {
            alert("IP地址不能为空");
            return;
        } else if ($scope.down.PlatformPort === null || $scope.down.PlatformPort === '') {
            alert("端口号不能为空");
            return;
        /*} else if (yanzheng !== '200') {
            alert("平台ID的11~13位应为：200，请修改");
            return;*/
        }
        else {
            UpDown.save({}, $scope.down, function () {
               /* $modalInstance.close();*/
                alert("添加成功");
                $modalInstance.dismiss('cancel');
                $state.go('app.updown', {}, {reload: true});
            });

        }
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});