/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('NtpCtrl', function ($scope, $modalInstance, $state) {

    this.submit = function () {
        alert($scope.ntpc);
        //现实是AJAX请求，将属性发送过去

    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


