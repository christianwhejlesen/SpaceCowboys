/** @format */
//---IMPORTS---//
import Player from './Player.js';
import EnemyController from './EnemyController.js';
import BulletController from './BulletController.js';
import ScoreController from './ScoreController.js';
// import Obstacle from './Obstacle.js';

//---SETUP---//
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const bg = new Image();
bg.src = '../assets/gfx/space.png';
canvas.width = canvas.height = 600;

//---INSTANTIATIONS---//
const playerBC = new BulletController(canvas, 5, 'red', true, '../assets/sfx/shoot.wav');
const enemyBC = new BulletController(canvas, 3, 'white', false, '../assets/sfx/mixkit-short-laser-gun-shot-1670.wav', 1);
const enemyController = new EnemyController(canvas, enemyBC, playerBC);
const player = new Player(canvas, playerBC);
const score = new ScoreController(canvas);
// const obstacle = new Obstacle(50, 420);

//---GAME LOOP---//
function game(dt) {
	requestAnimationFrame(game);
	draw(ctx);
	if (player.lives === 0) {
		score.gameover(ctx);
		return;
	}
	update(dt);
}

//---UPDATE---//
function update(dt) {
	player.update();
	// enemyController.update();
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
	// obstacle.draw(ctx);

	//Decorations
	ctx.fillStyle = 'darkred';
	ctx.fillRect(0, 545, canvas.width, 2);
}

//Wait for background image to load before continuing
bg.onload = function () {
	game();
};
