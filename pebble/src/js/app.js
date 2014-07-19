var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');
var ajax = require('ajax');

var config = {
  rootUrl: 'http://192.168.20.4:3000/pebble'
};

var Log = function (message) {
  ajax({
    url: config.rootUrl + '/log',
    data: {
      message: message
    },
    method: 'post'
  });
};

var Station = function (id) {
  this.id = id;
};

Station.prototype.getSongs = function (cb) {
  Log('getting songs');
  ajax({ 
    url: config.rootUrl + '/playlist/' + this.id,
    type: 'json'
  }, 
  function (data) {
    Log(data);
    cb(null, data);
  }, 
  function () {
    cb('error fetching songs');
  });
};

Station.get = function (id, cb) {
  cb(null, new Station(id));
};

Settings.config({ url: config.rootUrl + '/config' },
  function (e) {
    Settings.option('color', 'red');
  },
  function (e) {
    console.log('closed configurable');
  }
);

var updateInterval = null;

var joinStation = function (stationId) {
  var wind = new UI.Window();
  
  var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Joining ' + stationId,
    textAlign: 'center'
  });
  
  wind.add(textfield);
  wind.show();

  Station.get(stationId, function (err, station) {
    showPlaylist(station);
  }); 
};

var showPlaylist = function (station) {
  console.log('Showing playlist for ' + JSON.stringify(station));
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

  var updateSongs = (function () {  
    var currentSong = null;

    return function () {  
      station.getSongs(function (err, songs) {
        var playing = [{ title: 'Hotel California', subtitle: 'Eagles', id: 10 }];

        if (!currentSong || playing.id != currentSong.id) {
          menu.items(0, playing);  
        }
        
        menu.items(1, songs.map(function (s) {
          return {
            title: s.name,
            subtitle: s.artist,
            id: s.id
          };
        })); 
        
        currentSong = playing;
        currentSongList = songs;
      });
    }
  })();

  clearInterval(updateInterval);
  updateInterval = setInterval(updateSongs, 5000);
  updateSongs();

  menu.on('select', function (e) {
    showVoteScreen(station, currentSongList[e.item]);
  });

  menu.show();
};

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

  wind.add(createText(song.name, 0, 40));
  wind.add(createText(song.artist, 0, 55));
  wind.add(createText('Vote up', 0, 10));
  wind.add(createText('Vote down', 0, 105));

  wind.show();
};

var main = new UI.Card({
  title: 'r2dj',
  body: 'connect to a station'
});

main.show();

main.on('click', 'up', function(e) {

  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item: ' + e.section + ' ' + e.item);
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  joinStation('abc123');
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
