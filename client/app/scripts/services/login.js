'use strict';

/**
 * @ngdoc service
 * @name clientApp.Login
 * @description
 * # Login
 * Service in the clientApp.
 */
angular.module('clientApp')
    .service('Login', function Login($location, localStorageService) {
        var $this = {
            isLoggedIn: function() {
                var userId = localStorageService.get('auth.userId'),
                    rdioOauth = localStorageService.get('auth.rdioOauth');
                return (userId !== null) && (rdioOauth !== null);
            },
            dropAuthentication: function() {
                localStorageService.remove('auth.userId');
                localStorageService.remove('auth.rdioOauth');
            },
            setAuthentication: function(userId, rdioOauth) {
                localStorageService.set('auth.userId', userId);
                localStorageService.set('auth.rdioOauth', rdioOauth);
            },
            request: function(config) {
                if ($this.isLoggedIn()) {
                    var userId = localStorageService.get('auth.userId'),
                        rdioOauth = localStorageService.get('auth.rdioOauth');
                    config.headers.User = userId;
                    config.headers.Authorization = rdioOauth;
                }
                return config;
            },
            responseError: function(rejection) {}
        };
        return $this;
    });
