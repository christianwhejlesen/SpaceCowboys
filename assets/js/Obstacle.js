/** @format */

export default class Obstacle {
   obstacle = [];
   scale = 1;
   destroyed = false;
   ready = false;
   totalBlocks = 0;

   constructor(posX, posY, color, playerBC, enemyBC, blockSize = 3) {
      this.x = posX;
      this.y = posY;
      this.color = color;
      this.playerBC = playerBC;
      this.enemyBC = enemyBC;
      this.blockSize = blockSize;

      fetch('../assets/json/obstacle.json')
         .then((result) => result.json())
         .then((json) => {
            this.fullObstacle = json;
            this.obstacle = this.fullObstacle;
            this.width = this.fullObstacle.map[0].length * this.blockSize;
            this.height = this.fullObstacle.map.length * this.blockSize;
            this.totalBlocks = this.countBlocks();
            this.ready = true;
         });
   }

   draw(ctx) {
      if (!this.ready) return;
      this.destroyed = this.totalBlocks !== 0 ? false : true;
      if (this.destroyed) return;
      for (let y = 0; y < this.obstacle.map.length; y++) {
         for (let x = 0; x < this.obstacle.map[y].length; x++) {
            ctx.fillStyle = this.color;
            if (this.obstacle.map[y][x] !== '#') continue;
            ctx.fillRect(
               x * this.blockSize * this.scale + this.x,
               y * this.blockSize * this.scale + this.y,
               this.blockSize * this.scale,
               this.blockSize * this.scale
            );
         }
      }
   }

   reset() {
      this.destroyed = false;
      this.obstacle = this.fullObstacle;
      this.totalBlocks = this.countBlocks();
   }

   // hit() {
   // 	this.state++;
   // 	if (this.state >= this.obstacleStates.state.length) {
   // 		this.destroyed = true;
   // 		return;
   // 	}

   // 	this.obstacle = this.obstacleStates.state[this.state].map;
   // }

   checkBulletCollision() {
      // TODO: Change this so that it checks individual blocks
      if (!this.ready || this.destroyed) return;
      let object = {};
      for (let y = 0; y < this.obstacle.map.length; y++) {
         for (let x = 0; x < this.obstacle.map[y].length; x++) {
            object = {
               x: x * this.blockSize * this.scale + this.x,
               y: y * this.blockSize * this.scale + this.y,
               width: this.blockSize * this.scale,
               height: this.blockSize * this.scale,
               scale: this.scale,
            };
         }
      }
   }

   countBlocks() {
      let blocks = 0;
      for (let y = 0; y < this.obstacle.map.length; y++) {
         for (let x = 0; x < this.obstacle.map[y].length; x++) {
            if (this.obstacle.map[y][x] === '#') {
               blocks++;
            }
         }
      }
      return blocks;
   }
}
