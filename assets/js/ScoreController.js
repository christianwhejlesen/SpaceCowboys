/** @format */

export default class ScoreController {
	constructor(canvas, color = 'yellow') {
		this.canvas = canvas;
		this.score = 0;
		this.color = color;
		this.highscore = localStorage.getItem('spaceInvaders');
		this.fontSize = 0;
		if (this.highscore === null) {
			this.highscore = 0;
			localStorage.setItem('spaceInvaders', 0);
		}
	}

	update() {}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.font = '25px Silkscreen';
		ctx.textBaseline = 'top';
		ctx.textAlign = 'start';
		ctx.fillText('SCORE: ' + this.score, 5, 5);
		ctx.textAlign = 'end';
		ctx.fillText(`HIGHSCORE: ${this.highscore}`, this.canvas.width - 5, 5);
	}

	gameover(ctx) {
		if (this.score > this.highscore) {
			this.highscore = this.score;
			localStorage.setItem('spaceInvaders', this.score);
			this.score = 0;
		}
		ctx.fillStyle = 'white';
		this.fontSize = this.fontSize < 80 ? this.fontSize + 1 : this.fontSize;
		ctx.font = `${this.fontSize}px Silkscreen`;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.fillText('GAMEOVER', this.canvas.width / 2, this.canvas.height / 2);
	}
}
