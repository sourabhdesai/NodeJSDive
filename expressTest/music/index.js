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
	
	this.songQueue = new Queue();

	MusicQueue.prototype.addSong = function(songLink) {
		songLink = songLink.replace("%2F","/");
		this.songQueue.enqueue(songLink);
	};

	MusicQueue.prototype.nextSong = function() {
		if(!this.songQueue.isEmpty()) {
			var nextLink = this.songQueue.dequeue();
			this.songQueue.enqueue(nextLink); // Loop around the playlist
			return {  success : true , message : "Here is the next song!" , song : nextLink};
		} else {
			return { success : false , message : "Song Queue is Empty", song : null};
		}
	};

	MusicQueue.prototype.removeSong = function(link) {
		link = link.replace("%2F","/");
		if(this.songQueue.remove(link))
			return {success : true , message : "Song Removed Successfully" };
		else return {success : false , message : "Song was not found in Queue" };
	};

	// Shuffles the playlist... O(n) operation ( n = number of songs )
	MusicQueue.prototype.shuffle = function() {
		var elems = this.songQueue.getElems();
		this.songQueue.clear();
		permArray = randperm(elems.length);
		for (var i = elems.length - 1; i >= 0; i--) {
			this.songQueue.enqueue(elems[i].value);
		}
	};

	MusicQueue.prototype.getPlaylist = function() {
		return this.songQueue.getElems();
	};

}

module.exports = MusicQueue;