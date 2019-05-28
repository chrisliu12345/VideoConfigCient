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

app.controller('AddUserCtrl',
    function ($scope, $http, $resource, $modalInstance, $state, User) {

        this.submit = function () {

                User.save({}, $scope.user, function () {
                    $modalInstance.close();
                    $state.go('app.user', {}, {reload: true});
                }, function (response) {
                    console.log('create ' + $scope.user.realName + ' error!' + response);
                });

        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });