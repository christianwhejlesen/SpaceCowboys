export default class UFO {
    isHit = false;

    //---EXPLOSION---//
    expCurrentFrame = 0;
    expFrameDelay = 5;
    expCount = 0;
    exploded = false;


    constructor(canvas, y, vx, image, explosion, scale) {
        this.canvas = canvas;
        this.scale = scale;
        this.y = y;
        this.image = image;
        this.width = this.image.width;
        this.defaultX = Math.random() < 0.5 ? -(this.width * this.scale) : (this.width * this.scale) + canvas.width;
        this.vx = this.defaultX < 0 ? vx : -vx;
        this.x = this.defaultX;
        this.height = this.image.height;
        this.explosion = explosion;
        this.expWidth = this.explosion.width / 4;
        this.expHeight = this.explosion.height;
        this.expFrames = (this.explosion.width / this.expWidth) - 1;
        this.expXPadding = (this.width * this.scale - this.expWidth) / 2;
        this.expYPadding = (this.height * this.scale - this.expHeight) / 2;
        this.points = Math.abs(Math.floor((Math.random() * 300) + 100) * this.vx);
        this.pointsX = (this.expWidth / 2) + this.expXPadding;
        this.pointsY = (this.expHeight / 2) + this.expYPadding;
    }

    draw(ctx) {
        if (this.exploded) return;
        if (!this.isHit) {
            ctx.drawImage(this.image, this.x, this.y, this.width * this.scale, this.height * this.scale);
            this.x = this.x >= (this.canvas.width * 1.5) + this.width * this.scale ? this.defaultX : this.x + this.vx;
        } else {
            if (this.expCount >= this.expFrameDelay) {
                this.expCount = 0;
                this.expCurrentFrame++;
            }
            if (this.expCurrentFrame > this.expFrames) {
                this.exploded = true;
                return;
            }
            this.expCount++;
            ctx.drawImage(
                this.explosion,
                this.expCurrentFrame * this.expWidth,
                0,
                this.expWidth,
                this.expHeight,
                this.x + this.expXPadding,
                this.y + this.expYPadding,
                this.expWidth * this.scale,
                this.expHeight * this.scale
            );
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '20px Silkscreen';
            ctx.fillText(this.points, this.x + this.pointsX, this.y + this.pointsY);
            ctx.restore();
        }

    }

}
