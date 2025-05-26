void function(){

const system = monocle.system.combat = {};
system.prototype = {
	attack(data){
		this.emit("attack", data);
	}
}

Object.defineProperties(system.prototype, {

});

function onAttack(attack){
	console.log(`Hmm, ${this.health} ${this.constructor.name}`);

	this.health -= attack.damage;
}

system.constructor = function(){
	this.on("attack", onAttack);
}

system.apply = function apply(entity, op = {}){
	system.constructor.call(entity);

	Object.defineProperties(entity,
		Object.getOwnPropertyDescriptors(system.prototype)
	);
}

system.extend = function extend(prototype){
	prototype.constructors.push(system.constructor);

	Object.defineProperties(prototype,
		Object.getOwnPropertyDescriptors(system.prototype)
	);
}

}();
