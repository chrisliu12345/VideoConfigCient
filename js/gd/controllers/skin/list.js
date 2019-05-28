'use strict';

var groUri = "/ma/skin/";
app.factory("Skin", function ($resource) {
    return $resource(groUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});
app.factory("SkinService", function ($http) {
    var service = {};
    var gro;
    service.get = function () {
        return gro;
    };
    service.set = function (newApp) {
        gro = newApp;
    };
    service.changeSkin=function(id,name,successCall){
        $http({
            url: 'ma/skin',
            method: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: {
                skinId:id,
                skinName:name
            }
        }).success(function (da) {
            successCall();

        });
    };
    return service;
});


app.controller('SkinCtrl', SkinCtrl);

function SkinCtrl($scope, $rootScope, $resource,$timeout, $state, $http, $modal, Skin, SkinService, $compile) {

    var vm = this;
    $scope.data = {
        availableOptions: [
            {name: "皮肤1", id : "1"},
            {name: "皮肤2", id : "2"},
            {name: "皮肤3", id : "3"}
        ],
        selectedOption: {} //This sets the default value of the select in the ui
    };

    Skin.get(function (repos) {
        $scope.data.selectedOption = {id:repos.data.skinId,name:repos.data.skinName};

    });
    $scope.update = function () {
        let id = $scope.data.selectedOption.id;
        let name = $scope.data.selectedOption.name;
        SkinService.changeSkin(id, name, function () {
            // alert("修改成功！")
        })
    }

}