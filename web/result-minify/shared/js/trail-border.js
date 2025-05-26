/**
	@namespace Trail
*/

/**
	@class BorderPlayer
	@memberof Trail
*/
_ = Trail.BorderPlayer = class BorderPlayer extends EventSystem {
	constructor(){
		super();

		this.parts = [];
		this.element = document.createElement("div");
		this.element.classList.add("trail-border");
		for(let i = 0; i < 8; i++)
			new BorderPlayer.Part(this);
	}
}

/**
	Advance a single frame
	@method Trail.BorderPlayer.prototype.next
*/

_.prototype.next = async function(){
	return await Promise.all(this.parts.map(p => p.next()));
}

/**
	Append this player to an element
	@method Trail.BorderPlayer.prototype.append
	@param {HTMLElement} element
*/
_.prototype.append = function(element){
	element.appendChild(this.element);
}

/**
	Remove the player from DOM
	@method Trail.BorderPlayer.prototype.remove
*/
_.prototype.remove = function(){
	this.element.remove();
}

/**
	@class Trail.BorderPlayer.Part
*/

_ = Trail.BorderPlayer.Part = class Part {
	constructor(border, op = {}){
		this.border = border;
		this._player = null;
		this.canvas = document.createElement("canvas");
		op.noHide || this.canvas.classList.add("hidden");
		this.autoAdjust = true;

		if(border)
			this.canvas.classList.add(
				`i${border.parts.push(this) - 1}`
			);

		this.canvas.classList.add("border-player", "part");
		this.append(border.element);
	}
}

/**
	Adjust player position an size to fit part
	@method Trail.BorderPlayer.Part.prototype.adjust
*/

_.prototype.adjust = function(){
	const player = this._player;
	//const min = Math.min(this.canvas.width, this.canvas.height);

	player.w = this.canvas.width;
	player.h = this.canvas.height;

	this.canvas.getContext("2d").imageSmoothingEnabled = false;
}

/**
	Advance a single frame
	@method Trail.BorderPlayer.Part.prototype.next
	@param {HTMLElement} element
*/

_.prototype.next = async function(){
	await this.player.trail.promise;
	this.canvas.classList.remove("hidden");

	return this.player.next();
}

/**
	Append this part to an element
	@method Trail.BorderPlayer.Part.prototype.append
	@param {HTMLElement} element
*/
_.prototype.append = function(element){
	element.appendChild(this.canvas);
}

/**
	Remove this part from DOM
	@method Trail.BorderPlayer.Part.prototype.remove
	@param {HTMLElement} element
*/
_.prototype.remove = function(){
	this.canvas.remove();
}

Object.defineProperties(_.prototype, {
	which: {
		get(){
			return this.player.parts.indexOf(this);
		}
	},

	player: {
		get(){
			return this._player;
		},

		set(v){
			const ret = this._player = v;

			if(this.autoAdjust)
				this.adjust();

			return ret;
		}
	}
});
