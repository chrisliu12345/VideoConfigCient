/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('SipCtrl', function ($scope, $modalInstance, $http,$state,$modal,ServerService) {
      $scope.look=false;

    $scope.QueryAndEdit=function () {

        $http({
            url: "/ma/services/getConfig",
            method: "POST",
            data:$scope.queryService
        }).then(function success(response) {
            //返回是列表

            if(response.data.data===0){
                $scope.look=false;
                alert("无记录");
            }else{
                $scope.datas=response.data.data;
                $scope.look=true;
            }

            },function error() {
            console.log("error");
        });
    };
    $scope.ConfigView=function (x) {
        $http({
            url: "/ma/services/getConfigView",
            method: "POST",
            data:x
        }).then(function success(response) {
            //返回是列表
            ServerService.set(response.data.data);
            console.log(response.data.data);
            if(response.data.data===0){
                alert("无详情配置");
                return false;
            }else{
            $modal.open({
                    templateUrl: 'tpl/gd/server/ViewConfig.html',
                    controller: 'ViewConfig',
                    controllerAs: 'vcVm',
                    backdrop: "static"
            });
            }
        },function error() {
            console.log("error");
        });
    }
    this.submit = function () {
          alert($scope.sip);
        //这里是ajax发送数据。

    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


