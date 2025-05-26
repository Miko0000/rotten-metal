void function(){

const system = monocle.system.health = {};
system.prototype = {

}

Object.defineProperties(system.prototype, {
	health: {
		set(x){
			this.emit("health", this, this._health);
			this._health = x;

			if(x <= 0){
				this.emit("health-out", this, this._health);
			}
		},
		get(x){
			return this._health;
		}
	}
});

system.apply = function apply(entity, op = {}){
	entity._health = op.health || 100;

	Object.defineProperties(entity,
		Object.getOwnPropertyDescriptors(system.prototype)
	);
}

system.constructor = function(){
	this._health = 100;
}

system.extend = function extend(prototype){
	prototype.constructors.push(system.constructor);

	Object.defineProperties(prototype,
		Object.getOwnPropertyDescriptors(system.prototype)
	);
}

}();
