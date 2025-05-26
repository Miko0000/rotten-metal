async function fetcher(src, op){
	return fetch(src, op).then(r => r.text());
}

window.addEventListener("DOMContentLoaded", async function(){
	const els = document.querySelectorAll(".fetcher");
	
	for(const el of els){
		const src = el.getAttribute("data-src");
		if(!src){
			console.log(src);
			
			continue ;
		}
		
		const text = await fetcher(src);
		el.innerHTML = text;
	}
});