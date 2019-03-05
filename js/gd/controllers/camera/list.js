'use strict';

var appUri = "/ma/camera/";
app.factory("Camera", function ($resource) {
    return $resource(appUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});
app.factory("CameraService", function () {
    var service = {};
    var camera;
    service.get = function () {
        return camera;
    };
    service.set = function (newApp) {
        camera = newApp;
    };
    return service;
});


app.controller('CameraCtrl', appCtrl);

function appCtrl($scope, $rootScope, $resource, $state, $http, $modal, Camera, CameraService, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    //datatable当前页数据（用户）的临时数组
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];
    $scope.selectedUser = [];
    Camera.get(function (data) {
        vm.apps = data.data;
        console.log(vm.apps);
        //getDatatableAPI(vm.apps);
        $scope.dtDataset = vm.apps;
    });

    vm.remove = function (index) {

        console.log(vm.apps[index].ResID);
        CameraService.set(vm.apps[index]);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/camera/delete.html',
            controller: 'DeleteCameraCtrl',
            size: 'sm'
        });
    };


    vm.add = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/camera/add.html',
            controller: 'AddCameraCtrl',
            controllerAs: 'addCamVm',
            backdrop: "static"

        });
    };
    vm.view = function (index) {
        // console.log("view:" + index);
        //  console.log("view:" + vm.apps[index].createTime);
        var app = vm.apps[index];
        console.log(app);

        CameraService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/camera/view.html',
            controller: 'ViewCameraCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"

        });
    };


    vm.edit = function (index) {
        console.log("edit:" + index);
        var app = vm.apps[index];
        console.log(app);
        CameraService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/camera/edit.html',
            controller: 'EditCameraCtrl',
            controllerAs: 'editVm',
            backdrop: "static"

        });
    };
    vm.addChannel = function (index) {
        var app1 = vm.apps[index];

        CameraService.set(app1);
        $http({
            method: "POST",
            url: "ma/common/CameraId",
            data: app1.ResID
        }).then(function successCallback(data) {
/*
               if(data.data.code=='Occupied'){
                   alert("已没有可用的通道");

               }else{*/
                   $rootScope.channel_camid=app1.ResID;
                   $modal.open({
                       templateUrl: 'tpl/gd/camera/addChannel.html',
                       controller: 'addChannel1Ctrl',
                       controllerAs: 'addChannelVm',
                       backdrop: "static"

                   });

            }
            , function errorCallback() {
                alert("ERROR");
            });

    }


    vm.export = function () {
        $http({
            method: "GET",
            url: "ma/camera/camera_export",

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

    vm.addApps = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/camera/adds.html',
            controller: 'AddCamerasCtrl',
            controllerAs: 'addsVm',
            backdrop: "static"

        });
    };
    vm.toggleAnimation = function () {
        vm.animationsEnabled = !vm.animationsEnabled;
    };
  /*  $http({
        url: "ma/camera/getGroup",
        method: "GET",
        headers: {
            Authorization: $rootScope.tokens
        },
    }).then(function success(response) {
        $scope.arraylist1 = new Array();
        for (var i = 0; i < response.data.data.length; i++) {

            $scope.arraylist1.push(response.data.data[i]);
        }

        $rootScope.arraylist1 = $scope.arraylist1;
    }, function error() {

    })
*/
    /**
     * datatable参数设置
     */
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
        DTColumnBuilder.newColumn(null).withTitle('<input type="checkbox" class="btn" ng-checked="isSelectedAll()" ng-disabled="canSelectAll()" ng-click="showCase.updateSelectionAll($event)">').notSortable().withClass("text-center").renderWith(function (data, type, full, meta) {
            var index = $scope.dtDataset.indexOf(data);
            $scope.numb = index;
            var ss = data.ResID;

            //  return '<input type="checkbox"  ng-model="a[' + ss + ']" ng-checked="false"   ng-click="all(' + data.id + ',a[' + ss + '])" id="' + data.id + '" name="change_one" >';
            return '<input type="checkbox"   ng-model="a[' + ss + ']" ng-checked="false"    ng-click="all(' + data.ResID + ',a[' + ss + '])" id="' + data.ResID + '" name="change_one" >';
            //return '<input type="checkbox" ng-checked="isSelectedByIndex(' + index + ')" ng-click="showCase.updateSelectionOne($event,' + index + ')">';
        }),
        DTColumnBuilder.newColumn('ResID')
            .withTitle('摄像机ID'),
        DTColumnBuilder.newColumn('Alias')
            .withTitle('摄像机名称'),
        DTColumnBuilder.newColumn('PtzType')
            .withTitle('PTZ控制类型'),
        DTColumnBuilder.newColumn('PositionType')
            .withTitle('位置'),
        DTColumnBuilder.newColumn('UseType')
            .withTitle('用途'),
        DTColumnBuilder.newColumn(null)
            .withTitle('操作')
            .notSortable()
            .renderWith(function (data, type, full, meta) {

                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.view(' + index + ')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="查看摄像头"></i></a>' +
                    '<a type="button" ng-click="showCase.edit(' + index + ')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="编辑摄像头"></i></a>' +
                    '<a type="button" ng-click="showCase.remove(' + index + ')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="删除摄像头"></i></a>'+
                 '<a type="button" ng-click="showCase.addChannel(' + index + ')" class="btn btn-primary btn-xs"><i class="glyphicon glyphicon-plus" tooltip="添加通道"></i></a>';

            })
    ];


    $rootScope.array1 = new Array();

    $rootScope.codec_ALL1 = new Array();
    $scope.all = function (a, m) {

        if (m == true)
            $rootScope.array1.push(a);
        if (m == false)
            for (var i = 0; i < $rootScope.array1.length; i++) {
                if (a == $rootScope.array1[i]) {
                    $rootScope.array1.splice(i, 1);
                }
            }
        return $rootScope.array1;
    };

    $scope.show_all = function (s) {
        if (s == true) {
            $scope.myWar = true;
        }
        if (s == false) {
            $scope.myWar = false;
        }

    }

    $scope.delColumn = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/camera/delete_change.html',
            controller: 'Delete_changeCCtrl',
            size: 'sm'
        });

    };

    $scope.delAll = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/camera/delete_ALL.html',
            controller: 'Delete_changeCCtrl',
            size: 'sm'
        });
    };

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


    //判断当前页面是否可以进行全选操作，若没有数据，则不可以
    $scope.canSelectAll = function () {
        return (currentPageUser.length === 0);
    };
    $scope.select1 = true;
    //全选或取消全选
    vm.updateSelectionAll = function ($event) {

        var checkbox = $event.target;

        var action = (checkbox.checked ? 'add' : 'remove');
        if (action == 'add') {
            $scope.select1 = false;
        } else {
            $scope.select1 = true;
        }
        $scope.show_all(checkbox.checked);
        // console.log($scope.selectedUser.length);
        for (var i = 0; i < $scope.currentUser.length; i++) {
            updateSelected(action, $scope.currentUser[i]);
            // alert("wo shi updataSelectionAll//"+$scope.currentUser[i]);

        }
    };
    //单选或取消单选

    //实际更新被选中用户的数组的方法
    var updateSelected = function (action, user) {

        if (action === 'add' && $scope.selectedUser.indexOf(user) === -1) {
            $scope.selectedUser.push(user.ResID);
            document.getElementById(user.ResID).checked = true;
        }
        ;
        if (action === 'remove') {
            document.getElementById(user.ResID).checked = false;
            var idx = $scope.selectedUser.indexOf(user.ResID);
            $scope.selectedUser.splice(idx, 1);
        }
        $rootScope.codec_ALL1 = $scope.selectedUser;
    };
    $scope.isSelectedAll = function () {
        // if (myTable === undefined) {
        //     return false;
        // }
        if ($scope.myTable === false) {
            return false;
        }
        if (currentPageUser.length === 0) {
            return false;
        }
        for (var i = 0; i < $scope.currentUser.length; i++) {
            if (!$scope.isSelectedByData($scope.currentUser[i])) {
                //  alert("我是isSelectALL//" + $scope.isSelectedByData($scope.currentUser[i]));
                return false;
            }
        }
        return true;
    }
    $scope.isSelectedByData = function (user) {
        //  alert("我是is SelectByData//"+user);
        return $scope.selectedUser.indexOf(user) >= 0;
    };
    $scope.isSelectedByIndex = function (index) {
        return $scope.selectedUser.indexOf(index) >= 0;
        // return $scope.selectedUser.indexOf(vm.users[index]) >= 0;
    };

}