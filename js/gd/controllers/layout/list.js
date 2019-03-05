'use strict';

app.factory("Layout", function ($resource) {
    return $resource("/ma//tblwindowsmode/list/:id", {id: "@id"}, {
        update: {}
    });
});
app.factory('OrgTree', ['$http', '$q', function ($http, $q) {
    return {
        query: function (id) {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            var url = '/ma/orgtree/' + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                console.log(data);
                deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
            }).error(function (data, status, headers, config) {
                deferred.reject(data);   // 声明执行失败，即服务器返回错误
            });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        } // end query
    };
}]);
app.factory("LayoutService", function () {
    var service = {};
    var layoutInfo;
    service.get = function () {
        return layoutInfo;
    };
    service.set = function (newLayoutInfo) {
        layoutInfo = newLayoutInfo;
    };
    return service;
});

app.controller('layoutCtrl', layoutCtrl);

function layoutCtrl($scope, $rootScope, $http, $resource, OrgTree, $modal, $log, Layout, LayoutService, $state, $compile, layoutDataService,DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.layouts = [];
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
    $scope.selectedLayout = [];
    //datatable当前页数据（用户）的临时数组
    var tempCurrentPageLayout = [];
    //datatable当前页数据（用户）的数组
    var currentPageLayout = [];
    //控制批量修改部门按钮显示的开关
    $scope.showBatchUpdateLayoutOrgButton = false;
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
        var url = '/ma/layout/org/' + branch.id;
        $http.get(url)
            .success(function (data) {
                vm.layouts = data;
                //getDatatableAPI(vm.layouts);
                $scope.dtDataset = vm.layouts;
            });
    };
    $scope.org_tree_handler_click = function (branch) {

        $scope.org_tree.select_branch(branch);
    };
    Layout.get(function (data) {
        // vm.layouts = data.data;
        // console.log(data.data);
        for(var i=0;i<data.data.length;i++){
            console.log(data.data[i].status);
            if(data.data[i].status=='0'||data.data[i].status==0){
                console.log("change");
                data.data[i].statusName="未发布";
            }else if(data.data[i].status=='1'||data.data[i].status==1){

                data.data[i].statusName="已发布";
            }
            //窗口数量1快捷配置2自定义配置
            if(data.data[i].type=='1'||data.data[i].type==1){

                data.data[i].windowsNumberByType = data.data[i].width*data.data[i].height;
            }else if(data.data[i].type=='2'||data.data[i].type==2){

                data.data[i].windowsNumberByType=data.data[i].windowcount;
            }
        }
        // console.log(data.data);
        vm.layouts = data.data;
        //getDatatableAPI(vm.layouts);
        $scope.dtDataset = vm.layouts;
    });

    $scope.tree_data = [];
   /* var promise = OrgTree.query('1'); // 同步调用，获得承诺接口
    promise.then(function (data) {  // 调用承诺API获取数据 .resolve
        $scope.tree_data = data;
        console.log(data);
        console.log($scope.tree_data);
    }, function (data) {  // 处理错误 .reject
        console.log("error");
    });*/

    vm.removeLayout = function (index) {

        var layoutInfo = vm.layouts[index];
        LayoutService.set(layoutInfo);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/layout/delete.html',
            controller: 'DeleteLayoutCtrl',
            controllerAs: 'DeleteLayout',
            size: 'sm'
        });
    };
    vm.addLayout = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/layout/add.html',
            controller: 'AddLayoutCtrl',
            controllerAs: 'addlayout',
            backdrop: "static"
        });
    };

    vm.addLayouts = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/layout/adds.html',
            controller: 'addLayoutsCtrl',
            controllerAs: 'addsVm',
            backdrop: "static"

        });
    };
    vm.viewLayout = function (index) {
        console.log("view:" + index);
        console.log("view:" + vm.layouts[index].createTime);
        var layoutInfo = vm.layouts[index];
        console.log(layoutInfo);
        LayoutService.set(layoutInfo);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/layout/view.html',
            controller: 'ViewLayoutCtrl',
            controllerAs: 'viewLayout',
            backdrop: "static"

        });
    };
    vm.editLayout = function (index) {
        console.log("edit:" + index);
        var layoutInfo = vm.layouts[index];
        console.log(layoutInfo);
        LayoutService.set(layoutInfo);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/layout/edit.html',
            controller: 'EditLayoutCtrl',
            controllerAs: 'editLayout',
            backdrop: "static"
        });
    };
    //发布
    vm.setLayout = function(index) {
        var id = $scope.dtDataset[index].id;
        var status = $scope.dtDataset[index].status;
        layoutDataService.setLayout(id,status,function(){
            $state.go('app.layout', {}, {reload: true});
        });

        
    }
    // 给用户增加账户
    vm.addAccount = function (index) {

        var currentLayout = vm.layouts[index];
        LayoutService.set(currentLayout);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/layout/account.html',
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
            currentPageLayout = tempCurrentPageLayout;
            tempCurrentPageLayout = [];
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
            tempCurrentPageLayout.push(aData);
        });

    $scope.dtColumns = [
        // DTColumnBuilder.newColumn(null)
        //     .withTitle('选择')
        //  /*   .withTitle('<input type="checkbox" class="btn" ng-checked="isSelectedAll()" ng-disabled="canSelectAll()" ng-click="showCase.updateSelectionAll($event)">')*/
        //     .notSortable()
        //     .withClass("text-center")
        //     .renderWith(function (data, type, full, meta) {
        //         var index = vm.layouts.indexOf(data);
        //         return '<input type="checkbox" ng-checked="isSelectedByIndex(' + index + ')" ng-click="showCase.updateSelectionOne($event,' + index + ')">';
        //     }),
        
        DTColumnBuilder.newColumn('name')
            .withTitle("{{'layname'|translate}}"),
        DTColumnBuilder.newColumn('windowsNumberByType')
            .withTitle("{{'layname'|translate}}"),
        DTColumnBuilder.newColumn('statusName')
            .withTitle("{{'status1'|translate}}"),

        DTColumnBuilder.newColumn(null)
            .withTitle("{{'operate'|translate}}")
            .notSortable()
            .renderWith(function (data, type, full, meta) {
                var index = $scope.dtDataset.indexOf(data);
                var id = $scope.dtDataset[index].id;
                var status = $scope.dtDataset[index].status;
                return '<a type="button" ng-click="showCase.viewLayout(' + index + ')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="{{\'query\'|translate}}"></i></a>' +
                    '<a type="button" ng-click="showCase.editLayout(' + index + ')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="{{\'edit\'|translate}}"></i></a>' +
                    '<a type="button" ng-click="showCase.removeLayout(' + index + ')" class="btn btn-danger btn-xs"><i class="fa fa-trash-o" tooltip="{{\'delete\'|translate}}"></i></a>'+
                    '<a type="button" ng-click="showCase.setLayout(' + index +')" class="btn btn-info btn-xs"> <i class="fa fa-ban" tooltip="{{\'layoutset\'|translate}}"></i></a>';
            })
    ];

    //注册"BatchUpdateLayoutOrg"的事件监听函数
    // vm.successUpdateNum = 0;
    // vm.failUpdateNum = 0;
    // $scope.$on("BatchUpdateLayoutOrg", function (event, args) {
    //     // console.log(args.orgId);
    //     // console.log(args.org);
    //     var UPDATE_USER_ORG_URL = '/ma/layout';
    //     for (var i = 0; i < $scope.selectedLayout.length; i++) {
    //         $scope.selectedLayout[i].orgId = args.orgId;
    //         $scope.selectedLayout[i].org = args.org;

    //         $http.put(UPDATE_USER_ORG_URL, $scope.selectedLayout[i])
    //             .then(
    //                 function (response) {
    //                     console.log(response);
    //                     vm.successUpdateNum++;
    //                     if ((vm.successUpdateNum + vm.failUpdateNum) === $scope.selectedLayout.length) {
    //                         $state.go('app.layout', {}, {reload: true});
    //                     }
    //                 },
    //                 function () {
    //                     vm.failUpdateNum++;
    //                     console.log("错误");
    //                 }
    //             );
    //     }
    // });
    // //打开批量操作的模态框
    // vm.batchUpdateLayoutOrg = function () {
    //     var modalInstance = $modal.open({
    //         animation: vm.animationsEnabled,
    //         templateUrl: 'tpl/gd/layout/batchUpdateLayoutOrg.html',
    //         controller: 'batchUpdateLayoutOrgCtrl',
    //         controllerAs: 'showCase',
    //         backdrop: "static"
    //     });
    // };

    // 这个是用于监听modal发出批量删除的消息，然后执行删除操作
    // 暂时没用这个方法
    // $scope.$on('DeleteLayouts', function (event, data) {
    //     if ("ok" === data) {
    //         var deleteIds = [];
    //         $scope.selectedLayout.forEach(function (item) {
    //             deleteIds.push(item.id)
    //         });

    //         Layout.delete({
    //             id: deleteIds
    //         }, function (reult) {
    //             $state.go('app.layout', {}, {reload: true})
    //         }, function (reason) {
    //             alert('delete error ' + reason);
    //         });
    //     }
    // });

    // vm.batchDeleteLayout = function () {

    //     var modalInstance = $modal.open({
    //         animation: vm.animationsEnabled,
    //         templateUrl: 'tpl/gd/layout/delete.html',
    //         controller: 'DeleteLayoutsCtrl',
    //         backdrop: "static",
    //         size: 'sm'
    //     });

    //     modalInstance.result.then(function (data) {
    //             if ("ok" === data) {
    //                 var deleteIds = [];
    //                 $scope.selectedLayout.forEach(function (item) {
    //                     deleteIds.push(item.id)
    //                 });

    //                 Layout.delete({
    //                     id: deleteIds
    //                 }, function (reult) {
    //                     $state.go('app.layout', {}, {reload: true})
    //                 }, function (reason) {
    //                     alert('delete error ' + reason);
    //                 });
    //             }
    //         }, function (reason) {
    //             console.log(" canceled :" + reason);
    //         }
    //     )

    // };

    //判断当前页面是否可以进行全选操作，若没有数据，则不可以
    $scope.canSelectAll = function () {
        return (currentPageLayout.length === 0);
    };

    //全选或取消全选
    vm.updateSelectionAll = function ($event) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        // console.log($scope.selectedLayout.length);
        for (var i = 0; i < currentPageLayout.length; i++) {
            updateSelected(action, currentPageLayout[i]);
        }
    };
    //单选或取消单选
    vm.updateSelectionOne = function ($event, index) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, vm.layouts[index]);
    };
    //实际更新被选中用户的数组的方法
    var updateSelected = function (action, layout) {
        if (action === 'add' && $scope.selectedLayout.indexOf(layout) === -1) {
            $scope.selectedLayout.push(layout);
            if ($scope.selectedLayout.length > 0) {
                $scope.showBatchUpdateLayoutOrgButton = true;
            }
        }
        if (action === 'remove' && $scope.selectedLayout.indexOf(layout) !== -1) {
            var idx = $scope.selectedLayout.indexOf(layout);
            $scope.selectedLayout.splice(idx, 1);
            if ($scope.selectedLayout.length === 0) {
                $scope.showBatchUpdateLayoutOrgButton = false;
            }
        }
        $rootScope.uuLayoutid=$scope.selectedLayout;
    };
    //是否当页数据全部选中，用于angular数据检查实时更新全选框的状态
    $scope.isSelectedAll = function () {
        // if (myTable === undefined) {
        //     return false;
        // }
        if ($scope.myTable === false) {
            return false;
        }
        if (currentPageLayout.length === 0) {
            return false;
        }
        for (var i = 0; i < currentPageLayout.length; i++) {
            if (!$scope.isSelectedByData(currentPageLayout[i])) {
                return false;
            }
        }
        return true;
    };
    //单挑数据是否选中，用于angular数据检查实时更新单选框的状态（用编号检查）
    $scope.isSelectedByIndex = function (index) {
        return $scope.selectedLayout.indexOf(vm.layouts[index]) >= 0;
    };
    //单挑数据是否选中，用于angular数据检查实时更新单选框的状态（用数据实体检查）
    $scope.isSelectedByData = function (layout) {
        return $scope.selectedLayout.indexOf(layout) >= 0;
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
