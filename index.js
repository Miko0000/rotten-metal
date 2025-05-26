const http = require("http");
const https = require("https");
const config = require("config");
const on_request = require("server/request");
const db = require("server/database");

const server = module.exports = {
	http: http.createServer(on_request),
	https: https.createServer(on_request)
}

if(!config.manual){
	const port = config.port || process.env.PORT || 8080;

	server.http.listen(port);
}

db.create("default_table");