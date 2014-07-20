'use strict';

/**
 * @ngdoc service
 * @name clientApp.Login
 * @description
 * # Login
 * Service in the clientApp.
 */
angular.module('clientApp')
    .service('Login', function Login(localStorageService, Manager) {
        function dropAuthentication() {
            localStorageService.remove('auth.userId');
            localStorageService.remove('auth.rdioUser');
            localStorageService.remove('auth.rdioOauth');
        }

        function loginHome(currentUser) {
            (new Manager({
                rdioUser: R.currentUser.get('key')
            })).$save(function(res) {
                localStorageService.set('auth.userId', res._id);
            });
        }

        R.on('change:authenticated', function() {
            R.ready(function() {
                if (!R.authenticated()) {
                    return;
                }

                localStorageService.set('auth.rdioOauth', R.accessToken());
                localStorageService.set('auth.rdioUser', R.currentUser.get('key'));
                loginHome(R.currentUser);
            });
        });

        var $this = {
            isLoggedIn: function() {
                var userId = localStorageService.get('auth.userId'),
                    rdioUser = localStorageService.get('auth.rdioUser'),
                    rdioOauth = localStorageService.get('auth.rdioOauth');
                return (userId !== null) && (rdioUser !== null);
            },
            login: function(callback) {
                R.ready(function() {
                    R.authenticate(function(authenticated) {});
                });
            }
        };
        return $this;
    });
