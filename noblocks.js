/**
Here I tried a tutorial that suggested a way to bypass blocking in Node JS.
I also played around with a little javascript recursion for the first time with the simple factorial method.
*/

var http = require('http');
var url = require('url');
var cp = require('child_process');

function onRequest(request, response) {
	var pathname = url.parse(request.url).pathname;
	if(pathname == '/wait') {
		cp.exec('helloworld.js', myCallback);
	} else {
		response.writeHead(200, {'Content-Type':'text/plain'});
		response.write('Hello World\n');
		response.write('5 factorial is ' + factorial(5));
		response.end();
	}

	console.log('New connection');

	function myCallback() {
		response.writeHead(200, {'Content-Type':'text/plain'});
		response.write('Thanks for Waiting\n');
		response.end();
	}
}

function factorial(n) {
	if(n <= 1) return 1;
	return factorial(n-1)*n;
}

http.createServer(onRequest).listen(8080);
console.log('Server Started');

