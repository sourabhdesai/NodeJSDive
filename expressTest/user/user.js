var mongoose   = require('mongoose');
var userSchema = new mongoose.Schema({
	username : String , 
	password : String , 
	lastLogin : Number,
	musicQueue : { type: mongoose.Schema.Types.ObjectId , ref: "MusicQueue" }
});

userSchema.methods.login = function(pass) {
	if(pass != this.password) return { success : false , message : "Incorrect Password"};
	this.lastLogin = Date.now();
	return { success : true , message : "Logged into " + this.username + "'s account"};
};

exports.getUserObj = function (db) {
	var UserObj = db.model('User', userSchema);
	return UserObj;
}