/**
 * Created by Administrator on 2017/6/8.
 */

// 单个删除对应的controller
app.controller('DeleteUserCtrl', function ($scope, $modalInstance, $state, UserService, User) {

    $scope.currentUser = UserService.get();

    var userId = $scope.currentUser.id;

    $scope.submit = function () {

        User.delete({}, {id: userId}, function () {

            $state.go('app.user', {}, {reload: true});
            $modalInstance.close();
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

// 批量删除对应的controlller
app.controller('DeleteUsersCtrl', function ($scope,$rootScope, $http,$state, $modalInstance, BroadcastEventDispatcher ) {

    $scope.submit = function () {
        $http({
            method:"POST",
            url:"/ma/user/delete_select",

            data: $rootScope.uuUserid

        }).success(function(response){
            $state.go('app.user', {}, {reload: true});
            $modalInstance.close();
        }).error(function(data){
            console.log("error"+data);
        });
       // BroadcastEventDispatcher.batchDeleteUser("ok");
        // $rootScope.$broadcast('DeleteUsers', {"data": "ok"});

        // 向modalInstance返回ok
      /*  $modalInstance.close("ok");*/
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


