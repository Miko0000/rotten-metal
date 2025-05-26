(globalThis || window).jskit = (globalThis || window).jskit || {};

jskit.slowType = function(e, text, cpf, fps, prop = "textContent"){
	let i = 0;
	let next = Date.now();
	let res, rej;
	const ret = new Promise((r, rj) => (res = r, rej = rj));

	requestAnimationFrame(function frame(){
		if(i > text.length)
			return res();

		if(next > Date.now())
			return requestAnimationFrame(frame)

		next = (Date.now() + 1000/fps);

		e[prop] = e[prop] + text.slice(i, i += cpf);

		requestAnimationFrame(frame);
	});

	return ret;
}