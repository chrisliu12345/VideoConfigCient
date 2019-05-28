/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('MediaCtrl', function ($scope, $modalInstance, $state,$http) {


    this.submit = function () {
        console.log($scope.services);
        $http({
            url: "/ma/services/mediaConfig",
            method: "POST",
            data:$scope.services
        }).then(function success(response) {

            if(response.data==='success') {
                alert("配置成功");
                $modalInstance.dismiss('cancel');
            }
        }, function error() {
            console.log("error");
        });
        //这里是ajax发送数据。

    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


