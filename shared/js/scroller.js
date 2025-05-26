window.addEventListener("DOMContentLoaded", function(){
	const registry = [];

	for(const element of document.querySelectorAll(".__mod-scroller")){
		let scrollTopProvider = element;

		if(element instanceof HTMLBodyElement)
			scrollTopProvider = document.scrollingElement;

		element.setAttribute("data-scroll", scrollTopProvider.scrollTop);

		function scroll({ target }){
			element.setAttribute("data-scroll", scrollTopProvider.scrollTop);
		}

		registry.push({ element, scroll });

		element.addEventListener("wheel", scroll);
		element.addEventListener("scroll", scroll);
		element.addEventListener("touchmove", scroll);
	};

	/*window.addEventListener("keydown", (ev)
		=> key === "PageDown" || key === "PageUp"
			? scroll()
			: null
	)*/

	window.addEventListener("keydown", function(ev){
		const { target, key } = ev;

		//console.log(key);

		if("PageUp" !== key && "PageDown" !== key)
			return ;

		//console.log(target, key);

		if(target.matches(".__mod-scroller"))
			registry.find(r => r.element === target).scroll(ev);
	});
});
