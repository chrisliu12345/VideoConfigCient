'use strict';

app.controller('EditUserCtrl', function ($scope, $rootScope, $resource, $http, $state, $modalInstance,
                                         User, UserService) {

    // 从list界面获取user信息
    $scope.user = UserService.get();

    this.submit = function () {

        // 修改时，一并将新的部门名称和新的部门id传递过去
       /* $scope.user.org = $scope.orgs.selected.orgName;
        $scope.user.orgId = $scope.orgs.selected.id;*/

        var userId = $scope.user.id;
        $http({
            url: '/ma/user/update',
            method: 'POST',
            data:$scope.user
        }).then(function (result) {
            if(result.data.data==='success'){
                alert("用户信息修改完成！");
                $modalInstance.dismiss('cancel');
                $state.go('app.user', {}, {reload: true});
            }

        }, function (reason) {
            alert("get app list error : " + reason);
        });
       /* User.delete({}, {id: userId}, function () {
            console.log("update: " + $scope.user);
            $http.post('/ma/user/', $scope.user)
                .success(function () {
                    alert()
                    if (userId === $rootScope.currentAccountUserinfo.userinfo[0].id) {
                        angular.copy($scope.user, $rootScope.currentAccountUserinfo.userinfo[0]);
                    }
                    $modalInstance.dismiss('cancel');
                    $state.go('app.user', {}, {reload: true});
                });
        });*/
    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});