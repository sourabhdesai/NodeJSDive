// Basic Queue with one BIG difference: The queue loops around once it has dequeue'd all of its elements
// Also, this uses an array in its implementation with an ammortized constant time push. It plays nicer with Mongoose schemas than a linked list.
var Queue = function() {

	this.size = 0;
	this.marker = 0; // Marker tells us the current position in the queue
	this.array = new Array(1);
	Queue.prototype.copy = function(obj) {
		this.size = obj.size;
		this.marker = obj.marker;
		this.array = obj.array;
	};

	Queue.prototype.enqueue = function(obj) {
		if( this.size == this.array.length ) this.doubleArray();
		this.array[this.size] = obj;
		this.size++;
	};

	// Just returns the next element in the queue. Does not remove it!
	Queue.prototype.dequeue = function() {
		var obj = this.array[this.marker];
		this.marker = (this.marker + 1) % this.size;
		return obj;
	};

	// Returns true if obj was succesfully removed, false if it couldnt find it.
	// O(n) operation.
	Queue.prototype.remove = function(obj) {
		var index = this.array.indexOf(obj);
		if(index != -1) {
			this.array.splice(index,1);
			this.size--;
			return true;
		} else return false;
	};

	Queue.prototype.clear = function() {
		this.size = 0;
		this.marker = 0;
		this.array = new Array(1);
	};

	Queue.prototype.isEmpty = function() {
		return this.size == 0;
	};

	Queue.prototype.getElems = function() {
		return this.array;
	};

	Queue.prototype.doubleArray = function() {
		var newArray = new Array( 2 * this.array.length );
		for (var i = this.array.length - 1; i >= 0; i--) {
			newArray[i] = this.array[i];
		};
		this.array = newArray;
	};

};

module.exports = Queue;