window.addEventListener("click", function f({ target }){
	if(!target.classList.contains("ctcopy"))
		return ;

	const popup = document.querySelector(".ctcopy-popup")
	if(popup){
		popup.classList.add("active");

		if(!f.active)
			setTimeout(() => {
				popup.classList.remove("active");

				f.active = 0;
			}, 3000);

		f.active = 1;
	}

	if(document.execCommand){
		// with newer browser, this just refuses to work.

		//return document.execCommand("copy");
	}

	const content = target.getAttribute("href") || target.textContent;

	if(navigator.clipboard && navigator.clipboard.writeText)
		navigator.clipboard.writeText(content);
});