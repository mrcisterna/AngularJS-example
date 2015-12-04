'use strict';

var app = angular.module('app', [
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'ngStorage',
    'toaster',
    'app.services',
    'app.directives',
    'app.controllers'
    //'app.interceptors'
])
.run(
  ['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
  ]
)
.config(
  ['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

        app.controller = $controllerProvider.register;
        app.service = $provide.service;
        app.stateProvider = $stateProvider;
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|callto):/);

        $urlRouterProvider
        .otherwise('/app/startup');

        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                templateUrl: 'tpl/app.html'
            })
            .state('app.startup', {
                url: '/startup',
                templateUrl: 'tpl/customers/customers_list.html'
            })
            .state('app.login', {
                url: '/login',
                templateUrl: 'tpl/security/login.html'
            })
            .state('app.about', {
                url: '/auth',
                templateUrl: 'tpl/about/about.html'
            })
            .state('app.profile', {
                url: '/profile',
                templateUrl: 'tpl/404/page_404.html'
            })
            .state('app.error', {
                url: '/error',
                templateUrl: 'tpl/error/error_page.html'
            })
            .state('app.404', {
                url: '/404',
                templateUrl: 'tpl/404/page_404.html'
            });
    }])

angular.module('app.controllers', ['ngCookies', 'ui.router'])
  .controller('AppCtrl', ['$rootScope', '$scope', '$localStorage', '$window', '$http', 'sraApi', '$state', 'securityService',
function ($rootScope, $scope, $localStorage, $window, $http, sraApi, $state, securityService) {
    // add 'ie' and 'smart' classes to html
    var isIE = !!navigator.userAgent.match(/MSIE/i);
    isIE && angular.element($window.document.body).addClass('ie');
    isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

    // config
    $rootScope.app = {
        name: '\u00E9' + 'merix',
        title: '\u00E9' + 'merix',
        version: '6.0.0',
        user: {},
        settings: {
            startupState: 'app.startup',
            loginState: 'app.login',
            headerFixed: true,
            asideFixed: false,
            asideFolded: false,
            asideDock: false,
            container: false
        }
    }

    // save settings to local storage
    //if (angular.isDefined($localStorage.settings)) {        
    //    $scope.app.settings = $localStorage.settings;
    //} else {
    //    $localStorage.settings = $scope.app.settings;
    //}

    //Handle authentication
    securityService.authenticate(appStart);

    $rootScope.$on('unauthorized', function () {
        securityService.gotoLogin()
    });

    $rootScope.$on('authenticated', appStart);

    function appStart() {
        var authData = securityService.fromStorage();

        $rootScope.app.user = authData;

        $rootScope.$state.go($rootScope.app.settings.startupState);

        $rootScope.logout = securityService.logout;
    };

    //Global exception handling
    $rootScope.$on('unhandled_exception', function (event, args) {
        $rootScope.globalMessage = args.message;
        $state.go('app.error');
    });

    // detect mobile
    function isSmartDevice($window) {
        var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
    }
}])