window.API = {};

API.fetch = async function(url, op = {}){
	url = `./api/${url}`;

	return await fetch(url, op);
}

API.get = async function(url, op = {}){
	op.method = "GET";

	return await this.fetch(url, op);
}

API.post = async function(url, op = {}, body = ''){
	op.method = "POST";
	op.body = op.body || body;

	return await this.fetch(url, op);
}

API.put = async function(url, op = {}, body = ''){
	op.method = "PUT";
	op.body = op.body || body;

	return await this.fetch(url, op);
}

API.delete = async function(url, op = {}){
	op.method = "DELETE";

	return await this.fetch(url, op);
}


