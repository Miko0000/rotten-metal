window.addEventListener("load", async function(){
	//await new Promise((res, rej) => setTimeout(res, 1000));

	document.head.innerHTML += window["delay-css"].replaceAll("$lt", "<");
	await Promise.all(Array.from(document.head.querySelectorAll("link"))
		.map(async function(e){ try {
			await fetch(e.href);

			document.body.classList.add("load");
		} catch(_){} })
	);

	document.body.classList.add("load");
});

window.addEventListener("DOMContentLoaded", async function(){
	for(const el of document.querySelectorAll(
		".content > p, .format"
	)){
		const output = format(el.textContent, { el });

		el.textContent = '';
		output.map(child => el.appendChild(child.element));
	}
});

class Piece {
	constructor(str, pos, org){
		this.content = str;
		this.pos = pos;
		this.origin = org;

		this.tag = "span";
		this.attrs = {};
	}
}

Piece.prototype.toString = function(){
	const { tagName } = this.element;

	return `<${tagName}>${this.str}</${tagName}>`;
}

Piece.prototype.split = function(...args){
	const content = this.content;
	if(content instanceof HTMLElement)
		content = content.innerHTML;

	return content.split(...args);
}

Object.defineProperties(Piece.prototype, {
	element: {
		get(){
			if(!this._element){
				const element = this._element
					= document.createElement(this.tag);

				for(const [ key, attr ] of Object.entries(
					this.attrs
				)){
					element.setAttribute(key, attr);
				}
				if(this.content){
					if(this.content instanceof HTMLElement)
						element.appendChild(
							this.content
						);
					else
						element.textContent
							= this.content
						;
				}
			}

			return this._element;
		},

		set(x){
			// TODO: send a warning

			return this._element = x;
		}
	}
});

class Command extends Piece {
	constructor(str, pos, org){
		if(str instanceof Piece){
			super(str.str, str.pos, str.org);

			return ;
		}

		super(str, pos, org);
	}
}

function format_next_closure(i, str){
	let depth = 1;
	while(str.substring(i, i + 2) != "}}" || depth > 1){
		//alert(str.substring(i, i+2) + " : " + depth);
		if(str.substring(i, i + 2) == "{{"){
			depth++;
			i += 2;
			continue;
		}

		if(str.substring(i, i + 2) == "}}"){
			depth--;
			i += 2;
			//alert(depth);
			continue;
		}

		i++;

		if(i > str.length)
			return str.length;
	}

	return i;
}

function format(str, op, origin){
	/*const result = str.split('{{');
	for(let i = 0; i < result.length; i++){
		let [ command, ...args ] = result[i].split('}}');
		if(!args[0]){
			const piece = new Piece(command, i, result);
			result.splice(i, 1, piece);

			continue ;
		}

		const piece = new Piece(args.join('}}'), i, result);
		command = new Command(command, i, result);

		result.splice(i, 1, command, piece);
	}*/

	const result = [];
	result.origin = origin || null;
	result.op = op;

	let count = 0;
	for(let i = 0; i < str.length; i++){
		if(str.substring(i, i + 2) == "{{"){
			let start = i += 2;
			i = format_next_closure(i, str);
			let cut = str.substring(start, i);
			result.push(new Command(cut.trim(), count, result));
			count += 2;
			i += 1;
			continue ;
		}

		if(!result[count])
			result[count] = new Piece("", count, result);

		result[count].content += str[i];
	}

	for(let i = 0; i < result.length; i++){
		const str = result[i];

		if(str instanceof Command){
			str.exec();
		}
	}

	return result;
}

format.version = "1745672210";

