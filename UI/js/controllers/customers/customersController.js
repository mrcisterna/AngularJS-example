'use strict';

angular.module('app.controllers')
    .controller('customersCtrl', ['$rootScope', '$scope', 'sraApi', 'securityService', '$filter',
        function ($rootScope, $scope, sraApi, securityService, $filter) {

            var customersList = null;

            $scope.statusType = null;
            $scope.customerDetail = null;
            $scope.forms = {};            

            $rootScope.getCustomers = function () {
                $rootScope.search = {};
                sraApi.customers.list({ "sessionId": $rootScope.app.user.sessionId })
                    .then(function (result) {
                        var data = result.data;
                        if (data.code === 0) {
                            $rootScope.app.user.sessionId = data.sessionId;
                            customersList = data.data;
                            $scope.statusTypes = getStatesDomain(customersList);
                            $rootScope.statusType = $scope.statusTypes[0];
                            $scope.items = customersList;
                        } else {
                            securityService.logout();
                        }
                    });
            };

            function getStatesDomain(data) {
                var states = null;
                if (data) {
                    states = [data[0].status];
                    for (var i = 1; i < data.length; i++) {
                        if (states.indexOf(data[i].status) == -1) {
                            states.push(data[i].status);
                        }
                    }
                    return states;
                }
            }

            $scope.selectItem = function (customer) {
                var payload = {
                    "sessionId": $rootScope.app.user.sessionId
                    , "customerid": customer.id.toString()
                }
                sraApi.customers.detail(payload).then(function (result) {
                    var data = result.data;
                    if (data.code === 0) {
                        $rootScope.app.user.sessionId = data.sessionId;
                        var customerDetail = data.data;
                        if (customerDetail.visit) {
                            customerDetail.visit.date = formatDate(data.data.visit.date);
                            customerDetail.visit.time = formatTime(data.data.visit.time);
                        }
                        $scope.customerDetail = customerDetail;

                    } else {
                        securityService.logout();
                    }
                });
            }

            $rootScope.filter = function () {
                $scope.items = $filter('filter')(customersList, $rootScope.search);
                $scope.customerDetail = null;
                $rootScope.hasFilter = true;
            }

            $rootScope.removeFilter = function () {
                $rootScope.search = {};
                $scope.items = customersList;
                $rootScope.hasFilter = false;
            }

            $scope.selectNotesTab = function (tab) {               
                $scope.visitFormSelected = false;
                $scope.noteFormSelected = true;
            };

            $scope.selectVisitTab = function (tab) {                
                $scope.visitFormSelected = true;
                $scope.noteFormSelected = false;
            };

            $scope.saveNotes = function (customer) {
                var payload = {
                    "sessionId": $rootScope.app.user.sessionId
                    , "customerid": customer.id.toString()
                    , "status": customer.status
                    , "notes": customer.notes
                }
                sraApi.customers.saveNotes(payload).then(function (result) {
                    var data = result.data;
                    if (data.code === 0) {
                        $rootScope.app.user.sessionId = data.sessionId;
                        var customerDetail = data.data;
                        if (customerDetail.visit) {
                            customerDetail.visit.date = formatDate(customerDetail.visit.date);
                            customerDetail.visit.time = formatTime(customerDetail.visit.time);
                        }
                        $scope.customerDetail = customerDetail;
                        updateCustomer(customerDetail);
                        $scope.forms.form.$setPristine();
                        $rootScope.$broadcast('validation_success', "Note saved succefully.")
                    } else {
                        securityService.logout();
                    }
                });
            }

            $scope.saveVisit = function (customer) {

                var payload = {
                    "sessionId": $rootScope.app.user.sessionId
                       , "customerid": customer.id.toString()
                       , "visit": {
                           "date": $filter('date')(customer.visit.date, 'yyyy-MM-dd')
                           , "time": $filter('date')(customer.visit.time, 'shortTime')
                           , "action": customer.visit.action
                           , "notes": customer.visit.notes
                       }
                }
                sraApi.customers.saveVisit(payload).then(function (result) {
                    var data = result.data;
                    if (data.code === 0) {
                        $rootScope.app.user.sessionId = data.sessionId;
                        var customerDetail = data.data;
                        if (customerDetail.visit) {
                            customerDetail.visit.date = formatDate(data.data.visit.date);
                            customerDetail.visit.time = formatTime(data.data.visit.time);
                        }
                        $scope.customerDetail = customerDetail;
                        updateCustomer(customerDetail);
                        $scope.forms.form.$setPristine();
                        $rootScope.$broadcast('validation_success', "Visit saved succefully.")
                    } else {
                        securityService.logout();
                    }
                });
            }

            function updateCustomer(customerDetail) {
                for (var i = 0; i < customersList.length; i++) {
                    if (customersList[i].id == customerDetail.id) {
                        customersList[i].status = customerDetail.status;
                        customersList[i].notes = customerDetail.notes;
                        break;
                    }
                }
                for (var i = 0; i < $scope.items.length; i++) {
                    if ($scope.items[i].id == customerDetail.id) {
                        $scope.items[i].status = customerDetail.status;
                        $scope.items[i].notes = customerDetail.notes;
                        break;
                    }
                }
            }

            function formatDate(EpochDate) {
                var date = new Date(EpochDate);
                return new Date(date.getFullYear(), date.getMonth(), date.getDay());
            }

            function formatTime(time) {
                var _time = time.split(" ")[0].split(":");
                return new Date(1970, 0, 1, _time[0], _time[1]);
            }

            $scope.logout=securityService.logout;
        }]);