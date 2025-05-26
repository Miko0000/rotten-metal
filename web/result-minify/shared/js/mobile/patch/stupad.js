window.addEventListener("touchstart", function(){
	let fix = 0;
	requestAnimationFrame(function align(){
		const body = document.body;
		const rect = body.getBoundingClientRect();

		//prompt(JSON.stringify(rect));

		if(rect.top < 0 ){
			body.style.transform
				= `translateY(${rect.top - (fix++)})`;

			return requestAnimationFrame(align);
		}
	})
})

alert("Stupad Active");
