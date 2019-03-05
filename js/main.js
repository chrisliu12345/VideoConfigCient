'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window','$rootScope','$state','$cookieStore',
        function ($scope, $translate, $localStorage, $window, $rootScope, $state, $cookieStore) {
            // add 'ie' classes to html
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

            // config
            $scope.app = {

                user: {
                    username: "",
                    password: ""
                },
                name: '配置管理系统',
                version: '1.3.3',
                // for chart colors
                color: {
                    primary: '#7266ba',
                    info: '#23b7e5',
                    success: '#27c24c',
                    warning: '#fad733',
                    danger: '#f05050',
                    light: '#e8eff0',
                    dark: '#3a3f51',
                    black: '#1c2b36'
                },
                settings: {
                    themeID: 1,
                    navbarHeaderColor: 'bg-black',
                    navbarCollapseColor: 'bg-white-only',
                    asideColor: 'bg-black',
                    headerFixed: true,
                    asideFixed: false,
                    asideFolded: false,
                    asideDock: false,
                    container: false
                }
            };

            // save settings to local storage
            if (angular.isDefined($localStorage.settings)) {
                $scope.app.settings = $localStorage.settings;
            } else {
                $localStorage.settings = $scope.app.settings;
            }
            $scope.$watch('app.settings', function () {
                if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                    // aside dock and fixed must set the header fixed.
                    $scope.app.settings.headerFixed = true;
                }
                // save to local storage
                $localStorage.settings = $scope.app.settings;
            }, true);

           // angular translate
            $scope.lang = {isopen: false};
            /*$scope.langs = {en: 'English', de_DE: 'German', it_IT: 'Italian', cn:'Chinese'};
           // $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "Chinese";
           $scope.selectLang = $scope.langs['Chinese'];*/
            $scope.setLang = function () {
               /* $scope.selectLang = $scope.langs[langKey];
                // You can change the language during runtime*/
                $translate.use(langKey);
                $scope.lang.isopen = !$scope.lang.isopen;
            };

            $scope.logout = function () {
                // $localStorage.auth = null;
                // $http.defaults.headers.common['Authorization'] = "Basic";
                $rootScope.username = '';
                $rootScope.password = '';
                $cookieStore.remove('username');
                $cookieStore.remove('password');
                $state.go("auth.login");
            };

            function isSmartDevice($window) {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }

        }]);