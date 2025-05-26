void function(){

const system = monocle.system.movement = {};
system.prototype = {}
system.prototype.teleport = function(x, y){
	const lastX = this.x;
	const lastY = this.y;

	this.x = x;
	this.y = y;

	this.emit("teleport", x, y, lastX, lastY);
}

system.prototype.move = function(x, y){
	const lastX = this.x;
	const lastY = this.y;

	this.x += x;
	this.y += y;

	this.emit("move", x, y, lastX, lastY);
}

Object.defineProperties(system.prototype, {

});

system.apply = function apply(entity, op = {}){

	Object.defineProperties(entity,
		Object.getOwnPropertyDescriptors(system.prototype)
	);
}

system.constructor = function(op){
	this.x = op.x || 0;
	this.y = op.y || 0;
}

system.extend = function extend(prototype){
	prototype.constructors.push(system.constructor);

	Object.defineProperties(prototype,
		Object.getOwnPropertyDescriptors(system.prototype)
	);
}

}();
