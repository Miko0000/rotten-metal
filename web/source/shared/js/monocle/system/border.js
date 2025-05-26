void function(){

const system = monocle.system.border = {};
system.prototype = {}
system.prototype.checkHit = function(){
	//console.log(`${this.entities.length}`)
	for(const entity of this.entities){
		//console.log(`${this.x} > ${entity.x + entity.width}`);

		let hit = entity.isHit(this);
		if(hit){
			if(hit > 2)
				this.emit("border-hit", entity, hit);

			if(hit == 1 || hit > 2){
				this.emit("border-hit-x", entity);
			}

			if(hit == 2 || hit > 2){
				this.emit("border-hit-y", entity);
			}
		}
	}
}

/*
system.prototype.nearestPoint = function(target){
	if(target.x + target.width/2 > this.x + this.width/2){

	}

	if(target.y + target.height/2 > this.y + this.height/2){

	}
}*/

system.prototype.getRooms = function(rooms){
	return rooms.filter(r => r.isHitX(this) && r.isHitY(this));
}

system.prototype.getTiles = function(tiles){
	return tiles.filter(t => t.isHitX(this) && t.isHitY(this));
}

system.prototype.isHitX = function isHitX(entity){
	//window.log = (`${entity.x} ${entity.width} / ${this.x} ${this.width}`);
	if((entity.x + entity.width) < this.x){
		return false;
	}

	if(entity.x > (this.x + this.width)){
		return false;
	}

	return true;
}

system.prototype.isHitY = function isHitY(entity){
	if((entity.y + entity.height) < this.y){
		return false;
	}

	if(entity.y > (this.y + this.height)){
		return false;
	}

	return true;
}

system.prototype.nearestSide = function(entity){
	let x = entity.x - this.x;
	let y = entity.y - this.y;

	if(x > y){
		if(x > this.width/2 + this.width/4){
			return 2;
		}

		if(y < this.height/2){
			return 1;
		}

		return 2;
	} else {
		if(x > this.width/2 + this.width/4){
			return 3;
		}

		if(y < this.height/2){
			return 4;
		}

		return 3;
	}
}

system.prototype.nearestSide = function(entity){
	let x = entity.x - this.x;
	let y = entity.y - this.y;

	if(x > this.width/2){
		if(x > y){
			return 2;
		}

		return 1;
	}
	else {
		if(x < y){
		 	return 4;
		}

		return 3;
	}
}

system.prototype.nearestSide = function(entity){
	let x = entity.x - this.x;
	let y = entity.y - this.y;

	if(x > this.width/2){
		if(y < this.height/2){
			y += entity.height;
		} else {

		}
	} else {
		if(y < this.height/2){
			y += entity.height;
			x += entity.width;
		} else {
			x += entity.width;
		}
	}

	if(x > this.width/2){
		if(y > this.height/2){
			if(y > x)
				return 3;
			else
				return 2;
		} else {
			if(x > y)
				return 2;
			else
				return 1;
		}
	}
	else {
		if(y > this.height/2){
			if(y > x)
				return 4;
			else
				return 3;
		} else {
			if(x > y)
				return 1;
			else
				return 4;
		}
	}
}


system.prototype.nearestSide = function(entity){
	let x = entity.x - this.x;
	let y = entity.y - this.y;

	f = Math.floor;
	if(x > this.width/2){
		if(y < this.height/2){
			y += entity.height;
		} else if(f(y) == f(this.height/2)) {
			return 2;
		} else {

		}
	} else if(f(x) == f(this.width/2)){
		if(y < this.height/2)
			return 1;
		else
			return 3;
	} else {
		if(y < this.height/2){
			y += entity.height;
			x += entity.width;
		} else if(f(y) == f(this.height/2)){
			return 4;
		} else {
			x += entity.width;
		}
	}

	f = Math.floor;
	//console.log(`${f(entity.x)} ${f(entity.y)} | ${f(x)} ${f(y)}`);

	const w = this.width;
	const h = this.height;

	//x = Math.abs(x);
	//y = Math.abs(y);

	if(entity.x > w/2){
		//console.log(`${f(y)} ${f(h/2)}`);
		if(entity.y > h/2){
			/*console.log(
				`${f(w - x)} < ${h - y} |`
				+ `${f(x)} ${f(y)}`
			);*/
			//console.log(`${w} ${h} / ${w - x} ${y}`);
			//console.log(`% ${w} ${h} / ${x} ${y}`);

			if((w - x) < (h - y)){
				console.log(`& ${w - x} ${w / 4}`);

				//if(x <= w/2){
				if(Math.abs(w - x) > w/4)
					return 3;

				return 2;
				//}
			} else
				return 3;
		} else {
			if((w - x) > y)
				return 1;
			else
				return 2;
		}
	}
	else {
		if(entity.y > h/2){
			//console.log(
				//`--- [ ${w - x} ${h - y}`)
			if((h - y) > x){
				/*if(Math.abs(h - y) > h/4)
					return 3;*/

				return 4;
			} else {
				if(Math.abs(h - y) > h/4)
					return 4;

				return 3;
			}
		} else {
			if(x > y)
				return 1;
			else
				return 4;
		}
	}
}

system.getDistance = function(sx, sy, dx, dy){
	const a = dx - sx;
	const b = dy - sy;

	return Math.sqrt(a*a + b*b);
}

system.prototype.getDistance = function(x, y){
	const lt = system.getDistance(this.x, this.y, x, y);
	const rt = system.getDistance(this.x + this.width, this.y, x, y);
	const lb = system.getDistance(this.x, this.y + this.height, x, y);
	const rb = system.getDistance(
		this.x + this.width,
		this.y + this.height,
		x,
		y
	);
	const result = [ lt, rt, lb, rb ];
	result.unshift(Math.min(... result));
	result.unshift(Math.max(... result));

	return result;
}

system.prototype.nearestX = function(entity){
	return entity.x + entity.width/2 > this.x + this.width/2
		? this.x + this.width
		: this.x - entity.width
	;
}

system.prototype.nearestY = function(entity){
	return entity.y + entity.height/2 > this.y + this.height/2
		? this.y + this.height
		: this.y - entity.height
	;
}

system.prototype.isHit = function isHit(entity){
	if(this.isHitX(entity)){
		if(this.isHitY(entity)){
			return 3;
		}

		return 1;
	}

	if(this.isHitY(entity)){
		if(this.isHitX(entity)){
			return 3;
		}

		return 2;
	}

	return false;
}

Object.defineProperties(system.prototype, {

});

system.apply = function apply(entity, op = {}){

	Object.defineProperties(entity,
		Object.getOwnPropertyDescriptors(system.prototype)
	);
}

system.constructor = function(op){
	this.width = op.width || 30;
	this.height = op.height || 30;

	this.entities = this.entities || op.entities || [];

	this.on("move", this.checkHit);
}

system.extend = function extend(prototype){
	prototype.constructors.push(system.constructor);

	Object.defineProperties(prototype,
		Object.getOwnPropertyDescriptors(system.prototype)
	);
}

}();
