var config = require('app-config');
var ajax = require('ajax');

var Log = function (message) {
  ajax({
    url: config.apiUrl + '/pebble/log',
    data: {
      message: JSON.stringify(message, null, 2)
    },
    method: 'post'
  });
};

module.exports = Log;