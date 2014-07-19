var config = require('app-config');
var Log = require('logger');
var ajax = require('ajax');

var Station = function (id) {
  this.id = id;
};

Station.prototype.getPlaylist = function (cb) {
  Log('getting songs');

  ajax({ 
    url: config.rootUrl + '/playlist/' + this.id,
    type: 'json'
  }, 
  function (data) {
    cb(null, data);
  });
};

Station.get = function (id, cb) {
  cb(null, new Station(id));
};

module.exports = Station;