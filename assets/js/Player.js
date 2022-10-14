/** @format */

export default class Player {
	//---VARIABLES--//
	shoot = false;

	constructor(canvas, bulletController, scale = 2, speed = 2) {
		this.image = new Image();
		this.image.src = '../assets/gfx/Player.png';
		this.vx = 0;
		this.scale = scale;
		this.speed = speed;
		this.canvas = canvas;
		this.width = this.image.width;
		this.height = this.image.height;
		this.defaultLives = 3;
		this.lives = this.defaultLives;
		this.bulletController = bulletController;
		this.defaultX = canvas.width / 2 - (this.width * this.scale) / 2;
		this.x = this.defaultX;
		this.y = canvas.height - this.height * this.scale - 70;
	}

	reset() {
		this.vx = 0;
		this.x = this.defaultX;
		this.lives = this.defaultLives;
		this.bulletController.bullets = [];
		this.shoot = false;
	}

	dies() {
		this.vx = 0;
		this.x = this.defaultX;
		this.lives--;
	}

	update(keyboard) {
		this.input(keyboard);
		this.checkBoundaries();
		this.shootBullet();
		this.x += this.vx * this.speed;
	}

	checkBoundaries() {
		if (this.x < 0) {
			this.x = 0;
		} else if (this.x + this.width * this.scale > this.canvas.width) {
			this.x = this.canvas.width - this.width * this.scale;
		}
	}

	draw(ctx) {
		ctx.drawImage(this.image, this.x, this.y, this.width * this.scale, this.height * this.scale);
		for (let i = 0; i < this.lives; i++) {
			ctx.drawImage(this.image, i * 30 + 10, 560, this.width, this.height);
		}
	}

	shootBullet() {
		if (this.shoot) {
			this.bulletController.shoot(this.x + (this.width * this.scale) / 2, this.y, 4, 10);
		}
	}

	input(keyboard) {
		switch (keyboard.key) {
			case 'ArrowLeft':
				this.vx = keyboard.type == 'keydown' ? -1 : 0;
				break;
			case 'ArrowRight':
				this.vx = keyboard.type == 'keydown' ? 1 : 0;
				break;
			case ' ':
				this.shoot = keyboard.type === 'keydown' ? true : false;
				break;
		}
	}
}
