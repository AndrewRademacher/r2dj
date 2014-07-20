'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('ChannelDetailCtrl', function($scope, $stateParams, $http, Channel) {

        $scope.channel = Channel.get({
            id: $stateParams.channelId
        });

        var queue = ['t39978268', 't49480293', 't39978266', 't39978271', 't39978275', 't20005736', 't39978279', 't20005786', 't39978283'];

        $scope.playingText = 'play';
        R.ready(function() {
            if (R.player.playState() === R.player.PLAYSTATE_PLAYING || R.player.playState() === R.player.PLAYSTATE_BUFFERING) {
                $scope.playingText = 'pause';
            } else {
                $scope.playingText = 'play';
            }

            var track = R.player.playingTrack();
            if (track) {
                $scope.track = getTrack(track);
            }
            R.request({
                method: "get",
                content: {
                    keys: queue.join(',')
                },
                success: function(data) {
                    $scope.queue = _.map(queue, function(t) {
                        return data.result[t];
                    });
                    console.log($scope.queue);
                    $scope.$digest();
                },
                error: function(data) {
                    console.log(data);
                }
            });
        });

        $scope.getNextTrack = function() {
            if ($scope.queue.length > 0)
                return $scope.queue.splice(0, 1)[0].key;
        };

        $scope.play = function() {
            if (!R.player.playingTrack()) {
                var next = $scope.getNextTrack();
                if (next) {
                    console.log(next);
                    R.player.play({
                        source: next
                    })
                }
            } else {
                R.player.togglePause();
            }
        };

        $scope.next = function() {
            if (R.player.queue.length() > 0) {
                R.player.next();
                return;
            }

            var next = $scope.getNextTrack();
            if (next) {
                R.player.play({
                    source: next
                })
            } else {
                R.player.pause()
            }
        };

        var getTrack = function(track) {
            return {
                icon: track.get("icon"),
                name: track.get("name"),
                album: track.get("album"),
                artist: track.get("artist"),
                duration: track.get("duration")
            };
        };

        var updateConcertInformation = function(track) {
            if (!track.artist) {
                $scope.upcomingConcerts = [];
                $scope.$digest();
                return;
            }
            $.getJSON('http://api.jambase.com/artists', {
                name: track.artist,
                page: 0,
                api_key: 'n3bwj465gtaj658n9zhr7snf'
            }).success(function(res) {
                if (res.Artists.length > 0) {
                    $.getJSON('http://api.jambase.com/events', {
                        artistId: res.Artists[0].Id,
                        zipCode: '66205',
                        page: 0,
                        api_key: 'n3bwj465gtaj658n9zhr7snf'
                    }).success(function(res) {
                        $scope.upcomingConcerts = res.Events.splice(0, 3);
                        $scope.$digest();
                    });
                }
            });
        };

        R.ready(function() {
            R.player.on("change:playingTrack", function(track) {
                if (!track)
                    return;

                $scope.track = getTrack(track);
                updateConcertInformation($scope.track);
                $scope.$digest();
            });

            R.player.on("change:position", function(position) {
                var duration = R.player.playingTrack().get('duration');
                $scope.track.position = position;
                $scope.$digest();
                if (position + 5 >= duration && R.player.queue.length() === 0)
                    R.player.queue.add($scope.getNextTrack());
            });

            R.player.on("change:playState", function(state) {
                if (state === R.player.PLAYSTATE_PLAYING || state === R.player.PLAYSTATE_BUFFERING) {
                    $scope.playingText = 'pause';
                } else {
                    $scope.playingText = 'play';
                }
                $scope.$digest();
            });
        });
    });