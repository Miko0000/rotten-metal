let _scouts = [];

window.addEventListener("DOMContentLoaded", function(){
	_scouts.push(... document.querySelectorAll(".scout"));
});

window.addEventListener("scroll", _scouts.handler = function(){
	for(const scout of _scouts){
		const bound = scout.getBoundingClientRect();
		
		//console.log(bound);
		
		if(bound.top > 0 && bound.top < window.innerHeight){
			if(bound.left > 0 && bound.left < window.innerWidth){
				scout.dispatchEvent(new CustomEvent("scout", {
					detail: { bound }
				}));
			}
		}
	}
});

window.addEventListener("scrollend", _scouts.handler);