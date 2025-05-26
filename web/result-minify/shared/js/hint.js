window.addEventListener("DOMContentLoaded", function(){
	let hintbox = document.querySelector(".hint.hintbox");
	let lock;

	if(!hintbox){
		hintbox = document.createElement("div");
		hintbox.classList.add("hint", "hintbox");

		document.body.appendChild(hintbox);
	}

	function putHintbox(target, x, y){
		if(!target.matches)
			return ;

		if(!target.matches(".hint, .hint *")){
			hintbox.classList.remove("active");

			return ;
		}

		let provider = target;
		if(!provider.matches(".hint")){
			provider = provider.closest(".hint");
		}

		//console.log("target", target);

		const content = provider.querySelector(".hint-content")
			.cloneNode(1);

		if(!content){
			hintbox.classList.remove("active");

			return ;
		}

		if(x > window.innerWidth/2){
			x -= parseInt(target.offsetWidth);
		}

		if(y > window.innerHeight/2){
			y -= parseInt(target.offsetHeight);
		}

		hintbox.textContent = '';
		hintbox.style.left = `${x}px`;
		hintbox.style.top = `${y}px`;
		hintbox.appendChild(content);
		hintbox.classList.add("active");
	}

	window.addEventListener("mousemove", function({ target, clientX, clientY }){
		putHintbox(target, clientX, clientY);
	});

	window.addEventListener("focusin", function(ev){
		//console.log(ev);
		const bound = ev.target.getBoundingClientRect();

		putHintbox(ev.target, bound.right, bound.bottom);
	});
});

new Error("[anchint] Module unfinished");