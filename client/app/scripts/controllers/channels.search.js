'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('ChannelSongSearchCtrl', function($scope, $state, $stateParams, Channel, Queue, localStorageService) {

        $scope.channel = Channel.get({
            id: $stateParams.channelId
        });

        $scope.upVote = function(track) {
            (new Queue({
                songId: track.key,
                title: track.name,
                artist: track.artist,
                album: track.album,
                vote: 1
            })).$vote({
                id: $scope.channel._id
            }).then(function(res) {
                if (res.listenerId)
                    localStorageService.set('auth.listenerId', res.listenerId);
            });
        }

        $scope.downVote = function(track) {
            (new Queue({
                songId: track.key,
                title: track.name,
                artist: track.artist,
                album: track.album,
                vote: -1
            })).$vote({
                id: $scope.channel._id
            }).then(function(res) {
                if (res.listenerId)
                    localStorageService.set('auth.listenerId', res.listenerId);
            });
        }

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