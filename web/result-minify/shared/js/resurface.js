window.addEventListener("DOMContentLoaded", function(){
	for(const el of document.querySelectorAll(".resurface")){
		el.remove();
		
		document.body.appendChild(el);
	}
});
