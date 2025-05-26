class Counter {
	constructor(){
		this.data = {};
	}
}

Counter.prototype.count = function(id){
	this.data[id] = (this.data[id] || 0);
}
