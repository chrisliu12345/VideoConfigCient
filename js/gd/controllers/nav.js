app.controller("navCtrl", function ($scope, $http,$cookieStore) {

    $scope.query = function () {
        var QUERY_URI = '/ma/resource/menus/';

       /* $http.get(QUERY_URI)
            .then(
                function (result) {
                    console.log(result.data.data);

                    console.log($scope.menus);
                },
                function () {
                    // alert("获取导航列表失败 nav.js query menus");
                    console.log("获取导航列表失败");
                }
            );*/
        $http({
            url: QUERY_URI,
            method: "POST",
            data: $cookieStore.get("langSpeak")
        }).then(function success(result) {
            $scope.menus = result.data.data;
        }, function error() {
            alert("菜单查询失败");
        })
    };
    $scope.query();
});