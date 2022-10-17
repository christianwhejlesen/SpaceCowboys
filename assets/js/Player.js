/** @format */

export default class Player {
	//---VARIABLES--//
	shoot = false;
	doneLoadingAssets = false;
	numberOfAssets = 0;
	assets = null;

	assetsToLoad = [
		{ id: 1, var: 'image', src: '../assets/gfx/Player.png' },
	];

	constructor(canvas, bulletController, scale = 2, speed = 2) {
		this.vx = 0;
		this.scale = scale;
		this.speed = speed;
		this.canvas = canvas;
		this.defaultLives = 3;
		this.lives = this.defaultLives;
		this.bulletController = bulletController;
		this.loadAssets()
	}
	constructor2() {
		this.width = this.image.width;
		this.height = this.image.height;
		this.defaultX = this.canvas.width / 2 - (this.width * this.scale) / 2;
		this.x = this.defaultX;
		this.y = this.canvas.height - this.height * this.scale - 55;
	}

	newGame() {
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
		for (let i = 0; i < this.lives - 1; i++) {
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

	//-----ASSETSLOADER-----//
	loadAssets() {
		if (!this.assetsToLoad || this.assetsToLoad.length == 0) {
			this.constructor2();
			return;
		}
		if (this.assetsToLoad) {
			this.numberOfAssets = this.assetsToLoad.length;

			for (let i = 0; i < this.assetsToLoad.length; i++) {
				if (this.assetsToLoad[i].var != undefined) {
					this.beginLoadingImage(
						this.assetsToLoad[i].var,
						this.assetsToLoad[i].src);
				}
			}
		}
	}

	launchIfReady() {
		this.numberOfAssets--;
		if (this.numberOfAssets == 0) {
			this.constructor2();
		}
	}

	beginLoadingImage(imgVar, fileName) {
		eval(`this.${imgVar} = new Image();`);
		eval(`this.${imgVar}.src = '${fileName}';`);

		eval(`this.${imgVar}`).onload = () => this.launchIfReady();
	}
	//-----END OF ASSETSLOADER-----//
}
