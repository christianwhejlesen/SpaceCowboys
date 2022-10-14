/** @format */

export default class Bullet {
	constructor(canvas, x, y, vy, color) {
		this.canvas = canvas;
		this.x = x;
		this.y = y;
		this.vy = vy;
		this.color = color;
		this.width = 4;
		this.height = 20;
	}

	draw(ctx) {
		this.y -= this.vy;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	collideWith(object) {
		//Box collision detection
		//https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
		//if (
		//	rect1.x < rect2.x + rect2.w &&
		//  rect1.x + rect1.w > rect2.x &&
		//  rect1.y < rect2.y + rect2.h &&
		//  rect1.h + rect1.y > rect2.y
		//)
		if (this.x < object.x + object.width * object.scale && this.x + this.width > object.x && this.y < object.y + object.height * object.scale && this.y + this.height > object.y) {
			return true;
		}
		return false;
	}
}
