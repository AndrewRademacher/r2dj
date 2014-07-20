'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('ChannelDetailCtrl', function($scope, $stateParams, $http, Channel, Queue, localStorageService, $q) {
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
        });

        var getChannel = function () {
            $scope.channel = Channel.get({
                id: $stateParams.channelId
            }, function () {
                R.ready(function () {
                    R.request({
                        method: "get",
                        content: {
                            keys: _.map($scope.channel.queue, function(t) { return t.songId; }).join(',')
                        },
                        success: function(data) {
                            $scope.queue = _.map($scope.channel.queue, function(t) {
                                return _.extend(t, data.result[t.songId]);
                            });
                            console.log($scope.queue);
                            $scope.$digest();
                        },
                        error: function(data) {
                            console.log(data);
                        }
                    });
                });
            });
            
        };

        getChannel();
        setInterval(function () {
            getChannel();
        }, 30000);

        $scope.playingText = 'play';
        

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
                key: track.get("key"),
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