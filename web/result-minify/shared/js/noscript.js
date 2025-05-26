window.addEventListener("DOMContentLoaded", function(){
	console.log(window.nolog || "[noscript.js] Removed",
		Array.from(document.querySelectorAll(".noscript"))
			.map(el => el.remove())
			.length,
		"elements"
	);
});