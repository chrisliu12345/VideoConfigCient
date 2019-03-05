/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteChannelCtrl', function ($scope, $modalInstance, $state, ChannelService, Channel) {

    $scope.currentApp = ChannelService.get();

    var appId = $scope.currentApp.ChannelID;

    $scope.submit = function () {

        Channel.delete({}, {id: appId}, function () {
            $state.go('app.channel', {}, {reload: true});
            $modalInstance.close();
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


