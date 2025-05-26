const rlimit = require("server/ratelimit");
const auth = require("server/auth");
const db = require("server/database");
const fs = require("fs/promises");

function mandates(...args){
	if(args.filter(e => !e)[0])
		return false;

	return true;
}

function erlimit(req, res){
	res.statusCode = 429;
	res.end();
}

function finish(req, res){
	res.end();
}

function malform(req, res){
	res.statusCode = 400;
}

function denied(req, res){
	res.statusCode = 403;
	res.end();
}

module.exports = async function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");

	let ip = req.headers["X-Forwarded-For"]
		|| req.socket.remoteAddress

	if(typeof ip === "string")
			ip = ip.split(";").shift();

	if(rlimit(ip) > 1){
		return erlimit(req, res);
	}

	rlimit.raise(ip);

	const table = "default_table";
	const [ path, search ] = req.url.split('?');
	const data = (search || '').split("&");
	const [ id, key, value ] = data;

	if(path.endsWith("select")){
		if(mandates(id, key)){
			const value = db.select(table, id, key);

			if(!value)
				res.statusCode = 204;
			else
				res.write(value);
		} else {
			malform(req, res);
		}

		return finish(req, res);
	}

	if(path.endsWith("all")){
		if(mandates(id)){
			const values = db.selectAll(table, id);

			res.write(JSON.stringify(values));
		}  else {
			malform(req, res);
		}

		return finish(req, res);
	}

	const { user } = auth.validate(req, res);
	if(!user){
		return res.end("Access Denied");
	}
	const perm = user.data;

	if(path.endsWith("/")){
		const html = await fs.readFile("web.html");
		res.write(html);

		return finish(req, res);
	}

	//console.log(perm.includes("allow-edit-all"));
	console.log((!perm.includes["allow-edit-all"])
		&& (!perm.includes[`allow-edit-${id}`]
	))

	if((!perm.includes("allow-edit-all"))
		&& (!perm.includes(`allow-edit-${id}`))
	) return denied(req, res);

	if(path.endsWith("upsert")){
		if(mandates(id, key, value)){
			db.upsert(table, id, key, value);
		} else {
			malform(req, res);
		}

		return finish(req, res);
	}

	if(path.endsWith("delete")){
		if(mandates(id, key)){
			db.delete(table, id, key);
		} else {
			malform(req, res);
		}

		return finish(req, res);
	}

	if(path.endsWith("wipe")){
		if(mandates(id)){
			db.wipe(table, id);
		} else {
			malform(req, res);
		}

		return finish(req, res);
	}

	res.statusCode = 404;
	res.end();
}