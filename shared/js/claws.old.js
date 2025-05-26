// DOM Management relying on classes
window.claws = {

};

if(true){
	const { claws } = window;

	claws.getTemplate = function(template){
		return document.querySelector(`.template.${template}`);
	}

	claws.setTemplate = function(template, node){
		this.getTemplate(template).remove();

		node.classList.add("template");
		document.body.appendChild(node);

		return ;
	}

	claws.template = function(template, deep = 1){
		template = this.getTemplate(template);

		if(template){
			template = template.cloneNode(deep);
			template.classList.remove("template");

			return template;
		}

		return null ;
	}

	claws.get = function(el){

	}

	claws.set = function(el){

	}

	claws.register = function(el){

	}
}