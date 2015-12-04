'use strict';

angular.module('app.services')
    .service('securityService', ['$rootScope', '$window', 'sraApi',
function ($rootScope, $window, sraApi) {

    var $self = this;
    var rnd = Math.floor(Math.random() * 9999999999);
    var hash = CryptoJS.SHA256(rnd + new Date().toISOString());
    var token = hash.toString(CryptoJS.enc.Hex);

    this.token = token;

    this.authenticate = function (success) {
        var authData = this.fromStorage();

        if (authData) {
            $rootScope.app.user = authData;
            success();
        }
        else {
            this.gotoLogin();
        };
    };

    this.credentials = {
        "token": token
           , "digest": null
           , "user": { "username": "", "password": "" }
    };

    this.gotoLogin = function () {
        $rootScope.$state.go($rootScope.app.settings.loginState);
    };

    this.login = function (credentials, sraApi, success, error) {
        sraApi.security.authenticate(credentials).then(function (result) {
            var data = result.data;
            if (data.code === 0) {
                $rootScope.app.user = data.data;
                $rootScope.app.user.sessionId = data.sessionId;
                $window.localStorage.authData = JSON.stringify($rootScope.app.user);
                success(data);
            } else {
                var msg = "Error in login";
                error(msg);
            }
            console.log(result.data);
        },
        function (err) {
            var msg = "Error in login";
            error(msg);
        })
    };

    this.logout = function () {
        $self.credentials = {
            "token": token
           , "digest": null
           , "user": { "username": "", "password": "" }
        };
        if ($rootScope.app.user) {
            sraApi.security.logout($rootScope.app.user.sessionId).then(function (result) {
                $rootScope.app.user = {};
                $self.gotoLogin();
            },
        function (err) {
            $rootScope.app.user = {};
            $self.gotoLogin();
        });
        } else {
            $rootScope.app.user = {};
            this.gotoLogin();
        }
        $self.gotoLogin();
    };

    this.fromStorage = function () {
        var authData = null;
        if ($window.localStorage.authData)
            authData = JSON.parse($window.localStorage.authData);
        return authData;
    };

    $rootScope.$on('currentUserChangePhoto', function (evt, photo) {
        var authData = $self.fromStorage();
        authData.Photo = photo;
        $window.localStorage.authData = JSON.stringify(authData);

        $rootScope.app.user.photo = photo;
    });
}]);