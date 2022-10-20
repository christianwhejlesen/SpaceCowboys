/** @format */

//---IMPORTS---//
import Player from './Player.js';
import EnemyController from './EnemyController.js';
import BulletController from './BulletController.js';
import ScoreController from './ScoreController.js';
import ObstacleController from './ObstacleController.js';


//---SETUP---//
const container = document.getElementById('ITV').getBoundingClientRect();
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
// canvas.width = 800;
// canvas.height = 600;
canvas.width = container.width;
canvas.height = container.height;
const bg = new Image();
bg.src = '../assets/gfx/space.png';
let beginText = true;
const textIncrement = 1;
let fontSize = 0;
let gamePaused = true;

//---INSTANTIATIONS---//
const score = new ScoreController(canvas);
const playerBC = new BulletController(canvas, 5, 'red', false, '../assets/sfx/shoot.wav');
const player = new Player(canvas, playerBC);
const enemyBC = new BulletController(canvas, 3, 'white', false, '../assets/sfx/enemy-shoot.wav', 1);
const enemyController = new EnemyController(canvas, enemyBC, playerBC, score);
const obstacleController = new ObstacleController(canvas, 'limegreen', playerBC, enemyBC);

//Short form window.addEventListener
onkeydown = keyboardInput;
onkeyup = keyboardInput;
let keyPress = { key: '', type: '' };


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
		gamePaused = false;
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
	ctx.font = `${fontSize}px c64`;
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.fillText(text, canvas.width / 2, yOffset);
}


//---GAME LOOP---//
function game() {
	requestAnimationFrame(game);
	enemyController.gamePaused = gamePaused;
	obstacleController.gamePaused = gamePaused;
	draw(ctx);
	if (player.lives === 0) {
		printText('GAME OVER', 80, 240, 'red');
		printText('PRESS R', 40, 320, 'orange');
		printText('TO RESTART', 40, 355, 'orange');
		gamePaused = true;
		return;
	} else if (gamePaused) {
		printText('PRESS ENTER', 30, 260, 'orange');
		printText('TO', 30, 290, 'orange');
		printText('START', 30, 320, 'orange');
		printText('ARROW KEYS TO MOVE', 20, 390, 'limegreen');
		printText('SPACE TO FIRE', 20, 410, 'limegreen');
	} else {

		update();
	}
}


//---UPDATE---//
function update() {
	player.update(keyPress);
	enemyController.update();
	if (enemyBC.collideWith(player) || enemyController.collideWith(player)) {
		player.dies();
		if (player.lives !== 0) enemyController.resetGame();
	}
}


//---DRAW---//
function draw(ctx) {
	//clear screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Background
	ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

	//Player
	player.draw(ctx);

	//Scoreboard
	score.draw(ctx);

	//Enemies
	enemyController.draw(ctx);

	//Bullets
	playerBC.draw(ctx);
	enemyBC.draw(ctx);

	//Obstacle
	// obstacleController.draw(ctx);

	//Decorations
	ctx.fillStyle = 'darkred';
	ctx.fillRect(0, 530, canvas.width, 2);
}

//Wait for background image to load before continuing
bg.onload = () => game();