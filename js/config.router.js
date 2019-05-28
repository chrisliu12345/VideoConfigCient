'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .config(
        ['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {

                $urlRouterProvider
                    .otherwise('/auth/login');

                $stateProvider
                    .state('auth', {
                        abstract: true,
                        url: '/auth',
                        template: '<div ui-view class="fade-in"></div>',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('js/gd/auth/ctrl.js');
                                }]
                        }
                    })
                    .state('auth.loading', {
                        url: '/loading',
                        templateUrl: 'tpl/gd/auth/loading.html'
                    })
                    .state('auth.login', {
                        url: '/login',
                        templateUrl: 'tpl/gd/auth/login.html'
                    })
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'tpl/gd/blocks/app.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['js/gd/controllers/nav.js']);
                                }]
                        }
                    })
                    .state('app.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'tpl/gd/dashboard.html',
                        ncyBreadcrumb: {
                            label: '<i class="fa fa-home"></i>{{"shouye"|translate}} '
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['js/gd/controllers/dashboard.js']);
                                }]
                        }
                    })


                    .state('app.user', {
                        url: '/user',
                        templateUrl: 'tpl/gd/user/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"userlist"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['js/gd/controllers/user/list.js',
                                                'js/gd/controllers/user/view.js',
                                                'js/gd/controllers/user/edit.js',
                                                'js/gd/controllers/user/add.js',
                                                'js/gd/controllers/user/adds.js',
                                                'js/gd/controllers/user/account.js',
                                                'js/gd/controllers/account/list.js',
                                                'js/gd/controllers/role/list.js',
                                                'js/gd/controllers/user/delete.js',
                                                'js/gd/controllers/user/batchUpdateUserOrg.js',
                                               'js/gd/controllers/user/plazTree.js',
                                                'js/gd/controllers/user/camzTree.js'
                                            ]);
                                        }
                                    );
                                }]
                        }
                    })

                    .state('app.layout', {
                        url: '/layout',
                        templateUrl: 'tpl/gd/layout/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"loglist"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/layout/layoutDataService.js',
                                                'vendor/libs/d3.v4.min.js',
                                                'js/gd/controllers/layout/list.js',
                                                'js/gd/controllers/layout/view.js',
                                                'js/gd/controllers/layout/delete.js',
                                                'js/gd/controllers/layout/edit.js',
                                                'js/gd/controllers/layout/add.js'
                                            ]);
                                        }
                                    );
                                }]
                        }
                    })

                    .state('app.groups', {
                        url: '/groups',
                        templateUrl: 'tpl/gd/groups/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '组域管理'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/groups/list.js',
                                                'js/gd/controllers/groups/view.js',
                                                'js/gd/controllers/groups/edit.js',
                                                'js/gd/controllers/groups/delete.js',
                                                'js/gd/controllers/groups/add.js',
                                                'js/gd/controllers/groups/zTree.js',
                                                'js/gd/controllers/groups/delete_change.js',
                                                'js/gd/controllers/groups/adds.js']);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.res', {
                        url: '/res',
                        templateUrl: 'tpl/gd/res_attr/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '资源列表'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/res_attr/list.js',
                                                'js/gd/controllers/res_attr/view.js',
                                                'js/gd/controllers/res_attr/edit.js',
                                                'js/gd/controllers/res_attr/delete.js',
                                                'js/gd/controllers/res_attr/add.js',
                                                'js/gd/controllers/res_attr/zTree.js',
                                                'js/gd/controllers/res_attr/delete_change.js']);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.camera', {
                        url: '/camera',
                        templateUrl: 'tpl/gd/camera/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '摄像头列表'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/camera/list.js',
                                                'js/gd/controllers/camera/view.js',
                                                'js/gd/controllers/camera/edit.js',
                                                'js/gd/controllers/camera/delete.js',
                                                'js/gd/controllers/camera/add.js',
                                                'js/gd/controllers/camera/plazTree.js',
                                                'js/gd/controllers/camera/camzTree.js',
                                                'js/gd/controllers/camera/addChannel.js',
                                                'js/gd/controllers/camera/addChannel1.js',
                                                'js/gd/controllers/camera/delete_change.js',

                                                'js/gd/controllers/camera/adds.js']);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.channel', {
                        url: '/channel',
                        templateUrl: 'tpl/gd/channel/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '通道列表'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/channel/list.js',
                                                'js/gd/controllers/channel/view.js',
                                                'js/gd/controllers/channel/edit.js',
                                                'js/gd/controllers/channel/delete.js'
                                                ]);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.updown', {
                        url: '/updown',
                        templateUrl: 'tpl/gd/updown/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"platformdock"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/updown/list.js',
                                                'js/gd/controllers/updown/view.js',
                                                'js/gd/controllers/updown/edit.js',
                                                'js/gd/controllers/updown/delete.js',
                                                'js/gd/controllers/updown/add.js',
                                                'js/gd/controllers/updown/clean.js',
                                                'js/gd/controllers/updown/query.js',
                                                'js/gd/controllers/updown/delete_change.js'
                                            ]);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.role', {
                        url: '/role',
                        templateUrl: 'tpl/gd/role/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"rolelist"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ui.select').then(
                                        function () {
                                            return $ocLazyLoad.load(['js/gd/controllers/role/list.js',
                                                'js/gd/controllers/role/view.js',
                                                'js/gd/controllers/role/edit.js',
                                                'js/gd/controllers/role/delete.js',
                                                'js/gd/controllers/role/add.js']);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.skin', {
                        url: '/skin',
                        templateUrl: 'tpl/gd/skin/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"skin"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ui.select').then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/skin/list.js',
                                                // 'js/gd/controllers/role/view.js',
                                                // 'js/gd/controllers/role/edit.js',
                                                // 'js/gd/controllers/role/delete.js',
                                                // 'js/gd/controllers/role/add.js'
                                            ]);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.authority', {
                        url: '/authority',
                        templateUrl: 'tpl/gd/authority/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"authlist"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ui.select').then(
                                        function () {
                                            return $ocLazyLoad.load(['js/gd/controllers/authority/list.js',
                                                'js/gd/controllers/authority/view.js',
                                                'js/gd/controllers/authority/edit.js',
                                                'js/gd/controllers/authority/delete.js',
                                                'js/gd/controllers/authority/add.js'
                                                ]);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.org', {
                        url: '/org',
                        templateUrl: 'tpl/gd/org/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"orglist"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/org/list.js',
                                                'js/gd/controllers/org/zTreeDirective.js',
                                                'js/gd/controllers/org/viewResAttr.js',
                                                'js/gd/controllers/org/addResAttr.js',
                                                'js/gd/controllers/org/editResAttr.js',
                                                'js/gd/controllers/org/deleteResAttr.js',
                                                'js/gd/controllers/org/viewCamera.js',
                                                'js/gd/controllers/org/editCamera.js',
                                                'js/gd/controllers/org/deleteCamera.js',
                                                'js/gd/controllers/org/addCamera.js',
                                                'js/gd/controllers/org/addCameras.js',
                                                'js/gd/controllers/org/addChannel.js',
                                                'js/gd/controllers/org/addChannel1.js',
                                                'js/gd/controllers/org/addIntrusionAlarm.js',
                                                'vendor/libs/d3.v4.min.js',
                                                'js/gd/controllers/org/addGroup.js',
                                                'js/gd/controllers/org/addParentGroup.js',
                                                'js/gd/controllers/org/deleteGroup.js',
                                                'js/gd/controllers/org/editGroup.js',
                                                'js/gd/controllers/org/viewGroup.js',
                                                'js/gd/controllers/org/deleteAlarm.js'
                                            ]);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.save', {
                        url: '/save',
                        templateUrl: 'tpl/gd/save/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"saveplan"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/save/list.js',
                                                'js/gd/controllers/save/delete.js',
                                                'js/gd/controllers/save/delete_all.js',
                                                'js/gd/controllers/save/edit.js',
                                                'js/gd/controllers/save/view.js',


                                            ]);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.server', {
                        url: '/server',
                        templateUrl: 'tpl/gd/server/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"servicemasg"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['js/gd/controllers/server/list.js',
                                                'js/gd/controllers/server/upSSK.js',
                                                'js/gd/controllers/server/ntpConfig.js',
                                                'js/gd/controllers/server/internetConfig.js',
                                                'js/gd/controllers/server/editConfig.js',
                                                'js/gd/controllers/server/mediaConfig.js',
                                                'js/gd/controllers/server/viewConfig.js'
                                            ]);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.alarm', {
                        url: '/alarm',
                        templateUrl: 'tpl/gd/alarm/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"alarmconfig"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/alarm/list.js',
                                                'js/gd/controllers/alarm/delete.js',
                                                'js/gd/controllers/alarm/delete_all.js',
                                                'js/gd/controllers/alarm/edit.js',
                                                'js/gd/controllers/alarm/camzTree.js',
                                                'js/gd/controllers/alarm/view.js']);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.logview', {
                        url: '/logview',
                        templateUrl: 'tpl/gd/logview/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"logview"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/logview/list.js',
                                                ]);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.app.AppAccounts', {
                        url: '/AppAccounts',
                        // templateUrl: 'tpl/gd/account/list.html',
                        template: '<h1>hello </h1>',
                        controller: 'accountCtrl',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"viewAcc"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load('js/gd/controllers/account/list.js');
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.account', {
                        url: '/account',
                        templateUrl: 'tpl/gd/account/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"accountlist"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ui.select').then(function () {
                                        return $ocLazyLoad.load(['js/gd/controllers/account/list.js',
                                            'js/gd/controllers/account/delete.js',
                                            'js/gd/controllers/account/view.js',
                                            'js/gd/controllers/account/edit.js',
                                            'js/gd/controllers/account/plazTree.js',
                                            'js/gd/controllers/account/camzTree.js',
                                            'js/gd/controllers/user/list.js']);
                                    })
                                }]
                        }
                    })
                    .state('layout', {
                        abstract: true,
                        url: '/layout',
                        templateUrl: 'tpl/gd/blocks/layout.html'
                    })
                    .state('layout.im', {
                        url: '/im',
                        views: {
                            '': {
                                templateUrl: 'tpl/gd/im/im.html'
                            },
                            'footer': {
                                templateUrl: 'tpl/gd/im/im_footer.html'
                            }
                        },
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '即时通讯'
                        },
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/tab.js', 'js/gd/controllers/im/im.js']);
                                }]
                        }
                    })
                    .state('app.editCurrentAccountUserinfo', {
                        url: '/editCurrentAccountUserinfo',
                        templateUrl: 'tpl/gd/user/edit.html',
                        controller: 'currentAccountUserinfoCtrl',
                        controllerAs: 'editVm',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '查看编辑当前用户信息'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load('js/gd/controllers/currentAccountUserinfoCtrl.js');
                                        }
                                    );
                                }]
                        }
                    })

                    .state('app.changePassword', {
                        url: '/changePassword',
                        templateUrl: 'tpl/gd/auth/changePassword.html',
                        controller: 'currentAccountUserinfoCtrl',
                        controllerAs: 'editVm',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '{{"changeNowPwd"|translate}}'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('js/gd/controllers/currentAccountUserinfoCtrl.js');
                                }]
                        }
                    })

            }
        ]
    );

