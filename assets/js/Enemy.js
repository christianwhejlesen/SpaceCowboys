/** @format */

export default class Enemy {
	//---VARIABLES--//
	xOffset = 0;
	yOffset = 35;
	frame = 0;
	delay = 20;
	count = 0;
	largestEnemyWidth = 76; //The width of the widest enemy image in the assets

	constructor(x, y, imageNumber) {
		this.x = x;
		this.y = y;
		this.image = new Image();
		// this.image.src = '../assets/gfx/Invader_2.png';
		this.image.src = `../assets/gfx/Invader_${imageNumber}.png`;
		this.width = this.image.width / 2;
		this.height = this.image.height;
		this.scale = 1;
		this.padding = this.width < this.largestEnemyWidth / 2 ? (this.largestEnemyWidth / 2 - this.width) / 2 : 0; //Center up enemies
	}

	update(vx, vy) {
		this.x += vx;
		this.y += vy;
	}

	draw(ctx) {
		if (this.count === this.delay) {
			this.count = 0;
			this.frame = this.frame === 1 ? 0 : 1;
		}
		this.count++;
		ctx.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, this.x + this.xOffset + this.padding, this.y + this.yOffset, this.width * this.scale, this.height * this.scale);

		////////////////////////////////////////////////////////////////////
		// -----SPRITEMAP DRAWING-----
		// ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, width, height);
		// sx, sy Clipping area begin
		// sWidth, sHeight Clipping area size
		// x, y Position on canvas
		// width, height Size of image, here's where scaling would be added
		////////////////////////////////////////////////////////////////////
	}
}