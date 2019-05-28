'use strict';

app.controller('EditSaveCtrl', function ($scope, $resource, $http, $state, $modalInstance, SaveService) {

    $scope.saves = SaveService.get();
    $scope.saves.StartTime=$scope.saves.start.substring(0,5);
    $scope.saves.StopTime=$scope.saves.stop.substring(0,5);

    this.updateSelectionAll = function ($event, vv) {

        var checkbox = $event.target;

        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, vv);
    };
    var selectDays = new Array();
    var result;
    var updateSelected = function (action, value) {

        if (action === 'add') {
            selectDays.push(value);
        }
        if (action === 'remove') {
            var idx = selectDays.indexOf(value);
            selectDays.splice(idx, 1);
        }
        result = selectDays;
    };

    this.submit = function () {
        if(result===null ||result===''){
            $scope.saves.dayTemp1=null;
        }else {
            $scope.saves.dayTemp1 = result;
        }
        $http({
            url:"/ma/save/update",
            method:"POST",
            data:$scope.saves
        }).then(function success(response){
            $state.go('app.save', {}, {reload: true});
            $modalInstance.close();
        },function error(){
            console.log("error");
        })

    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

