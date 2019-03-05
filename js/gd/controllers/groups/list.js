'use strict';

var groUri = "/ma/groups/";
app.factory("Gro", function ($resource) {
    return $resource(groUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});
app.factory("GroService", function () {
    var service = {};
    var gro;
    service.get = function () {
        return gro;
    };
    service.set = function (newApp) {
        gro = newApp;
    };
    return service;
});


app.controller('GroCtrl', groCtrl);

function groCtrl($scope, $rootScope, $resource, $state, $http, $modal, Gro, GroService, $compile, DTOptionsBuilder, DTColumnBuilder) {



    var vm = this;
    //datatable当前页数据（用户）的临时数组
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];
    $scope.selectedUser = [];
    Gro.get(function (data) {
        vm.apps = data.data;
        console.log(vm.apps);
        //getDatatableAPI(vm.apps);
        $scope.dtDataset = vm.apps;
    });

    vm.remove = function (index) {

        console.log(vm.apps[index].id);
        GroService.set(vm.apps[index]);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/groups/delete.html',
            controller: 'DeleteGroCtrl',
            size: 'sm'
        });
    };


    vm.add = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/groups/add.html',
            controller: 'AddGroCtrl',
            controllerAs: 'addVm',
            backdrop: "static"

        });
    };
    vm.view = function (index) {
        var app = vm.apps[index];
        GroService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/groups/view.html',
            controller: 'ViewGroCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"

        });
    };


    vm.edit = function (index) {
        var app = vm.apps[index];
        GroService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/groups/edit.html',
            controller: 'EditGroCtrl',
            controllerAs: 'editVm',
            backdrop: "static"

        });
    };


    vm.export = function () {
        $http({
            method: "GET",
            url: "ma/groups/groups_export",

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
            templateUrl: 'tpl/gd/groups/adds.html',
            controller: 'AddsGroCtrl',
            controllerAs: 'addsVm',
            backdrop: "static"

        });
    };
    vm.toggleAnimation = function () {
        vm.animationsEnabled = !vm.animationsEnabled;
    };


    /**
     * datatable参数设置
     */
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
            $scope.currentUser=currentPageUser;
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
       DTColumnBuilder.newColumn(null).withTitle('<input type="checkbox" class="btn" ng-checked="isSelectedAll()" ng-disabled="canSelectAll()" ng-click="showCase1.updateSelectionAll($event)">').notSortable().withClass("text-center").renderWith(function (data, type, full, meta) {
            var index = $scope.dtDataset.indexOf(data);
           var ss = data.GroupID;
            return '<input type="checkbox"   ng-model="a[' + ss + ']" ng-checked="false"    ng-click="all(' + data.GroupID +',a[' + ss + '])" id="' + data.GroupID + '" name="change_one" >';

       }),
        DTColumnBuilder.newColumn('GroupID')
            .withTitle("组ID"),
        DTColumnBuilder.newColumn('Type')
            .withTitle('类型'),
        DTColumnBuilder.newColumn('VirtualOrgID')
            .withTitle('虚拟组织ID'),
        DTColumnBuilder.newColumn('name')
            .withTitle('组名'),
        DTColumnBuilder.newColumn('ParentID')
            .withTitle('父组ID'),
        DTColumnBuilder.newColumn('BusinessGroupID')
            .withTitle('业务分组ID'),
        DTColumnBuilder.newColumn('ParentOrgID')
            .withTitle('父虚拟组织ID'),
        DTColumnBuilder.newColumn(null)
            .withTitle('操作')
            .notSortable()
            .renderWith(function (data, type, full, meta) {

                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase1.view(' + index + ')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="查看组信息"></i></a>' +
                    '<a type="button" ng-click="showCase1.edit(' + index + ')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="编辑组信息"></i></a>' +
                    '<a type="button" ng-click="showCase1.remove(' + index + ')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="删除组"></i></a>';
            })
    ];


    $rootScope.arraygr = new Array();

    $rootScope.codec_ALL1 = new Array();
    $scope.all = function (a, m) {

        if (m == true)
            $rootScope.codec_ALL1.push(a);
        if (m == false)
            for (var i = 0; i < $rootScope.codec_ALL1.length; i++) {
                if (a == $rootScope.codec_ALL1[i]) {
                    $rootScope.codec_ALL1.splice(i, 1);
                }
            }
        return $rootScope.codec_ALL1;
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
            templateUrl: 'tpl/gd/groups/delete_change.html',
            controller: 'Delete_changeCtrl',
            size: 'sm'
        });

    };

    $scope.delAll = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/groups/delete_ALL.html',
            controller: 'Delete_changeCtrl',
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


    $scope.canSelectAll = function () {
        return (currentPageUser.length === 0);
    };

    //全选或取消全选
    vm.updateSelectionAll = function ($event) {

        var checkbox = $event.target;

        var action = (checkbox.checked ? 'add' : 'remove');

        $scope.show_all(checkbox.checked);
        // console.log($scope.selectedUser.length);
        for (var i = 0; i < $scope.currentUser.length; i++) {
            updateSelected(action, $scope.currentUser[i]);


        }
    };
    //单选或取消单选

    //实际更新被选中用户的数组的方法
    var updateSelected = function (action, user) {

        if (action === 'add' && $scope.selectedUser.indexOf(user) === -1) {
            $scope.selectedUser.push(user.GroupID);
            document.getElementById(user.GroupID).checked = true;

        }
        ;
        if (action === 'remove') {
            document.getElementById(user.GroupID).checked = false;
            var idx = $scope.selectedUser.indexOf(user.GroupID);
            $scope.selectedUser.splice(idx, 1);
        }
        $rootScope.arraygr = $scope.selectedUser;
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
        return $scope.selectedUser.indexOf(user) >= 0;
    };
    $scope.isSelectedByIndex = function (index) {
        return $scope.selectedUser.indexOf(index) >= 0;
        // return $scope.selectedUser.indexOf(vm.users[index]) >= 0;
    };

}