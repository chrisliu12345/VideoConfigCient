'use strict';

var logUri = "/ma/logview/";
app.factory("LogView", function ($resource) {
    return $resource(logUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});
app.factory("LogViewService", function () {
    var service = {};
    var logview;
    service.get = function () {
        return logview;
    };
    service.set = function (newApp) {
        logview = newApp;
    };
    return service;
});


app.controller('logVCtrl', logvCtrl);

function logvCtrl($scope, $rootScope, $resource, $state, $http, $modal, LogView, LogViewService, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    //datatable当前页数据（用户）的临时数组
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];
    $scope.selectedUser = [];
    LogView.get(function (data) {
        vm.apps = data.data;
        console.log(vm.apps);
        //getDatatableAPI(vm.apps);
        $scope.dtDataset = vm.apps;
    });
    this.cleanLog=function(){
        $http({
            url:"/ma/logview/cleanLog",
            method:"GET",
        }).then(function success(response){
            $state.go('app.logview', {}, {reload: true});
        },function error(){
            console.log("error");
        })
    }
    vm.toggleAnimation = function () {
        vm.animationsEnabled = !vm.animationsEnabled;
    };
    $scope.dtDataset = [];
    //手动调用angular数据检查$apply的开关
    $scope.manual$applyTag = false;
    $scope.headerCompiled = false;
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOrder([[3, 'desc']])
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
        DTColumnBuilder.newColumn('GroupOrCameraName')
            .withTitle("{{'resName'|translate}}"),
        DTColumnBuilder.newColumn('Comments')
            .withTitle("{{'operateType'|translate}}"),
        DTColumnBuilder.newColumn('UsrName')
            .withTitle("{{'operatePerson'|translate}}"),
        DTColumnBuilder.newColumn('LogDate')
            .withTitle("{{'logdate'|translate}}")
    ];

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