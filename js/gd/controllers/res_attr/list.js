'use strict';

var resUri = "/ma/res/";
app.factory("Res", function ($resource) {
    return $resource(resUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});
/*var camUri = "/ma/camera/";
app.factory("Camera1", function ($resource) {
    return $resource(camUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});*/
app.factory("ResService", function () {
    var service = {};
    var res;
    service.get = function () {
        return res;
    };
    service.set = function (newApp) {
        res = newApp;
    };
    return service;
});


app.controller('ResCtrl', resCtrl);

function resCtrl($scope, $rootScope, $resource, $state, $http, $modal, Res, ResService, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    //datatable当前页数据（用户）的临时数组
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];
    $scope.selectedUser = [];
    Res.get(function (data) {
        vm.apps = data.data;
        console.log(vm.apps);
        //getDatatableAPI(vm.apps);
        $scope.dtDataset = vm.apps;
    });

    vm.remove = function (index) {

        console.log(vm.apps[index].ResID);
        ResService.set(vm.apps[index]);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/res_attr/delete.html',
            controller: 'DeleteResCtrl',
            size: 'sm'
        });
    };


    vm.add = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/res_attr/addSelect.html',
            controller: 'AddResCtrl',
            controllerAs: 'addVm',
            backdrop: "static"

        });
    };
    vm.view = function (index) {
        // console.log("view:" + index);
        //  console.log("view:" + vm.apps[index].createTime);
        var app = vm.apps[index];
        console.log(app);

        ResService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/res_attr/view.html',
            controller: 'ViewResCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"

        });
    };

    vm.edit = function (index) {
        console.log("edit:" + index);
        var app = vm.apps[index];
        console.log(app);
        ResService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/res_attr/edit.html',
            controller: 'EditResCtrl',
            controllerAs: 'editVm',
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
                console.log("header call back");
                $scope.headerCompiled = true;
                $compile(header)($scope);
            }
        })
        .withOption('fnDrawCallback', function (oSettings) {
            currentPageUser = tempCurrentPageUser;
            $scope.currentUser = currentPageUser;
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
            return '<input type="checkbox"   ng-model="a[' + ss + ']" ng-checked="false"    ng-click="all(' + data.ResID + ',a[' + ss + '])" id="' + data.ResID + '" name="change_one" >';
        }),
        DTColumnBuilder.newColumn('ResID')
            .withTitle('资源ID'),
        DTColumnBuilder.newColumn('ProtocolType')
            .withTitle('接入方式'),
        DTColumnBuilder.newColumn('name')
            .withTitle('名称'),
        DTColumnBuilder.newColumn('Manufacturer')
            .withTitle('厂商'),
        DTColumnBuilder.newColumn('Port')
            .withTitle('端口号'),
        DTColumnBuilder.newColumn('Status')
            .withTitle('设备状态'),
        DTColumnBuilder.newColumn(null)
            .withTitle('操作')
            .notSortable()
            .renderWith(function (data, type, full, meta) {

                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.view(' + index + ')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="查看资源"></i></a>' +
                    '<a type="button" ng-click="showCase.edit(' + index + ')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="编辑资源"></i></a>' +
                    '<a type="button" ng-click="showCase.remove(' + index + ')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="删除资源"></i></a>';
                // '<a type="button" ng-click="showCase.addCamera(' + index + ')" class="btn btn-primary btn-xs"><i class="glyphicon glyphicon-plus" tooltip="添加摄像机"></i></a>';
            })
    ];


    $rootScope.arrayres = new Array();

    $rootScope.codec_ALLres = new Array();
    $scope.all = function (a, m) {

        if (m == true)
            $rootScope.arrayres.push(a);

        if (m == false)
            for (var i = 0; i < $rootScope.arrayres.length; i++) {
                if (a == $rootScope.arrayres[i]) {
                    $rootScope.arrayres.splice(i, 1);
                }
            }
        return $rootScope.arrayres;
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
            templateUrl: 'tpl/gd/res_attr/delete_change.html',
            controller: 'DeleteResCtrl1',
            size: 'sm'
        });

    };

    $scope.delAll = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/res_attr/delete_ALL.html',
            controller: 'DeleteResCtrl1',
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
            $scope.selectedUser.push(user.ResID);
            document.getElementById(user.ResID).checked = true;

        }
        ;
        if (action === 'remove') {
            document.getElementById(user.ResID).checked = false;
            var idx = $scope.selectedUser.indexOf(user.ResID);
            $scope.selectedUser.splice(idx, 1);
        }
        $rootScope.codec_ALLres = $scope.selectedUser;
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