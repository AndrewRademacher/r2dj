var UI = require('ui');
var Vector2 = require('vector2');
var config = require('app-config');
var ajax = require('ajax');
var voteScreen = require('vote');
var Log = require('logger');
var updateInterval = null;
var flash = require('flash');
var Accel = require('ui/accel');

var onTapped = function () { };
Accel.init();
Accel.on('tap', function (e) {
  Log('Tapped!');
  onTapped(e);
});

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
      currentSongList = info.queue;

      var songInProgress = info.currentSong;

      if (songInProgress && (!currentSong || songInProgress.id != currentSong.id)) {
        menu.items(0, [{
            title: songInProgress.title,
            subtitle: songInProgress.artist,
            id: songInProgress.id
        }]);  
      }
      
      menu.items(1, currentSongList.map(function (s) {
        return {
          title: s.title,
          subtitle: '[' + s.vote + '] ' + s.artist,
          id: s.id
        };
      })); 
      
      currentSong = songInProgress;
    });
  };
  
  onTapped = updateSongs;

  clearInterval(updateInterval);
  updateInterval = setInterval(updateSongs, 10000);

  updateSongs();
  
  menu.fullscreen(true);

  menu.on('select', function (e) {
    if (e.section !== 1) 
      return;

    clearInterval(updateInterval);
    menu.hide();

    voteScreen.show(channel, currentSongList[e.item], voteComplete(channel));
  });

  menu.show();
};

module.exports = {
  show: showPlaylist
};
