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
            localStorageService.remove('auth.rdioKey');
            localStorageService.remove('auth.rdioOauth');
        }

        function loginHome(currentUser) {
            (new Manager({
                rdioKey: R.currentUser.get('key')
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
                localStorageService.set('auth.rdioKey', R.currentUser.get('key'));
                loginHome(R.currentUser);
            });
        });

        var $this = {
            isLoggedIn: function() {
                var userId = localStorageService.get('auth.userId'),
                    rdioKey = localStorageService.get('auth.rdioKey'),
                    rdioOauth = localStorageService.get('auth.rdioOauth');
                return (userId !== null) && (rdioKey !== null);
            },
            login: function(callback) {
                R.ready(function() {
                    R.authenticate(function(authenticated) {});
                });
            }
        };
        return $this;
    });