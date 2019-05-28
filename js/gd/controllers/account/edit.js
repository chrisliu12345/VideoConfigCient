'use strict';

app.controller('EditAccountCtrl', function ($scope, $rootScope,$modal, $resource, $http, $state, $modalInstance,
                                         Account, AccountService) {
    $scope.customize=true;
    // 从list界面获取account信息
    $scope.account = AccountService.get();
    $scope.items=$scope.account.place;
    this.showAuthority=function () {
        if($scope.AllAuthority===true){
            $scope.customize=false;
        }else{
            $scope.customize=true;
        }
    }

    this.selectquanxian=function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/account/placeTree.html',
            controller: 'plaTreeEditCtrl',
            controllerAs: 'plaEditVm',
            backdrop: "static"
        });
    }
    this.selectquanxian1=function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/account/cameraTree.html',
            controller: 'camTreeEditCtrl',
            controllerAs: 'cameraTreeVm',
            backdrop: "static"
        });
    }
    this.submit = function () {
        $modalInstance.close();


       //创建JSON数据对象
        $scope.accountForPassword={};
        //存入场所类型
        if($rootScope.EditAllotPlace!==null){
            $scope.accountForPassword.place=$rootScope.EditAllotPlace;
        }
        //存入摄像机权限
        if($rootScope.selectGroupOrCamera!==null){
            $scope.accountForPassword.camera=$rootScope.selectGroupOrCamera;
            console.log($rootScope.selectGroupOrCamera);
        }
        //获取全部权限
        if($scope.AllAuthority===true){
            $scope.accountForPassword.Authority='1';
        }else{
            $scope.accountForPassword.Authority='2';
        }
        $scope.accountForPassword.id=$scope.account.id;
        $scope.accountForPassword.username=$scope.account.username;
        //获取修改的新密码
        $scope.accountForPassword.password=$scope.NewPassword;
        if($scope.accountForPassword.password===undefined && $scope.accountForPassword.place===undefined &&
            $scope.accountForPassword.camera===undefined && $scope.AllAuthority===undefined ) {
            alert('您未修改数据，已退出！');
        }else{
        $http.post('/ma/account/updatePassword', $scope.accountForPassword).success(function () {
                    $state.go('app.account', {}, {reload: true});
                    alert('恭喜，账户信息修改成功！');
                    $rootScope.selectGroupOrCamera=null;
                    $rootScope.EditAllotPlace=null;
                    $modalInstance.dismiss('cancel');

                });
        }
    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $rootScope.selectGroupOrCamera=null;
        $rootScope.EditAllotPlace=null;
        $modalInstance.dismiss('cancel');
    };

});