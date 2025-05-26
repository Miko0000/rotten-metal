void function(){
	class Entity extends EventSystem {
		constructor(op = {}){
			super();

			for(const constructor of this.constructor.prototype
				.constructors
			){
				constructor.call(this, op);
			}
		}
	}

	Entity.prototype.constructors = [];

	monocle.Entity = Entity;
}();
