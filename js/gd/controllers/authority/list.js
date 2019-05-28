'use strict';
var authorityUri = "/ma/authority/";
app.factory("Authority", function ($resource) {
    return $resource(authorityUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});
app.factory("AuthorityService", function () {
    var service = {};
    var authority;
    service.get = function () {
        return authority;
    };
    service.set = function (newAuthority) {
        authority = newAuthority;
    };
    return service;
});
app.controller('authorityCtrl', authorityCtrl);

function authorityCtrl($scope,$rootScope, $resource, $modal, Authority, AuthorityService, $state, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;

    Authority.get(function (data) {
      //  console.log(data.data[0].authorities.authorityName);
        vm.authorities = data.data;


        //getDatatableAPI(vm.authorities);
        $scope.dtDataset = vm.authorities;
    });

    vm.remove = function (index) {
        AuthorityService.set(vm.authorities[index]);
         var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/authority/delete.html',
            controller: 'DeleteAuthorityCtrl',
             size:'sm'

        });
    };


    vm.add = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/authority/add.html',
            controller: 'AddAuthorityCtrl',
            controllerAs: 'addVm',
            backdrop: "static",

        });
    };

    vm.view = function (index) {
        console.log("view:" + index);
        console.log("view:" + vm.authorities[index].createTime);
        var authority = vm.authorities[index];
        console.log(authority);
        AuthorityService.set(authority);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/authority/view.html',
            controller: 'ViewAuthorityCtrl',
            controllerAs: 'viewVm',
            backdrop: "static",

        });
    };
    vm.edit = function (index) {
        console.log("edit:" + index);
        var authority = vm.authorities[index];
        console.log(authority);
        AuthorityService.set(authority);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/authority/edit.html',
            controller: 'EditAuthorityCtrl',
            controllerAs: 'editVm',
            backdrop: "static",

        });
    };
    vm.toggleAnimation = function () {
        vm.animationsEnabled = !vm.animationsEnabled;
    };

    /**
     * datatable参数设置
     */
    $scope.dtDataset = [];
    //datatable当前页数据（用户）的临时数组
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOrder([[1, 'asc']])
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
        DTColumnBuilder.newColumn('authorityName')
            .withTitle("{{'authName'|translate}}"),
      DTColumnBuilder.newColumn('ak')
            .withTitle("{{'authdesc'|translate}}"),

        DTColumnBuilder.newColumn('updateTime')
            .withTitle("{{'updateTime'|translate}}"),
        DTColumnBuilder.newColumn(null)
            .withTitle("{{'operate'|translate}}")
            .notSortable()
            .renderWith(function(data, type, full, meta){
                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.view('+index+')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="{{\'view\'|translate}}"></i></a>' +
                   '<a type="button" ng-click="showCase.edit('+index+')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="{{\'edit\'|translate}}"></i></a>' +
                    '<a type="button" ng-click="showCase.remove('+index+')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="{{\'delete\'|translate}}"></i></a>';
            })
    ];




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
