/*
	partially pre-written
*/

void function(){
	class Element {
		constructor(op = {}){
			this.x = op.x || 0;
			this.y = op.y || 0;
			this.w = op.w || 100;
			this.h = op.w || 100;
			this.offsetX = op.offsetX || 0;
			this.offsetY = op.offsetY || 0;

			this.playing = 1;
			this.anim = op.anim || null;
		}
	}

	Element.prototype.next = function draw(){
		const { x, y, w, h, anim } = this;
		const { context } = anim;
		const { canvas } = context;

		anim.offsetX = this.offsetX;
		anim.offsetY = this.offsetY;
		anim.playing = this.playing;

		if(x > canvas.width)
			return ;

		if(x > canvas.height)
			return ;

		if((x + w) < 0)
			return ;

		if((y + h) < 0)
			return ;/**/

		anim.x = x;
		anim.y = y;

		//console.log(`${x} ${y} ${w} ${h} ) ${anim.w}, ${anim.h}`);
		if(!this.repeat){
 			return anim.next();
		}

		for(let i = y; i < y + h; i += anim.h){
			for(let j = x; j < x + w; j += anim.w){
				/*monocle.moonsole_el.textContent
					= `${this.constructor.name} ${w - (j - x)} ${h - (i - y)}`;
				*/

				anim.x = j;
				anim.y = i;
				anim.next(
					0,
					0,
					Math.min((x + w) - j, anim.w),
					Math.min((y + h) - i, anim.h),
				);
				anim.i--;
			}
		}

		anim.x = x;
		anim.y = y;
		//anim.w = w;
		//anim.h = h;
		//anim.next();

		anim.i++;
	}

	Object.defineProperties(Element.prototype, {

	});

	monocle.dfield.Element = Element;
}();
