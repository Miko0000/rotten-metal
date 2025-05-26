async function composerCommand(q, ob){
	const { composerCommands } = globalThis;
	const [ command, ...args ] = q.trim().split(/ +|\t+|\n+/);
	const f = (this.commands || composerCommands)[command];
	
	//console.log("CC", command, ob)
	
	if(f)
		return await f
			.apply(this.commands || composerCommands, [ ob, ...args ]);
}

async function composer(str, ob, sob = {}){
	if(str instanceof Object)
		str = String(str);
	
	ob = ob || Object.assign([ document.createElement("span") ], {
		f: [],
		reset(){
			this.unshift(document.createElement("span"))
		}
	});
	
	ob.data = sob;

	let i = 0;
	//let o = '';
	let q = '';

	let d = 0;
	while(i < str.length){
		while(i < str.length && str[i] != '{'){
			const el = ob[0].cloneNode(1);
			el.textContent = str[i++];
			ob.unshift(el);
		}

		if(i >= str.length)
			break ;

		i++;
		d++;
		while(i < str.length && d > 0){
			if(str[i] == '{'){
				d++;

				i++;
			}

			if(str[i] == '}'){
				d--;

				i++;
			}

			if(d <= 0)
				break ;

			q += str[i++];
		}
		
		//console.log(this.commander)

		await (this.commander || composerCommand).apply(this, [ q, ob ]);
		//console.log(q, ob)

		q = '';
	}

	return ob.reverse();
}
/*
function composerHighlight(str){
	let i = 0;
	let o = '';

	while(i < str.length){
		if(str[i] == '{'){
			o += '<span style="color: red">{</span>'
				+ '<span style="color: lightGreen">'

			i++;
		}

		if(str[i] == '}'){
			o += '</span><span style="color: red">}</span>'

			i++;
		}

		if(i >= str.length)
			break ;

		o += str[i++];
	}

	return o;
}*/

function composerHighlight(str){
	let i = 0;
	const o = [ document.createElement("span") ];

	while(i < str.length){
		if(str[i] == '{'){
			const el = document.createElement("span");
			el.innerText = '{';
			el.classList.add("composer", "composer-tag");

			o.unshift(el)

			const el2 = document.createElement("span");
			el2.innerText = '';
			el2.classList.add("composer", "composer-command");

			o.unshift(el2)

			i++;
			while(str[i] && str[i] == ' ') el.innerText += str[i++];
			while(str[i] && str[i] != ' ') el2.innerText += str[i++];
			while(str[i] && str[i] == ' ') el2.innerText += str[i++];

			const el3 = document.createElement("span");
			el3.innerText = '';
			el3.classList.add("composer", "composer-param");

			o.unshift(el3)

		}

		if(str[i] == '}'){
			//o[0].innerText = str[i++];

			const el = document.createElement("span");
			el.innerText = '}';
			el.classList.add("composer", "composer-tag");

			o.unshift(el);
			o.unshift(document.createElement("span"));
			i++;
		}

		if(i >= str.length)
			break ;

		if(str[i] === '\n'){
			o.unshift(document.createElement("br"));
			let n = o[1].cloneNode();
			n.innerText = "";
			o.unshift(n);
		} else
			o[0].innerText += str[i];

		i++;
	}

	// console.log(o);
	console.log(str)

	return o.reverse();
}

/*

 Lupin { slowtype 30 1 { vibrate }{ rainbow }} DIED! { reset }

*/

if(globalThis.modules)
	globalThis.modules.composer = { composerCommand, composer };

class Composer {
	constructor(){
		
	}
}

Composer.prototype.compose = composer;
Composer.prototype.commander = composerCommand;


