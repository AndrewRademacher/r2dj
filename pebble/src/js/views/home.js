var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var config = require('app-config');
var Settings = require('settings');
var Log = require('logger');
var playlist = require('playlist');
var Channel = require('channel');

var joinChannel = function (channel) {
    Log('Joining channel: ' + channel.name);
    playlist.show(channel);
};

module.exports = {
    show: function () {
        var channels = [];

        var menu = new UI.Menu({
            sections: [{
                title: 'channels',
                items: []
            }]
        });

        menu.on('select', function (e) {
            joinChannel(channels[e.item]);
        });

        var update = function () {
            Channel.list(function (err, chans) {
                channels = chans;

                var items = channels.map(function (c) {
                    return {
                        title: c.name
                    };
                });

                menu.items(0, items);
            });
        };

        update();

        setInterval(update, 5000);

        menu.show();
    }
};