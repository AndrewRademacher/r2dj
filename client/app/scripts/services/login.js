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
                    rdio_oauth = localStorageService.get('auth.rdio_oauth');
                return (userId !== null) && (rdio_oauth !== null);
            },
            dropAuthentication: function() {
                localStorageService.remove('auth.userId');
                localStorageService.remove('auth.rdio_oauth');
            },
            setAuthentication: function(userId, rdio_oauth) {
                localStorageService.set('auth.userId', userId);
                localStorageService.set('auth.rdio_oauth', rdio_oauth);
            },
            request: function(config) {
                if ($this.isLoggedIn()) {
                    var userId = localStorageService.get('auth.userId'),
                        rdio_oauth = localStorageService.get('auth.rdio_oauth');
                    config.headers.User = userId;
                    config.headers.Authorization = rdio_oauth;
                }
                return config;
            },
            responseError: function(rejection) {}
        };
        return $this;
    });
