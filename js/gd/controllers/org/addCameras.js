'use strict'
//批量导入摄像机
app.controller('AddCamerasRightCtrl', ['$scope','$state','$rootScope','$http','$timeout', 'FileUploader','$modalInstance', function( $scope,$state,$rootScope,$http,$timeout, FileUploader,$modalInstance) {
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    var uploader = $scope.uploader = new FileUploader({

        url:'ma/camera/camera_import_new',
        headers:{
            Authorization:$scope.token
        }


    });


    $scope.uploadFileCode = function () {

        uploader.uploadAll();
        //插入日志
        $http({
            url: "/ma/logview/add",
            method: "POST",
            data:$rootScope.currentAccountUserinfo.accountName
        }).then(
            function success(response) {
            }, function error() {
                console.log("error");
            });
        /*$timeout(function () {
            $state.go('app.camera',{},{reload:true});
        }, 1000);*/
        $modalInstance.dismiss('cancel');

       // $state.go('app.encoder',{},{reload:true});
    };
    $scope.gotoOrg = function () {
        $modalInstance.dismiss('cancel');
        $state.go('app.encoder',{},{reload:true});
    };

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        alert("上传成功！");
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
}]);