'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('ChannelNewCtrl', function($scope, $state, Channel) {

        $scope.createChannel = function() {
            (new Channel({
                name: $scope.name
            })).$save(function(res) {
                $state.go('channels.list', {}, {
                    reload: true
                });
            });
        };

    });