Command.prototype.exec = function(){
	/*this.tag = "b";
	this.content = `${this.content}`;*/
	const { content } = this;
	const { commands } = this.constructor;
	//const [ command, ...args ] = this.content.split('|');
	let args = [];
	let count = 0;
	for(let i = 0; i < content.length; i++){
		if(!args[count])
			args.push("");

		if(content[i] == '|'){
			count++;
			continue ;
		}

		if(content.substring(i, i + 2) == "{{"){
			let start = i += 2;
			i = format_next_closure(i, content);
			let cut = content.substring(start, i);
			i += 1;
			args[count] += `{{${cut}}}`;
			continue ;
		}

		args[count] += content[i];
	}

	args = args.map(arg => arg.trim());
	//if(args[0].startsWith("tree")) alert(args);

	const f = commands[args[0]];
	if(f)
		f.call(this, ...args.slice(1));
	else
		0 && alert(args[0]);
}

Command.commands = {};
Command.commands["link"] = function(link, content){
	this.tag = "a";
	this.attrs["href"] = link;
	this.content = `${content}`;
}

Command.commands["level"] = function(level, ...content){
	this.tag = "span";
	this.attrs["class"] = `level l${level}`;
	const el = this.content = document.createElement("span");
	content = content.join('|');
	content = format(content, this.origin.op, this.origin);
	content.map(child => el.appendChild(child.element));
}

Command.commands["strike"] = function(...content){
	this.tag = "span";
	this.attrs["class"] = `strike`;
	const el = this.content = document.createElement("span");
	content = content.join('|');
	content = format(content, this.origin.op, this.origin);
	content.map(child => el.appendChild(child.element));
}

const heading_queries = ["h1", "h2", "h3", "h4", "h5", "h6", ".heading"];
Command.commands["toc"] = function(){
	const el = this.origin.op.el.parentElement;
	const headings = el.querySelectorAll(heading_queries.join(','));

	this.tag = "div";
	this.attrs["class"] = ` toc`;
	const content = this.content = document.createElement("ul");

	let min = heading_queries.length;
	for(const heading of headings){
		let level = heading_queries.indexOf(heading_queries
			.filter(el => el == heading.tagName)[0]
		);
		level = level < 0 ? 0 : level;
		if(level < min)
			min = level;
	}

	for(const heading of headings){
		const li = document.createElement("li");
		let level = heading_queries.indexOf(heading_queries
			.filter(el => el == heading.tagName)[0]
		);
		level = level < 0 ? 0 : level;
		level = level - min;

		li.style.setProperty("--toc-heading-level", level);
		li.classList.add(`l${level}`);
		li.textContent = heading.textContent;
		content.appendChild(li);
	}
}

Command.commands["tree"] = function(root, ...branches){
	this.tag = "div";
	this.attrs["class"] = ` tree`;
	const ul = this.content = document.createElement("ul");

	if(1){
		const li = document.createElement("div");
		li.classList.add("root");
		const content = format(root, this.origin.op, this.origin);
		content.map(child => li.appendChild(child.element));
		ul.appendChild(li);
	}

	for(const branch of branches){
		const li = document.createElement("li");
		li.classList.add("branch");
		const content = format(branch, this.origin.op, this.origin);
		content.map(child => li.appendChild(child.element));
		ul.appendChild(li);
	}
}

Command.commands["nothing"] = function(...contents){
	this.tag = "div";
	this.attrs["class"] = ` nothing`;
	this.content = contents.join('|');
}

Command.commands["block-date"] = function(year, month, day, yu, mu, du){
	this.tag = "div";
	this.attrs["class"] = ` block-date`;
	const content = this.content = document.createElement("div");
	for(const [ time, unit ] of [
		[ day, du ],
		[ month, mu ],
		[ year, yu ]
	]){
		const part = document.createElement("div");
		const tel = document.createElement("span");
		const tun = document.createElement("span");
		part.classList.add("part");
		tel.classList.add("time");
		tun.classList.add("unit");
		tel.textContent = time || '';
		tun.textContent = unit || '';
		part.appendChild(tel);
		part.appendChild(tun);
		content.appendChild(part);
	}
}
qevent("pointerover", "*", function(ev, el){
	const date = el.querySelector(".block-date");
	if(!date || date.parentElement != el){
		for(const block of document.querySelectorAll(".block-date")){
			block.classList.remove("visible");
		}

		return ;
	}

	date.classList.add("visible");

	//return true;
});