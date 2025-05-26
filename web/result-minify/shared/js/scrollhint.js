window.addEventListener("click", function({ target }){
	if(!target.classList.contains("scroll-hint"))
		return ;

	let scable = target;

	if(scable.classList.contains("scroll-hint-definitive")){
		while(scable){
			if(scable.classList.contains("scroll-hint-definition"))
				break ;

			scable = scable.parentElement || null;
		}
	} else {
		while(scable){
			if(scable.scrollHeight > scable.clientHeight)
				break ;

			if(scable.scrollWidth > scable.clientWidth)
				break ;

			scable = scable.parentElement || null;
		}
	}

	if(!scable)
		return ;

	console.log(scable);

	if(scable instanceof HTMLBodyElement)
		scable = document.scrollingElement;

	console.log(scable instanceof HTMLBodyElement, scable);

	let n = 64;
	let behavior = "smooth";

	if(target.classList.contains("scroll-hint-down")){
		scable.scrollBy({ top: n, behavior });
	}

	if(target.classList.contains("scroll-hint-up")){
		scable.scrollBy({ top: -n, behavior });
	}

	if(target.classList.contains("scroll-hint-left")){
		scable.scrollBy({ left: -n, behavior });
	}

	if(target.classList.contains("scroll-hint-right")){
		scable.scrollBy({ left: n, behavior });
	}
})