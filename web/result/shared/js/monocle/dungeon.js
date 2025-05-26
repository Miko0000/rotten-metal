void function(){
	class Dungeon extends EventSystem {
		constructor(trails, scale){
			super();

			this.trails = trails || {};
			this.scale = scale || 150;

			this.rooms = [];
			this.corridors = [];
			this.doors = [];

			this.Tile = Dungeon.Tile;
			this.Room = Dungeon.Room;
			this.Door = Dungeon.Door;
			this.Corridor = Dungeon.Corridor;
		}
	}

	class Tile extends monocle.Entity {
		constructor(element, op = {}){
			super(op);

			this.element = element;
			this.layer = 0;
		}
	}

	monocle.system.movement.extend(Tile.prototype);
	monocle.system.border.extend(Tile.prototype);

	Tile.prototype.randomDirectionTile = function(){
		const dir = this.randomDirection();
		return this[dir];
	}

	Tile.prototype.randomDirection = function(){
		const exists = [
			"top",
			"topLeft",
			"left",
			"bottomLeft",
			"bottom",
			"bottomRight",
			"right",
			"topRight"
		].filter(d => this[d]);

		const n = Math.floor(Math.random()*exists.length);

		return exists[n];
	}

	Tile.prototype.next = function(){
		if(!this.element)
			return ;

		const { x, y, offsetX, offsetY } = play;

		this.element.x = this.x - x + offsetX;
		this.element.y = this.y - y + offsetY;
		this.element.next();
	}

	class Room extends Tile {
		constructor(element, op){
			super(element, op);

			this.tiles = [];
		}
	}

	Room.prototype.next = function(){
		for(const tile of this.tiles){
			tile.next();
		}
	}

	class Corridor extends Tile {
		constructor(element, op){
			super(element, op);

			this.tiles = [];
		}
	}

	Corridor.prototype.next = function(){

	}

        class Door extends Tile {
                constructor(element, op){
                        super(element, op);
                }
        }

	Dungeon.Tile = Tile;
	Dungeon.Room = Room;
	Dungeon.Corridor = Corridor;
        Dungeon.Door = Door;

	Monocle.Dungeon = Dungeon;
}();

Monocle.Dungeon.prototype.transformRoom = function(room){
	const left = room.getLeft();
	const top = room.getTop();
	const right = room.getRight();
	const bottom = room.getBottom();

	const sx = left;
	const sy = top;
	const dx = right + 1;
	const dy = bottom + 1;

	return [ sx, sy, dx, dy ].map(e => e*this.scale);
}

Monocle.Dungeon.prototype.transformCorridor = function(corridor){
	let sx = corridor._startX;
	let sy = corridor._startY;
	let dx = corridor._endX;
	let dy = corridor._endY;

	if(sx < dx){
		dx += 1;
	}

	if(sy < dy){
		dy += 1;
	}

	if(dx < sx){
		sx += 1;
	}

	if(dy < sy){
		sy += 1;
	}

	const order = [ sx, sy, dx, dy ];

	if(sx > dx){
		_sx = sx;

		sx = dx;
		dx = _sx;
	}

	if(sy > dy){
		_sy = sy;

		sy = dy;
		dy = _sy;
	}

	return [ sx, sy, dx, dy, ...order ].map(e => e*this.scale);
}

Monocle.Dungeon.prototype.getDrawPos = function(sx, sy, dx, dy){
	if(sx instanceof Array){
		dy = sx[3];
		dx = sx[2];
		sy = sx[1];
		sx = sx[0];
	}

	sx = sx ? sx - play.x + play.offsetX : -1;
	sy = sy ? sy - play.y + play.offsetY : -1;
	dx = dx ? dx - play.x + play.offsetX : -1;
	dy = dy ? dy - play.y + play.offsetY : -1;

	return [ sx, sy, dx, dy ];
}

Monocle.Dungeon.prototype.transformDoor = function(x, y){
	return [x, y].map(e => e*this.scale)
}

Monocle.Dungeon.prototype.drawMap = function(){
	const canvas = document.querySelector(".play canvas.map");
	const context = canvas.getContext("2d");

	for(const room of this.map.getRooms()){
		const left = room.getLeft();
		const top = room.getTop();
		const right = room.getRight();
		const bottom = room.getBottom();

		context.fillStyle = "black";
		context.fillRect(
			left, top, right - left, bottom - top
		);
	}
	for(const corridor of this.map.getCorridors()){
		context.beginPath();
		context.moveTo(corridor._startX, corridor._startY);
		context.lineTo(corridor._endX, corridor._endY);
		context.strokeStyle = "red";
		context.stroke();
	}
}

