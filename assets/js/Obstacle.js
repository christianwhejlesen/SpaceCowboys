/** @format */

import OBSTACLE from '../json/obstacle.json' assert { type: 'json' };

export default class Obstacle {
	constructor(posX, posY, blockSize = 3, color = 'red') {
		this.state = 0;
		this.obstacle = OBSTACLE.state[this.state].map;
		this.xOffset = posX;
		this.yOffset = posY;
		this.size = blockSize;
		this.color = color;
		this.destroyed = false;
	}

	draw(ctx) {
		if (this.destroyed) return;
		this.obstacle.forEach((column, y) => {
			column.forEach((row, x) => {
				ctx.fillStyle = this.color;
				if (row === 1) {
					ctx.fillRect(x * this.size + this.xOffset, y * this.size + this.yOffset, this.size, this.size);
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
