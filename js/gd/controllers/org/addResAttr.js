'use strict'

app.controller('addResAttrRightCtrl', function ($rootScope, $scope, $http, $resource, $modalInstance, $modal, $state, OrgTempService,OrgService) {

    var temp="";
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
        $scope.res.SipServiceID=$scope.sips[0].ServiceID;
    },function error(){
        console.log("error");
    })

    //字符串自动补0
    function pad(num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = num + "0";
            len++;
        }
        if(len>n){
            num=num.toString().substring(0,n-1);
        }
        return num;
    }
    //DVR/NVR添加
    this.submit = function () {

        var cd = parseInt($scope.res.channel);
        var number=$scope.res.DeviceID;
        if($scope.res.SipServiceID===null ||$scope.res.SipServiceID===''){
            alert("请选择SIP服务器");
            return;
        }
        else {
            //获取当前res表中最后的一条数据的deviceID
            $http({
                url:"/ma/res/selectLastData",
                method:"GET",
            }).then(function success(response){
                var lastData=response.data.data;
                temp=lastData.slice(13);
                var i;
                i=parseInt(temp);
                if(temp.substr(0,1)==='0'){
                    temp=pad(i,7);
                    i=parseInt(temp);
                    console.log("这是补全后的temp:"+temp);
                }
                temp=i+1;
                var civil=OrgService.get();
                var virtual=OrgTempService.get();
                $scope.res.accountName=$rootScope.currentAccountUserinfo.accountName;
                $scope.res.accountId= $rootScope.currentAccountUserinfo.accountId;
                $scope.res.CivilCode = virtual.VirtualOrgID;
                //如果行政区划类型不是1，则parentid不能与deviceID相同，应该为组的VirtualOrgID。
                if(virtual.Type!==1){
                    $scope.res.ParentID=virtual.VirtualOrgID;
                }
                $scope.res.ResType = $scope.deviceType;
                var pp = pad(virtual.VirtualOrgID,10);//前10位
                var kk=pp+$scope.deviceType+temp;//前13位
                //查询最后一条数据的deviceid
                $scope.res.DeviceID=kk;
                $http({
                    url:"/ma/res",
                    method:"POST",
                    data:$scope.res
                }).then(function success(response){
                    var NewNode=response.data.data;
                    alert("设备添加成功");
                    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                    if(civil.children !==undefined){
                        treeObj.addNodes(civil, NewNode, true);
                        treeObj.expandNode(civil, true);
                    }else{
                        $scope.expandNodes1();
                        /*treeObj.addNodes(civil, NewNode, true);
                         treeObj.expandNode(civil, true);*/
                    }
                    $modalInstance.close();

                },function error(){
                console.log("error");
            });

            },function error(){
                alert("错误！");
            })
        };
    };
    //展开所选的节点
    $scope.expandNodes1 = function (event, treeId, treeNode) {
        var tt=OrgService.get();
        console.log(tt);
        $http({
            url: "/ma/orgtree/getCtree/" + tt.id,
            method: 'POST',
            data:$rootScope.currentAccountUserinfo.accountName
        }).success(function (response) {
            var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
            zTreeObj.addNodes(tt, response, true);
            zTreeObj.expandNode(tt, true);// 将新获取的子节点展开

        }).error(function () {
            alert("请求错误！");
        });
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    this.select_type = function () {
        var ss = $scope.SelectType;
        $rootScope.deviceType = ss;

        if ($scope.SelectType === '111') { //DVR

            var modalInstance =$modal.open({
                templateUrl: 'tpl/gd/org/addResAttr/addResAttr1.html',
                controller: 'addResAttrRightCtrl',
                controllerAs: 'addVm',
                backdrop: "static"

            });

        }
        if ($scope.SelectType === '118') { //NVR
            var modalInstance =$modal.open({
                templateUrl: 'tpl/gd/org/addResAttr/addResAttr2.html',
                controller: 'addResAttrRightCtrl',
                controllerAs: 'addVm',
                backdrop: "static"

            });

        }


        if ($scope.SelectType === '132') { //IPC摄像机
            var modalInstance =$modal.open({
                templateUrl: 'tpl/gd/org/addResAttr/addResAttr3.html',
                controller: 'addResAttrRightCtrl',
                controllerAs: 'addVm',
                backdrop: "static"

            });

        }
        if ($scope.SelectType === '133') {//电视墙
            var modalInstance =$modal.open({
                templateUrl: 'tpl/gd/org/addResAttr/addResAttr4.html',
                controller: 'addResAttrRightCtrl',
                controllerAs: 'addVm',
                backdrop: "static"

            });

        }
        if ($scope.SelectType === '134') { //报警设备
            var modalInstance =$modal.open({
                templateUrl: 'tpl/gd/org/addResAttr/addResAttr6.html',
                controller: 'addResAttrRightCtrl',
                controllerAs: 'addVm',
                backdrop: "static"

            });
        }
        if ($scope.SelectType === '138') { //解码器
            var modalInstance =$modal.open({
                templateUrl: 'tpl/gd/org/addResAttr/addResAttr5.html',
                controller: 'addResAttrRightCtrl',
                controllerAs: 'addVm',
                backdrop: "static"

            });
        }

        $modalInstance.dismiss('cancel');
    };

    this.select_config = function () {
        var srcf = $scope.res.config;
        if (srcf === 'HIK' || srcf === 'DH' || srcf === 'UNIVIEW'||srcf === 'ONVIF') {
            $scope.hdy = true;
            $scope.gb2011 = false;
            $scope.gb2016 = false;
            if(srcf === 'HIK'){
               $scope.res.Manufacturer='HIK';
                $scope.res.Port=8000;
                $scope.res.UsrName='admin';
                $scope.res.channel=16;
            }if(srcf === 'DH'){
                $scope.res.Manufacturer='DH';
                $scope.res.Port=37777;
                $scope.res.UsrName='admin';
                $scope.res.channel=16;
            }if(srcf === 'UNIVIEW'){
                $scope.res.Manufacturer='UNIVIEW';
                $scope.res.UsrName='admin';
                $scope.res.channel=16;
                $scope.res.Port=80;
            }if(srcf === 'ONVIF'){
                $scope.res.Manufacturer='ONVIF';
                $scope.res.UsrName='admin';
                $scope.res.channel=16;
                $scope.res.Port=80;
            }
        }
        else{
           // (srcf === 'SIP')
            $scope.hdy = false;
            $scope.gb2011 = false;
            $scope.gb2016 = true;
            $scope.res.Manufacturer='国标';
       /* } else {
            $scope.hdy = false;
            $scope.gb2011 = false;
            $scope.gb2016 = false;
            $scope.res.Manufacturer='ONVIF';*/
        }
    };
});





