'use strict'

app.controller('AddCameraCtrl', function ($rootScope, $scope, $modal, $http, $resource, $modalInstance, $state, Camera) {
    //字符串自动补0
    function pad(num, n) {
        var len = num.toString().length;
        while (len < 10) {
            num = num + "0";
            len++;
        }
        return num;
    }

    //生成7位随机数
    function MathRand() {
        var Num = "";
        for (var i = 0; i < 7; i++) {
            Num += Math.floor(Math.random() * 10);
        }
        return Num;
    }

    this.submit = function () {
        //SIPID
        var skt = $scope.ParID.split("|");
        $scope.camera.ParentID = skt[1];
        $scope.camera.ResID=skt[0];
        if ($rootScope.getzTree1 === null || $rootScope.getzTree1 === undefined || $rootScope.getzTree1 === '') {
            $scope.camera.CivilCode = skt[2];
            var pp = pad(skt[2], 10);//前10位
            //11~13位
            if(skt[3]==='132'){
                $scope.camera.ResType="132";

                var camt = skt[3];
            }else{
                var camt = "131";
            }
            //11~13位
            var num = MathRand();//后7位
            var all = pp + camt + num;
            $scope.camera.codec16 = all;

        } else {
            $scope.camera.CivilCode = $rootScope.getzTree1.ParentOrgID;
            var pp = pad($rootScope.getzTree1.ParentOrgID, 10);//前10位
            //11~13位
            if(skt[3]==='132'){
                $scope.camera.ResType="132";
                var camt = skt[3];
            }else{
                var camt = "131";
            };//11~13位
            var num = MathRand();//后7位
            var all = pp + camt + num;
            $scope.camera.codec16 = all;
            $rootScope.getzTree1 = null;
        }
        //判断所属场所是否为空
        if ($rootScope.selectNodePlace === null || $rootScope.selectNodePlace === undefined || $rootScope.selectNodePlace === '') {

        } else {
            $scope.camera.selectPlaceID = $rootScope.selectNodePlace.id;
        }
        var ce = "";
        for (var i = 0; i < $scope.selected.length; i++) {
            if (i !== $scope.selected.length - 1) {
                ce = ce + $scope.selected[i] + "/";
            } else {
                ce = ce + $scope.selected[i];
            }
        }
        $scope.camera.Resolution = ce;

        $http({
            url: "/ma/camera",
            method: "POST",
            data: $scope.camera
        }).then(function success(response) {
            $modalInstance.dismiss('cancel');
            if (skt[0] !== null) {
                $rootScope.channel_NvrID = skt[0];
            } else {
                $rootScope.channel_NvrID = 0;
            }
            $rootScope.channel_camid = response.data.data;

            $modal.open({
                templateUrl: 'tpl/gd/camera/addChannel.html',
                controller: 'addChannelCtrl',
                controllerAs: 'addChannelVm',
                backdrop: "static"

            });
        }, function error() {
            alert("设备SIPID已存在，或者数据为空，请修改！");
        })

    };
    //选择行政区划
    this.selectquanxian = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/camera/cameraTree.html',
            controller: 'camTreeCtrl',
            controllerAs: 'cameraTreeVm',
            backdrop: "static"
        });
    }
    //选择场所类型
    this.selectchangsuo = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/camera/placeTree.html',
            controller: 'plaTreeCtrl',
            controllerAs: 'plaTreeVm',
            backdrop: "static"
        });
    }
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.zu1 = [
        {id: "1", name: "1：QCIF", value: "1"},
        {id: "2", name: "2：CIF", value: "2"},
        {id: "3", name: "3：4CIF", value: "3"},
        {id: "4", name: "4：D1", value: "4"},
        {id: "5", name: "5：720P", value: "5"},
        {id: "6", name: "6：1080P/I", value: "6"}
    ];
    $scope.selected = [];

    var updatedSelected = function (action, id, name) {
        if (action === 'add' && $scope.selected.indexOf(id) === -1) {
            $scope.selected.push(name);

        }
        if (action === 'remove' && $scope.selected.indexOf(id) !== -1) {
            var ids = $scope.selected.indexOf(id);
            $scope.selected.splice(ids, 1);

        }

    }
    $scope.updateedSelect = function ($event, id) {

        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updatedSelected(action, id, checkbox.name);
    }

    $scope.zu2 = [
        {id: "1", name: "1倍速", value: "1"},
        {id: "2", name: "2倍速", value: "2"},
        {id: "4", name: "4倍速", value: "4"},

    ];
    $scope.selected1 = [];

    var updatedSelected1 = function (actions, id1, name1) {
        if (actions === 'add' && $scope.selected1.indexOf(id1) === -1) {
            $scope.selected1.push(name1);

        }
        if (actions === 'remove' && $scope.selected1.indexOf(id1) !== -1) {
            var ids1 = $scope.selected1.indexOf(id1);
            $scope.selected1.splice(ids1, 1);

        }

    }
    $scope.updateedSelect1 = function ($event, id1) {

        var checkbox1 = $event.target;
        var actions = (checkbox1.checked ? 'add' : 'remove');
        updatedSelected1(actions, id1, checkbox1.name);
    }
  //选择设备
    $http({
        url: "/ma/res/resIdName",
        method: "GET",
    }).then(
        function success(response) {
            /*var a = "0";
             response.data.data.push(a);*/
            $scope.site4 = response.data.data;
            console.log($scope.site4);
            if ($scope.site4 === 'null') {
                alert("无可用设备");
                $modalInstance.close();
            }
        }, function error() {
            console.log("error");
        });
    //选择转发服务
    $http({
        url: "/ma/res/sip1",
        method: "GET",
    }).then(
        function success(response) {
            $scope.site5 = response.data.data;
        }, function error() {
            console.log("error");
        });
    $scope.myopen = function () {
        $scope.mywar = true;
    }
    $scope.myclose = function () {
        $scope.mywar = false;
    }
});