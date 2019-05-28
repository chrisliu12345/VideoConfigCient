app.controller('LoadingController', function ($scope, $resource, $state) {
    // var $com = $resource($scope.app.host + "/account/all");
    // $com.get(function () {
    //     $state.go('app.user');
    // }, function () {
    //     $state.go('auth.login');
    // })
});
app.controller('LoginController', function ($rootScope, $scope, $state, $http, $cookieStore,$translate) {

    var REST_SERVICE_URI = '/ma/login/';
    $cookieStore.put('langSpeak',$translate.use());
    //切换语言
    $scope.setLang = function(langKey) {
        $translate.use(langKey);
        $cookieStore.put('langSpeak',$translate.use());

    };
    $scope.login = function () {
        $scope.authError = "";

        $rootScope.username = $scope.user.username;
        $rootScope.password = $scope.user.password;

        $cookieStore.put('username', $rootScope.username);
        $cookieStore.put('password', $rootScope.password);


        var stata2 = {
            username: $rootScope.username,
            password: $rootScope.password
        };

// 修改为token认证，先要用户名和密码获取token
        $http({
            method: 'POST',
            url: '/ma/auth',
            data: stata2,
            timeout:5000
        }).then(function successCallback(data) {
            $scope.tokens = 'Bearer' + ' ' + data.data.token;

            $rootScope.token = $scope.tokens;
            $cookieStore.put('token',$scope.tokens );

            $http({
                method: 'GET',
                url: '/ma/login',
                timeout:3000
            }).then(function (response) {
                var vid=response.data.validategroupid;
                if(vid === null ||vid === undefined || vid ===''){
                    vid="null";
                }
                $rootScope.currentAccountUserinfo = {};

                var account = {
                    accountName: $scope.user.username,
                    password: $scope.user.password,
                    realName: response.data.data[0].userinfo[0].realName,
                    avatar: response.data.data[0].userinfo[0].picture,
                    validategroupid: vid,
                    accountId:response.data.accountId

                };

                $cookieStore.put('account', account);
                

                angular.copy(response.data.data[0], $rootScope.currentAccountUserinfo);
                $rootScope.accountId = response.data.accountId;
                $state.go('app.dashboard');
            }, function (reason) {
                $scope.authError = "登录凭证不正确，请重新输入";
            });
        }, function (reason) {
            $scope.authError = "请求超时，服务器不可用";
        });
    }



});






