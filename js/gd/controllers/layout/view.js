'use strict';

app.controller('ViewLayoutCtrl', function ($scope, $resource, $modalInstance, $http, LayoutService, layoutDataService) {
    var self = this;
    this.submit = function () {

    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.initFunc = function(){
        var data = LayoutService.get();
        
        layoutDataService.initView(data,self);    

    }

});