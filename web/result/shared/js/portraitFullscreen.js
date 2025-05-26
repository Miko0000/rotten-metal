async function portraitFullscreen(){
	if(!screen.orientation.type.startsWith("portrait"))
		return ;

	if(screenfull.isEnabled && !screenfull.isFullscreen) try {
		await screenfull.request();
	} catch(error){

	}
}

window.addEventListener("click", portraitFullscreen);
window.addEventListener("touchstart", portraitFullscreen);
