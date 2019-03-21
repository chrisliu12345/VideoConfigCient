'use strict';

app.controller('addIntrusionAlarmCtrl', function ($scope, $rootScope, $resource, $http, $state, $modalInstance, OrgTempService) {
    //摄像机ID
    var vm = this;
    var flag = "";
    var myList = new Array();
    //设置确认设置按钮是否禁用
    var playersmap = {};
    window.players = playersmap;
    var vid = document.getElementById("video1");
    $scope.AlarmData = {};
    $scope.alarmLine = false;
    $scope.drawVideo = false;
    $scope.alarmDoubleLine = false;
    $scope.alarmMulLine = false;
    $scope.cleanDraw = false;
    $scope.alarmArrow = false;
    $scope.items = [
        {id: 0, name: "闯入"},
        {id: 1, name: "闯出"},
        {id: 2, name: "徘徊"},
        {id: 3, name: "骤变"},
        {id: 4, name: "聚众"},
        {id: 5, name: "绊线"},
        {id: 6, name: "双绊线"},
        {id: 7, name: "逆行"},
        {id: 8, name: "奔跑"},
        {id: 9, name: "遗留物检测"},
        {id: 10, name: "物体移除检测"}];
    this.selecttype = function (data) {
        $("#confirm").attr('disabled', true);
        flag = data;
        //清除画布
        d3.select("#test1").select("svg").remove();
        d3.select("#test3").select("svg").remove();
        d3.select("#test2").select("svg").select("line").remove();
        d3.select("#test4").select("svg").remove();
        //画单线
        if (data.id === 5) {
            $scope.alarmLine = true;
            $scope.drawVideo = true;
            $scope.alarmDoubleLine = false;
            $scope.alarmMulLine = false;
            $scope.cleanDraw = true;
            $scope.alarmArrow = false;
            //画双线
        } else if (data.id === 6) {
            $scope.alarmLine = false;
            $scope.drawVideo = true;
            $scope.alarmDoubleLine = true;
            $scope.alarmMulLine = false;
            $scope.cleanDraw = true;
            $scope.alarmArrow = false;
            //画箭头
        } else if (data.id === 7) {
            $scope.alarmLine = false;
            $scope.drawVideo = true;
            $scope.alarmDoubleLine = false
            $scope.alarmMulLine = false;
            $scope.cleanDraw = true;
            $scope.alarmArrow = true;
            //画区域
        } else {
            $scope.alarmLine = false;
            $scope.drawVideo = true;
            $scope.alarmDoubleLine = false;
            $scope.alarmMulLine = true;
            $scope.cleanDraw = true;
            $scope.alarmArrow = false;
        }
    };
    this.ok = function () {
        //画单线
        if ($scope.AlarmData.type.id === 5) {
            var myItems = {
                id: $scope.AlarmData.type.id,
                name: $scope.AlarmData.type.name,
                path: $('#simpline0').val() + ":" + $('#simpline1').val()
            };
            myList.push(myItems);
        } else if ($scope.AlarmData.type.id === 6) {
            //画双线
            var myItems1 = {
                id: $scope.AlarmData.type.id,
                name: $scope.AlarmData.type.name,
                path: $('#doubline0').val() + ";" + $('#doubline1').val() + ";" + $('#doubline2').val() + ";" + $('#doubline3').val()
            };
            myList.push(myItems1);
        } else if ($scope.AlarmData.type.id === 7) {
            //画箭头
            var myItems2 = {
                id: $scope.AlarmData.type.id,
                name: $scope.AlarmData.type.name,
                path: $('#arrow0').val() + ";" + $('#arrow2').val()
            };
            myList.push(myItems2);
        } else {
            //画区域
            var myItems3 = {
                id: $scope.AlarmData.type.id,
                name: $scope.AlarmData.type.name,
                path: $('#mulline').val()
            };
            myList.push(myItems3);
        }
        console.log(myList);
        d3.select("#finishData").append("span").attr("class", "label label-info").attr("id", flag.id.toString())
            .append("text").text(flag.name);
        $("#confirm").attr('disabled', true);
    };
    this.deleteThis = function () {
        //先找到此数据，并把索引记录下来。
        var indexs = new Array();
        for (var i = 0; i < myList.length; i++) {
            if (myList[i].id === $scope.AlarmData.type.id) {
                indexs.push(myList[i].index);
            }
        }
        //删除记录下的索引对应的list里的数据
        if (indexs.length > 0) {
            for (var j = 0; j < indexs.length; j++) {
                myList.pop(myList[j]);
            }
        }
        $("#" + flag.id).remove();

    };
    this.deleteAll = function () {
        myList = [];
        d3.select("#finishData").remove();
    }
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    this.submit = function () {
        $scope.AlarmData.ResId = $rootScope.channel_camid;
        $scope.AlarmData.data = myList;
        console.log()
        $http({
            url: "/ma/res/saveAlarm",
            method: "POST",
            data: $scope.AlarmData
        }).then(
            function success(response) {
                alert("添加成功！");
                $modalInstance.close();
            }, function error() {
                console.log("error");
            });
    }


    //切换到其他页面时关闭视频播放
    $scope.$on('$destroy', function () {
        vm.vis_destroy();
    });
    //播放视频方法
    $scope.selectCameraNow = function () {
        //  $rootScope.channel_camid=28;
        $http({
            url: '/ma/camera/searchCameraUrl',
            method: 'POST',
            data: $rootScope.channel_camid
        }).then(function (result) {
            $scope.tempUrl = result.data.data;
            $scope.CameraUrl = "http://" + $scope.tempUrl + ":8000/RealVideo/W3C_MSE?cameraid="+$rootScope.channel_camid;
            console.log($scope.CameraUrl);
            var xmlhttp;
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            } else {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    // 第四步：使用获取的handle加载视频
                    vm.vis_load('http://' + $scope.tempUrl + ':8000/ACK/W3C_MSE?ctrlHandle=' + xmlhttp.responseText);
                } else if (Number(xmlhttp.status) >= 400) {
                    alert("网络错误，无法添加！");
                    $modalInstance.dismiss('cancel');
                }
            }
            xmlhttp.open("GET", $scope.CameraUrl, true);
            xmlhttp.send();
        }, function (reason) {
            console.log(reason);
        });

    };
    vm.vis_load = function (url) {
        var urlinput = $("#realTimeSearchInput").val();
        console.log('isSupported: ' + visjs.isSupported());
        var element = document.getElementById("video1");
        var mediaDataSource =
            {
                "type": "ps",  // now support ps, rtp, flv
                "isLive": "true",
                "duration": "0",
                "filesize": "0",
                "cors": "true",
                "url": url,  // change this url to switch different camera
                "withCredentials": "false"
            };
        if (typeof playersmap[vid] !== "undefined") {
            if (playersmap[vid] != null) {
                playersmap[vid].unload();
                playersmap[vid].detachMediaElement();
                playersmap[vid].destroy();
                playersmap[vid] = null;
            }
        }
        playersmap[vid] = visjs.createPlayer(mediaDataSource, {
            enableWorker: false,
            lazyLoadMaxDuration: 3 * 60,
            seekType: 'range',
            enableStashBuffer: false
        });
        playersmap[vid].attachMediaElement(element);
        playersmap[vid].load();
    }
    vm.vis_start = function () {
        playersmap[vid].play();
    }

    vm.vis_pause = function () {
        playersmap[vid].pause();
    }

    vm.vis_destroy = function () {
        if (playersmap[vid] == null)
            return;
        playersmap[vid].pause();
        playersmap[vid].unload();
        playersmap[vid].detachMediaElement();
        playersmap[vid].destroy();
        playersmap[vid] = null;
    }

    vm.vis_seekto = function () {
        var input = document.getElementsByName('seekpoint')[0];
        playersmap[vid].currentTime = parseFloat(input.value);
    }

    vm.getUrlParam = function (key, defaultValue) {
        var pageUrl = window.location.search.substring(1);
        var pairs = pageUrl.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var keyAndValue = pairs[i].split('=');
            if (keyAndValue[0] === key) {
                return keyAndValue[1];
            }
        }
        return defaultValue;
    }

});