/** @format */
import Bullet from './Bullet.js';

export default class BulletController {
	bullets = [];
	gapBetweenBullets = 0;

	constructor(canvas, maxBullets, color, soundEnabled, soundBit, volume = 0.2) {
		this.canvas = canvas;
		this.maxBullets = maxBullets;
		this.color = color;
		this.soundEnabled = soundEnabled;
		this.sound = new Audio(soundBit);
		this.sound.volume = volume;
	}

	draw(ctx) {
		this.bullets.forEach((bullet) => bullet.draw(ctx));
		this.removeBullet();
		this.gapBetweenBullets = this.gapBetweenBullets > 0 ? this.gapBetweenBullets - 1 : this.gapBetweenBullets;
	}

	shoot(x, y, vy, gapBetweenBullets = 0) {
		if (this.gapBetweenBullets <= 0 && this.bullets.length < this.maxBullets) {
			const bullet = new Bullet(this.canvas, x, y, vy, this.color);
			this.bullets.push(bullet);
			if (this.soundEnabled) {
				this.sound.currentTime = 0;
				this.sound.play();
			}
			this.gapBetweenBullets = gapBetweenBullets;
		}
	}

	removeBullet() {
		this.bullets = this.bullets.filter((bullet) => bullet.y + bullet.height > 0 && bullet.y <= this.canvas.height);
	}

	collideWith(object) {
		const collider = this.bullets.findIndex((bullet) => {
			bullet.collideWith(object);
		});
		if (collider >= 0) {
			this.bullets.splice(collider, 1);
			return true;
		}
		return false;
	}
}
