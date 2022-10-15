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
const textIncrement = 2;
let fontSize = 0;

//Short form window.addEventListener
onkeydown = keyboardInput;
onkeyup = keyboardInput;
let keyPress = { key: '', type: '' };

//---INSTANTIATIONS---//
const score = new ScoreController(canvas);
const playerBC = new BulletController(canvas, 5, 'red', true, '../assets/sfx/shoot.wav');
const enemyBC = new BulletController(canvas, 3, 'white', true, '../assets/sfx/mixkit-short-laser-gun-shot-1670.wav', 1);
const enemyController = new EnemyController(canvas, enemyBC, playerBC, score);
const player = new Player(canvas, playerBC);
const obstacleController = new ObstacleController(canvas, 'yellowgreen', playerBC, enemyBC);

//---KEYPRESS LISTENER---//
function keyboardInput(event) {
	keyPress.key = event.key;
	keyPress.type = event.type;

	if (player.lives === 0 && keyPress.key == 'Enter') {
		keyPress = { key: '', type: '' };
		player.reset();
		enemyController.newGame();
		beginText = true;
	}
}

//---GAME LOOP---//
function game(dt) {
	requestAnimationFrame(game);
	draw(ctx);
	if (player.lives === 0) {
		printText('GAMEOVER', true);
		return;
	}
	update();
}

//---LEVEL-TEXT---//
function printText(text, forwards) {
	if (beginText) {
		fontSize = forwards ? 0 : 300;
		beginText = false;
	}
	if (forwards) {
		fontSize = fontSize < 80 ? fontSize + textIncrement : fontSize;
	} else {
		fontSize = fontSize > 0 ? fontSize - textIncrement : fontSize;
	}
	ctx.fillStyle = 'red';
	ctx.font = `${fontSize}px Silkscreen`;
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

//---UPDATE---//
function update(dt) {
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
