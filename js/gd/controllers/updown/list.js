'use strict';

var appUri = "/ma/updown/";
app.factory("UpDown", function ($resource) {
    return $resource(appUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});
app.factory("UpDownService", function () {
    var service = {};
    var app;
    service.get = function () {
        return app;
    };
    service.set = function (newApp) {
        app = newApp;
    };
    return service;
});


app.controller('UpDownCtrl', appCtrl);

function appCtrl($scope, $rootScope, $resource, $state, $http, $modal, UpDown, UpDownService, $compile, DTOptionsBuilder, DTColumnBuilder) {


    var vm = this;
    //datatable当前页数据（用户）的临时数组
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];
    $scope.selectedUser = [];
    UpDown.get(function (data) {
        vm.apps = data.data;

        //getDatatableAPI(vm.apps);
        $scope.dtDataset = vm.apps;
    });
    var update=function () {
        UpDown.get(function (data) {
            vm.apps = data.data;

            //getDatatableAPI(vm.apps);
            $scope.dtDataset = vm.apps;
        });
    }
    vm.remove = function (index) {

        console.log(vm.apps[index].id);
        UpDownService.set(vm.apps[index]);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/updown/delete.html',
            controller: 'DeleteUpDownCtrl',
            size: 'sm'
        });
    };


    vm.add = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/updown/add.html',
            controller: 'AddUpDownCtrl',
            controllerAs: 'addVm',
            backdrop: "static"

        });
        modalInstance.result.then(function (result) {
                     $scope.myWar1=result;
                     update();
                       }, function (reason) {
                       console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel

        });
    };
    vm.view = function (index) {

        var app = vm.apps[index];

        UpDownService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/updown/view.html',
            controller: 'ViewUpDownCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"

        });
    };

    vm.edit = function (index) {
        console.log("edit:" + index);
        var app = vm.apps[index];
        console.log(app);
        UpDownService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/updown/edit.html',
            controller: 'EditUpDownCtrl',
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
            var ss = data.PlatformId;


            return '<input type="checkbox"   ng-model="a[' + ss + ']" ng-checked="false"    ng-click="all(' + ss + ',a[' + ss + '])" id="' + ss + '" name="change_one" >';

        }),
        DTColumnBuilder.newColumn('PlatformId')
            .withTitle("{{'platid'|translate}}"),
        DTColumnBuilder.newColumn('PlatformName')
            .withTitle("{{'platName'|translate}}"),
        DTColumnBuilder.newColumn('IPAddress')
            .withTitle("{{'ipaddress'|translate}}"),
        DTColumnBuilder.newColumn('PlatformPort')
            .withTitle("{{'port'|translate}}"),
        DTColumnBuilder.newColumn('SipID')
            .withTitle('Sip ID'),
        DTColumnBuilder.newColumn('TypeName')
            .withTitle("{{'dockmeth'|translate}}"),
        DTColumnBuilder.newColumn('Status')
            .withTitle("{{'online'|translate}}"),
        DTColumnBuilder.newColumn(null)
            .withTitle("{{'operate'|translate}}")
            .notSortable()
            .renderWith(function (data, type, full, meta) {

                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.view(' + index + ')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="{{\'query\'|translate}}"></i></a>' +
                    '<a type="button" ng-click="showCase.edit(' + index + ')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="{{\'edit\'|translate}}"></i></a>' +
                    '<a type="button" ng-click="showCase.remove(' + index + ')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="{{\'delete\'|translate}}"></i></a>';
                // '<a type="button"  ui-sref=".AppAccounts"  class="btn btn-success btn-xs"> <i class="fa fa-area-chart" tooltip="查看账户"></i></a>';
            })
    ];

    $rootScope.UpDown_SELECT = new Array();

    $rootScope.Updown_All = new Array();
    $scope.all = function (a, m) {

        if (m == true)
            $rootScope.UpDown_SELECT.push(a);
        if (m == false)
            for (var i = 0; i < $rootScope.UpDown_SELECT.length; i++) {
                if (a == $rootScope.UpDown_SELECT[i]) {
                    $rootScope.UpDown_SELECT.splice(i, 1);
                }
            }
        return $rootScope.UpDown_SELECT;
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
            templateUrl: 'tpl/gd/updown/delete_change.html',
            controller: 'Delete_changeUCtrl',
            size: 'sm'
        });

    };

    $scope.delAll = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/updown/delete_ALL.html',
            controller: 'Delete_changeUCtrl',
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
    $scope.select1=true;
    //全选或取消全选
    vm.updateSelectionAll = function ($event) {

        var checkbox = $event.target;

        var action = (checkbox.checked ? 'add' : 'remove');
        if(action=='add'){
            $scope.select1=false;
        }else{
            $scope.select1=true;
        }
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
            $scope.selectedUser.push(user.PlatformId);
            document.getElementById(user.PlatformId).checked = true;
        }
        ;
        if (action === 'remove') {
            document.getElementById(user.PlatformId).checked = false;
            var idx = $scope.selectedUser.indexOf(user.PlatformId);
            $scope.selectedUser.splice(idx, 1);
        }
        $rootScope.Updown_All = $scope.selectedUser;
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


    //下级平台设备信息查询
    vm.query1=function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/updown/query.html',
            controller: 'QueryUpDownCtrl',
            controllerAs: 'queryVm',
            backdrop: "static"
        });
    }
    //下级平台设备状态查询
    vm.query2=function () {
        alert($scope.selectDownNodes);
        console.log($scope.selectDownNodes);
    }
    //下级平台清除设备
    vm.clear1=function () {

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/updown/clean.html',
            controller: 'CleanUpDownCtrl',
            controllerAs: 'cleanVm',
            backdrop: "static"
        });
    }
}
