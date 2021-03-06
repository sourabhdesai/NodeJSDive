
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var user = require('./user');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(function (req, res, next){
	res.set('X-Powered-By','Express Test');
	next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//POST Requests
app.post('/user/register/:username/:password',user.registerUser);

// PUT Requests
app.put('/user/login/:username/:password',user.loginUser);
app.put('/user/:username/:password/music/addsong/:songlink',user.addSong);
app.put('/user/:username/:password/music/removesong/:songlink',user.removeSong);
app.put('/user/:username/:password/music/clearplaylist',user.clearPlaylist);
app.put('/user/:username/:password/music/shuffle', user.shuffle);

// GET Requests
app.get('/user/list/:username',user.getUser);
app.get('/user/:username/:password/music/nextsong', user.nextSong);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});