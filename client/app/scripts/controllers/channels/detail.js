'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('ChannelDetailCtrl', function($scope, $stateParams, utils) {
        
        $scope.channel = utils.findById($scope.channels, $stateParams.channelId);


    });
