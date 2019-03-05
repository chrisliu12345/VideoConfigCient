'use strict';
var saveUri = "/ma/save/";
app.factory("Save", function ($resource) {
    return $resource(saveUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});

app.factory("SaveService", function () {
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

app.controller('saveCtrl', ssCtrl);

function ssCtrl($scope, $resource, $rootScope, $modal, Save, SaveService, $compile, DTOptionsBuilder, DTColumnBuilder, $state, $http) {
    var vm = this;
    $scope.tree = {};
    $scope.my_tree = $scope.tree = {};
    $scope.select_plan = false;
    $scope.TimeDay = false;
    $scope.ThingDay = false;
    $scope.addSave_Plan = false;
    $scope.query_plan = true;
    $scope.tree_data = [];
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];
    $scope.selectedPlan = [];

    var selectAndContinue = vm.selectAndContinue = function () {
        console.log("我是选择的节点"+$scope.selectNode);
        if($scope.selectNode.length<=0){
            alert("请选择摄像机！");
            return;
        }
       for(var i=0;i<$scope.selectNode.length;i++){
            if ($scope.selectNode[i].cameraNodes !== 'C'&&$scope.selectNode[i].ResType!=='132') {
                $scope.select_plan = false;
                $scope.TimeDay = false;
                $scope.ThingDay = false;
                alert("此节点["+$scope.selectNode[i].name+"]不是摄像机!,请删除！");
                return;
            }
        }
        $scope.select_plan = true;
        $scope.TimeDay = true;
      /*  $http({
            url: "/ma/save/serviceId",
            method: "POST",
            data: $scope.selectNode.id
        }).then(function success(response) {
            $scope.service01 = response.data.data;
        }, function error() {
            console.log("error");
        })*/

    }
    //选择存储服务器
    $http({
        url: "/ma/res/sip1",
        method: "GET",
    }).then(function success(response) {
        $scope.itemt = response.data.data;
    }, function error() {
        console.log("error");
    });

    //以上为组域加载树结构JS///////////////////////////////////////////////////////////
    //配置录像天数
    //获取checkbox的选中状态和属性值
    vm.updateSelectionAll = function ($event, vv) {

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

   /* $scope.plans = [
        {name: "{{\'fanyi516\'|translate}}", value: "1"},
        {name: "{{\'fanyi517\'|translate}}", value: "2"},
    ];*/

    this.planLook = function () {
        if ($scope.plan == '1') {
            $scope.TimeDay = true;
            $scope.ThingDay = false;
        }
        else if ($scope.plan == '2') {
            $scope.TimeDay = false;
            $scope.ThingDay = true;
        }
        else {
            $scope.TimeDay = false;
            $scope.ThingDay = false;
        }
    }
    $scope.ztreeOnAsyncSuccess1 = function (event, treeId, treeNode) {
        console.log(treeNode);
        var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
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

    var getCameraNodes = function (event, treeId, treeNode) {
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
    $scope.searchCameraNodes1 = function (event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var keywords = document.getElementById("searchCamera").value;
        //如果输入框为空，则返回父节点
        if (keywords === '' || keywords === null) {
            getCameraNodes();

        } else {
            //否则根据输入框数据进行搜索
            var node = treeObj.getNodes();
            var nodes = treeObj.transformToArray(node);
            $scope.CameraNodes1={};
            $scope.CameraNodes1.value1=keywords;
            $scope.CameraNodes1.key1="2";
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
                alert("请求错误！");
            });
        }

    }


    //根据存储服务器ID来提示用户该服务器存储计划过多，是否更换服务器
    this.selectService = function () {
        $http({
            method: 'POST',
            url: '/ma/save/selectService',
            data: $scope.StreamID
        }).then(function successCallback(response) {
            if (response.data.data !== 'OK') {
                alert(response.data.data);
            }
        }, function errorCallback(response) {

        });
    }

    //对数据进行提交处理
    vm.submit = function () {
        $scope.savesconfig = {};
        if ($scope.selectNode === null || $scope.selectNode === undefined) {
            alert("请先选择摄像机");
            return;
        } else if (document.getElementById("st_input2").value === null || document.getElementById("st_input2").value === undefined) {
            alert("请填写开始时间");
            return;
        } else if (document.getElementById("dtp_input2").value === null || document.getElementById("dtp_input2").value === undefined) {
            alert("请填写结束时间");
            return;
        } else if (result === null || result === undefined) {
            alert("请选择天数");
            return;
        } else if ($scope.StreamID === null || $scope.StreamID === undefined) {
            alert("请选择存储服务器");
            return;
        } else if ($scope.StopTime <= $scope.StartTime) {
            alert("结束时间不能小于开始时间");
            return;
        } else {
            if ($scope.StreamID === 0 && $scope.service01 !== undefined) {
                $scope.savesconfig.StreamingID = $scope.service01.ServiceID;
            } else {
                $scope.savesconfig.StreamingID = $scope.StreamID;
            }
            $scope.savesconfig.KeepTime = 1;
            $scope.savesconfig.IslostStop = $scope.IslostStop;
            $scope.savesconfig.WorkDay = result;
           /* $scope.savesconfig.StopTime = $scope.StopTime;
            $scope.savesconfig.StartTime = $scope.BeginTime;*/
            $scope.savesconfig.StartTime=document.getElementById("st_input2").value;
            $scope.savesconfig.StopTime=document.getElementById("dtp_input2").value;
           /* $scope.savesconfig.CamID = $scope.selectNode.id;*/
            var listId=[];
            for(var j=0;j<$scope.selectNode.length;j++){
                listId.push($scope.selectNode[j].id)
            }
            $scope.savesconfig.cameraIds=listId;
            console.log($scope.savesconfig);
            $http({
                method: 'POST',
                url: '/ma/save',
                data: $scope.savesconfig
            }).then(function successCallback(response) {
                if (response.data.code === '500') {
                    alert("日期格式错误！正确格式为：HH:MM，例：03:50");
                } else {
                    alert("录像保存成功！");
                    $scope.select_plan = false;
                    $scope.savesconfig.cameraIds=[];
                }

            }, function errorCallback(response) {
                alert("录像保存失败！");
            });
        }
    }
    //查看录像计划
    vm.queryPlan = function () {
        /*$scope.select_plan = false;
         $scope.addSave_Plan = false;
         $scope.query_plan = true;*/
        $state.go('app.save', {}, {reload: true});
    }
    vm.cancel = function () {
        $scope.TimeDay = false;
        $scope.ThingDay = false;
        $scope.select_plan = false;
    }
    //新增
    vm.add = function () {
        $scope.query_plan = false;
        $scope.addSave_Plan = true;
    }
//显示录像计划数据
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];
    $scope.selectedUser = [];
    Save.get(function (data) {
        vm.apps = data.data;
        console.log(vm.apps);
        //getDatatableAPI(vm.apps);
        $scope.dtDataset = vm.apps;
    });
    $scope.dtDataset = [];
    //手动调用angular数据检查$apply的开关
    $scope.manual$applyTag = false;
    $scope.headerCompiled = false;
    /* $scope.dtOptions = DTOptionsBuilder.newOptions()
     .withOption('createdRow', function (row, data, dataIndex) {
     $compile(row)($scope);
     });*/
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
            var ss = data.PlanID;

            //  return '<input type="checkbox"  ng-model="a[' + ss + ']" ng-checked="false"   ng-click="all(' + data.id + ',a[' + ss + '])" id="' + data.id + '" name="change_one" >';
            return '<input type="checkbox"   ng-model="a[' + ss + ']" ng-checked="false"    ng-click="all(' + data.PlanID + ',a[' + ss + '])" id="' + data.PlanID + '" name="change_one" >';
            //return '<input type="checkbox" ng-checked="isSelectedByIndex(' + index + ')" ng-click="showCase.updateSelectionOne($event,' + index + ')">';
        }),
        DTColumnBuilder.newColumn('PlanID')
            .withTitle("{{'videoplan'|translate}}"),
        DTColumnBuilder.newColumn('CamID')
            .withTitle("{{'camid'|translate}}"),
        DTColumnBuilder.newColumn('CameraName')
            .withTitle("{{'camName'|translate}}"),
        DTColumnBuilder.newColumn('StreamingID')
            .withTitle("{{'mediaid'|translate}}"),
        DTColumnBuilder.newColumn('dayTemp')
            .withTitle("{{'workday'|translate}}"),
        DTColumnBuilder.newColumn('KeepTime')
            .withTitle("{{'savetime'|translate}}"),
        DTColumnBuilder.newColumn('IslostStop')
            .withTitle("{{'videoloss'|translate}}"),
        DTColumnBuilder.newColumn('start')
            .withTitle("{{'starttime'|translate}}"),
        DTColumnBuilder.newColumn('stop')
            .withTitle("{{'endtime'|translate}}"),
        DTColumnBuilder.newColumn(null)
            .withTitle("{{'operate'|translate}}")
            .notSortable()
            .renderWith(function (data, type, full, meta) {
                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.view(' + index + ')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="{{\'query\'|translate}}"></i></a>' +
                    '<a type="button" ng-click="showCase.edit(' + index + ')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="{{\'edit\'|translate}}"></i></a>' +
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
            $scope.selectedPlan.push(user.PlanID);
            document.getElementById(user.PlanID).checked = true;

        }
        ;
        if (action === 'remove') {
            document.getElementById(user.PlanID).checked = false;
            var idx = $scope.selectedPlan.indexOf(user.PlanID);
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

    }
    vm.remove = function (index) {
        SaveService.set(vm.apps[index]);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/save/delete.html',
            controller: 'DeleteSaveCtrl',
            size: 'sm'
        });
    };
    vm.view = function (index) {
        console.log("view:" + index);
        var app = vm.apps[index];
        SaveService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/save/view.html',
            controller: 'ViewSaveCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"

        });
    };

    vm.edit = function (index) {
        console.log("edit:" + index);
        var app = vm.apps[index];
        SaveService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/save/edit.html',
            controller: 'EditSaveCtrl',
            controllerAs: 'editVm',
            backdrop: "static"

        });
    };
    vm.removeAllPlan = function () {
        SaveService.set($scope.selectedPlan);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/save/delete_ALL.html',
            controller: 'DeleteAllSaveCtrl',
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
app.directive('ngTimeS', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function ($scope, $element, $attrs, $ngModel) {
            if (!$ngModel) {
                return;
            }
            $('#timepickerTest2').datetimepicker({
                language: 'cn',
                weekStart: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 1,
                minView: 0,
                maxView: 1,
                forceParse: 0
            });
            $('#timepickerTest1').datetimepicker({
                language: 'cn',
                weekStart: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 1,
                minView: 0,
                maxView: 1,
                forceParse: 0
            });
        },
    };
});

app.directive('myDir1', function ($http,$rootScope) {
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
                        chkStyle: "checkbox",
                        chkboxType: {"Y": "s", "N": "s"}
                       /* chkStyle: "radio",  //单选框*/
                       /* radioType: "all"*/
                    },
                    callback: {
                        beforeClick: beforeClick,
                        onExpand: $scope.ztreeOnAsyncSuccess1,
                        onCheck: function (event, treeId, treeNode, clickFlag) {
                            $scope.$apply(function () {
                                var treeObj = $.fn.zTree.getZTreeObj("treeDemo"),
                                    nodes = treeObj.getCheckedNodes(true);
                                    ngModel.$setViewValue(nodes);

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

