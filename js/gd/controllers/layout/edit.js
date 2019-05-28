'use strict';

app.controller('EditLayoutCtrl', function ($scope, $rootScope, $resource, $http, $state, $modalInstance,
                                         layoutDataService, LayoutService) {

    // 从list界面获取布局信息
    // $scope.layout = LayoutService.get();
    var self=this;
    this.layoutName=LayoutService.get().name;

    $scope.initFunc=function(){
        var data=LayoutService.get();
        layoutDataService.initEdit(data,self);
        
          
    }
    this.submit = function () {
        var data=LayoutService.get();
        layoutDataService.getFinalData(data,self);
        
        
        layoutDataService.editLayout(data,function(){
            self.cancel();
            $state.go('app.layout', {}, {reload: true});
        });
        
    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});