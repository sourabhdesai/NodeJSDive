// The randperm function...Used in MusicQueueScheme.methods.shuffle()
function randperm(maxValue){
    // first generate number sequence
    var permArray = new Array(maxValue);
    for(var i = 0; i < maxValue; i++) {
        permArray[i] = i;
    }
    // draw out of the number sequence
    for (var i = (maxValue - 1); i >= 0; --i) {
		var randPos        = Math.floor(i * Math.random());
		var tmpStore       = permArray[i];
		permArray[i]       = permArray[randPos];
		permArray[randPos] = tmpStore;
    }
    return permArray;
}

var mongoose = require('mongoose');
var MusicQueueSchema = new mongoose.Schema({
	size : Number,
	marker : Number,
	array : []
});

// Creating MusicQueueSchema and adding its instance methods
MusicQueueSchema.methods.doubleArray = function() {
	var newArray = new Array( 2 * ( this.array.length == 0 ? 1 : this.array.length ) );
	for (var i = this.array.length - 1; i >= 0; i--) {
		newArray[i] = this.array[i];
	};
	this.array = newArray;
};

MusicQueueSchema.methods.addSong = function(songLink) {
	if(songLink == null) return { success : false , message : "Not a valid URL"};
	if(songLink.substring(songLink.length - 4) != '.mp3') return { success : false , message : "Song URL must have a \".mp3\" extension."};
	songLink = songLink.replace("%2F","/");
	if( this.size == this.array.length ) this.doubleArray();
	this.array[this.size] = songLink;
	this.size++;
	return { success : true , message : "Added Song to Playlist"};
};

MusicQueueSchema.methods.nextSong = function() {
	if(!this.isEmpty()) {
		var nextLink = this.array[this.marker];
		this.marker  = (this.marker + 1) % this.size;
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
	if(this.size == 0) return;
	var permArray = randperm(this.size); // randperm(...) is a function I defined earlier on in this module. Its not a method of MusicQueue
	var newArray  = new Array(permArray.length);
	for (var i = this.size - 1; i >= 0; i--) {
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
	this.size   = 0;
	this.marker = 0;
	this.array  = new Array(1);
};

MusicQueueSchema.methods.getSize = function() {
	return this.size;
};

MusicQueueSchema.methods.isEmpty = function() {
	return this.size == 0;
};

exports.getMusicQueueObj = function(db) {
	var MusicQueueObj = db.model('MusicQueue', MusicQueueSchema);
	return MusicQueueObj;
};