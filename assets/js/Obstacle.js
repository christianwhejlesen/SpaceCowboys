/** @format */

export default class Obstacle {
	obstacleStates = [];
	obstacle = [];
	state = 0;

	constructor(posX, posY, color, blockSize = 3) {
		this.x = posX;
		this.y = posY;
		this.color = color;
		this.blockSize = blockSize;
		this.destroyed = false;

		fetch('../assets/json/obstacle.json')
			.then(result => result.json())
			.then(json => {
				this.obstacleStates = json;
				this.readyConstructor();
			});
	}

	readyConstructor() {
		this.obstacle = this.obstacleStates.state[this.state].map;

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
		this.obstacle = this.obstacleStates.state[this.state].map;
	}

	hit() {
		this.state++;
		if (this.state >= this.obstacleStates.state.length) {
			this.destroyed = true;
			return;
		}

		this.obstacle = this.obstacleStates.state[this.state].map;
	}
}
