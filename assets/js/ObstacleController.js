/** @format */

import Obstacle from './Obstacle.js';

export default class ObstacleController {
	obstacles = [];
	obstacleYoffset = 445;
	obstacleBlockSize = 3;
	obstacleWidth = 22;
	obstacleHeight = 18;


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
		this.checkBulletCollision();
		this.obstacles.forEach((obstacle) => obstacle.draw(ctx));
	}

	createObstacles() {
		for (let i = 0; i < 4; i++) {
			this.obstacles.push(new Obstacle(i * this.obstacleGap + this.obstacleXoffset, this.obstacleYoffset, this.color, this.obstacleBlockSize));
		}
	}

	checkBulletCollision() {
		this.obstacles.forEach((obstacle) => {
			if (!obstacle.destroyed) {
				if (this.playerBC.collideWith(obstacle) || this.enemyBC.collideWith(obstacle)) {
					this.deathSound.currentTime = 0;
					this.deathSound.play();
					obstacle.hit();
				}

			}
		});
	}

	newGame() {
		this.obstacles.forEach((obstacle) => obstacle.reset());
	}
}
