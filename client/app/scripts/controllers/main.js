'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('MainCtrl', function($scope, $rootScope, Login) {

        function convertUser() {
            R.ready(function() {
                $scope.currentUser = {
                    url: R.currentUser.get('url'),
                    firstName: R.currentUser.get('firstName'),
                    lastName: R.currentUser.get('lastName'),
                    key: R.currentUser.get('key'),
                    accessToken: R.accessToken()
                };
                $scope.$digest();
            });
        }

        if (!Login.isLoggedIn()) {
            Login.login();
        }

        convertUser();
        $rootScope.$on('$stateChangeSuccess', function(event, toState, fromState) {
            if (toState === 'main') {
                convertUser();
            }
        });
    });
