/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('IntCtrl', function ($scope, $modalInstance, $state) {

    $scope.card=[
        {name: "NVDIA网卡", value: "1"},
        {name: "DELL网卡", value: "2"},
        {name: "360网卡", value: "3"}
    ];

    this.submit = function () {
          alert($scope.inter);
        //这里是ajax发送数据。

    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


