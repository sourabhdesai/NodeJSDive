var Queue = function() {

	this.size = 0;
	this.root = null; // First link in linked list
	this.leaf = null; // Last link in linked list

	Queue.prototype.enqueue = function(obj) {
		if(this.root == null) {
			this.root = new Node(obj);
			this.leaf = this.root;
		}
		else {
			this.size++;
			this.leaf.next = new Node(obj);
			this.leaf = this.leaf.next;
		}
	};

	Queue.prototype.dequeue = function() {
		if(this.root == null) return null;
		else {
			var val = this.root.value;
			this.root = this.root.next;
			this.size--;
			return val;
		}
	};

	// Returns true if obj was succesfully removed, false if it couldnt find it.
	// O(n) operation.
	Queue.prototype.remove = function(obj) {
		var tmpNode = root;
		var lastNode = null;
		for (var i = size - 1; i >= 0; i--) {
			if(tmpNode.value == obj) {
				if(tmpNode == this.root) {
					this.root = this.root.next;
					this.size--;
					return true;
				} else if(tmpNode == this.leaf){
					this.leaf = lastNode;
					this.leaf.next = null;
					this.size--;
					return true;
				} else {
					lastNode.next = tmpNode.next;
					this.size--;
					return true;
				}
			} else {
				// tmpNode's value does not match obj
				lastNode = tmpNode;
				tmpNode = tmpNode.next;
			}
		}
		return false;
	};

	Queue.prototype.clear = function() {
		this.root = null;
		this.leaf = null;
		this.size = 0;
	};

	Queue.prototype.isEmpty = function() {
		return this.size == 0;
	};

	Queue.prototype.size = function() {
		return this.size;
	};

	Queue.prototype.getElems = function() {
		var elementArray = new Array(this.size);
		if(this.root != null) this.root.addValuesToArray(elementArray, 0);
		return elementArray;
	};

};

var Node = function(obj) {
	this.value = obj;
	this.next = null;

	Node.prototype.getValue = function() {
		return this.value;
	};

	Node.prototype.addValuesToArray = function(array, i) {
		array[i] = ({ value : this.value});
		if(this.next != null) this.next.addValuesToArray(array, i + 1 );
	};

};

module.exports = Queue;