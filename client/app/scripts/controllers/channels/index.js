'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('ChannelIndexCtrl', function($scope) {
        
        $scope.channels = [ { name: 'Wedding Party', id: '235001', rdioPlaylist: '10270464'} ];

        $scope.deleteChannel = function () {

        };

    });
