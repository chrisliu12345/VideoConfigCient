/**
 * Created by Administrator on 2018/1/12 0012.
 */
app.directive('myDir', function ($http,$rootScope) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function ($scope, element, attrs, ngModel) {
            $http({
                url: '/ma/orgtree/zTreeCmaera/1',
                method: 'POST',
                data:$rootScope.currentAccountUserinfo.accountName
            }).success(function (response) {

                var setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        beforeClick:beforeClick,
                        /*onClick: $scope.ztreeOnAsyncSuccess1,*/
                        onRightClick:$scope.zTreeOnRightClick,
                        onExpand:$scope.ztreeOnAsyncSuccess1

                        }
                };
                function beforeClick(treeId, treeNode, clickFlag) {
                    return (treeNode.click !== false);
                }

                $scope.treemenus = response;
                $.fn.zTree.init(element, setting, response);
            }).error(function (data) {
                console.log("error" + data);
            });
        },

    };
});
