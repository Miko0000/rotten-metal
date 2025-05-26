// DOM manipulation relying on classes

class Klaws {
	constructor(namespace){
		this.namespace = namespace;
	}
}

Object.defineProperties(Klaws, {
	element: { get(){
		return document.querySelector(this.namespace) || document.body;
	} }
});

Klaws.get = function get(name){
	const query = `${this.namespace} .template.${name}`;

	//alert(this.element);

	return new KlawsInstance(
		this,
		this.element.querySelector(query),
		query
	);
}

Klaws.namespace = function namespace(namespace){
	return new Klaws(namespace);
}

Klaws.prototype = Klaws;

class KlawsInstance {
	constructor(klaws, element, query){
		this.klaws = klaws;
		this._element = element && element.cloneNode(1);
		this.query = query;
	}
}

Object.defineProperties(KlawsInstance.prototype, {
	element: { get(){
		if(!this._element)
			this._element = this.klaws.element
				.querySelector(query)
				.cloneNode(1)
		;

		return this._element;
	} }
});

KlawsInstance.prototype.get = function get(query){
	query = query.split(/ +/);

	let current = this.element;
	for(const selector of query){
		if(!current)
			return null;

		current = current.querySelector(`.${selector}`);
	}

	return current;
}

KlawsInstance.prototype.apply = function(query, option){
	const target = this.get(query);

	if(!target)
		return null;

	for(const [ key, value ] of Object.entries(option)){
		if(target[key] instanceof Function){
			 target[key](... option);

			continue ;
		}

		target[key] = option;
	}

	return target;
}

KlawsInstance.prototype.compose = function compose(...args){
	for(let i = 0; i < args.length; i += 2){
		this.apply(args[0], args[1]);
	}

	return 0;
}

KlawsInstance.prototype.new = function _new(){
	this._element = this._element.cloneNode(1);

	return this;
}
