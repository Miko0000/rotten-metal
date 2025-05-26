try {
	window.global = globalThis;
} catch(err){
	try {
		window.global = window;
		window.globalThis = window;
	} catch(err){

	}
}
