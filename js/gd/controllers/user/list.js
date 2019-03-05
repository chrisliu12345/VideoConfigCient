'use strict';

app.factory("User", function ($resource) {
    return $resource("/ma/user/:id", {id: "@id"}, {
        update: {}
    });
});

app.factory("UserService", function () {
    var service = {};
    var userInfo;
    service.get = function () {
        return userInfo;
    };
    service.set = function (newUserInfo) {
        userInfo = newUserInfo;
    };
    return service;
});

app.controller('userCtrl', userCtrl);

function userCtrl($scope, $rootScope, $http, $resource, OrgTree, $modal, $log, User, UserService, $state, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.users = [];
    $scope.dtDataset = [];
    /**
     * datatable相关变量
     */
     //datatable的api实例变量
    var myTable;
    $scope.myTable = false;
    //手动调用angular数据检查$apply的开关
    $scope.manual$applyTag = false;
    //被选中用户的数组
    $scope.selectedUser = [];
    //datatable当前页数据（用户）的临时数组
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];
    //控制批量修改部门按钮显示的开关
    $scope.showBatchUpdateUserOrgButton = false;
    /* datatable相关变量 */

    var tree;
    $scope.org_tree = tree = {};

    $scope.expanding_property = {
        field: "",
        displayName: "организация",
        sortable: true,
        filterable: true
    };
    $scope.org_tree_handler_select = function (branch) {
        console.log('you clicked on', branch);
        var url = '/ma/user/org/' + branch.id;
        $http.get(url)
            .success(function (data) {
                vm.users = data;
                //getDatatableAPI(vm.users);
                $scope.dtDataset = vm.users;
            });
    };
    $scope.org_tree_handler_click = function (branch) {

        $scope.org_tree.select_branch(branch);
    };
    User.get(function (data) {
        vm.users = data.data;
        //getDatatableAPI(vm.users);
        $scope.dtDataset = vm.users;
    });

   /* $scope.tree_data = [];
    var promise = OrgTree.query('1'); // 同步调用，获得承诺接口
    promise.then(function (data) {  // 调用承诺API获取数据 .resolve
        $scope.tree_data = data;
        console.log(data);
        console.log($scope.tree_data);
    }, function (data) {  // 处理错误 .reject
        console.log("error");
    });*/

    vm.removeUser = function (index) {

        var userInfo = vm.users[index];
        UserService.set(userInfo);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/user/delete.html',
            controller: 'DeleteUserCtrl',
            controllerAs: 'DeleteUser',
            size: 'sm'
        });
    };
    vm.addUser = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/user/add.html',
            controller: 'AddUserCtrl',
            controllerAs: 'addVm',
            backdrop: "static"
        });
    };
    vm.addUsers = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/user/adds.html',
            controller: 'addUsersCtrl',
            controllerAs: 'addsVm',
            backdrop: "static"

        });
    };
    vm.viewUser = function (index) {
        console.log("view:" + index);
        console.log("view:" + vm.users[index].createTime);
        var userInfo = vm.users[index];
        console.log(userInfo);
        UserService.set(userInfo);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/user/view.html',
            controller: 'ViewUserCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"

        });
    };
    vm.editUser = function (index) {
        console.log("edit:" + index);
        var userInfo = vm.users[index];
        console.log(userInfo);
        UserService.set(userInfo);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/user/edit.html',
            controller: 'EditUserCtrl',
            controllerAs: 'editVm',
            backdrop: "static"
        });
    };

    // 给用户增加账户
    vm.addAccount = function (index) {

        var currentUser = vm.users[index];
        UserService.set(currentUser);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/user/account.html',
            controller: 'AddAccountCtrl',
            controllerAs: 'accountVm',
            backdrop: "static"
        });
    };

    vm.toggleAnimation = function () {
        vm.animationsEnabled = !vm.animationsEnabled;
    };

    /**
     * datatable参数设置
     */
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
        DTColumnBuilder.newColumn(null)
            .withTitle("{{'selec'|translate}}")
         /*   .withTitle('<input type="checkbox" class="btn" ng-checked="isSelectedAll()" ng-disabled="canSelectAll()" ng-click="showCase.updateSelectionAll($event)">')*/
            .notSortable()
            .withClass("text-center")
            .renderWith(function (data, type, full, meta) {
                var index = vm.users.indexOf(data);
                return '<input type="checkbox" ng-checked="isSelectedByIndex(' + index + ')" ng-click="showCase.updateSelectionOne($event,' + index + ')">';
            }),
        DTColumnBuilder.newColumn('realName')
            .withTitle("{{'rname'|translate}}"),
        DTColumnBuilder.newColumn('station')
            .withTitle("{{'zhiwei'|translate}}"),
        DTColumnBuilder.newColumn('mail')
            .withTitle("{{'email'|translate}}"),
        DTColumnBuilder.newColumn('phone')
            .withTitle("{{'phone'|translate}}"),
        DTColumnBuilder.newColumn(null)
            .withTitle("{{'operate'|translate}}")
            .notSortable()
            .renderWith(function (data, type, full, meta) {
                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.viewUser(' + index + ')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="{{\'fanyi4\'|translate}}"></i></a>' +
                    '<a type="button" ng-click="showCase.editUser(' + index + ')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="{{\'fanyi491\'|translate}}"></i></a>' +
                    '<a type="button" ng-click="showCase.removeUser(' + index + ')" class="btn btn-danger btn-xs"><i class="fa fa-trash-o" tooltip="{{\'deleteUser\'|translate}}"></i></a>' +
                    '<a type="button" ng-click="showCase.addAccount(' + index + ')" class="btn btn-info btn-xs"> <i class="icon-user-follow" tooltip="{{\'addacout\'|translate}}"></i></a>';
            })
    ];

    //注册"BatchUpdateUserOrg"的事件监听函数
    vm.successUpdateNum = 0;
    vm.failUpdateNum = 0;
    $scope.$on("BatchUpdateUserOrg", function (event, args) {
        // console.log(args.orgId);
        // console.log(args.org);
        var UPDATE_USER_ORG_URL = '/ma/user';
        for (var i = 0; i < $scope.selectedUser.length; i++) {
            $scope.selectedUser[i].orgId = args.orgId;
            $scope.selectedUser[i].org = args.org;

            $http.put(UPDATE_USER_ORG_URL, $scope.selectedUser[i])
                .then(
                    function (response) {
                        console.log(response);
                        vm.successUpdateNum++;
                        if ((vm.successUpdateNum + vm.failUpdateNum) === $scope.selectedUser.length) {
                            $state.go('app.user', {}, {reload: true});
                        }
                    },
                    function () {
                        vm.failUpdateNum++;
                        console.log("错误");
                    }
                );
        }
    });
    //打开批量操作的模态框
    vm.batchUpdateUserOrg = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/user/batchUpdateUserOrg.html',
            controller: 'batchUpdateUserOrgCtrl',
            controllerAs: 'showCase',
            backdrop: "static"
        });
    };

    // 这个是用于监听modal发出批量删除的消息，然后执行删除操作
    // 暂时没用这个方法
    $scope.$on('DeleteUsers', function (event, data) {
        if ("ok" === data) {
            var deleteIds = [];
            $scope.selectedUser.forEach(function (item) {
                deleteIds.push(item.id)
            });

            User.delete({
                id: deleteIds
            }, function (reult) {
                $state.go('app.user', {}, {reload: true})
            }, function (reason) {
                alert('delete error ' + reason);
            });
        }
    });

    vm.batchDeleteUser = function () {

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/user/delete.html',
            controller: 'DeleteUsersCtrl',
            backdrop: "static",
            size: 'sm'
        });

        modalInstance.result.then(function (data) {
                if ("ok" === data) {
                    var deleteIds = [];
                    $scope.selectedUser.forEach(function (item) {
                        deleteIds.push(item.id)
                    });

                    User.delete({
                        id: deleteIds
                    }, function (reult) {
                        $state.go('app.user', {}, {reload: true})
                    }, function (reason) {
                        alert('delete error ' + reason);
                    });
                }
            }, function (reason) {
                console.log(" canceled :" + reason);
            }
        )

    };

    //判断当前页面是否可以进行全选操作，若没有数据，则不可以
    $scope.canSelectAll = function () {
        return (currentPageUser.length === 0);
    };

    //全选或取消全选
    vm.updateSelectionAll = function ($event) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        // console.log($scope.selectedUser.length);
        for (var i = 0; i < currentPageUser.length; i++) {
            updateSelected(action, currentPageUser[i]);
        }
    };
    //单选或取消单选
    vm.updateSelectionOne = function ($event, index) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, vm.users[index]);
    };
    //实际更新被选中用户的数组的方法
    var updateSelected = function (action, user) {
        if (action === 'add' && $scope.selectedUser.indexOf(user) === -1) {
            $scope.selectedUser.push(user);
            if ($scope.selectedUser.length > 0) {
                $scope.showBatchUpdateUserOrgButton = true;
            }
        }
        if (action === 'remove' && $scope.selectedUser.indexOf(user) !== -1) {
            var idx = $scope.selectedUser.indexOf(user);
            $scope.selectedUser.splice(idx, 1);
            if ($scope.selectedUser.length === 0) {
                $scope.showBatchUpdateUserOrgButton = false;
            }
        }
        $rootScope.uuUserid=$scope.selectedUser;
    };
    //是否当页数据全部选中，用于angular数据检查实时更新全选框的状态
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
        for (var i = 0; i < currentPageUser.length; i++) {
            if (!$scope.isSelectedByData(currentPageUser[i])) {
                return false;
            }
        }
        return true;
    };
    //单挑数据是否选中，用于angular数据检查实时更新单选框的状态（用编号检查）
    $scope.isSelectedByIndex = function (index) {
        return $scope.selectedUser.indexOf(vm.users[index]) >= 0;
    };
    //单挑数据是否选中，用于angular数据检查实时更新单选框的状态（用数据实体检查）
    $scope.isSelectedByData = function (user) {
        return $scope.selectedUser.indexOf(user) >= 0;
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
