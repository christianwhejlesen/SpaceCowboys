/** @format */
import Enemy from './Enemy.js';
import Direction from './Direction.js';
import UFO from './UFO.js';

export default class EnemyController {
	//---VARIABLES--//
	enemyMap = [
		[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
		[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
		[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
	xOffset = 45;
	yOffset = 35;
	enemyArrayWidth = 0;
	gamePaused = true;
	doneLoadingAssets = false;
	numberOfAssets = 0;
	assets = null;
	level = 0;
	levelBumpY = 5;
	basePoint = 10;
	//UFO
	ufo = null;
	ufoVX = 0;
	readyForUFO = false;
	timeToUFO = 0;
	ufoOn = false;
	ufoYOffset = 35;
	ufoScale = 1.5;


	assetsToLoad = [
		{ id: 1, var: 'Invader_1', src: '../assets/gfx/Invader_1.png' },
		{ id: 2, var: 'Invader_2', src: '../assets/gfx/Invader_2.png' },
		{ id: 3, var: 'Invader_3', src: '../assets/gfx/Invader_3.png' },
		{ id: 4, var: 'Explosion', src: '../assets/gfx/Explosion.png' },
		{ id: 5, var: 'ufoImage', src: '../assets/gfx/UFO.png' },
	];

	constructor(canvas, enemyBC, playerBC, scoreController) {
		this.canvas = canvas;
		this.enemyBC = enemyBC;
		this.playerBC = playerBC;
		this.scoreController = scoreController;
		this.soundEnabled = this.enemyBC.soundEnabled;
		this.deathSound = new Audio('../assets/sfx/enemy-death.wav');
		this.deathSound.volume = 0.2;
		this.loadAssets();

	}

	//-----ASSETSLOADER-----//
	loadAssets() {
		if (!this.assetsToLoad || this.assetsToLoad.length == 0) {
			this.newGame();
			return;
		}
		if (this.assetsToLoad) {
			this.numberOfAssets = this.assetsToLoad.length;

			for (let i = 0; i < this.assetsToLoad.length; i++) {
				if (this.assetsToLoad[i].var != undefined) {
					this.beginLoadingImage(
						this.assetsToLoad[i].var,
						this.assetsToLoad[i].src);
				}
			}
		}
	}

	launchIfReady() {
		this.numberOfAssets--;
		if (this.numberOfAssets == 0) {
			this.newGame();
		}
	}

	beginLoadingImage(imgVar, fileName) {
		eval(`this.${imgVar} = new Image();`);
		eval(`this.${imgVar}.src = '${fileName}';`);

		eval(`this.${imgVar}`).onload = () => this.launchIfReady();
	}
	//-----END OF ASSETSLOADER-----//

	draw(ctx) {
		this.enemyRows.flat().forEach((enemy) => {
			this.vx = this.gamePaused ? 0 : this.vx;
			this.vy = this.gamePaused ? 0 : this.vy;
			enemy.update(this.vx, this.vy);
			enemy.draw(ctx);
		});

		if (this.ufo != null && !this.gamePaused) {
			this.ufo.draw(ctx);
		}
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
		if (this.enemyRows.length != 0) {
			if (this.enemyRows[0].some((object) => object.y + object.yOffset >= this.ufoYOffset + (this.ufoImage.height * this.ufoScale)) && !this.readyForUFO) {
				this.readyForUFO = true;
				this.timeToUFO = Math.floor((Math.random() * 1000) + 1);
				this.ufoVX = Math.floor((Math.random() * 4) + 1);
			}
			if (!this.ufoOn && this.readyForUFO && this.timeToUFO == 0) {
				this.generateUFO();
			}
			this.timeToUFO = this.readyForUFO ? (this.timeToUFO > 0 ? this.timeToUFO - 1 : this.timeToUFO) : this.timeToUFO;

		}

		if (this.ufo != null && this.ufo.exploded) {
			this.resetUFO();
		}

		this.checkBulletCollision();
		this.fireBullet();
	}

	resetGame() {
		this.ufo = null;
		this.readyForUFO = false;
		this.ufoOn = false;



		this.currentDirection = Direction.right;
		this.defaultVX = this.defaultVY = 1;
		this.clearBullets();
		this.createEnemies();
	}

	newGame() {
		this.enemyArrayWidth = 0;
		this.level = 0;
		this.resetGame();
	}
	generateUFO() {
		this.ufo = new UFO(this.canvas, this.ufoYOffset, this.ufoVX, this.ufoImage, this.Explosion, this.ufoScale)
		this.ufoOn = true;
	}

	resetUFO() {
		this.ufo = null;
		this.readyForUFO = false;
		this.ufoOn = false;
	}

	createEnemies() {

		this.enemyRows = [];
		this.enemyMap.forEach((row, rowIndex) => {
			this.enemyRows[rowIndex] = [];
			row.forEach((enemyNumber, enemyIndex) => {
				if (enemyNumber > 0) {
					this.enemyRows[rowIndex].push(new Enemy(enemyIndex * this.xOffset + this.enemyArrayWidth,
						rowIndex * this.yOffset + (this.level * this.levelBumpY), eval(`this.Invader_${enemyNumber}`), this.Explosion, enemyNumber * this.basePoint));
				}
			});
		});
		if (this.enemyArrayWidth === 0) {
			let rightmost = 0;
			for (const row of this.enemyRows) {
				rightmost = row[row.length - 1].x + row[row.length - 1].width > rightmost ? row[row.length - 1].x + row[row.length - 1].width : rightmost;
			}
			this.enemyArrayWidth = (this.canvas.width - rightmost) / 2;

			this.createEnemies();

		}
	}

	clearBullets() {
		this.vx = 0;
		this.vy = 0;
		this.enemyBC.bullets = [];
		this.playerBC.bullets = [];
	}

	fireBullet() {
		if (this.gamePaused || this.enemyRows == 0) return;
		this.bulletTimer -= this.dt;
		if (this.bulletTimer <= 0) {
			this.bulletTimer = this.bulletTimerDefault;
			const enemies = this.enemyRows.flat();
			const index = Math.floor(Math.random() * enemies.length);
			const currEnemy = enemies[index];
			this.enemyBC.shoot(currEnemy.x + currEnemy.width / 2, currEnemy.y + currEnemy.height, this.bulletSpeed);
		}
	}

	collideWith(object) {
		const collider = this.enemyRows.flat().findIndex((enemy) => enemy.collideWith(object));
		if (collider >= 0) {
			return true;
		}
		return false;
	}

	checkBulletCollision() {
		if (this.enemyRows != 0) {
			this.enemyRows.forEach((enemyRow) => {
				enemyRow.forEach((enemy, index) => {
					if (this.playerBC.collideWith(enemy)) {
						if (this.soundEnabled) {
							this.deathSound.currentTime = 0;
							this.deathSound.play();
						}
						// enemy.hit();
						enemy.isHit = true;
						this.scoreController.update(enemy.points);
					}
					if (enemy.exploded) {
						enemyRow.splice(index, 1);

					}
				});
			});
			this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
		}

		if (this.enemyRows.length == 0 && (this.ufo == null || this.ufo.x >= this.canvas.width || this.ufo.x < 0)) {
			this.level++;
			this.resetGame();
		}

		//UFO
		if (this.ufo == null) return;
		if (this.playerBC.collideWith(this.ufo)) {
			if (this.soundEnabled) {
				this.deathSound.currentTime = 0;
				this.deathSound.play();
			}
			this.ufo.isHit = true;
			this.scoreController.update(this.ufo.points);
		}
		if (this.ufo.exploded) {
			this.ufo = null;
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
			this.defaultVX += 0.1;
			this.defaultVY += 0.05;
			return;
		} else if (rightmost >= this.canvas.width && this.currentDirection === Direction.right) {
			this.defaultVX += 0.1;
			this.defaultVY += 0.05;
			this.currentDirection = newDirection;
			return;
		}
	}
}
