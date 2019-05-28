'use strict';

app.controller('addUsersCtrl', ['$scope', '$timeout', '$http', '$state', 'FileUploader', '$modalInstance',
    function ($scope, $timeout, $http, $state, FileUploader, $modalInstance) {

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        // 获取app列表,并默认选择第一个app
        $http({
            url: '/ma/app/',
            method: 'GET'
        }).then(function (result) {
            $scope.apps = result.data.data;
            $scope.apps.selected = $scope.apps[0];
        }, function (reason) {
            alert("get app list error : " + reason);
        });

        var uploader = $scope.uploader = new FileUploader({
            url: '/ma/user/upload',
            headers: {
                Authorization: $scope.token
            }
        });

        $scope.uploadFile = function () {
            uploader.uploadAll();


            $modalInstance.dismiss('cancel');

            /* $state.go('auth.loading', {}, {reload: true});*/
        };
        $scope.gotoOrg = function () {
            $modalInstance.dismiss('cancel');
            $state.go('app.org', {}, {reload: true});
        };

        /* $scope.down_user=function(){
         $http({
         url: 'ma/app/downloadFile',
         method: 'GET',
         headers:{
         Authorization:$scope.token
         }
         }).then(function (result) {
         return result;
         }, function (reason) {
         alert("get app list error : " + reason);
         });*/


        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            var formData = [{
                appId: $scope.apps.selected.id,
            }];
            Array.prototype.push.apply(item.formData, formData);

            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };

        uploader.onSuccessItem = function (fileItem, response, status, headers) {

            if (response.code === "10000") {
                alert("共有" + response.totalCount + "条数据\r" +
                    "本地后台注册成功: " + response.insertSuccess + "条\n" +
                    "本地后台注册失败：" + response.insertFaild + "条\n" +
                    "环信注册失败: " + response.easeRegisterFaild + "条\n"
                );
            }
            // setTimeout($state.go('app.user', {}, {reload: true}),3000);
            $state.go('app.user', {}, {reload: true});

            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
    }]);