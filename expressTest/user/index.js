var MusicQueue = require('../music');
var HashTable = require('hashtable');
var userTable = new HashTable();

exports.registerUser = function (req, res) {
	var username = req.param("username");
	var password = req.param("password");
	var user = userTable.get(username);
	if(user != undefined) {
		res.status(404).json( {success: false, message: "User already Registered"} );
	} else {
		userTable.put(username, 
			{ 
				username : username , 
				password : password , 
				lastLogin : Date.now(),
				songQueue : new MusicQueue()
			} 
		);
		res.json({success: true, message: "User Registered"});
	}
};

exports.loginUser = function (req, res) {
	var username = req.param("username");
	var password = req.param("password");
	var user = userTable.get(username);
	if(user == undefined) {
		res.status(404).json( { success : false , message : "User not Registered" } );
	} else {
		if(user.password == password) {
			user.lastLogin = Date.now();
			res.json( { success : true , message : "User Logged In" } );
		} else res.json( { success : false , message : "Incorrect password" } );

	}
};

exports.getUser = function(req, res) {
	var username = req.param("username");
	var user = userTable.get(username);
	if(user == undefined) {
		res.status(404).json({success: false, message: "User not Registered"});
	} else {
		res.json({
    		username : username,
    		lastLogin : user.lastLogin,
    		playlist : user.songQueue.getPlaylist()
		});
	} 
};

exports.addSong = function (req, res) {
	var username = req.param("username");
	var password = req.param("password");
	var user = userTable.get(username);
	if(user == undefined) {
		res.json( { success : false , message : "Username is not registered" } );
	} else if(user.password == password) {
		user.songQueue.addSong(req.param("songlink"));
		res.json( { success : true , message : "Added song to playlist!" } );
	} else {
		res.json( { success : false , message : "Incorrect password" } );
	}
};

exports.nextSong = function (req, res) {
	var username = req.param("username");
	var password = req.param("password");
	var user = userTable.get(username);
	if(user == undefined) {
		res.json( { success : false , message : "Username is not registered" } );
	} else if(user.password == password) {
		var song = user.songQueue.nextSong();
		res.json(song);
	} else {
		res.json( { success : false , message : "Incorrect password" } );
	}
};

exports.shuffle = function (req, res) {
	var username = req.param("username");
	var password = req.param("password");
	var user = userTable.get(username);
	if(user == undefined) {
		res.json( { success : false , message : "Username is not registered" } );
	} else if(user.password == password) {
		user.songQueue.shuffle();
		res.json( { success : true , message : "Shuffled playlist" } );
	} else {
		res.json( { success : false , message : "Incorrect password" } );
	}
};

exports.removeSong = function (req, res) {
	var username = req.param("username");
	var password = req.param("password");
	var songlink = req.param("songlink");
	var user = userTable.get(username);
	if(user == undefined) {
		res.json( { success : false , message : "Username is not registered" } );
	} else if(user.password == password) {
		res.json( user.songQueue.removeSong(songlink) );
	} else {
		res.json( { success : false , message : "Incorrect password" } );
	}
};
