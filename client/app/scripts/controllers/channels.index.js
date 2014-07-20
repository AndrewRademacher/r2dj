'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('ChannelIndexCtrl', function($scope, Channel) {

        $scope.channels = Channel.query();
        $scope.canPlay = false;

        R.ready(function () {
            $scope.canPlay = R.authenticated();
            $scope.$digest();
        });

        $scope.deleteChannel = function(channel) {

            channel.$delete({
                id: channel._id
            }).then(function() {
                $scope.channels.splice(_.indexOf($scope.channels, channel), 1);
            });
        };

    });