var passList = [];

exports.registerUser = function (req, res) {
	var index = passList.indexOf(req.param("username"));
	if(index != -1) {
		res.status(404).json({success: false, message: "User already Registered"});
	} else {
		passList.push( 
			{ 
				username : req.param("username") , 
				password : req.param("password") , 
				lastLogin : Date.now() 
			} 
		);
		res.json({success: true, message: "User Registered"});
	}
};

exports.loginUser = function (req, res) {
	var index = getUserIndex(req.param("username"));
	if(index == -1) {
		res.status(404).json({success: false, message: "User not Registered"});
	} else {
		if(passList[index].password == req.param("password")) {
			passList[index].lastLogin = Date.now();
			res.json({success: true, message: "User Logged In"});
		} else res.json({success: false, message: "Incorrect Password"});

	}
};

exports.listUsers = function(req, res) {
	res.json(passList);
};

exports.getUser = function(req, res) {
	var index = getUserIndex(req.param("username"));
	if(index == -1) {
		res.status(404).json({success: false, message: "User not Registered"});
	} else {
		res.json(passList[index]);
	}
};

function getUserIndex(username) {
	for (var i = passList.length - 1; i >= 0; i--) {
		if(passList[i].username == username) return i;
	}
	return -1;
}