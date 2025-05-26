const config = require("config");
const rlimit = require("server/ratelimit");
const list = [];
const eauth = config.auth || process.env.AUTH;
if(eauth){
	for(const entry of eauth.split("|")){
		const [ password, username, ...data ] = entry.split(";");
		list.push({
			data: data,
			toString(){ return password; }
		});
	}
}

console.warn("[X-Forwarded-For] Server automatically trust proxy");
module.exports = {
	validate(request, response){
		let ip = request.headers["X-Forwarded-For"]
			|| request.socket.remoteAddress

		if(typeof ip === "string")
				ip = ip.split(";").shift();

		console.log(`client: ${ip}`);

		const auth = request.headers.authorization || "";
		if(auth){
			const authStr = (Buffer.from(auth.split(' ')
				.slice(1)
				.join(' ')
			, "base64")).toString();

			const [ password ] = authStr.split(':');
			const [ user ] = list.filter(
				pass => pass.toString() == password
			);

			if(!user){
				response.statusCode = 401;
				response.setHeader("WWW-Authenticate",
					"Basic realm=\"rotten metal\""
				);
			}

			return { user: user || null };
		} else {
			response.statusCode = 401;
			response.setHeader("WWW-Authenticate",
				"Basic realm=\"rotten metal\""
			);
		}

		return { user: null };
	}
}