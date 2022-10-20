/** @format */

import Obstacle from './Obstacle.js';

export default class ObstacleController {
	obstacles = [];
	obstacleYoffset = 433;
	obstacleBlockSize = 3;
	obstacleWidth = 22;
	obstacleHeight = 18;
	gamePaused = true;


	constructor(canvas, color, playerBC, enemyBC) {
		this.canvas = canvas;
		this.color = color;
		this.playerBC = playerBC;
		this.enemyBC = enemyBC;
		this.obstacleXoffset = ((this.canvas.width / 4) - (this.obstacleWidth * this.obstacleBlockSize)) / 2;
		this.obstacleGap = (this.canvas.width / 4);
		this.createObstacles();

	}

	draw(ctx) {
		this.obstacles.forEach((obstacle) => {
			if (!this.gamePaused) obstacle.checkBulletCollision();
			obstacle.draw(ctx)
		});
	}

	createObstacles() {
		for (let i = 0; i < 4; i++) {
			this.obstacles.push(new Obstacle(i * this.obstacleGap + this.obstacleXoffset,
				this.obstacleYoffset,
				this.color,
				this.playerBC,
				this.enemyBC,
				this.obstacleBlockSize));
		}
	}

	newGame() {
		this.resetGame();
	}

	resetGame() {
		this.obstacles.forEach((obstacle) => obstacle.reset());
	}

}
