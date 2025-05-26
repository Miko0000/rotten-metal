let extc = {};
extc["h1"] = function(...content){
	this.tag = "h1";
	this.attrs["class"] = `h1`;
	const el = this.content = document.createElement("span");
	content = content.join('|');
	content = format(content, this.origin.op, this.origin);
	content.map(child => el.appendChild(child.element));
}

window.addEventListener("DOMContentLoaded", async function(){
	//(await fetch("http://localhost:3080/select?lupin"))
	Object.assign(Command.commands, extc);
	/*const resp = await fetch(
		`http://localhost:3080/all?lupin`
	);

	*/
	const list = document.querySelector(".page.search .abilities .list");
	const inst = Klaws.namespace(list.parentElement).get("ability");
	for(const entry of list.textContent.split('|')){
		inst.compose(
			"name", entry,
			"value", "0"
		);
		inst.append();
		inst.new();
	}

	//psearch("lupin", await resp.json());
	psearch("lupin", JSON.parse(`{"bio_psychosis":"37","cyber_psychosis":"60"`
		+ `,"health":"100","name":"Foster;Mitchel;Lukas;Derek",`
		+ `"paragraph-1`
		+ `":"My%20name%20is%20{{level|5|Lupin%20Kalashnikov}}`
		+ `.%20I%20was%2`
		+ `0born%20in%20{{level|5|Kiev}},%20{{level|5|July%202`
		+ `4th,%202042%20}}.`
		+ `","paragraph-2":"It%20wasn%27t%20the%20best%20time.`
		+ `%20But%20it%20wasn%`
		+ `27t%20the%20worst%20neither.%20At%20least%20we%20we`
		+ `ren%27t%20starving."}`
	));
});

window.addEventListener("load", function(){
	setTimeout(() => {
		window.scrollTo(0, 0);
	}, 100);
});

const psearch_custom = {};
psearch_custom["id"] = function({ page }, value){

}

psearch_custom["cyber_psychosis"] = function({ page }, value){
	const element = page.element.querySelector(".cyber_psychosis");
	const { style } = element;
	style.setProperty("--progress", `${(value/100)*360}deg`);
}

psearch_custom["bio_psychosis"] = function({ page }, value){
	const element = page.element.querySelector(".bio_psychosis");
	const { style } = element;
	style.setProperty("--progress", `${(value/100)*360}deg`);
}

psearch_custom["paragraph"] = function({ page }, value){
	value = decodeURIComponent(value);

	psearch_add_paragraph(page.element, value);
}

async function psearch_add_attribute(inst, key, value){
	inst.element.classList.add(`${key}`);
	inst.compose(
		"key", key
	);

	if(key == value){
		inst.get("key").textContent = value;
		const v = inst.get("value");
		v.textContent = value;
		v.style.display = "none";
		inst.append();

		return ;
	}

	const key_el = inst.get("key").nextSibling;
	let value_el = inst.get("value");
	for(const entry of value.split(";")){
		value_el.textContent = entry;
		inst.element.insertBefore(value_el, key_el);
		value_el = value_el.cloneNode(1);
	}

	inst.append();
}

async function psearch_add_paragraph(page, text){
	const pageNs = Klaws.namespace(
		page instanceof Klaws
			? page.element
			: page
	);
	page = pageNs.document;

	const inst = pageNs.get("paragraph");
	inst.get("edit").textContent = text;

	await psearch_update_paragraph({
		parentElement: inst.element,
		value: text
	});
	page.insertBefore(inst.element, page.querySelector(".add-paragraph"));
}

async function psearch_update_paragraph(el){
	const text = el.parentElement.querySelector(".text");
 	text.textContent = "";

	const output = format(el.value || "", { el: text });
	output.map(child => text.appendChild(child.element));
}

async function psearch(id, data){
	const page = Klaws.get("page.search");
	const pageNs = Klaws.namespace(page.element);

	let custom;
	let inst = pageNs.get("attribute");
	for(const [ k, v ] of Object.entries(data)){
		if(custom = psearch_custom[Object
			.keys(psearch_custom)
			.filter(key => k.startsWith(key))
		]){
			await custom({ page, inst }, v, k);

			continue ;
		}

		await psearch_add_attribute(inst, k, v);

		inst.append();
		inst = pageNs.get("attribute");
	}

	page.compose("id", id);
	page.append();
}

qevent("click", ".page.search > .add-attribute", async function(ev, el){
	const key = prompt("Enter key");
	const value = prompt("Enter value");
	const inst = Klaws
		.namespace(el.parentElement)
		.get("attribute");

	await psearch_add_attribute(inst, key, value);
});

qevent("click", ".page.search .attribute .remove", async function(ev, el){
	el.parentElement.remove();
});

qevent("click", ".page.search > .add-paragraph", async function(ev, el){
	await psearch_add_paragraph(el.parentElement, "");
});

qevent("click", ".page.search .paragraph .remove", async function(ev, el){
	el.parentElement.remove();
});

qevent("input", ".page.search .paragraph .edit", async function(ev, el){
	await psearch_update_paragraph(el);
});

qevent("click", ".page.search .creation.preview", async function(ev, el){
	el.parentElement.classList.toggle("preview");
});

qevent("click", ".page.search .conic-pbar", async function(ev, el){
	const progress = parseInt(prompt("Enter a number between 0 to 100"));
	el.style.setProperty("--progress", `${(progress/100)*360}deg`);

	const value = el.parentElement.querySelector(".value");
	if(value)
		value.textContent = progress;
});

qevent("click", ".page.search .creation.finish", async function(ev, el){
	const text = await serializer(el.parentElement);
	try {
		await navigator.clipboard.writeText(text);
	} catch(err){

	}

	const tab = window.open("about:blank", '_blank');
	tab.document.write(text);
	tab.document.close();
});

async function pcreation(data){

}

let password;
qevent("click", ".app.search", async function(){
	const search = prompt("Enter id");
	if(!search)
		return ;

	try {
		const resp = await fetch(
			`http://localhost:3080/all?${search}`
		);

		//alert("Success");
		//alert(await resp.text());
		psearch(search, await resp.json());
	} catch(err){
		alert("Failed");
	}
});

qevent("click", ".app.scan", async function(){
	const json = JSON.parse(prompt("Paste data"));
	await psearch(json.id, json);
});

qevent("click", ".app.clipboard-scan", async function(){
	try {
		const sheet = JSON.parse(await navigator.clipboard.readText());
		await psearch(sheet.id, sheet);
	} catch(err){

	}
});

qevent("click", ".app.create", async function(){
	await psearch(prompt("Enter id"), {});
});

qevent("click", ".app.submit", async function(){
	//window.open("http://localhost:3080", "_self")
});

qevent("click", ".search > .end-panel .close", function(ev, el){
	if(!confirm("Really close?"))
		return ;

	el = el.parentElement.parentElement;
	el.classList.add("close");
	el.offsetHeight;
	setTimeout(() => {
		el.remove();
	}, 2000);
});

qevent("click", ".search > .end-panel .cancel", function(ev, el){
	if(!confirm("Cancel and delete unsaved changes?"))
		return ;

	el = el.parentElement.parentElement;
	el.classList.add("close");
	el.offsetHeight;
	setTimeout(() => {
		el.remove();
	}, 2000);
});