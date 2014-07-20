var UI = require('ui');
var Vector2 = require('vector2');
var config = require('app-config');
var ajax = require('ajax');
var voteScreen = require('vote');
var Log = require('logger');
var updateInterval = null;
var flash = require('flash');

var voteComplete = function (channel) {
  return function () {
    flash('Vote Success!', function () {
      showPlaylist(channel);
    });  
  };
};

var showPlaylist = function (channel) {
  Log('Showing playlist for: ' + channel.name);
  
  var menu = new UI.Menu({
    sections: []
  });

  var nowPlaying = {
    title: 'now playing',
    items: []
  };

  var upNext = {
    title: 'up next',
    items: []
  };

  menu.section(0, nowPlaying);
  menu.section(1, upNext);
  
  var currentSongList = [];
  var currentSong = null;

  var updateSongs = function () {   
    channel.info(function (err, info) {
      var playing = info.history.slice(-1);
      var songs = info.queue;

      if (!currentSong || playing.id != currentSong.id) {
        menu.items(0, [{
            title: playing.title,
            subtitle: playing.artist,
            id: playing.id
        }]);  
      }
      
      menu.items(1, songs.map(function (s) {
        return {
          title: s.title,
          subtitle: s.artist,
          id: s.id
        };
      })); 
      
      currentSong = playing;
      currentSongList = songs;
    });
  };

  clearInterval(updateInterval);
  updateInterval = setInterval(updateSongs, 5000);
  updateSongs();
  
  menu.fullscreen(true);

  menu.on('select', function (e) {
    if (e.section !== 1) 
      return;

    Log(e);

    clearInterval(updateInterval);
    menu.hide();

    voteScreen.show(channel, currentSongList[e.item], voteComplete(channel));
  });

  menu.show();
};

module.exports = {
  show: showPlaylist
};
