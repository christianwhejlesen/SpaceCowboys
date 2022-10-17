/** @format */

export default class Enemy {
	//---VARIABLES--//
	xOffset = 0;
	yOffset = 35;
	frame = 0;
	delay = 30;
	count = 0;
	largestEnemyWidth = 76; //The width of the widest enemy image in the assets
	scale = 1;

	//---EXPLOSION---//
	expCurrentFrame = 0;
	expFrameDelay = 10;
	expCount = 0;
	exploded = false;
	isHit = false;


	constructor(x, y, enemyImage, explosion, points) {
		this.image = enemyImage;
		this.x = x;
		this.y = y;
		this.width = this.image.width / 2;
		this.height = this.image.height;
		this.points = points;
		this.padding = this.width < this.largestEnemyWidth / 2 ? (this.largestEnemyWidth / 2 - this.width) / 2 : 0; //Center up enemies
		//---EXPLOSION STUFF---//
		this.explosion = explosion;
		this.expWidth = (this.explosion.width / 4) - 1;
		this.expHeight = this.explosion.height;
		this.expFrames = this.explosion.width / this.expWidth;
		this.expXPadding = (this.width + this.padding - this.expWidth) / 2;
		this.expYPadding = (this.height - this.expHeight) / 2;

	}

	update(vx, vy) {
		this.x += vx;
		this.y += vy;
	}

	draw(ctx) {
		if (this.exploded) return;
		if (!this.isHit) {
			if (this.count >= this.delay) {
				this.count = 0;
				this.frame = this.frame === 1 ? 0 : 1;
			}
			this.count++;
			ctx.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, this.x + this.xOffset + this.padding, this.y + this.yOffset, this.width * this.scale, this.height * this.scale);
		} else {
			if (this.expCount >= this.expFrameDelay) {
				this.expCount = 0;
				this.expCurrentFrame++;
			}
			if (this.expCurrentFrame > this.expFrames) {
				this.exploded = true;
				return;
			}
			this.expCount++;
			ctx.drawImage(
				this.explosion,
				this.expCurrentFrame * this.expWidth,
				0,
				this.expWidth,
				this.expHeight,
				this.x + this.xOffset + this.expXPadding,
				this.y + this.yOffset + this.expYPadding,
				this.expWidth * this.scale,
				this.expHeight * this.scale
			);
		}
		////////////////////////////////////////////////////////////////////
		// -----SPRITEMAP DRAWING-----
		// ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, width, height);
		// sx, sy Clipping area begin
		// sWidth, sHeight Clipping area size
		// x, y Position on canvas
		// width, height Size of image, here's where scaling would be added
		////////////////////////////////////////////////////////////////////
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
