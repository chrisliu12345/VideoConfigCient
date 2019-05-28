'use strict';
var ImUrl = 'http://192.168.10.36:80';
var appkey = "/ssy/ccf";
app.factory('EasemobUsers', function ($resource) {
    return $resource(ImUrl + appkey + '/users');
});
app.controller('AddAccountCtrl', function ($scope, $http, $resource, $modalInstance, $state, User,
                                         Account, UserService,Role,$modal,$rootScope) {
    // 获取角色列表
    Role.get(function (response) {
        $scope.Roles = response.data;
        $scope.Roles.selected = $scope.Roles[0];
    }, function (response) {
        console.log('get role list failed !')
    });


    var currentUser = UserService.get();

    this.submit = function () {

        $scope.account.userId = currentUser.id;
        $scope.account.communicationId = $scope.account.username;
        $scope.account.roleIds = $scope.Roles.selected.id;

        $scope.account.selectPlace=$rootScope.allotPlace;//选择场所
        $scope.account.selectGroupOrCamera=$rootScope.selectGroupOrCamera;//选择摄像机权限
        Account.save({}, $scope.account, function (response) {
            console.log("本地后台账户创建成功");
            if (response.code === "0000") {
                alert('恭喜，账户创建成功！');
                $rootScope.selectGroupOrCamera=null;
                $rootScope.allotPlace=null;
                $modalInstance.close();
            } else if (response.code === "0005") {
                alert('对不起，注册失败，该用户名已经被注册！请修改');
            }
        }, function (response) {
            console.log("本地后台账户创建失败 " + response);
            alert('对不起，账户创建失败！');
        });
    };

    this.cancel = function () {
        $rootScope.selectGroupOrCamera=null;
        $rootScope.allotPlace=null;
        $modalInstance.dismiss('cancel');
    };
   this.selectquanxian=function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/user/placeTree.html',
            controller: 'plaTreeauthCtrl',
            controllerAs: 'plaTreeVm',
            backdrop: "static"
        });
    }
    this.selectquanxian1=function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/user/cameraTree.html',
            controller: 'camTreeauthCtrl',
            controllerAs: 'cameraTreeVm',
            backdrop: "static"
        });
    }

});