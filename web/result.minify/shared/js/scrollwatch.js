const _scrollwatch = [];

window.addEventListener("DOMContentLoaded", function(){
	for(const el of document.querySelectorAll(".scrollwatch")){
		_scrollwatch.push([0, el]);
	}
	
	_scrollwatch.handler();
})

window.addEventListener("scrollend", _scrollwatch.handler = function(){
	for(const entry of _scrollwatch){
		const el = entry[1];
		const rect = el.getBoundingClientRect();
		let state = entry[0];
		let event;
		
		if(rect.top > 0){
			state = 1;
			
			if(rect.top > window.innerHeight/2){
				state = 2;
				
				if(rect.top > window.innerHeight){
					state = 3;
				}
			}
		}
		
		if(rect.top < 0){
			state = 0;
			
			if(rect.top < (window.innerHeight/2)*-1){
				state = -1;
				
				if(rect.top > window.innerHeight*-1){
					state = -2;
				}
			}
		}
				
		if(state == entry[0])
			return ;
		
		el.dispatchEvent(new CustomEvent("scrollwatch", { detail: {
				state, rect
			} })
		);
	}
});