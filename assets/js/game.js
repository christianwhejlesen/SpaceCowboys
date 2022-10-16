/** @format */
//---IMPORTS---//
import Player from './Player.js';
import EnemyController from './EnemyController.js';
import BulletController from './BulletController.js';
import ScoreController from './ScoreController.js';
import Obstacle from './Obstacle.js';
import ObstacleController from './ObstacleController.js';

//---SETUP---//
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const bg = new Image();
bg.src = '../assets/gfx/space.png';
canvas.width = canvas.height = 600;
let beginText = true;
const textIncrement = 1;
let fontSize = 0;
let gamePaused = true;

//Short form window.addEventListener
onkeydown = keyboardInput;
onkeyup = keyboardInput;
let keyPress = { key: '', type: '' };

//---INSTANTIATIONS---//
const score = new ScoreController(canvas);
const playerBC = new BulletController(canvas, 15, 'red', false, '../assets/sfx/shoot.wav');
const enemyBC = new BulletController(canvas, 3, 'white', false, '../assets/sfx/mixkit-short-laser-gun-shot-1670.wav', 1);
const enemyController = new EnemyController(canvas, enemyBC, playerBC, score);
const player = new Player(canvas, playerBC);
const obstacleController = new ObstacleController(canvas, 'yellowgreen', playerBC, enemyBC);

//---KEYPRESS LISTENER---//
function keyboardInput(event) {
	keyPress.key = event.key;
	keyPress.type = event.type;

	if (player.lives === 0 && keyPress.key == 'r') {
		keyPress = { key: '', type: '' };
		player.newGame();
		enemyController.newGame();
		obstacleController.newGame();
		score.newGame();
		gamePaused = true;
		beginText = true;
	} else if (gamePaused && keyPress.key == 'Enter' && player.lives !== 0) {
		gamePaused = false;
		beginText = true;
	}
}

//---LEVEL-TEXT---//
function printText(text, maxFontSize, yOffset, color) {
	if (beginText) {
		fontSize = 0;
		beginText = false;
	}
	fontSize = fontSize < maxFontSize ? fontSize + textIncrement : maxFontSize;
	ctx.fillStyle = color;
	ctx.font = `${fontSize}px Silkscreen`;
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.fillText(text, canvas.width / 2, yOffset);
}

//---GAME LOOP---//
function game() {
	requestAnimationFrame(game);
	enemyController.gamePaused = gamePaused;
	draw(ctx);
	if (player.lives === 0) {
		printText('GAME OVER', 80, 130, 'red');
		printText('PRESS R', 40, 200, 'red');
		printText('TO RESTART', 40, 270, 'red');
		gamePaused = true;
		return;
	} else if (gamePaused) {
		printText('ENTER', 40, 260, 'orange');
		printText('TO', 40, 300, 'lightblue');
		printText('START', 40, 340, 'lightgreen');
	}
	update();
}

//---UPDATE---//
function update() {
	player.update(keyPress);
	enemyController.update();
	if (enemyBC.collideWith(player) || enemyController.collideWith(player)) {
		player.dies();
		enemyController.reset();
	}
}

//---DRAW---//
function draw(ctx) {
	//clear screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Background
	ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

	//Scoreboard
	score.draw(ctx);

	//Enemies
	enemyController.draw(ctx);

	//Player
	player.draw(ctx);

	//Bullets
	playerBC.draw(ctx);
	enemyBC.draw(ctx);

	//Obstacle
	obstacleController.draw(ctx);

	//Decorations
	ctx.fillStyle = 'darkred';
	ctx.fillRect(0, 545, canvas.width, 2);
}

//Wait for background image to load before continuing
bg.onload = function () {
	game();
};

