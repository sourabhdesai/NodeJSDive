BinarySearchTree = function() {

	BinarySearchTree.prototype.init = function() {
		this.key = null;
		this.value = null;
		this.right =null;
		this.left = null;
	};

		BinarySearchTree.prototype.init = function( k , v ) {
		this.key = k;
		this.value = v;
		this.right =null;
		this.left = null;
	};

	BinarySearchTree.prototype.insert = function( k , v ) {
		if( k < this.key ) {
			// Go left
			if(this.left != null ) this.left.insert(k,v);
			else {
				this.left = new BinarySearchTree();
				this.left.init(k,v);
			}
		} else if( k > this.key ) {
			// Go right
			if(this.right != null) this.right.insert(k,v);
			else {
				this.right = new BinarySearchTree();
				this.right.init(k,v);
			}
		} else {
			this.value = v;
		}
	};

	BinarySearchTree.prototype.find = function( k ) {
		if( this.key == k ) return this.value;
		else if( k < this.key ) {
			// Go Left
			return this.left.find(k);
		} else if( k > this.key ) {
			// Go Right
			return this.right.find(k);
		}
		return null;
	};

	BinarySearchTree.prototype.inOrderTraversal = function() {
		if( this.left != null ) {
			this.left.inOrderTraversal();
		}
		if( this.right != null ) {
			this.right.inOrderTraversal();
		}
		console.log( { key : this.key , value : this.value } );
	};
};

var bst = new BinarySearchTree();
bst.init(0,"Hi");

bst.insert(0, "Hi" );
bst.insert(1, "Who" );
bst.insert(-1, "Hello" );
bst.insert( 0.5 , "Who" );
bst.insert( -0.5 , "Howdy" );
bst.inOrderTraversal();

var a = 432234;
var b = 765453;

a = a ^ b;
b= b ^ a;
a = a ^ b;
console.log( { A : a, B : b } );

