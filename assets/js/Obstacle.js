/** @format */

export default class Obstacle {
	blockSize = 3;
	width = 66;
	height = 54;
	scale = 1;
	obstacleState = [];
	obstacle = [];
	state = 0;

	constructor(posX, posY, color) {
		this.x = posX;
		this.y = posY;
		this.color = color;
		this.destroyed = false;

		fetch('../assets/json/obstacle.json')
			.then(result => result.json())
			.then(json => {
				this.obstacleState = json;
				this.readyConstructor();
			});
	}

	readyConstructor() {
		this.obstacle = this.obstacleState.state[this.state].map;
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
		this.obstacle = this.obstacleState.state[this.state].map;
	}

	hit() {
		this.state++;
		if (this.state >= this.obstacleState.state.length) {
			this.destroyed = true;
			return;
		}

		this.obstacle = this.obstacleState.state[this.state].map;
	}
}
