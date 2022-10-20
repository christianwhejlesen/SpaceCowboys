/** @format */

export default class Obstacle {
	obstacle = [];
	scale = 1;
	destroyed = false;

	constructor(posX, posY, color, playerBC, enemyBC, blockSize = 3) {
		this.x = posX;
		this.y = posY;
		this.color = color;
		this.playerBC = playerBC;
		this.enemyBC = enemyBC;
		this.blockSize = blockSize;

		fetch('../assets/json/obstacle.json')
			.then(result => result.json())
			.then(json => {
				this.fullObstacle = json;
				this.obstacle = this.fullObstacle;
				this.width = this.fullObstacle.map[0].length * this.blockSize;
				this.height = this.fullObstacle.map.length * this.blockSize;
			});
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
		this.destroyed = false;
		this.obstacle = this.fullObstacle;
	}

	// hit() {
	// 	this.state++;
	// 	if (this.state >= this.obstacleStates.state.length) {
	// 		this.destroyed = true;
	// 		return;
	// 	}

	// 	this.obstacle = this.obstacleStates.state[this.state].map;
	// }

	checkBulletCollision() {
		this.obstacle.forEach((row) => {
			if (!obstacle.destroyed) {
				if (this.playerBC.collideWith(obstacle) || this.enemyBC.collideWith(obstacle)) {
					obstacle.hit();
				}

			}
			if (!this.c) {
				obstacle.map.forEach((row) => {
					let rowChar = '';
					row.forEach((col) => {
						rowChar += col;
					});
					console.log(rowChar);
				});
				this.c = true;
			}
		});
	}

}
