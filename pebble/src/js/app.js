var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');
var ajax = require('ajax');
var Log = require('logger');
var Station = require('station');
var config = require('app-config');
var playlist = require('playlist');

var main = new UI.Card({
  title: 'r2dj',
  body: 'connect to a station'
});

main.on('click', 'select', function (e) {
  Station.get('abc123', function (err, station) {
    playlist.show(station);
  }); 
});

main.show();