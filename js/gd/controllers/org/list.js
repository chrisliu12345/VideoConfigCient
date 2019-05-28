'use strict';
var orgUri = "/ma/orgtree/";
app.factory("OrgTree", function ($resource) {
    return $resource(orgUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});

app.factory("OrgService", function () {
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
//此工厂用于存放树节点数据
app.factory("OrgTempService", function () {
    var serviceTemp = {};
    var orgTemp;
    serviceTemp.get = function () {
        return orgTemp;
    };
    serviceTemp.set = function (newOrg) {
        orgTemp = newOrg;
    };
    return serviceTemp;
});
app.factory("OrgExportService", function () {
    var serviceTemp = {};
    var orgTemp;
    serviceTemp.get = function () {
        return orgTemp;
    };
    serviceTemp.set = function (newOrg) {
        orgTemp = newOrg;
    };
    return serviceTemp;
});
app.controller('orgCtrl', orgCtrl);

function orgCtrl($scope, $resource, $rootScope, $modal, $interval, OrgTree, OrgService, OrgTempService,$state,OrgExportService, $http) {
    var vm = this;
    $scope.gen=true;
    $scope.alarmConfig=false;
    $scope.token = function () {
        var sto = $rootScope.token;
        return sto;
    };
    $scope.ztreeOnAsyncSuccess1 = function (event, treeId, treeNode) {
        console.log(treeNode);
        OrgService.set(treeNode);
        var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var checkNodes = zTreeObj.getNodesByParam('pId', treeNode.id, null);
        if (checkNodes === null || checkNodes.length <= 0) {
            $http({
                url: "/ma/orgtree/getCtree/" + treeNode.id,
                method: 'POST',
                data:$rootScope.currentAccountUserinfo.accountName
            }).success(function (response) {
                zTreeObj.addNodes(treeNode, response, true);

                zTreeObj.expandNode(treeNode, true);// 将新获取的子节点展开

            }).error(function () {
                alert("请求错误！");
            });
        } else {
            return;
        }

    };
    //右击树菜单
    $scope.zTreeOnRightClick = function (event, treeId, treeNode) {
        $scope.treeNodeTemp = {};

        //C为右键点击摄像机，B为右键点击设备，A为右键点击组
        if (treeNode.cameraNodes === 'C') {
            $scope.treeNodeTemp = treeNode;
            $rootScope.channel_camid=treeNode.id;
            $http({
                url: "/ma/orgtree/getCameraRightOne",
                method: "POST",
                data: treeNode.id
            }).then(
                function success(response) {
                    /*if(response.data.data==="null"){
                        alert("该设备为IPC设备，且设备下未添加摄像机，无法查看和编辑！");
                        return false;
                    }else{*/
                    OrgService.set(response.data.data);
                    $scope.CameraRightClick(event);

                }, function error() {
                    console.log("error");
                });

        } else if (treeNode.cameraNodes === 'B') {
            $scope.treeNodeTemp = treeNode;
            console.log(treeNode);
            if(treeNode.ResType==='132'){
                $scope.alarmConfig=true;
                $rootScope.channel_camid=treeNode.id
            }else{
                $scope.alarmConfig=false;
            }
            $http({
                url: "/ma/orgtree/getResAttrRightOne",
                method: "POST",
                data: treeNode.id
            }).then(
                function success(response) {
                    OrgService.set(response.data.data);
                    OrgTempService.set(treeNode);
                }, function error() {
                    console.log("error");
                });
            $scope.ResAttrRightClick(event);
        }else{
            $scope.treeNodeTemp = treeNode;
            OrgService.set(treeNode);

            //如果是最顶节点，则显示添加根组。否则不显示
            if(treeNode.pId!==null){
                $scope.gen=false;
            }else{
                $scope.gen=true;
            }
            $http({
                url: "/ma/orgtree/getGroupRightOne",
                method: "POST",
                data: treeNode.id
            }).then(
                function success(response) {

                    OrgTempService.set(response.data.data);
                }, function error() {
                    console.log("error");
                });


             $scope.GroupRightClick(event);
        }
    }

    //组右键
    $scope.GroupRightClick=function (e) {
       e.preventDefault();
        //获取我们自定义的右键菜单
        var menu = document.querySelector("#menu2");
        //根据事件对象中鼠标点击的位置，进行定位
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';
        //改变自定义菜单的宽，让它显示出来
        menu.style.width = '170px';
        menu.style.backgroundColor = "white";
        document.querySelector('#menu2').style.height = "auto";
    }
    //摄像机右键
    $scope.CameraRightClick = function (e) {
        //取消默认的浏览器自带右键 很重要！！
        e.preventDefault();
        //获取我们自定义的右键菜单
        var menu = document.querySelector("#menu");
        //根据事件对象中鼠标点击的位置，进行定位
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';
        //改变自定义菜单的宽，让它显示出来
        menu.style.width = '170px';
        menu.style.backgroundColor = "white";
        document.querySelector('#menu').style.height = "auto";
    }
    //设备右键
    $scope.ResAttrRightClick = function (e) {
        //取消默认的浏览器自带右键 很重要！！
        e.preventDefault();
        document.oncontextmenu = function(){
            return false;
        }
        //获取我们自定义的右键菜单
        var menu1 = document.querySelector("#menu1");
        //根据事件对象中鼠标点击的位置，进行定位
        menu1.style.left = e.clientX + 'px';
        menu1.style.top = e.clientY + 'px';
        //改变自定义菜单的宽，让它显示出来
        menu1.style.width = '170px';
        menu1.style.backgroundColor = "white";
        document.querySelector('#menu1').style.height = "auto";
    }
    window.onclick = function (e) {
        //用户触发click事件就可以关闭了，因为绑定在window上，按事件冒泡处理，不会影响菜单的功能
        document.querySelector('#menu').style.height = 0;
        document.querySelector('#menu1').style.height = 0;
        document.querySelector('#menu2').style.height = 0;
    }
    //关闭页面后恢复window事件

    $scope.$on("$destroy", function (e) {
        window.onclick = function () {
        };
    });
    //批量导入
    vm.addCameras = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/org/addCamera/adds.html',
            controller: 'AddCamerasRightCtrl',
            controllerAs: 'addsVm',
            backdrop: "static"

        });
    };
    $scope.getd3Test = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/addAlarm/addAlarm.html',
            controller: 'addIntrusionAlarmCtrl',
            controllerAs: 'addVm',
            backdrop: "static"
        });

    }
    //批量导出摄像机及设备数据
    $scope.exportResAttr = function () {
       var treeNode=OrgService.get();
        $scope.resList={};
        $scope.resList.id=treeNode.id;
        $scope.resList.vid=treeNode.ParentOrgID;
        $scope.resList.name=treeNode.name;
        $scope.resList.accountid=$rootScope.currentAccountUserinfo.accountName;
        $http({
            method: "post",
            url: "ma/common/camera_export",
            data:$scope.resList,
            headers: {
                Authorization: $rootScope.token
            },
            responseType: 'arraybuffer'

        }).then(function successCallback(data) {
                var blob = new Blob([data.data], {type: "application/vnd.ms-excel;utf-8"});
                var objectUrl = URL.createObjectURL(blob);
                var aForExcel = $("<a><span class='forExcel'>下载excel</span></a>").attr("href", objectUrl);
                $("body").append(aForExcel);
                $(".forExcel").click();
                aForExcel.remove();
            }
            , function errorCallback() {
                alert("ERROR");
            });
    }
    //批量导出组数据
    $scope.exportGroups = function () {
        var treeNode=OrgService.get();
        $scope.groList={};
        $scope.groList.id=treeNode.id;
        $scope.groList.vid=treeNode.ParentOrgID;
        $scope.groList.name=treeNode.name;
        $scope.groList.accountid=$rootScope.currentAccountUserinfo.accountName;
        $http({
            method: "post",
            url: "ma/common/group_export_new",
            data:$scope.groList,
            headers: {
                Authorization: $rootScope.token
            },
            responseType: 'arraybuffer'

        }).then(function successCallback(data) {
                var blob = new Blob([data.data], {type: "application/vnd.ms-excel;utf-8"});
                var objectUrl = URL.createObjectURL(blob);
                var aForExcel = $("<a><span class='forExcel'>下载excel</span></a>").attr("href", objectUrl);
                $("body").append(aForExcel);
                $(".forExcel").click();
                aForExcel.remove();
            }
            , function errorCallback() {
                alert("请直接右键查看组信息");
            });

    }
    //右键查看摄像机
    $scope.viewCameraRight = function () {

        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/cameraView.html',
            controller: 'viewRightCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"

        });
    };
    //右键添加摄像机
    $scope.addCameraRight=function () {
        //先查询没有被使用的通道
        $http({
            url: "/ma/common/CamId",
            method: "POST",
            data:$scope.treeNodeTemp.id
        }).then(function success(response) {
            var mm = response.data.data;
            console.log(mm);
            if(mm===''|| mm===null ||mm===undefined){
                alert("该设备下已没有通道可以使用！");
                return false;
            }else{
                var modalInstance = $modal.open({
                    templateUrl: 'tpl/gd/org/addCamera/add.html',
                    controller: 'AddCameraRightCtrl',
                    controllerAs: 'addCamVm',
                    backdrop: "static"

                });
            }
        }, function error() {
            console.log("error");
        });


    }
    //右键编辑摄像机
    $scope.editCameraRight = function () {

        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/cameraEdit.html',
            controller: 'editRightCtrl',
            controllerAs: 'editVm',
            backdrop: "static"

        });
        modalInstance.result.then(function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var node1 = treeObj.getNodeByTId($scope.treeNodeTemp.tId);
            //获取更新后的设备数据
            $http({
                url: "/ma/orgtree/getCameraRightOne",
                method: "POST",
                data: node1.id
            }).then(function success(response) {
                var mm = response.data.data;
                node1.name = mm.Alias;
                treeObj.updateNode(node1);
            }, function error() {
                console.log("error");
            });
        });
    };
    //右键删除摄像机
    $scope.deleteCameraRight=function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/org/cameraDelete.html',
            controller: 'DeleteCameraRightCtrl',
            size: 'sm'
        });
        modalInstance.result.then(function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var node1 = treeObj.getNodeByTId($scope.treeNodeTemp.tId);
            //获取更新后的设备数据
            treeObj.removeNode(node1);

        });
    }
    //右键添加入侵告警
    $scope.addAlarmRight=function(){
        var modalInstance=$modal.open({
            templateUrl: 'tpl/gd/org/addAlarm/addAlarm.html',
            controller: 'addIntrusionAlarmCtrl',
            controllerAs: 'addVm',
            backdrop: "static"
        });
        modalInstance.result.then(function (rr) {
        });
    }
    //右键删除入侵告警
    $scope.deleteAlarmRight=function(){
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/org/alarmDelete.html',
            controller: 'DeleteAlarmRightCtrl',
            size: 'sm'
        });
    }
     //右键添加通道
    $scope.addChannelRight=function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/addCamera/addChannel.html',
            controller: 'addChannel1RightCtrl',
            controllerAs: 'addChannelVm',
            backdrop: "static"

        });
    }
    //右键查看设备
    $scope.viewResAttrRight = function () {

        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/resattrView.html',
            controller: 'viewResAttrRightCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"

        });
    };
    //右键添加设备
    $scope.addResAttrRight = function () {

        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/addResAttrSelect.html',
            controller: 'addResAttrRightCtrl',
            controllerAs: 'addVm',
            backdrop: "static"

        });
        modalInstance.result.then(function (Node) {
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var node1 = treeObj.getNodeByTId($scope.treeNodeTemp.tId);
            //获取更新后的设备数据
           console.log(node1);
           if(node1.ResType==='132'){
               $scope.alarmConfig=true;
           }
        });
    }
    //右键编辑设备
    $scope.editResAttrRight = function () {

        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/resattrEdit.html',
            controller: 'editResAttrRightCtrl',
            controllerAs: 'editVm',
            backdrop: "static"

        });
        modalInstance.result.then(function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var node1 = treeObj.getNodeByTId($scope.treeNodeTemp.tId);
            //获取更新后的设备数据
            $http({
                url: "/ma/orgtree/getResAttrRightOne",
                method: "POST",
                data: node1.id
            }).then(function success(response) {
                var mm = response.data.data;
                node1.name = mm.name;
                treeObj.updateNode(node1);
            }, function error() {
                console.log("error");
            });
        });
    };
    //右键删除设备
    $scope.deleteResAttrRight=function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/org/resattrDelete.html',
            controller: 'DeleteResRightCtrl',
            size: 'sm'
        });
        modalInstance.result.then(function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var node1 = treeObj.getNodeByTId($scope.treeNodeTemp.tId);
            //获取更新后的设备数据
                treeObj.removeNode(node1);

        });
    }
    //右键其他
    $scope.other = function () {
        alert("功能正在开发");
    };
    //右键添加根组
    $scope.addParentGroupRight=function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/addGroup/add.html',
            controller: 'AddParentGroRightCtrl',
            controllerAs: 'addVm',
            backdrop: "static"
        });
    }
    //右键添加子组
    $scope.addGroupRight=function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/addGroup/add.html',
            controller: 'AddGroRightCtrl',
            controllerAs: 'addVm',
            backdrop: "static"
        });
    }
    //右键查询组信息
    $scope.viewGroupRight=function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/groupView.html',
            controller: 'ViewGroRightCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"
        });
    }
    //右键编辑组信息
    $scope.editGroupRight=function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/groupEdit.html',
            controller: 'EditGroRightCtrl',
            controllerAs: 'editVm',
            backdrop: "static"
        });
        modalInstance.result.then(function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var node1 = treeObj.getNodeByTId($scope.treeNodeTemp.tId);
            //获取更新后的设备数据
            $http({
                url: "/ma/orgtree/getGroupRightOne",
                method: "POST",
                data: node1.id
            }).then(function success(response) {
                var mm = response.data.data;
                node1.name = mm.name;
                treeObj.updateNode(node1);
            }, function error() {
                console.log("error");
            });
        });
    }
    //右键删除组信息
    $scope.deleteGroupRight=function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/org/groupDelete.html',
            controller: 'DeleteGroRightCtrl',
            size: 'sm'
        });
        modalInstance.result.then(function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var node1 = treeObj.getNodeByTId($scope.treeNodeTemp.tId);
            //获取更新后的设备数据
            treeObj.removeNode(node1);

        });
    }
    //选择搜索方式
    $scope.selectSearchType=function () {
        if($scope.searchType==='1'||$scope.searchType==='3'){
            //按名称或者IP地址搜索设备
            $scope.searchResAttrNodes1();
        }
        if($scope.searchType==='2'||$scope.searchType==='4'){
            //按名称或者IP地址搜索摄像机
            $scope.searchCameraNodes1();
        }
    }
    //按摄像机名称检索
    $scope.searchCameraNodes1 = function (event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var keywords = document.getElementById("searchCameraOrRes").value;
        //如果输入框为空，则返回父节点
        if (keywords === '' || keywords === null) {
            $scope.getCameraNodes();

        } else {
            //否则根据输入框数据进行搜索
            var node = treeObj.getNodes();
            var nodes = treeObj.transformToArray(node);
            $scope.CameraNodes1={};
            $scope.CameraNodes1.value1=keywords;
            $scope.CameraNodes1.key1=$scope.searchType;
            //var nodes = treeObj.getNodesByParamFuzzy("name", keywords, null);
            $http({
                url: "/ma/orgtree/getInputCamera",
                method: 'POST',
                data: $scope.CameraNodes1
            }).success(function (response) {
                for (var i = 0; i < nodes.length; i++) {
                    treeObj.removeNode(nodes[i]);
                }
                treeObj.addNodes(treeNode, response, true);
                //treeObj.expandNode(treeNode, true);
                treeObj.expandAll(true);
            }).error(function () {
                alert("未找到相应的摄像机！");
            });
        }
    }
    //按设备名称/IP地址检索
    $scope.searchResAttrNodes1 = function (event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var keywords = document.getElementById("searchCameraOrRes").value;
        //如果输入框为空，则返回父节点
        if (keywords === '' || keywords === null) {
            $scope.getCameraNodes();

        } else {
            //否则根据输入框数据进行搜索
            var node = treeObj.getNodes();
            var nodes = treeObj.transformToArray(node);
            $scope.ResAttrNodes1={};
            $scope.ResAttrNodes1.value1=keywords;
            $scope.ResAttrNodes1.key1=$scope.searchType;
            console.log($scope.ResAttrNodes1);
            //var nodes = treeObj.getNodesByParamFuzzy("name", keywords, null);
            $http({
                url: "/ma/orgtree/getInputResAttr",
                method: 'POST',
                data: $scope.ResAttrNodes1
            }).success(function (response) {
                for (var i = 0; i < nodes.length; i++) {
                    treeObj.removeNode(nodes[i]);
                }
                treeObj.addNodes(treeNode, response, true);
                treeObj.expandAll(true);
            }).error(function () {
                alert("未找到相应的设备！");
            });
        }
    }


    $scope.getCameraNodes = function (event, treeId, treeNode) {
        var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
        $http({
            url: "/ma/orgtree/zTreeCmaera/1",
            method: 'POST',
            data:$rootScope.currentAccountUserinfo.accountName
        }).success(function (response) {

            var node = zTreeObj.getNodes();
            var nodes = zTreeObj.transformToArray(node);
            for (var i = 0; i < nodes.length; i++) {
                zTreeObj.removeNode(nodes[i]);
            }
            zTreeObj.addNodes(treeNode, response, true);
            zTreeObj.expandNode(treeNode, true);// 将新获取的子节点展开
        }).error(function () {
            alert("请求错误！");
        });
    }
}



