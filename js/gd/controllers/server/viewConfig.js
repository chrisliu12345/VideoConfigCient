/**
 * Created by Administrator on 2018/3/27 0027.
 */
/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('ViewConfig', function ($scope,ServerService,$modalInstance) {
    $scope.datasView=ServerService.get();

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


