function flicker(f, fps){
	let next = Date.now();
	let stop = 0;

	requestAnimationFrame(function frame(){
		if(stop)
			return ;

		if(next > Date.now())
			return requestAnimationFrame(frame);

		next = (Date.now() + 1000/fps);

		f(() => stop = 1);

		requestAnimationFrame(frame);
	});
}

/*
let i = 0
flicker(function(stop){
	// (try to) execute 60 times per second

	console.log(i++);

	if(i > 100)
		stop();
}, 60);
*/