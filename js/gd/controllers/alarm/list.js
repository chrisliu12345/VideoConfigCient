'use strict';
var alarmUri = "/ma/alarm/";
app.factory("Alarm", function ($resource) {
    return $resource(alarmUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});

app.factory("AlarmService", function () {
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

app.controller('alarmCtrl', alCtrl);

function alCtrl($scope, $resource, $rootScope, $modal, Alarm, AlarmService, $compile, DTOptionsBuilder, DTColumnBuilder, $state, $http) {
    var vm = this;
    $scope.alarm = {};
    $scope.mutinput={};
    $scope.mutinput.users = [];
    /*$scope.tree = {};
    $scope.my_tree = $scope.tree = {};*/
    $scope.select_plan = false;
    $scope.showSelect=false;
    $scope.TimeDay = false;
    $scope.addSave_Plan = false;
    $scope.query_plan = true;
    $scope.tree_data = [];
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];
    $scope.selectedPlan = [];

    var selectAndContinue = vm.selectAndContinue = function () {
        if ($scope.selectNodeAlarm.icon === '/img/alarm.jpg'||$scope.selectNodeAlarm.icon===undefined) {
            $scope.select_plan = true;
            $scope.TimeDay = true;
        } else{
            alert("请选择报警设备");
            $scope.select_plan = false;
            $scope.TimeDay = false;
        }
    }

    //获取人员列表

    $http({
        method: 'GET',
        url: '/ma/user'
    }).then(function successCallback(response) {
        $scope.userList=response.data.data;
    }, function errorCallback(response) {
        alert("人员信息获取失败！");
    });
    $scope.ztreeOnAsyncSuccess1 = function (event, treeId, treeNode) {
        var zTreeObj = $.fn.zTree.getZTreeObj("treeAlarm");
        var checkNodes = zTreeObj.getNodesByParam('pId', treeNode.id, null);
        console.log(checkNodes);
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

    //对数据进行提交处理
    vm.submit = function () {
        $scope.alarm.DeviceID=$scope.selectNodeAlarm.id;
        $scope.alarm.Linkage_Camera=$rootScope.selectLinkCamera;//获取联动摄像机
        $scope.alarm.Linkage_Method=result;//获取联动方式
        var userlist=new Array();
        if($scope.mutinput.users===null||$scope.mutinput.users===undefined||$scope.mutinput.users.length<=0){
            alert("请选择通知人");
            return false;
        }
        if((result === null || result === undefined)){
            alert("请选择联动方式");
            return false;
        }
        if($rootScope.selectLinkCamera===null || $rootScope.selectLinkCamera===undefined){
            alert("请选择联动摄像机");
            return false;
        }
        for(var i=0;i<$scope.mutinput.users.length;i++){
                    userlist.push($scope.mutinput.users[i].realName);
        }
        $scope.alarm.Notified_person=userlist;

            $http({
                method: 'POST',
                url: '/ma/alarm/add',
                data: $scope.alarm
            }).then(function successCallback(response) {
                alert("添加成功！");
                $scope.select_plan=false;
            }, function errorCallback(response) {
                alert("报警设置保存失败！");
            });
        }


    //查看录像计划
    vm.queryPlan = function () {
        $state.go('app.alarm', {}, {reload: true});
    }
    vm.cancel = function () {
        $scope.TimeDay = false;
        $scope.select_plan = false;
        $rootScope.selectLinkCamera=null;
    }
    //新增
    vm.add = function () {
        $scope.query_plan = false;
        $scope.addSave_Plan = true;
    }
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];
    $scope.selectedUser = [];

    Alarm.get(function (data) {
        vm.apps = data.data;
        console.log(vm.apps);
        $scope.dtDataset = vm.apps;
    });
    $scope.dtDataset = [];
    //手动调用angular数据检查$apply的开关
    $scope.manual$applyTag = false;
    $scope.headerCompiled = false;
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOrder([[1, 'desc']])
        .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
                // Use this headerCompiled field to only compile header once
                console.log("header call back");
                $scope.headerCompiled = true;
                $compile(header)($scope);
            }
        })
        .withOption('fnDrawCallback', function (oSettings) {
            currentPageUser = tempCurrentPageUser;
            $scope.currentUser = currentPageUser;
            //  alert(currentPageUser);
            tempCurrentPageUser = [];
            if ($scope.manual$applyTag) {
                $scope.$apply();
            }
        })
        .withOption('initComplete', function (settings, json) {
            $scope.manual$applyTag = true;
            $scope.myTable = true;
        })
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(row)($scope);
        })
        .withOption('fnRowCallback', function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            tempCurrentPageUser.push(aData);
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle('<input type="checkbox" class="btn" ng-checked="isSelectedAll1()"  ng-click="showCase.updateSelectionAll1($event)">').notSortable().withClass("text-center").renderWith(function (data, type, full, meta) {
            var index = $scope.dtDataset.indexOf(data);
            $scope.numb = index;
            var ss = data.Id;

            //  return '<input type="checkbox"  ng-model="a[' + ss + ']" ng-checked="false"   ng-click="all(' + data.id + ',a[' + ss + '])" id="' + data.id + '" name="change_one" >';
            return '<input type="checkbox"   ng-model="a[' + ss + ']" ng-checked="false"    ng-click="all(' + data.Id + ',a[' + ss + '])" id="' + data.Id + '" name="change_one" >';
            //return '<input type="checkbox" ng-checked="isSelectedByIndex(' + index + ')" ng-click="showCase.updateSelectionOne($event,' + index + ')">';
        }),
        DTColumnBuilder.newColumn('Alarm_event_name')
            .withTitle("{{'alarmename'|translate}}"),
        DTColumnBuilder.newColumn('DeviceName')
            .withTitle("{{'devicname'|translate}}"),
        DTColumnBuilder.newColumn('Input_channel')
            .withTitle("{{'alarmnum'|translate}}"),
        DTColumnBuilder.newColumn('AlarmMethodName')
            .withTitle("{{'alarmmode'|translate}}"),
        DTColumnBuilder.newColumn('AlarmTypeName')
            .withTitle("{{'alarmType'|translate}}"),
        DTColumnBuilder.newColumn('Notified_person')
            .withTitle("{{'tongzhiren'|translate}}"),
        DTColumnBuilder.newColumn('Linkage_MethodName')
            .withTitle("{{'lianType'|translate}}"),
        DTColumnBuilder.newColumn('Linkage_Camera')
            .withTitle("{{'liancam'|translate}}"),
        DTColumnBuilder.newColumn(null)
            .withTitle("{{'operate'|translate}}")
            .notSortable()
            .renderWith(function (data, type, full, meta) {
                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.view(' + index + ')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="{{\'viewsome\'|translate}}"></i></a>' +
                    '<a type="button" ng-click="showCase.remove(' + index + ')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="{{\'delete\'|translate}}"></i></a>';

            })
    ];

    vm.updateSelectionAll1 = function ($event) {

        var checkbox = $event.target;

        var action = (checkbox.checked ? 'add' : 'remove');
        $scope.show_all(checkbox.checked);
        for (var i = 0; i < $scope.currentUser.length; i++) {
            updateSelected1(action, $scope.currentUser[i]);


        }
    };
    var updateSelected1 = function (action, user) {

        if (action === 'add' && $scope.selectedPlan.indexOf(user) === -1) {
            $scope.selectedPlan.push(user.Id);
            document.getElementById(user.Id).checked = true;

        };
        if (action === 'remove') {
            document.getElementById(user.Id).checked = false;
            var idx = $scope.selectedPlan.indexOf(user.Id);
            $scope.selectedPlan.splice(idx, 1);
        }

    };
    $scope.isSelectedAll = function () {
        if ($scope.myTable === false) {
            return false;
        }
        if (currentPageUser.length === 0) {
            return false;
        }
        for (var i = 0; i < $scope.currentUser.length; i++) {
            if (!$scope.isSelectedByData($scope.currentUser[i])) {

                return false;
            }
        }
        return true;
    }
    $scope.isSelectedByData = function (user) {
        //  alert("我是is SelectByData//"+user);
        return $scope.selectedPlan.indexOf(user) >= 0;
    };
    $scope.isSelectedByIndex = function (index) {
        return $scope.selectedPlan.indexOf(index) >= 0;
        // return $scope.selectedUser.indexOf(vm.users[index]) >= 0;
    };
    $scope.all = function (a, m) {

        if (m == true)
            $scope.selectedPlan.push(a);

        if (m == false)
            for (var i = 0; i < $scope.selectedPlan.length; i++) {
                if (a == $scope.selectedPlan[i]) {
                    $scope.selectedPlan.splice(i, 1);
                }
            }

        return $scope.selectedPlan;
    };
    $scope.show_all = function (s) {
        if (s == true) {
            $scope.myWar = true;
        }
        if (s == false) {
            $scope.myWar = false;
        }

    };
    vm.updateSelectionAllA = function ($event, vv) {

        var checkbox = $event.target;

        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, vv);
    };
    var selectDays = new Array();
    var result;
    var updateSelected = function (action, value) {

        if (action === 'add') {
            selectDays.push(value);
        }
        if (action === 'remove') {
            var idx = selectDays.indexOf(value);
            selectDays.splice(idx, 1);
        }
        result = selectDays;


    };
    //选择联动摄像机
    this.selectquanxian1=function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/alarm/cameraTree.html',
            controller: 'camTreeAlarmCtrl',
            controllerAs: 'cameraTreeVm',
            backdrop: "static"
        });
    }
    //根据报警方式选择报警类型
    $scope.chanegAlarmMethod=function(){
        var ii=parseInt($scope.alarm.AlarmMethod);
        $scope.alarm.AlarmType="1";
        $scope.showSelect=true;
        switch (ii){
            case 2:
                $scope.sites=[{name: "视频丢失", value: "1"},
                    {name: "设备防拆报警", value: "2"},
                    {name: "存储设备磁盘满报警", value: "3"},
                    {name: "设备高温报警", value: "4"},
                    {name: "设备低温报警", value: "5"}
                ];
                break;
            case 5:
                $scope.sites=[{name: "人工视频报警", value: "1"},
                    {name: "运动目标检测报警", value: "2"},
                    {name: "遗留物检测报警", value: "3"},
                    {name: "物体移除检测报警", value: "4"},
                    {name: "绊线检测报警", value: "5"},
                    {name: "入侵检测报警", value: "6"},
                    {name: "逆行检测报警", value: "7"},
                    {name: "徘徊检测报警", value: "8"},
                    {name: "流量统计报警", value: "9"},
                    {name: "密度检测报警", value: "10"},
                    {name: "视频异常检测报警", value: "11"},
                    {name: "快速移动报警", value: "12"}
                ];
                break;
            case 6:
                $scope.sites=[{name: "存储设备磁盘故障报警", value: "1"},
                    {name: "存储设备风扇故障报警", value: "2"}];
                break;
            default:
                $scope.alarm.AlarmType=null;
                $scope.showSelect=false;
        }
    }
    vm.remove = function (index) {
        AlarmService.set(vm.apps[index]);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/alarm/delete.html',
            controller: 'DeleteAlarmCtrl',
            size: 'sm'
        });
    };
    vm.view = function (index) {
        console.log("view:" + index);
        var app = vm.apps[index];
        AlarmService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/alarm/view.html',
            controller: 'ViewAlarmCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"

        });
    };

    vm.edit = function (index) {
        console.log("edit:" + index);
        var app = vm.apps[index];
        AlarmService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/save/edit.html',
            controller: 'EditSaveCtrl',
            controllerAs: 'editVm',
            backdrop: "static"

        });
    };
    vm.removeAllPlan = function () {
        console.log($scope.selectedPlan);
        AlarmService.set($scope.selectedPlan);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/alarm/delete_ALL.html',
            controller: 'DeleteAllAlarmCtrl',
            size: 'sm'
        });
    };

}
app.filter('highlight', function () {
    return function (text, search, caseSensitive) {
        if (search || angular.isNumber(search)) {
            text = text.toString();
            search = search.toString();
            if (caseSensitive) {
                return text.split(search).join('<span class="ui-match">' + search + '</span>');
            } else {
                return text.replace(new RegExp(search, 'gi'), '<span class="ui-match">$&</span>');
            }
        } else {
            return text;
        }
    };
});

app.directive('myDirAlarm', function ($http,$rootScope) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function ($scope, element, attrs, ngModel) {
            $http({
                url: '/ma/orgtree/zTreeCmaera/1',
                method: 'POST',
                data:$rootScope.currentAccountUserinfo.accountName
            }).success(function (response) {

                var setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    check: {
                        enable: true,
                        /*chkStyle: "checkbox",
                        chkboxType: {"Y": "s", "N": "s"}*/
                        chkStyle: "radio",  //单选框
                        radioType: "all"
                    },
                    callback: {
                        beforeClick: beforeClick,
                        onExpand: $scope.ztreeOnAsyncSuccess1,
                        onCheck: function (event, treeId, treeNode, clickFlag) {
                            $scope.$apply(function () {
                                var treeObj = $.fn.zTree.getZTreeObj("treeAlarm"),
                                    nodes = treeObj.getCheckedNodes(true);
                                    ngModel.$setViewValue(nodes[0]);

                            });
                        },
                    }
                };

                function beforeClick(treeId, treeNode, clickFlag) {
                    return (treeNode.click !== false);
                }

                $scope.treemenus = response;
                $.fn.zTree.init(element, setting, response);
            }).error(function (data) {
                console.log("error" + data);
            });
        },

    };
});

