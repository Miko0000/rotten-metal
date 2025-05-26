monocle.hold = {
	active: false,
 	anims: new Trail.Player.Stack([
		new Trail.Player(new Trail("monocle/anim/sel/1", {
			duration: 3,
			style: {}
		})),
		new Trail.Player(new Trail("monocle/anim/sel/2", {
			duration: 3,
			style: {}
		}))
	]),
	direction: 1,
	pos: 0
}

monocle.hold.on = function on({ position, reset, element }){
	if(!position) position = 0;
	if(reset)
		this.anims.jump(0);

	this.anims.jump(position);
	//console.log(`${this.pos}:${this.anim.frames.length}`);

	//this.pos = this.pos > pos ? this.pos : pos;
	this.anims.direction = 1;
	this.active = true;

	if(element){
		const canvas = document.querySelector("canvas.selector");
		const rect = element.getBoundingClientRect();

		canvas.style.left
			= `${rect.left + (rect.right - rect.left)/2}px`;
		canvas.style.top
			= `${rect.top + (rect.bottom - rect.top)/2}px`;
	}
}

monocle.hold.off = function off(reset){
	if(reset){
		this.anims.jump(0);
		this.tick();
		this.active = false;
	}

	this.anims.direction = -1;
}

monocle.hold.tick = function on(){
	if(!this.active)
		return ;

	//console.log("tick");
	this.anims.players[0].clear();
	this.anims.next();
}

window.addEventListener("load", async function trail(){
	if(trail.lock)
		return ;
	trail.lock = 1;

	flicker(function(){
		monocle.hold.tick();
	}, 60);

	const canvas = document.querySelector("canvas.selector");
	const context = canvas.getContext('2d');
	canvas.width = 100;
	canvas.height = 100

	monocle.hold.anims.context = context;
	_ = monocle.hold.anims.next;
	monocle.hold.anims.next = function(){
		const deg = Math.floor((Date.now() % (60 * 360)) / 360)*6;
		context.filter = `drop-shadow(0 0 5px white)`;
		_.call(this);

		context.filter = (`hue-rotate(${deg}deg)`);
		context.fillStyle = "rgb(255, 100, 100)";
		context.globalCompositeOperation = "source-in";
		context.fillRect(0, 0, 100, 100);
		context.globalCompositeOperation = "source-over";
	}
});


void function holder(){
	const instance = new Holder;
	instance.delay = 100;

	instance.on("knock", function(ev){
		//console.log("[knock]");

		window.qeventEmitter("hold")({
			event: ev,
			target: ev.target,
			holder: instance,
			count: instance.count,
			stopPropagation(){}
		});
	});

	instance.on("end", function(ev){
		window.qeventEmitter("hold-end")({
			event: ev,
			target: ev.target,
			holder: instance,
			count: instance.count,
			stopPropagation(){}
		});

		monocle.hold.off();
	});
}();
