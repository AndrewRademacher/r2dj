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
        size: new Vector2(144, 28),
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

    wind.add(new UI.Text({
        color: 'black',
        position: new Vector2(0, 50),
        size: new Vector2(144, 26),
        font: 'gothic-28-bold',
        text: song.title,
        align: 'center'
    }));

    wind.add(createText('Vote up', 0, 8));
    wind.add(createText('Vote down', 0, 107));

    wind.show();
  }
};