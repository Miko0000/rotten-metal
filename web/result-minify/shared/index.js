qevent("click", "li.collapse.active", function(ev, el){
	//alert([Object.is(ev.target, el.children[0])]);
});

qevent("click", "li.collapse", function(ev, el){
	if(el.classList.contains("active")){
		if(!Array.from(el.querySelectorAll('*')).includes(ev.target)
			|| Object.is(ev.target, el.children[0])
		){
			el.classList.remove("active");

			return ;
		}
	}

	el.classList.add("active");
});

qevent("click", "ul.options.top li.icon", function(ev, el){
	el.classList.add("transitionFix");
	el = el.parentElement;
	el.classList.toggle("hide");
	el = document.querySelector(".top.bg");
	el && el.classList.toggle("hide");
});

qevent("click", ".level", function(ev, el){
	if(!el.classList.contains("open"))
		ev.preventDefault();

	el.style.setProperty("--level-open-time",
		`${el.textContent.length/120}s`
	);
	el.classList.add("transitionFix");
	el.classList.add("open");

	const level = Array.from(el.classList).filter(e =>
		e.startsWith("l") && e != "level"
	)[0];
	if(!level)
		return ;

	const next = parseInt(level.slice(1));
	for(const el of document.querySelectorAll(".access-context .level")){
		const current = parseInt(el.textContent);
		if(current > next)
			continue ;

		el.textContent = next;
	}
});

const acon_levels = [ 0, 1, 2, 3, 4, 5, 6 ];
qevent("click", ".access-context .level", function(ev, el){
	const level = parseInt(el.textContent);
	el.textContent = acon_levels[acon_levels.indexOf(level) - 1]
		|| acon_levels[0]
	;

	const denies = acon_levels.slice(acon_levels.indexOf(level));
	for(const deny of denies){
		for(const el of document.querySelectorAll(`.level.l${deny}`)){
			el.classList.remove("open");
		}
	}
});