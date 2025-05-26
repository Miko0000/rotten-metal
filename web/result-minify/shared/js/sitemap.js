const sitemap = {
	
}

sitemap.treant = function(map){
	function parser(map){
		return {
			text: {
				name: map.name || "Unnamed",
				
			},
			link: { href: map["data-url"] },
			
			children: map.map(parser)
		}
	}
	
	return parser(map);
}

sitemap.fetch = async function(path = "./"){
	async function handler(path){
		try {
			const textR = await fetch(path + "/sitemap");
			const attrR = await fetch(path + "/sitemap.attribute");
			
			// console.log(textR, attrR)
			
			if(!textR.ok){
				throw "Not OK";
			}
			
			const text = await textR.text();
			const attr = attrR.ok ? await attrR.text() : "Error";
			const list = text.split('\n');
			
			//console.log(list);
			
			let _prom = [];
			
			for(const entry of list.filter(Boolean)){ console.log(entry)
				_prom.push(handler(`${path}/${entry}`));
			}
			_prom = await Promise.all(_prom);
			_prom.attribute = attr;
			
			//console.log("E", _res);
			
			for(let i = 0; i < _prom.length; i++){
				_prom[i].name = list[i];
				_prom[i]["data-url"] = `${path}/${list[i]}`;
			}
			
			return _prom;
			
		} catch(err) {
			//console.log(err)
			
			const res = [];
			res.attribute = "Error";
			
			return res;
		}
	}
	
	const res = await handler(path);
	res.name = path;
	
	return res;
}
