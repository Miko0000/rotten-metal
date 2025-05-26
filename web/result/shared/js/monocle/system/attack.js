void function(){

const system = monocle.system.combat = {};
system.prototype = {
	attack(){
	}
}

Object.defineProperties(system.prototype, {
});

system.apply = function apply(entity, op = {}){


	Object.defineProperties(entity,
		Object.getOwnPropertyDescriptors(system.prototype)
	);
}

}();
