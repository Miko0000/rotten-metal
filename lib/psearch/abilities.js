function evaluate(el, { max, average } = {}){
	const eva = new KlawsInstance(null,
		null,
		null
	);

	eva._element = 	el.querySelector(".ability-eval");

	const list = Array.from(el.querySelectorAll(".ability"))
		.filter(element => !element.classList.contains("template"));
	average = average || 30;
	max = max || list.map(en => average).reduce((l, r) => l + r, 0);

	let total = 0;
	for(const bar of list){
		const value = Math
			.round((parseInt(bar
				.style
				.getPropertyValue("--progress")
			)
				/ 360)
				* 100
			|| 0)
		;

		total += value;
	}

	//alert([ average, max, total ]);
	/*eval.compose(
		"average", `${average}`,
		"total", `${total}`,
		"max", `${max}`
	);*/

	const elav = eva.get("each-average");
	const elto = eva.get("total");
	const elma = eva.get("total-average");

	elav.textContent = `${average}`;
	elto.textContent = `${total}`;
	elma.textContent = `${max}`;

	if(total < max)
		elto.style.color = "#FFAFAF";

	if(total >= max)
		elto.style.color = "#FFFFAF";

	if(total > max)
		elto.style.color = "#AFFFAF";
}

qevent("click", ".page.search .abilities .conic-pbar", async function(ev, el){
	const progress = parseInt(prompt("Enter a number between 0 to 100"))
		|| 0;
	const page = el.parentElement.parentElement.parentElement;
	el.style.removeProperty("--progress");
	el.parentElement.style
		.setProperty("--progress", `${(progress/100)*360}deg`);

	const value = el.parentElement.querySelector(".value");
	if(value)
		value.textContent = progress;

	evaluate(page);
});

qevent("click", ".page.search .abilities .reset", async function(ev, el){
	el = el.parentElement;
	const progress = 30;
	const page = el.parentElement.parentElement.parentElement;
	el.style.removeProperty("--progress");
	el.parentElement.style
		.setProperty("--progress", `${(progress/100)*360}deg`);

	const value = el.parentElement.querySelector(".value");
	if(value)
		value.textContent = progress;

	evaluate(page);
});