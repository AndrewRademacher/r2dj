var UI = require('ui');
var Vector2 = require('vector2');
var config = require('app-config');
var ajax = require('ajax');
var Log = require('logger');

module.exports = {
  show: function  (channel, song, done) {
    Log('Showing vote screen for ' + channel.name + ", " + song.title);

    var wind = new UI.Window();

    wind.action({
      up: 'images/thumbs_up.png',
      down: 'images/thumbs_down.png',
      backgroundColor: 'white'
    });
    
    wind.backgroundColor('white');

    var createText = function (text, x, y) {
      return new UI.Text({
        color: 'black',
        position: new Vector2(x, y),
        size: new Vector2(144, 30),
        font: 'gothic-24-bold',
        text: text
      });
    };

    var hideWindow = function () {
      wind.hide();
      done();
    };

    var voteFn = function (vote) {
      return function () {
        channel.vote(song, vote, hideWindow);
      };
    };

    wind.on('click', 'up', voteFn(true));
    wind.on('click', 'down', voteFn(false));

    wind.add(createText(song.title, 0, 40));
    wind.add(createText(song.artist, 0, 55));
    wind.add(createText('Vote up', 0, 10));
    wind.add(createText('Vote down', 0, 105));

    wind.show();
  }
};