'use strict';

/**
 * @ngdoc service
 * @name clientApp.LoginInterceptor
 * @description
 * # LoginInterceptor
 * Service in the clientApp.
 */
angular.module('clientApp')
    .service('LoginInterceptor', function LoginInterceptor($location, localStorageService) {
        var $this = {
            isLoggedIn: function() {
                var userId = localStorageService.get('auth.userId'),
                    rdioKey = localStorageService.get('auth.rdioKey'),
                    rdioOauth = localStorageService.get('auth.rdioOauth');
                return (userId !== null) && (rdioOauth !== null);
            },
            request: function(config) {
                if ($this.isLoggedIn()) {
                    var userId = localStorageService.get('auth.userId'),
                        rdioKey = localStorageService.get('auth.rdioKey'),
                        rdioOauth = localStorageService.get('auth.rdioOauth');
                    config.headers.User = userId;
                    config.headers.RdioUser = rdioKey;
                    config.headers.Authorization = rdioOauth;
                }
                return config;
            },
            responseError: function(rejection) {}
        };
        return $this;
    });
