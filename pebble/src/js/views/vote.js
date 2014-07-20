var UI = require('ui');
var Vector2 = require('vector2');
var config = require('app-config');
var ajax = require('ajax');

var showVoteScreen = function  (station, song) {
  console.log('Showing vote screen for ' + JSON.stringify(song));

  var wind = new UI.Window();

  wind.action({
    up: 'images/thumb_up.png',
    down: 'images/thumb_up.png'
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

  var success = function (e) {
    wind.hide();
  };

  var fail = function () {
    wind.hide();
  };

  var submitVote = function (vote) {
    ajax({
      url: config.rootUrl + '/vote',
      method: 'post',
      type: 'json',
      data: {
        vote: vote,
        song_id: song.id,
        pebble_id: Pebble.getAccountToken(),
        station_id: station.id
      }
    }, success, fail);
  };

  wind.on('click', 'up', function (e) {
    submitVote(true);
  });

  wind.on('click', 'down', function (e) {
    submitVote(false);
  });

  wind.add(createText(song.title, 0, 40));
  wind.add(createText(song.artist, 0, 55));
  wind.add(createText('Vote up', 0, 10));
  wind.add(createText('Vote down', 0, 105));

  wind.show();
};

module.exports = {
  show: showVoteScreen
};