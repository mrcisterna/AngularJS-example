'use strict';

angular.module('app.services', [])
    .service('sraApi', ['$http', '$rootScope', function ($http, $rootScope) {
        var baseUrl = ' http://localhost:8080/SRA/';

        $http.defaults.headers.put = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
        };
        $http.defaults.useXDomain = true;

        this.security = {
            authenticate: function (credentials) {
                return $http.post(baseUrl + 'authenticate', credentials);
            },
            logout: function (id) {
                return $http.post(baseUrl + 'logout', id);
            }
        };

        this.customers = {
            list: function (id) {
                return $http.post(baseUrl + 'customer/list', id);
            },
            detail: function (payload) {
                return $http.post(baseUrl + 'customer/details', payload);
            },
            saveNotes: function (payload) {
                return $http.post(baseUrl + 'customer/savenotes', payload);
            },
            saveVisit: function (payload) {
                return $http.post(baseUrl + 'customer/savevisit', payload);
            }
        };
    }])