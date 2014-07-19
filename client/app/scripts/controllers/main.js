'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('MainCtrl', function($scope, $window, Login, Manager) {

        $scope.login = function() {
            $window.R.authenticate(function(authenticated) {});
        };

        $scope.setUser = function() {
            $scope.currentUser = {
                url: $window.R.currentUser.get('url'),
                firstName: $window.R.currentUser.get('firstName'),
                lastName: $window.R.currentUser.get('lastName'),
                key: $window.R.currentUser.get('key'),
                accessToken: $window.R.accessToken()
            };

            (new Manager({
                rdioOauth: $scope.currentUser.accessToken
            })).$save(function(res, b, c) {
                Login.setAuthentication(res._id, res.rdioOauth);
            });
            $scope.$digest();
        };

        $window.R.on('change:authenticated', function() {
            $window.R.ready(function() {
                if (!$window.R.authenticated()) {
                    return;
                }
                
                $scope.setUser();
            });
        });
    });
