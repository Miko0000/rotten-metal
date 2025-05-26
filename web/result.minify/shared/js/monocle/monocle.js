if(typeof globalThis != 'undefined')
	globalThis.global = globalThis
else if(typeof window != 'undefined')
	window.global = window

class Monocle extends EventSystem {
	constructor(){
		super();

		this.system = new EventSystem;
		this.window = new EventSystem;
		this.dfield = new EventSystem;
	}
}

global.Monocle = Monocle;
global.monocle = new Monocle;

window.onFullScreen = function(){
	monocle.emit("fullscreen");
}

window.addEventListener("DOMContentLoaded", function(){
	monocle.moonsole_el = document.querySelector(".moonsole");
})
