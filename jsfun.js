/**
	Here I did quite a few things.
	I learned how to create objects in Javascript (Look at the person and personality objects below).
	I also learned how to make simple get and post requests.
	So far if you run `node jsfun.js` then you can see several things from your browser.
	if you go to the address "localhost:8080" you can see a JSON version of the me variable below.
	If you go to the address "http://localhost:8080/POST?&Name=<PUT_NAME_HERE>&Major=<PUT_MAJOR_HERE>", you can change the name and major of the me variable below. 
	You will also get a JSON response back with a success field indicating whether the POST was sucessful, and a message indicating what went wrong if it wasn't.
*/

function person() {
	// Sourabh Desai
	person.prototype.init = function() {
		this.name = "Sourabh";
		this.age = 20;
		this.gender = "M";
		this.major = "Computer Science";
		this.personality = new personality();
		this.personality.init();
	};

	person.prototype.getName = function() {
		return this.name;
	};

	person.prototype.setName = function(newName) {
		this.name = newName;
	};

	person.prototype.getAge = function() {
		return this.age;
	};

	person.prototype.getGender = function() {
		return this.gender;
	};

	person.prototype.getMajor = function() {
		return this.major;
	};

	person.prototype.setMajor = function(maj) {
		this.major = maj;
	};
};

function personality() {
	personality.prototype.init = function() {
		this.mood = "Content";
		this.goals = "Graduation";
		this.religion = "Hindu";
		this.interests = ["Programming","Friends","Tennis","Gym","Tan","Laundry"];
		this.qualities = ["Thoughtful","Caring","Patient","Driven","Inspired"];
	};
};

var me = new person();
me.init();
console.log(me.getMajor());

var http = require('http');
var url = require('url');
var querystring = require('querystring');

http.createServer( function(request,response) {
	response.writeHead(200, {'Content-Type':'application/json'});
	if(url.parse(request.url).pathname == '/POST') {
		setData(querystring.parse(request.url));
	} else {
		response.write(JSON.stringify(me));
	}

	function setData(req) {
		success = true;
		message = "Post was successful";
		if(req.Name != null) me.setName(req.Name);
		else {
			console.log("No name setting\n");
			success = false;
			message = "Name could not be set";
		}
		if(req.Major != null) me.setMajor(req.Major);
		else {
			console.log("No major setting\n");
			success = false;
			if(message != "Post was successful") message += ";" + " Major could not be set";
			else message = "Major could not be set";
		}
		response.write(JSON.stringify({'success':success, 'message':message}));
	}

	response.end();
}).listen(8080);

console.log("Started server");