/** @format */

import Obstacle from './Obstacle.js';

export default class ObstacleController {
	obstacles = [];
	obstacleYoffset = 445;
	obstacleXoffset = 42;
	obstacleGap = 150;
	constructor(canvas, color, playerBC, enemyBC) {
		this.canvas = canvas;
		this.color = color;
		this.playerBC = playerBC;
		this.enemyBC = enemyBC;
		this.createObstacles();
	}

	draw(ctx) {
		this.checkBulletCollision();
		this.obstacles.forEach((obstacle) => obstacle.draw(ctx));
	}

	createObstacles() {
		for (let i = 0; i < 4; i++) {
			this.obstacles.push(new Obstacle(i * this.obstacleGap + this.obstacleXoffset, this.obstacleYoffset, this.color));
		}
	}

	checkBulletCollision() {
		this.obstacles.forEach((obstacle) => {
			if (!obstacle.destroyed) {
				if (this.playerBC.collideWith(obstacle) || this.enemyBC.collideWith(obstacle)) {
					// this.deathSound.currentTime = 0;
					// this.deathSound.play();
					obstacle.hit();
				}
			}
		});
	}

	newGame() {
		this.obstacles.forEach((obstacle) => obstacle.reset());
	}
}
