const fakescroll_stickies = [];

let fakescroll_reset = 0;
let fakescroll_accum = 0;
let fakescroll_accel = 1;
let fakescroll_touchstart;

function fakescroll_eventHandler(ev){
	const { deltaY } = ev;
	const p = document.body.getAttribute("data-fakescroll-position") || 0;
	
	if(deltaY > 0){
		if(p > document.scrollingElement.scrollHeight*-1)
			fakescroll_accum = deltaY;
		else {
			fakescroll_accum = 1;
			fakescroll_reset = 1;
		}
	} else {
		if(p < 0)
			fakescroll_accum = deltaY;
		else {
			fakescroll_accum = 1;
			fakescroll_reset = -1;
		}
	}
	
	fakescroll_accum = fakescroll_accum/4;
	
	requestAnimationFrame(fakescroll_smoothScrolling);
	
	document.body.setAttribute("data-scroll", Number(
		document.body.getAttribute("data-fakescroll-position")
	)*-1);
}

function fakescroll_sticky(el){
	const bound = el.getBoundingClientRect();
	const style = getComputedStyle(el);
	const top = parseInt(style.top);
	
	//console.log(el.classList[1], bound.top, top)
	
	el.style.transform = `translateY(`
		+ Number(
			document.body.getAttribute("data-fakescroll-position")
		)*-1
		+ `)px`
	;
	
	if(bound.top < top)
		el.classList.add("fakescroll-sticky");
	else
		el.classList.remove("fakescroll-sticky");
}

function fakescroll_scroll(el){
	const { body } = document;

	const style = getComputedStyle(el);
	if(style.position === "absolute")
		return ;
	/*
	if(style.position === "sticky"){
		//fakescroll_sticky(el);
		
		// continue ;
		return ;
	}*/
	
	if(el.classList.contains("fakescroll-sticky"))
		fakescroll_sticky(el);
	
	if(fakescroll_reset < 0){
		body.setAttribute("data-fakescroll-position", 0);
		el.style.transform = `translateY(`
			+ `0px)`
		;
		
		return ;
	}
	
	if(fakescroll_reset > 0){
		body.setAttribute("data-fakescroll-position",
			document.scrollingElement.scrollHeight*-1
		);
		el.style.transform = `translateY(`
			+ document.scrollingElement.scrollHeight*-1
			+ `)px`
		;
		
		return ;
	}
	
	for(const el of fakescroll_stickies)
		fakescroll_sticky(el);

	body.setAttribute("data-fakescroll-position", Number(
		body.getAttribute("data-fakescroll-position") || 0
	) - (
		fakescroll_accum
	));

	
	el.style.transform = `translateY(`
		+ `${body.getAttribute("data-fakescroll-position")}px)`
	;
}

function fakescroll_smoothScrolling(){
	if(!fakescroll_accum)
		return ;
	
	const { body } = document;
	for(const child of document.body.children){
		fakescroll_scroll(child);
	}
	
	if(fakescroll_reset != 0)
		fakescroll_reset = 0;
	
	if(fakescroll_accum < 0)
		fakescroll_accum += fakescroll_accum;
		
		if(fakescroll_accum > 0)
			fakescroll_accum = 0;
	else
		fakescroll_accum -= fakescroll_accum;
		
		if(fakescroll_accum < 0)
			fakescroll_accum = 0;
	;
	
	requestAnimationFrame(fakescroll_smoothScrolling);
}

requestAnimationFrame(fakescroll_smoothScrolling);

window.addEventListener("DOMContentLoaded", function fakescroll(){
	document.body.style.overflow = "hidden"	;
	document.body.style.width = "100vw";
	document.body.style.height = "100vh";
	
	document.body.style.top = "0px";
	document.body.style.left = "0px";
	
	for(const child of document.body.children)
		child.style.transition = "transform 0.7s";
		
	for(const child of document.body.querySelectorAll("*")){
		if(getComputedStyle(child).position === "sticky")
			fakescroll_stickies.push(child);
	}
});

window.addEventListener("wheel", fakescroll_eventHandler);
window.addEventListener("touchstart", function(ev){
	fakescroll_touchstart = ev;
	ev.preventDefault();
}, { passive: false });
window.addEventListener("touchend", function(ev){
	ev.preventDefault();
}, { passive: false });
window.addEventListener("touchmove", function(ev){
	ev.preventDefault()
	const deltaY
		= ev.targetTouches[0].screenY
		- fakescroll_touchstart.targetTouches[0].screenY
	;
	
	fakescroll_touchstart = ev;
	
	fakescroll_eventHandler({
		target: ev.target,
		deltaY: deltaY*4
	});
}, { passive: false });


