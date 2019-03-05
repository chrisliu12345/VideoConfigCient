'use strict';
var serUri = "/ma/server/";
app.factory("Server", function ($resource) {
    return $resource(serUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});

app.factory("ServerService", function () {
    var service = {};
    var org;
    service.get = function () {
        return org;
    };
    service.set = function (newOrg) {
        org = newOrg;
    };
    return service;
});

app.controller('ServerCtrl', srCtrl);

function srCtrl($scope, $timeout,$http,$rootScope, $modal) {
    var vm=this;
    $scope.isDisabled = false;
    //根据实际情况获取ajax异步数据，根据数据情况返回按钮状态
    vm.toggleAnimation = function () {
        vm.animationsEnabled = !vm.animationsEnabled;
    };
    //当前在线人数统计
    $http({
        url: "/ma/logview/getAccountNow",
        method: "GET",
    }).then(function success(response) {
        $scope.radio=response.data.ratio;
        $scope.person=response.data.perons;
    }, function error() {
        console.log("error");
    });
    //重新获取在线人数
    this.reflashNumber = function () {
        $http({
            url: "/ma/logview/getAccountNow",
            method: "GET",
        }).then(function success(response) {
            $scope.radio=response.data.ratio;
            $scope.person=response.data.perons;
        }, function error() {
            console.log("error");
        });
    };
    //下载调试日志时，打开一个模态框，现实调试列表之后，选择相应的信息进行下载
    this.uploadlog = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/server/UpLoadLog.html',
            controller: 'upsskCtrl',
            controllerAs: 'dlVm',
            backdrop: "static"

        });
    };
    //NTP时效配置，打开一个模态框，输入相应的属性，并提交。
    this.ntpconfig = function () {
        /*var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/server/NTPConfig.html',
            controller: 'NtpCtrl',
            controllerAs: 'ntpVm',
            backdrop: "static"

        });*/
        //导出密钥库文件
            $http({
                method: "post",
                url: "ma/logview/exportssl",
                headers: {
                    Authorization: $rootScope.token
                },
                responseType: 'arraybuffer'

            }).then(function successCallback(data) {
                    var blob = new Blob([data.data], {type: "application/msword;charset=utf-8"});
                    var objectUrl = URL.createObjectURL(blob);
                    var aForExcel = $("<a><span class='forExcel'>下载</span></a>").attr("href", objectUrl);
                    $("body").append(aForExcel);
                    $(".forExcel").click();
                    aForExcel.remove();
                }
                , function errorCallback() {
                    alert("操作失败");
                });


    };
    //网络配置，打开一个模态框，输入相应的属性，并提交。
    this.Intconfig = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/server/InternetConfig.html',
            controller: 'IntCtrl',
            controllerAs: 'IntVm',
            backdrop: "static"

        });
    };
    //服务查询与编辑。
    this.Sipconfig = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/server/EditConfig.html',
            controller: 'SipCtrl',
            controllerAs: 'SipVm',
            backdrop: "static"

        });
    };
    this.Mediaconfig = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/server/MediaConfig.html',
            controller: 'MediaCtrl',
            controllerAs: 'MediaVm',
            backdrop: "static"

        });
    };
}


