/** @format */
import Enemy from './Enemy.js';
import Direction from './Direction.js';

export default class EnemyController {
	//---VARIABLES--//
	enemyMap = [
		[2, 2, 2, 2, 2, 2, 2],
		[1, 1, 2, 2, 2, 1, 1],
		[1, 1, 1, 1, 1, 1, 1],
		[3, 3, 3, 3, 3, 3, 3],
		[0, 1, 3, 3, 3, 1, 0],
	];

	vx = 0;
	vy = 0;
	defaultVX = 1;
	defaultVY = 1;
	bulletSpeed = -3;
	currentDirection = Direction.right;
	moveTimerDefault = 1.5;
	moveTimer = this.moveTimerDefault;
	bulletTimerDefault = 5.0;
	bulletTimer = this.bulletTimerDefault;
	dt = 60 / 1000;
	enemyRows = [];

	constructor(canvas, bulletController, playerBC, scoreController) {
		this.canvas = canvas;
		this.bulletController = bulletController;
		this.playerBC = playerBC;
		this.scoreController = scoreController;
		this.deathSound = new Audio('../assets/sfx/enemy-death.wav');
		this.deathSound.volume = 0.2;
		this.createEnemies(); //TODO Change to this.newGame() when finished, seems to fix the reload problem
	}

	draw(ctx) {
		this.enemyRows.flat().forEach((enemy) => {
			enemy.update(this.vx, this.vy);
			enemy.draw(ctx);
		});
	}

	createEnemies() {
		this.enemyMap.forEach((row, rowIndex) => {
			this.enemyRows[rowIndex] = [];
			row.forEach((enemyNumber, enemyIndex) => {
				if (enemyNumber > 0) {
					this.enemyRows[rowIndex].push(new Enemy(enemyIndex * 50, rowIndex * 35, enemyNumber));
				}
			});
		});
	}

	clearBullets() {
		this.vx = 0;
		this.vy = 0;
		this.bulletController.bullets = [];
		this.playerBC.bullets = [];
	}
	reset() {
		this.currentDirection = Direction.right;
		this.clearBullets();
		this.createEnemies();
	}

	newGame() {
		this.defaultVX = this.defaultVY = 1;
		this.reset;
	}

	update() {
		//Update velocity and direction of enemies.
		for (const enemyRow of this.enemyRows) {
			switch (this.currentDirection) {
				case Direction.right:
					this.checkBoundaries(enemyRow, Direction.rightDown);
					this.vx = this.defaultVX;
					this.vy = 0;
					break;
				case Direction.left:
					this.checkBoundaries(enemyRow, Direction.leftDown);
					this.vx = -this.defaultVX;
					this.vy = 0;
					break;
				case Direction.rightDown:
					this.checkMoveTimer(Direction.left);
					this.vx = 0;
					this.vy = this.defaultVY;
					break;
				case Direction.leftDown:
					this.checkMoveTimer(Direction.right);
					this.vx = 0;
					this.vy = this.defaultVY;
					break;
			}
		}

		this.checkBulletCollision();
		this.fireBullet();
	}

	collideWith(object) {
		const collider = this.enemyRows.flat().findIndex((enemy) => enemy.collideWith(object));
		if (collider >= 0) {
			return true;
		}
		return false;
	}

	fireBullet() {
		this.bulletTimer -= this.dt;
		if (this.bulletTimer <= 0) {
			this.bulletTimer = this.bulletTimerDefault;
			const enemies = this.enemyRows.flat();
			const index = Math.floor(Math.random() * enemies.length);
			const currEnemy = enemies[index];
			this.bulletController.shoot(currEnemy.x + currEnemy.width / 2, currEnemy.y + currEnemy.height, this.bulletSpeed);
		}
	}

	checkBulletCollision() {
		this.enemyRows.forEach((enemyRow) => {
			enemyRow.forEach((enemy, index) => {
				if (this.playerBC.collideWith(enemy)) {
					this.deathSound.currentTime = 0;
					this.deathSound.play();
					enemyRow.splice(index, 1);
					this.scoreController.update(50);
				}
			});
		});
		this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
		if (this.enemyRows.length == 0) {
			this.reset();
			this.defaultVX += 0.3;
			this.defaultVY += 0.3;
		}
	}

	checkMoveTimer(newDirection) {
		this.moveTimer -= this.dt;
		if (this.moveTimer > 0 || this.currentDirection === newDirection) return;
		this.moveTimer = this.moveTimerDefault;
		this.currentDirection = newDirection;
	}

	checkBoundaries(row, newDirection) {
		const leftmost = row[0].x;
		const rightmost = row[row.length - 1].x + row[row.length - 1].width;

		if (leftmost <= 0 && this.currentDirection === Direction.left) {
			this.currentDirection = newDirection;
			return;
		} else if (rightmost >= this.canvas.width && this.currentDirection === Direction.right) {
			this.currentDirection = newDirection;
			return;
		}
	}
}
