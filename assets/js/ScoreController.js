/** @format */

export default class ScoreController {
	constructor(canvas, color = 'yellow') {
		this.canvas = canvas;
		this.score = 0;
		this.color = color;
		this.highscore = localStorage.getItem('spaceInvaders');
		if (this.highscore === null) {
			this.highscore = 0;
			localStorage.setItem('spaceInvaders', 0);
		}
	}

	update(amount) {
		this.score += amount;
		if (this.score > this.highscore) {
			this.highscore = this.score;
			localStorage.setItem('spaceInvaders', this.score);
		}
	}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.font = '25px c64';
		ctx.textBaseline = 'top';
		ctx.textAlign = 'start';
		ctx.fillText('SCORE: ' + this.score, 15, 10);
		ctx.textAlign = 'end';
		ctx.fillText(`HIGHSCORE: ${this.highscore}`, this.canvas.width - 15, 10);
	}

	newGame() {
		this.score = 0;
	}
}
