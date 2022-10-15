/** @format */

import OBSTACLE from '../json/obstacle.json' assert { type: 'json' };

export default class Obstacle {
	blockSize = 3;
	width = 66;
	height = 54;
	scale = 1;

	constructor(posX, posY, color) {
		this.state = 0;
		this.obstacle = OBSTACLE.state[this.state].map;
		this.x = posX;
		this.y = posY;
		this.color = color;
		this.destroyed = false;
	}

	draw(ctx) {
		if (this.destroyed) return;
		this.obstacle.forEach((column, y) => {
			column.forEach((row, x) => {
				ctx.fillStyle = this.color;
				if (row === '@') {
					ctx.fillRect(x * this.blockSize + this.x, y * this.blockSize + this.y, this.blockSize, this.blockSize);
				}
			});
		});
	}

	reset() {
		this.state = 0;
		this.destroyed = false;
		this.obstacle = OBSTACLE.state[this.state].map;
	}

	hit() {
		this.state++;
		if (this.state >= OBSTACLE.state.length) {
			this.destroyed = true;
			return;
		}

		this.obstacle = OBSTACLE.state[this.state].map;
	}
}