Monocle.Dungeon.prototype.drawRoom = function(room, context, dungeon){
	/*const [ sx, sy, dx, dy ] =
		dungeon.getDrawPos()
	;*/

	/*context.fillStyle = "black";
	context.fillRect(
		sx, sy, dx - sx, dy - sy
	);*/
	room.next();
	if(!dungeon.tped){
		play.character.teleport(room.x, room.y);

		dungeon.tped = 1;
	}

	//console.log(`${sx} ${sy} ${dx} ${dy}`);
	false && room.getDoors(function(_x, _y){
		const [ x, y ] = dungeon.transformDoor(_x, _y);

		context.fillStyle = "yellow";
		context.fillRect(
			x - play.x + play.offsetX,
			y - play.y + play.offsetY,
		this.scale, this.scale);

		if(!dungeon.tped){
			console.log(`${x} ${y}`);
			play.character.teleport(x, y);

			dungeon.tped = 1;
		}
	});
}

Monocle.Dungeon.prototype.drawRooms = function(map, context, dungeon){
	for(const room of this.rooms){
		this.drawRoom(room, context, dungeon);
	}
}

Monocle.Dungeon.prototype.drawCorridor = function(corridor, context, dungeon){
	const [ _1, _2, _3, _4, _sx, _sy, _dx, _dy ] =
		dungeon.transformCorridor(corridor)
	;

	const [ sx, sy, dx, dy ] = this.getDrawPos(
		_sx, _sy, _dx, _dy
	);

	//console.log(`${sx} ${sy} ${dx - sx} ${dy - sy}`);
	//console.log(JSON.stringify(corridor))

	/*context.fillStyle = "red";
	context.fillRect(
		sx, sy, dx - sx, dy - sy
	);*/

	context.strokeStyle = "red";
	context.beginPath();
	context.moveTo(sx, sy);
	context.lineTo(dx, dy);
	context.stroke();
	context.strokeStyle = "black";
}

Monocle.Dungeon.prototype.drawCorridors = function(map, context, dungeon){
	for(const corridor of map.getCorridors()){
		this.drawCorridor(corridor, context, dungeon);
	}
}

Monocle.Dungeon.prototype.draw = function(){
	const { context, dungeon } = play;
	const { map } = dungeon;

	this.drawRooms(map, context, dungeon);
	this.drawCorridors(map, context, dungeon);
	this.drawMap();
}

Monocle.Dungeon.prototype.generate = function(w, h, op = {}){
	const { context } = play;
	const dungeon = this;

	//ROT.RNG.setSeed(792192);
	ROT.RNG.setSeed(op.seed || ((n = Math.random()*100000) | n));

	if(!op.roomWidth)
		op.roomWidth = [ 1, 5 ];

	if(!op.roomHeight)
		op.roomHeight = [ 1, 5 ];

	if(!op.corridorLength)
		op.corridorLength = [ 1, /*this.scale*/3 ];

	const map = new ROT.Map.Digger(w || 60, h || 6, op);
	map.create();
	dungeon.map = map;
	dungeon.tped = false;

	this.rooms = dungeon.generateRooms(map.getRooms());
	this.corridors = dungeon.generateCorridors(map.getCorridors());
}

Monocle.Dungeon.prototype.tileConnect = function(room, tile){
	const { x, y, width, height } = tile;

	for(const n of room.tiles){
		if(n == tile)
			continue ;

		const x1 = n.x;
		const x2 = n.x + n.width;
		const y1 = n.y;
		const y2 = n.y + n.height;

		const tx1 = tile.x;
		const tx2 = tile.x + tile.width;
		const ty1 = tile.y;
		const ty2 = tile.y + tile.height;

		//if(x1 == tx2 && y2 == ty1)
		//alert([ x1, x2, y1, y2, tx1, tx2, ty1, ty2 ].join(' / '))

		if(x1 == tx2 && y2 == ty1){
			tile.topRight = n;
			n.bottomLeft = tile;
		}

		if(x1 == tx1 && y2 == ty1){
			tile.top = n;
			n.bottom = tile;
		}

		if(x2 == tx1 && y2 == ty1){
			tile.topLeft = n;
			n.bottomRight = tile;
		}

		if(x2 == tx1 && y1 == ty1){
			tile.left = n;
			n.right = tile;
		}

		if(x2 == tx1 && y1 == ty2){
			tile.bottomleft = n;
			n.topRight = tile;
		}

		if(x1 == tx1 && y1 == ty2){
			tile.bottom = n;
			n.top = tile;
		}

		if(x1 == tx2 && y1 == ty2){
			tile.bottomRight = n;
			n.topLeft = tile;
		}

		if(x1 == tx2 && y1 == ty1){
			tile.right = n;
			n.left = tile;
		}
	}
}

