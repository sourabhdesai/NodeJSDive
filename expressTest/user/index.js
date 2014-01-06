var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'musicqueuedb');
var UserObj = null;
var MusicQueueObj = null;


// The randperm function...Used in MusicQueueScheme.methods.shuffle()

function randperm(maxValue){
    // first generate number sequence
    var permArray = new Array(maxValue);
    for(var i = 0; i < maxValue; i++){
        permArray[i] = i;
    }
    // draw out of the number sequence
    for (var i = (maxValue - 1); i >= 0; --i){
        var randPos = Math.floor(i * Math.random());
        var tmpStore = permArray[i];
        permArray[i] = permArray[randPos];
        permArray[randPos] = tmpStore;
    }
    return permArray;
}

// Instantiate the nested Schemas!

// Creating MusicQueueSchema and adding its instance methods
var MusicQueueSchema = new mongoose.Schema({
	size : Number,
	marker : Number,
	array : []
});

MusicQueueSchema.methods.doubleArray = function() {
		var newArray = new Array( 2 * this.array.length );
		for (var i = this.array.length - 1; i >= 0; i--) {
			newArray[i] = this.array[i];
		};
		this.array = newArray;
};

MusicQueueSchema.methods.addSong = function(songLink) {
		songLink = songLink.replace("%2F","/");
		if( this.size == this.array.length ) this.doubleArray();
		this.array[this.size] = songLink;
		this.size++;
};

MusicQueueSchema.methods.nextSong = function() {
		if(!this.isEmpty()) {
			var nextLink = this.array[this.marker];
			this.marker = (this.marker + 1) % this.size;
			return {  success : true , message : "Here is the next song!" , song : nextLink};
		} else {
			return { success : false , message : "Song Queue is Empty", song : null};
		}
};

MusicQueueSchema.methods.removeSong = function(link) {
		link = link.replace("%2F","/");
		var index = this.array.indexOf(link);
		if(index != -1) {
			this.array.splice(index,1);
			this.size--;
			return {success : true , message : "Song Removed Successfully" };
		} else return {success : false , message : "Song was not found in Queue" };
};

MusicQueueSchema.methods.shuffle = function() {
		var permArray = randperm(this.array.length); // randperm(...) is a function I defined later on in this module. Its not a method of MusicQueue
		var newArray = new Array(permArray.length);
		for (var i = this.array.length - 1; i >= 0; i--) {
			newArray[i] = this.array[permArray[i]];
		}
		this.array = newArray;
}; 

MusicQueueSchema.methods.getPlaylist = function() {
		var playlist = new Array(this.size);
		for (var i = this.size - 1; i >= 0; i--) {
			playlist[i] = this.array[i];
		};
		return playlist;
};

MusicQueueSchema.methods.clear = function() {
		this.size = 0;
		this.marker = 0;
		this.array = new Array(1);
};

MusicQueueSchema.methods.getSize = function() {
		return this.size;
};

MusicQueueSchema.methods.isEmpty = function() {
		return this.size == 0;
};

MusicQueueObj = db.model('MusicQueue', MusicQueueSchema);

db.once('open', function() {
	var userSchema = new mongoose.Schema({
		username : String , 
		password : String , 
		lastLogin : Number,
		musicQueue : { type: mongoose.Schema.Types.ObjectId , ref: "MusicQueue" }
	});
	UserObj = db.model('User', userSchema);
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
		mq.size = 0;
		mq.array = [""]
		mq.save();
		var newUser = new UserObj({
				username : username , 
				password : password , 
				lastLogin : Date.now(),
				musicQueue : mq._id
		});
		// console.log("Register: \n"+newUser);
		newUser.save(); // Save the user to the db
		res.json( { success : true , message : "User Registered" } );
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
		if(password == user.password) {
			user.lastLogin = Date.now();
			user.save();
			res.json( { success : true , message : "User Logged In" } );
		} else {
			res.json( { success : false , message : "Incorrect Username/Password" } );
		}
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
				musicQueue.addSong(req.param("songlink"));
				musicQueue.save();
				res.json( { success : true , message : "Added song to playlist!" } );
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
				musicQueue.save();
				res.json(song);
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
				res.json( { success : true , message : "Shuffled playlist" } );
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
				musicQueue.save();
				res.json(removeResponse);
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
				res.json( { success : true , message : "Cleared Playlist" } );
			}
		});
	});
};