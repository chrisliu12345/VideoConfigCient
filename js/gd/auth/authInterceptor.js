angular.module('app')
    .factory('AuthInterceptor', ['$rootScope', '$q', '$location','$cookieStore',
        function ($rootScope, $q, $location, $cookieStore ) {

        return {
            'request': function (config) {
                config.headers = config.headers || {};
                //var encodedString = btoa("admin:111111");
                //alert($rootScope.username);
                var username = $cookieStore.get('username');
                var password = $cookieStore.get('password');

                if(undefined === username && undefined === password)
                {
                    return config;
                }
                var encodedString = btoa(username + ":" + password);
                $rootScope.currentAccountUserinfo={};
                $rootScope.token={};
                angular.copy($cookieStore.get('account'), $rootScope.currentAccountUserinfo);
                config.headers.Authorization = $cookieStore.get('token');
                $rootScope.token=$cookieStore.get('token');
                return config;
            },
            'responseError': function (response) {

                if (response.status === 401) {
                   alert("用户名或密码错误，请重新输入");
                    console.log("请重新登录");
                    $location.url('/auth/login');
                }
                return $q.reject(response);
            }
        }

    }]);

