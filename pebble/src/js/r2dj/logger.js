var config = require('app-config');
var ajax = require('ajax');

var Log = function (message) {
    var headers = { 'Content-Type': 'application/json' };
    console.log(message);
    ajax.post(config.apiUrl + '/pebble/log', { msg: message }, headers, function (err, data) {
        console.log(data);
    });
};

module.exports = Log;