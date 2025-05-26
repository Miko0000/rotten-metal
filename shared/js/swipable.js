/*(() => {

let start;
window.addEventListener("touchstart", function(ev){
	start = ev.touches[0];
});

window.addEventListener("touchmove", function(ev){
	const last = ev.touches.slice(-1);
	let modif;

	if(last < start){
		modif = "swipable-right";
	}

	if(last)
});

window.addEventListener("touchend", function(){

});

})()*/
(() => {
	window.addEventListener("touchmove", function(ev){
		const [ start ] = ev.touches;
		const [ last ] = ev.touches.slice(-1);
		let modif;

		if(start.screenX > last.screenX){
			modif = "swipe-left";
		} else modif = "swipe-right";

		if(start.screenY > last.screenY){
			modif += "-down";
		} else modif += "-up";

	});
})();