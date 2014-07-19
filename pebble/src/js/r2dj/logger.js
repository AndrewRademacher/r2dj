var config = require('app-config');
var ajax = require('ajax');

var Log = function (message) {
  ajax({
    url: config.rootUrl + '/log',
    data: {
      message: message
    },
    method: 'post'
  });
};

module.exports = Log;