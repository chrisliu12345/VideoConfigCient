'use strict';

app.controller('ViewChannelCtrl', function ($scope, $resource, $modalInstance,ChannelService) {


    $scope.channel = ChannelService.get();

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});