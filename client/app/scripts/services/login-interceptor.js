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
                    rdioUser = localStorageService.get('auth.rdioUser'),
                    rdioOauth = localStorageService.get('auth.rdioOauth');
                return (userId !== null) && (rdioOauth !== null);
            },
            request: function(config) {
                if ($this.isLoggedIn()) {
                    var userId = localStorageService.get('auth.userId'),
                        rdioUser = localStorageService.get('auth.rdioUser'),
                        rdioOauth = localStorageService.get('auth.rdioOauth');
                    config.headers.User = userId;
                    config.headers.RdioUser = rdioUser;
                    config.headers.Authorization = rdioOauth;
                }

                var listenerId = localStorageService.get('auth.listenerId');
                if (listenerId) 
                    config.headers.Listener = listenerId;

                return config;
            },
            responseError: function(rejection) {}
        };
        return $this;
    });
