'use strict'

app.controller('AddsGroCtrl', ['$scope','$state','$timeout', 'FileUploader','$modalInstance', function( $scope,$state,$timeout, FileUploader,$modalInstance) {
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.gotoOrg = function () {
        $modalInstance.dismiss('cancel');
        $state.go('app.groups',{},{reload:true});
    };

    // FILTERS


    var uploader = $scope.uploader = new FileUploader({

        url:'ma/groups/codec_import',
        headers:{
            Authorization:$scope.token
        }


    });
    $scope.uploadFileCode = function () {

        uploader.uploadAll();
        $timeout(function () {
            $state.go('app.groups',{},{reload:true});
        }, 1000);
        $modalInstance.dismiss('cancel');

        // $state.go('app.encoder',{},{reload:true});
    };
    // CALLBACKS
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });
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