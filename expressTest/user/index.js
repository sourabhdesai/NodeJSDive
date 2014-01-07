var mongoose      = require('mongoose');
var db            = mongoose.createConnection('localhost', 'musicqueuedb');
var UserObj       = null;
var MusicQueueObj = null;



db.once('open', function() {
	MusicQueueObj = require('../music').getMusicQueueObj(db);
	UserObj = require('./user').getUserObj(db);
});

exports.registerUser = function (req, res) {
	var username = req.param("username");
	var password = req.param("password");
	UserObj.findOne({ username : username }).exec(function(err, user) {
		if(err) {
			res.status(404).json( {success: false, message: "Database error"} );
			return;
		}
		if(user != null) {
			res.status(404).json( {success: false, message: "Username already Registered"} );
			return;
		}
		var mq = new MusicQueueObj();
		mq.marker = 0;
		mq.size   = 0;
		mq.array  = new Array();
		mq.save(function(err) {
			var newUser = new UserObj({
					username : username , 
					password : password , 
					lastLogin : Date.now(),
					musicQueue : mq._id
			});
			// console.log("Register: \n"+newUser);
			newUser.save(function(err) {
				if(err) res.json( { success : false , message : "Database error in saving user" } );
				else res.json( { success : true , message : "User Registered" } );
			}); // Save the user to the db
		});
	});
};

exports.loginUser = function (req, res) {
	var username = req.param("username");
	var password = req.param("password");
	UserObj.findOne({ username : username }).exec(function(err, user) {
		if(err) {
			res.status(404).json( {success: false, message: "Database error"} );
			return;
		}
		if(user == null) {
			res.status(404).json( {success: false, message: "Username not Registered"} );
			return;
		}
		var loginResponse = user.login(password);
		if(loginResponse.success) user.save();
		res.json( loginResponse );
	});
};

exports.getUser = function(req, res) {
	var username = req.param("username");
	UserObj.findOne( { username : username } ).exec( function(err, user) {
		if(err) {
			res.status(404).json( {success: false, message: "Database error"} );
			return;
		}
		if(user == null) {
			res.status(404).json( {success: false, message: "Username not Registered"} );
			return;
		}
		var mq = user.musicQueue;
		MusicQueueObj.findById(mq).exec(function (err, musicQueue) {
			if(err) res.status(404).json( { success : false , message : "Database Error" } );
			else {
				var pl = musicQueue.getPlaylist();
				res.json({
					username : username,
			    	lastLogin : user.lastLogin,
			    	playlist : pl
				});
			}
		});
	});
};

exports.addSong = function (req, res) {
	var username = req.param("username");
	var password = req.param("password");
	UserObj.findOne( { username : username , password : password } ).exec( function(err, user) {
		if(err) {
			res.status(404).json( {success: false, message: "Database error in retrieving user"} );
			return;
		}
		if(user == null) {
			res.status(404).json( {success: false, message: "Incorrect Username/Password"} );
			return;
		}
		var mq = user.musicQueue;
		MusicQueueObj.findById(mq).exec(function (err, musicQueue) {
			if(err) res.status(404).json( {success: false, message: "Database error"} );
			else {
				var addResponse = musicQueue.addSong(req.param("songlink"));
				musicQueue.save(function(err) {
					if(err) res.json( { success : false , message : "Database error in saving song" } );
					else res.json( addResponse );
				});
			}
		});
	});
};

exports.nextSong = function (req, res) {
	var username = req.param("username");
	var password = req.param("password");
	UserObj.findOne( { username : username , password : password } ).exec( function(err, user) {
		if(err) {
			res.status(404).json( {success: false, message: "Database error"} );
			return;
		}
		if(user == null) {
			res.status(404).json( {success: false, message: "Incorrect Username/Password"} );
			return;
		}
		var mq = user.musicQueue;
		MusicQueueObj.findById(mq).exec(function (err, musicQueue) {
			if(err) res.status(404).json( {success: false, message: "Database error"} );
			else {
				var song = musicQueue.nextSong();
				musicQueue.save(function(err) {
					if(err) res.json( {success : false , message : "Database error in updating playlist"} );
					else res.json(song);
				});
			}
		});
	});
};

exports.shuffle = function (req, res) {
	var username = req.param("username");
	var password = req.param("password");
	UserObj.findOne( { username : username , password : password } ).exec( function(err, user) {
		if(err) {
			res.status(404).json( {success: false, message: "Database error"} );
			return;
		}
		if(user == null) {
			res.status(404).json( {success: false, message: "Incorrect Username/Password"} );
			return;
		}
		var mq = user.musicQueue;
		MusicQueueObj.findById(mq).exec(function (err, musicQueue) {
			if(err) res.status(404).json( {success: false, message: "Database error"} );
			else {
				musicQueue.shuffle();
				musicQueue.save(function(err) {
					if (err) res.json( { success : false , message : "Database error in saving playlist" } );
					else res.json( { success : false , message : "Shuffled playlist" } );
				});
			}
		});
	});
};

exports.removeSong = function (req, res) {
	var username = req.param("username");
	var password = req.param("password");
	var songlink = req.param("songlink");
	UserObj.findOne( { username : username , password : password } ).exec( function(err, user) {
		if(err) {
			res.status(404).json( {success: false, message: "Database error"} );
			return;
		}
		if(user == null) {
			res.status(404).json( {success: false, message: "Incorrect Username/Password"} );
			return;
		}
		var mq = user.musicQueue;
		MusicQueueObj.findById(mq).exec(function (err, musicQueue) {
			if(err) res.status(404).json( {success: false, message: "Database error"} );
			else {
				var removeResponse = musicQueue.removeSong(songlink);
				musicQueue.save(function(err) {
					if (err) res.json( { success : false , message : "Database error in saving playlist" } );
					else res.json(removeResponse);
				});
			}
		});
	});	
};

exports.clearPlaylist = function (req, res) {
	var username = req.param("username");
	var password = req.param("password");
	UserObj.findOne( { username : username , password : password } ).exec( function(err, user) {
		if(err) {
			res.status(404).json( {success: false, message: "Database error"} );
			return;
		}
		if(user == null) {
			res.status(404).json( {success: false, message: "Incorrect Username/Password"} );
			return;
		}
		var mq = user.musicQueue;
		MusicQueueObj.findById(mq).exec(function (err, musicQueue) {
			if(err) res.status(404).json( {success: false, message: "Database error"} );
			else {
				musicQueue.clear();
				musicQueue.save(function(err) {
					if (err) res.json( { success : false , message : "Database error in saving playlist" } );
					else res.json( { success : true , message : "Cleared Playlist" } );
				});
			}
		});
	});
};