'use strict'

app.controller('AddCameraRightCtrl', function ($rootScope, $scope, $modal, $http, $resource, $modalInstance, OrgService,OrgTempService,$state) {
    $scope.showSelect=false;
    $scope.showCamera=true;
  var temp1="";
    var fen= OrgService.get();
    if(fen.ResType===132){
        //$scope.camera.Alias=fen.Name;
        $scope.showCamera=false;
    }
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

    //提交
    this.submit = function () {

        //SIPID
        //fen为设备信息

       // var skt = $scope.ParID.split("|");
        $scope.camera.ParentID = fen.DeviceID;
        $scope.camera.ResID=fen.ResID;
        $scope.camera.CivilCode = fen.CivilCode;
        $scope.camera.accountName=$rootScope.currentAccountUserinfo.accountName;
        $scope.camera.accountId= $rootScope.currentAccountUserinfo.accountId;
       if(fen.ResType===132){
            $scope.camera.ResType="132";
        }
        //获取当前res表中最后的一条数据的deviceID
        $http({
            url:"/ma/res/selectLastData",
            method:"GET",
        }).then(function success(response){
            var lastData=response.data.data;
            temp1=lastData.slice(13);
            var i=parseInt(temp1);
            temp1=i+1;//后7位
            console.log(temp1);
            var pp = pad(fen.CivilCode, 10);//前10位
            //11~13位
            if(fen.ResType===132){
                var camt = fen.ResType;
            }else{
                var camt = "131";
            }
            var all = pp + camt + temp1;
            $scope.camera.codec16 = all;

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
                if (fen.ResID !== null) {
                    $rootScope.channel_NvrID = fen.ResID;
                } else {
                    $rootScope.channel_NvrID = 0;
                }
                $rootScope.channel_camid = response.data.data;

                var modalInstance=$modal.open({
                    templateUrl: 'tpl/gd/org/addCamera/addChannel.html',
                    controller: 'addChannelRightCtrl',
                    controllerAs: 'addChannelVm',
                    backdrop: "static"

                });
                modalInstance.result.then(function (rr) {
                    var nodes=OrgTempService.get();
                    var restype=OrgService.get();
                    if(restype.ResType===132){
                    }else{
                        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                        treeObj.addNodes(nodes, rr, false);
                        treeObj.expandNode(nodes, true);
                    }

                });
            }, function error() {
                alert("设备SIPID已存在，或者数据为空，请修改！");
            })
        },function error(){
            console.log("error");
        })


    };

    //选择场所类型（父）
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
                    //alert("该父场所下无子场所类型，请重新选择");
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
            $scope.site4 = response.data.data;
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