const flicker = (function(){
	const list = [];

	requestAnimationFrame(del = function frame(){
		const now = Date.now();

		for(let i = 0; i < list.length; i++){
			const [ f, fps, next ] = list[i];
			if(now < next)
				continue ;

			list[i][2] = Date.now() + fps;

			f(() => list.splice(i, 1));
		}

		requestAnimationFrame(frame);
	});

	let i = 0;
	return function(f, fps){
		list.push([ f,
			Math.floor(1000/fps),
			Date.now() + Math.floor(1000/fps)
		]);

		i++ < 1 && del();

		return () => list.splice(list.indexOf(f), 1);
	}
})();
