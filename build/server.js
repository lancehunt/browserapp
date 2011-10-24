var base_dir = process.argv[2];
var port = process.argv[3];

var util = require("util"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

var extensionToTypeMap = {
	".html" : "text/html",
	".js" : "text/javascript",
	".css" : "text/css"
};

var respondWithFile = function(filename, response) {
	fs.stat(filename, function(err, stats) {
		if (stats.isDirectory())
			filename = path.join(filename, "index.html");
		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.end(err + "\n");
				console.log("Failure to load '" + filename + "'.");
			} else {
				var type = extensionToTypeMap[path.extname(filename)] || "text/html";
				response.writeHead(200, {"Content-Type" : type });
				response.end(file, "binary");
				console.log("  " + filename);
			}
		});
	});
};

http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = path.join(base_dir, uri);
    path.exists(filename, function(exists) {
    	if(!exists) {
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.end("404 Not Found\n");
    	} else
			respondWithFile(filename, response);
    });
}).listen(port);

util.puts("Server running at http://localhost:" + port);
