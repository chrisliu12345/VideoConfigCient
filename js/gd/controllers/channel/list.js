'use strict';

var cUri = "/ma/channel/";
app.factory("Channel", function ($resource) {
    return $resource(cUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});
app.factory("ChannelService", function () {
    var service = {};
    var channel;
    service.get = function () {
        return channel;
    };
    service.set = function (newApp) {
        channel = newApp;
    };
    return service;
});


app.controller('ChannelCtrl', channelCtrl);

function channelCtrl($scope, $rootScope, $resource, $state, $http, $modal, Channel, ChannelService, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    //datatable当前页数据（用户）的临时数组
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];
    $scope.selectedUser = [];
    Channel.get(function (data) {
        vm.apps = data.data;
        console.log(vm.apps);
        //getDatatableAPI(vm.apps);
        $scope.dtDataset = vm.apps;
    });

    vm.toggleAnimation = function () {
        vm.animationsEnabled = !vm.animationsEnabled;
    };
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
        DTColumnBuilder.newColumn(null).withTitle('').notSortable().withClass("text-center").renderWith(function (data, type, full, meta) {
            var index = $scope.dtDataset.indexOf(data);
            $scope.numb = index;
        }),
        DTColumnBuilder.newColumn('CamID')
            .withTitle('摄像机ID'),
        DTColumnBuilder.newColumn('NvrID')
            .withTitle('所属设备ID'),
        DTColumnBuilder.newColumn('PlayUrl')
            .withTitle('自定义播放地址'),
        DTColumnBuilder.newColumn('UseType')
            .withTitle('通道使用类型'),
        DTColumnBuilder.newColumn(null)
            .withTitle('操作')
            .notSortable()
            .renderWith(function (data, type, full, meta) {

                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.view(' + index + ')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="查看通道信息"></i></a>' +
                    '<a type="button" ng-click="showCase.edit(' + index + ')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="编辑通道信息"></i></a>' +
                    '<a type="button" ng-click="showCase.remove(' + index + ')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="清空该通道"></i></a>';

            })
    ];
    //查看通道信息
    vm.view = function (index) {
        var app = vm.apps[index];
        ChannelService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/channel/view.html',
            controller: 'ViewChannelCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"

        });
    };
    //编辑通道信息
    vm.edit = function (index) {
        var app = vm.apps[index];
        ChannelService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/channel/edit.html',
            controller: 'EditChannelCtrl',
            controllerAs: 'editVm',
            backdrop: "static"

        });
    };
    vm.remove = function (index) {

        console.log(vm.apps[index].id);
        ChannelService.set(vm.apps[index]);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/channel/delete.html',
            controller: 'DeleteChannelCtrl',
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
}