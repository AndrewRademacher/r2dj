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
            localStorageService.remove('auth.rdioOauth');
        }

        function setAuthentication(userId, rdioOauth) {
            localStorageService.set('auth.userId', userId);
            localStorageService.set('auth.rdioOauth', rdioOauth);
        }

        function loginHome(currentUser) {
            (new Manager({
                rdioOauth: R.accessToken()
            })).$save(function(res) {
                Login.setAuthentication(res._id, res.rdioOauth);
            });
        }

        R.on('change:authenticated', function() {
            R.ready(function() {
                if (!R.authenticated()) {
                    return;
                }

                loginHome(R.currentUser);
            });
        });

        var $this = {
            isLoggedIn: function() {
                var userId = localStorageService.get('auth.userId'),
                    rdioOauth = localStorageService.get('auth.rdioOauth');
                return (userId !== null) && (rdioOauth !== null);
            },
            login: function(callback) {
                R.ready(function() {
                    R.authenticate(function(authenticated) {});
                });
            }
        };
        return $this;
    });