Monocle.Dungeon.prototype.generateTiles = function(room){
	const dungeon = this;
	const size = dungeon.scale/4;

	//const width = room.width * this.scale;
	//const height = room.height * this.scale;

	for(let y = 0; y < room.height; y += size){
		for(let x = 0; x < room.width; x += size){
			const tile = new dungeon.Tile(null, {
				x: room.x + x,
				y: room.y + y,
				width: size,
				height: size
			});
			this.tileConnect(room, tile);
			room.tiles.push(tile);
			dungeon.emit("make-tile", tile);
		}
	}
}

Monocle.Dungeon.prototype.generateRoom = function(room){
	//alert(JSON.stringify(Object.getOwnPropertyDescriptors(room)));
	const dungeon = this;
	const instance = new dungeon.Room(new monocle.dfield.Element({
		anim: new Trail.Player(dungeon.trails.floor1, play.context),
		w: 300,
		h: 300
	}));
	instance.element.repeat = 1;
	const [ sx, sy, dx, dy ] = dungeon.transformRoom(room);

	instance.x = sx;
	instance.y = sy;
	instance.width = dx - sx;
	instance.height = dy - sy;
	//console.log("!!!!!!!!!");

	instance.element.w = instance.width;
	instance.element.h = instance.height;

	dungeon.generateTiles(instance);
        instance.doors = dungeon.generateDoors(instance, room);

	dungeon.emit("make-room", instance);

	return instance;
}

Monocle.Dungeon.prototype.generateRooms = function(rooms){
	const dungeon = this;
	const instances = [];

	for(const room of rooms){
		instances.push(this.generateRoom(room));
	}

	return instances;
}

Monocle.Dungeon.prototype.generateCorridors = function(corridors){
	const dungeon = this;
	const instances = [];

	for(const corridor of corridors){
		instances.push(this.generateCorridor(corridor));
	}

	return instances;
}

Monocle.Dungeon.prototype.generateCorridor = function(corridor){
	const dungeon = this;
	const instance = new dungeon.Corridor(new monocle.dfield.Element({
		anim: new Trail.Player(dungeon.trails.floor1, play.context),
		w: 300,
		h: 300
	}));
	const [ sx, sy, dx, dy ] = dungeon.transformCorridor(corridor);

	instance.x = sx;
	instance.y = sy;

	instance.width = Math.max(dx - sx, this.scale);
	instance.height = Math.max(dy - sy, this.scale);

	instance.element.w = instance.width;
	instance.element.h = instance.height;
	instance.element.repeat = 1;

	dungeon.generateTiles(instance);
	dungeon.emit("make-corridor", instance);

	return instance;
}

Monocle.Dungeon.prototype.generateDoors = function(instance, room){
        const dungeon = this;
        const result = instance.doors;

        room.getDoors(function(_x, _y){
		const [ x, y ] = dungeon.transformDoor(_x, _y);
                const instance = new dungeon.Door(new monocle.dfield.Element({
			anim: new Trail.Player(
				dungeon.trails.floor1,
				play.context
			),
			w: 300,
			h: 300
		}));

                instance.x = x;
                instance.y = y;
                instance.width = dungeon.scale;
                instance.height = dungeon.scale;

		instance.element.w = instance.width;
		instance.element.h = instance.height;
		instance.element.repeat = 1;

                const instance2 = new dungeon.Door(new monocle.dfield.Element({
			anim: new Trail.Player(
				dungeon.trails.door1,
				play.context, { w: 200, h: 200 }
			),
			w: 200,
			h: 200
		}));

                instance2.x = x;
                instance2.y = y;
                instance2.layer = 2;
                instance2.width = 80;
                instance2.height = 80;

		//instance2.element.w = 80;
		//instance2.element.h = 80;
		instance2.element.repeat = 0;
		instance2.element.anim.direction = -1;

                dungeon.doors.push(instance);
                dungeon.doors.push(instance2);
		if(dungeon.doors2){
			dungeon.doors2.push(instance);
		        dungeon.doors2.push(instance2);
		}

		dungeon.emit("make-door", instance, instance2);
        });

        return result;
}
