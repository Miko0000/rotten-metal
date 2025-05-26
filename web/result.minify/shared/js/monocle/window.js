monocle.window = {

}

void function window(){
	class Window extends KlawsInstance {
		constructor(icon, title, op){
			super(Klaws, null, `.window.${title}`);

			this.id = Window.count++;
			this.title = "Untitled";
			this.icon = icon;

			this.width = 0;
			this.height = 0;

			this.x = 0;
			this.y = 0;
		}
	}

	Window.count = 0;

	monocle.window.Window = Window;
}();
