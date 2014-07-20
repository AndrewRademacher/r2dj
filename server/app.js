var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pmongo = require('promised-mongo');
var debug = require('debug')('server');
var app = express();

// schemas setup
var schema = {};
fs.readdirSync(path.join(__dirname, 'schema')).forEach(function (file) {
    var s = require(path.join(__dirname, 'schema', file));
    schema[s.title] = s;
});

app.set('schema', schema);

// mongo setup
var db = pmongo(process.env.MONGO_CONN_STRING, ['manager', 'channel', 'listener']);

db.manager.ensureIndex({ rdioUser: 1 }, { unique: true });

app.set('db', db);

// express setup
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,User,RdioUser,Listener');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD');
    next();
});

app.use('/', require('./routes/index'));
app.use('/manager', require('./routes/manager'));
app.use('/channel/queue', require('./routes/queue'));
app.use('/channel', require('./routes/channel'));
app.use('/pebble', require('./routes/pebble'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

module.exports = app;
