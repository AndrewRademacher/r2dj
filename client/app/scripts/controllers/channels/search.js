'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('ChannelSongSearchCtrl', function($scope, $state, $stateParams, Channel) {

        $scope.channel = Channel.get({
            id: $stateParams.channelId
        });

        $scope.vote = function(track, value) {
            if (value === 1) {
                console.log('up vote for ' + track.key);
            } else {
                console.log('down vote for ' + track.key);
            }
        };

        var runQuery = _.debounce(function() {
            $scope.results = [];

            R.request({
                method: "search",
                content: {
                    query: $scope.query,
                    types: "Track"
                },
                success: function(data) {
                    $scope.results = data.result.results;
                    $scope.$digest();
                },
                error: function(data) {
                    console.log(data);
                }
            });
        }, 500);

        $scope.$watch('query', function(n, o) {
            if (!n) {
                $scope.results = [];
                return;
            }
            if (n !== undefined && n != o) {
                runQuery();
            }
        });

    });