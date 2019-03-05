'use strict'

app.controller('AddResCtrl', function ($rootScope, $scope, $http, $resource, $modalInstance, $modal, $state, Res,ResService) {


    //动态获取平台ID
    $http({
        url:"/ma/res/platformid",
        method:"GET",
    }).then(function success(response){
        $scope.items=response.data.data;
    },function error(){
        console.log("error");
    })
    //动态获取sipid
    $http({
        url:"/ma/res/sip",
        method:"GET",
    }).then(function success(response){
        $scope.sips=response.data.data;
    },function error(){
        console.log("error");
    })
    this.selectquanxian = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/res_attr/cameraTree.html',
            controller: 'ResTreeCtrl',
            controllerAs: 'ResTreeVm',
            backdrop: "static"
        });
    }

    //DVR/NVR添加
    this.submit = function () {

        var cd = parseInt($scope.res.channel);
        var number=$scope.res.DeviceID;
        console.log("我是树结构："+$rootScope.getzTree2);
        if (number.substring(10,13) !==$scope.deviceType) {
            alert("设备SIPID的11位~13位必须与设备类型代号相同，当前设备类型代号为"+$scope.deviceType);
        } else if($rootScope.getzTree2===undefined || $rootScope.getzTree2===null){
                alert("请选择行政区划");
        }else if($scope.res.SipServiceID===null ||$scope.res.SipServiceID===''){
            alert("请选择SIP服务器");
        }
        else {
            $scope.res.CivilCode = $rootScope.getzTree2.ParentOrgID;
            $scope.res.ResType = $scope.deviceType;
            $http({
                url:"/ma/res",
                method:"POST",
                data:$scope.res
            }).then(function success(response){
                $modalInstance.dismiss('cancel');

                alert("设备添加成功");
                $state.go('app.res', {}, {reload: true});

            },function error(){
                alert("设备SIPID已存在，或者数据为空，请修改！");
            })
        };
    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    this.select_type = function () {
        var ss = $scope.SelectType;
        $rootScope.deviceType = ss;

        if ($scope.SelectType == '111') { //DVR

            $modal.open({
                templateUrl: 'tpl/gd/res_attr/add1.html',
                controller: 'AddResCtrl',
                controllerAs: 'addVm',
                backdrop: "static"

            });
        }
        if ($scope.SelectType == '118') { //NVR
            $modal.open({
                templateUrl: 'tpl/gd/res_attr/add2.html',
                controller: 'AddResCtrl',
                controllerAs: 'addVm',
                backdrop: "static"

            });
        }


        if ($scope.SelectType == '132') { //IPC摄像机
            $modal.open({
                templateUrl: 'tpl/gd/res_attr/add3.html',
                controller: 'AddResCtrl',
                controllerAs: 'addVm',
                backdrop: "static"

            });
        }
        if ($scope.SelectType == '133') {//电视墙
            $modal.open({
                templateUrl: 'tpl/gd/res_attr/add4.html',
                controller: 'AddResCtrl',
                controllerAs: 'addVm',
                backdrop: "static"

            });
        }
        if ($scope.SelectType == '134') { //解码器
            $modal.open({
                templateUrl: 'tpl/gd/res_attr/add5.html',
                controller: 'AddResCtrl',
                controllerAs: 'addVm',
                backdrop: "static"

            });
        }
        $modalInstance.dismiss('cancel');
    };

    this.select_config = function () {
        var srcf = $scope.res.config;
        if (srcf == 'HIK' || srcf == 'DH' || srcf == 'UNIVIEW') {
            $scope.hdy = true;
            $scope.gb2011 = false;
            $scope.gb2016 = false;
            if(srcf == 'HIK'){
               $scope.res.Manufacturer='HIK';
                $scope.res.Port=8000;
                $scope.res.UsrName='admin';
                $scope.res.channel=16;
            }if(srcf == 'DH'){
                $scope.res.Manufacturer='DH';
                $scope.res.Port=37777;
                $scope.res.UsrName='admin';
                $scope.res.channel=16;
            }if(srcf == 'UNIVIEW'){
                $scope.res.Manufacturer='UNIVIEW';
                $scope.res.UsrName='admin';
                $scope.res.channel=16;
                $scope.res.Port=80;
            }
        }
        else if (srcf == 'SIP') {
            $scope.hdy = false;
            $scope.gb2011 = false;
            $scope.gb2016 = true;
            $scope.res.Manufacturer='国标';
        } else {
            $scope.hdy = false;
            $scope.gb2011 = false;
            $scope.gb2016 = false;
            $scope.res.Manufacturer='ONVIF';
        }
    };
});





