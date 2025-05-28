async function serializer(el){
	const obj = {};

	function convert(el){
		const inst = new KlawsInstance(null, null, null);
		inst._element = el;

		return inst;
	}

	const id = (el.querySelector(".id")).textContent;
	const attributes = Array
		.from(el.querySelectorAll(".attributes > .attribute"))
		.filter(el => !el.classList.contains("template"))
		.map(convert);
	const paragraphs = Array
		.from(el.querySelectorAll(".paragraph"))
		.filter(el => !el.classList.contains("template"))
		.map(convert);
	const statuses = Array
		.from(el.querySelectorAll(".status > *"))
		.filter(el => !el.classList.contains("template"))
		.map(convert);
	const abilities = Array
		.from(el.querySelectorAll(".abilities > *"))
		.filter(el => !el.classList.contains("template"))
		.map(convert);

	obj.id = id;
	Object.assign(obj, Object.fromEntries(attributes.map(function(attr){
		const key = attr.get("key").textContent.trim();
		const value = attr.get("value").textContent.trim();
		if(!key || !value)
			return null;

		return [ key, value ];
	}).filter(Boolean)));

	Object.assign(obj, Object.fromEntries(paragraphs.map(function(p, i){
		const text = p.get("edit").value;

		return [ `paragraph-${i}`, text ];
	})));

	Object.assign(obj, Object.fromEntries(statuses.map(function(s){
		s = s.element;
		return [
			s.classList.toString().split(' ')[0],
			(parseInt(s.style.getPropertyValue("--progress"))/360)
				* 100
		];
	})));

	Object.assign(obj, Object.fromEntries(abilities.map(function(s){
		return [
			`ability-${s.get("name").textContent.trim()}`,
			Math.round((parseInt(s.element.style
				.getPropertyValue("--progress") || 0)/360)
			* 100)
		];
	})));

	const str = JSON.stringify(obj);
	return str;
}

async function save(){

}

async function load(){

}