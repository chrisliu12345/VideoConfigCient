'use strict';

app.factory("Account", function ($resource) {
    return $resource("/ma/account/:id", {id: "@id"}, {
        update: {}
    });
});

app.factory("AccountService", function () {
    var service = {};
    var accountInfo;
    service.get = function () {
        return accountInfo;
    };
    service.set = function (newAccountInfo) {
        accountInfo = newAccountInfo;
    };
    return service;
});

app.controller('accountCtrl', accountCtrl);

function accountCtrl($scope, $rootScope,$http, $resource, $modal, $log, Account, AccountService, $state,
                     $compile,  User, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.accounts = [];
    var myMap = new Map();

    vm.successGetUserNum = 0;
    vm.failGetUserNum = 0;


    $scope.allAppsAccounts = {};


        // 获取账户列表, 并调用dataTable进行显示
    $http({
        url: "/ma/account/listAccount",
        method: 'POST',
        data:$rootScope.currentAccountUserinfo.validategroupid
    }).success(function (response) {
        vm.accounts = response.data;
        $scope.allAppsAccounts = vm.accounts;
        createDatatableData();
    }).error(function () {
        alert("请求错误！");
    });
      /*  Account.get(function (response) {

            createDatatableData();

        }, function (response) {
            console.log(" get Accounts list error: " + response);
        },function (response) {
            console.log('get app ids failed !')
        });*/


    $scope.showCurrentAppAccount = function () {

        // 如果是所有app就不用请求后台，直接把初始获取的数据传到DataTabel
        if ($scope.AppIds.selected.name === "所有App") {

            //  vm.accounts = $scope.allAppsAccounts;
            createDatatableData();
            return;
        }

        $http({
            url: "/ma/account/queryAccount",
            method: "POST",
            data: {"appId": $scope.AppIds.selected.id.toString()}
            // data: {"appId": "9335241e-8890-4ae7-b11c-66013934767d"}
        }).then(function successCallback(response) {

            console.log(response);
            vm.accounts = response.data.data;

            createDatatableData();
        })
    };
    var createDatatableData = function () {

        vm.successGetUserNum = 0;
        vm.failGetUserNum = 0;

        for (var i = 0; i < vm.accounts.length; i++) {
            vm.accounts[i].appName = myMap.get(vm.accounts[i].appId);
        }

        vm.accounts.forEach(function (value, index) {

            $http({
                url: '/ma/accountUser/' + value.id + '/user',

                method: 'GET'
            }).then(function (response) {
                $scope.user = response.data.data;
                if(response.data.role[0]==undefined)
                {
                    vm.accounts[index].UserRole = "对应角色已不存在";
                }else{
                $scope.role = response.data.role[0];
                    vm.accounts[index].UserRole = $scope.role.roleName;
                }
                vm.accounts[index].realName = $scope.user.realName;
                //value.username是账户名称；
                //alert(vm.accounts[index].realName);
                vm.accounts[index].createTime = value.createTime;




                //$scope.datatableDataset = vm.accounts;
                //getDatatableAPI($scope.datatableDataset);
                vm.successGetUserNum++;

                if ((vm.successGetUserNum + vm.failGetUserNum) === vm.accounts.length) {
                    //getDatatableAPI(vm.accounts);
                    $scope.dtDataset = vm.accounts;
                }

            }, function (response) {
                vm.failGetUserNum++;
                console.log("get User info error!");
                return;
            });
        });

        if (vm.accounts.length === 0) {
            //getDatatableAPI(vm.accounts);
            $scope.dtDataset = vm.accounts;
        }

    };

    vm.removeAccount = function (index) {
        console.log(vm.accounts[index].id);

        // var currentAccount = vm.accounts[id];
        AccountService.set(vm.accounts[index]);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/account/delete.html',
            controller: 'DeleteAccountCtrl',
            size: 'sm'
        });
        //vm.accounts.splice(index, 1);
    };



    vm.addAccounts = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/account/adds.html',
            controller: 'addAccountsCtrl',
            controllerAs: 'addsVm',
            backdrop: "static"

        });
    };
    vm.viewAccount = function (index) {
        console.log("view:" + index);
        console.log("view:" + vm.accounts[index].createTime);
        var accountInfo = vm.accounts[index];
        console.log(accountInfo);
        AccountService.set(accountInfo);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/account/view.html',
            controller: 'ViewAccountCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"

        });
    };
    vm.editAccount = function (index) {
        console.log("edit:" + index);
        var accountInfo = vm.accounts[index];
        console.log(accountInfo);
        AccountService.set(accountInfo);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/account/edit.html',
            controller: 'EditAccountCtrl',
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
        DTColumnBuilder.newColumn('username')
            .withTitle("{{'zhanghu'|translate}}"),
        DTColumnBuilder.newColumn('realName')
            .withTitle("{{'rname'|translate}}"),
        DTColumnBuilder.newColumn('UserRole')
            .withTitle("{{'role'|translate}}"),
        DTColumnBuilder.newColumn(null)
            .withTitle("{{'operate'|translate}}")
            .notSortable()
            .renderWith(function (data, type, full, meta) {
                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.viewAccount(' + index + ')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="{{\'fanyi384\'|translate}}"></i></a>' +
                    '<a type="button" ng-click="showCase.editAccount(' + index + ')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="{{\'editaccount\'|translate}}"></i></a>' +
                    '<a type="button" ng-click="showCase.removeAccount(' + index + ')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="{{\'deleteAccount\'|translate}}"></i></a>';
            })
    ];
    $http({
        method:"GET",
        url:"ma/role"
    }).success(function(data){
    /*    alert(data.data[0].roleName);*/
        var UserRoles=new Array();
        for(var i=0;i<data.data.length;i++){
            UserRoles.push(data.data[i].roleName);
        }

        $rootScope.AccountRole=UserRoles;
    }).error(function(){

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
