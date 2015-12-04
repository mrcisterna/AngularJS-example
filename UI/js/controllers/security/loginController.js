'use strict';

angular.module('app.controllers')
    .controller('loginCtrl', ['$rootScope', '$scope', '$state', 'sraApi', 'securityService', '$localStorage', '$http',
        function ($rootScope, $scope, $state, sraApi, securityService, $localStorage, $http) {

           
            var $self = this;
            $rootScope.app.user = {};

            $scope.credentials = securityService.credentials;

            $scope.login = function () {
                var passHash = CryptoJS.MD5($scope.credentials.user.password);
                var pass = passHash.toString(CryptoJS.enc.Base64);
                var digestHash = CryptoJS.MD5($scope.credentials.user.username + "," + pass + "," + securityService.token);
                var digest = digestHash.toString(CryptoJS.enc.Base64);

                $scope.credentials.digest = digest;
                $scope.credentials.user.password = pass;

                securityService.login($scope.credentials, sraApi,
                    function (data) {
                        $rootScope.$broadcast('authenticated');
                    },
                    function (message) {
                        $scope.credentials = securityService.credentials;
                        $rootScope.$broadcast('validation_error', message);
                    });
            };
        }]);