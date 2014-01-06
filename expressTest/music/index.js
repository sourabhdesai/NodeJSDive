var Queue = require('./queue');

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

var MusicQueue = function () {
	
	this.size = 0;
	this.marker = 0; // Marker tells us the current position in the queue
	this.array = new Array(1);

	MusicQueue.prototype.addSong = function(songLink) {
		songLink = songLink.replace("%2F","/");
		if( this.size == this.array.length ) this.doubleArray();
		this.array[this.size] = songLink;
		this.size++;
	};

	MusicQueue.prototype.nextSong = function() {
		if(!this.isEmpty()) {
			var nextLink = this.array[this.marker];
			this.marker = (this.marker + 1) % this.size;
			return {  success : true , message : "Here is the next song!" , song : nextLink};
		} else {
			return { success : false , message : "Song Queue is Empty", song : null};
		}
	};

	MusicQueue.prototype.removeSong = function(link) {
		link = link.replace("%2F","/");
		if(this.remove(link))
			return {success : true , message : "Song Removed Successfully" };
		else
			return {success : false , message : "Song was not found in Queue" };
	};

	// Shuffles the playlist... O(n) operation ( n = number of songs )
	MusicQueue.prototype.shuffle = function() {
		var permArray = randperm(elems.length);
		var newArray = new Array(permArray.length);
		for (var i = elems.length - 1; i >= 0; i--) {
			newArray[i] = this.array[permArray[i]];
		}
	};

	MusicQueue.prototype.getPlaylist = function() {
		var playlist = new Array(this.size);
		for (var i = this.size - 1; i >= 0; i--) {
			playlist[i] = this.array[i];
		};
		return playlist;
	};

	MusicQueue.prototype.clear = function() {
		this.size = 0;
		this.marker = 0;
		this.array = new Array(1);
	};

	MusicQueue.prototype.size = function() {
		return this.size;
	};

	MusicQueue.prototype.doubleArray = function() {
		var newArray = new Array( 2 * this.array.length );
		for (var i = this.array.length - 1; i >= 0; i--) {
			newArray[i] = this.array[i];
		};
		this.array = newArray;
	};

	MusicQueue.prototype.remove = function(obj) {
		var index = this.array.indexOf(obj);
		if(index != -1) {
			this.array.splice(index,1);
			this.size--;
			return true;
		} else return false;
	};

	MusicQueue.prototype.isEmpty = function() {
		return this.size == 0;
	};

}

module.exports = MusicQueue;