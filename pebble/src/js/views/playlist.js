var UI = require('ui');
var Vector2 = require('vector2');
var config = require('app-config');
var ajax = require('ajax');
var voteScreen = require('vote');
var Log = require('logger');
var updateInterval = null;

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
    channel.getPlaylist(function (err, info) {
      console.log(info);
      var playing = info.currentSong;
      var songs = info.playlist;

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
    menu.hide();
    voteScreen.show(channel, currentSongList[e.item], function () {  
      showPlaylist(channel);
    });
  });

  menu.show();
}

module.exports = {
  show: showPlaylist
};
