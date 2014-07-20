var Settings = require('settings');

var config = require('app-config');

var home = require('home');

Settings.config({ url: config.settingsUrl },
  function (e) {
    Log(e);
  },
  function (e) {
    Log(e);
  }
);

home.show();