'use strict';

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.controller('AddLayoutCtrl',
    function ($scope, $http, $resource, $modalInstance, $state, Layout,layoutDataService) {

        var self=this;
        this.layoutName="";

        var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
          },

        width = 568,
        height = 568*0.618;

        this.submit = function () {

            var data = layoutDataService.getLayoutData(self);
            layoutDataService.addLayout(data,function(){
                self.cancel();
                $state.go('app.layout', {}, {reload: true});
            });

        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };


    });
