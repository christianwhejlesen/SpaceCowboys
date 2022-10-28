/** @format */

export default class Obstacle {
   obstacle = [];
   scale = 1;
   destroyed = false;
   ready = false;

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
            this.obstacle = [...this.fullObstacle];
            this.width = this.fullObstacle[0].length * this.blockSize;
            this.height = this.fullObstacle.length * this.blockSize;
            this.ready = true;
         });
   }

   draw(ctx) {
      if (!this.ready) return;
      this.destroyed = this.countBlocks() !== 0 ? false : true;
      if (this.destroyed) return;
      for (let y = 0; y < this.obstacle.length; y++) {
         for (let x = 0; x < this.obstacle[y].length; x++) {
            ctx.fillStyle = this.color;
            if (this.obstacle[y][x] !== '#') continue;
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
      this.obstacle = [...this.fullObstacle];
   }

   checkBulletCollision() {
      if (!this.ready || this.destroyed) return;

      for (let y = 0; y < this.obstacle.length; y++) {
         if (!this.obstacle[y].includes('#')) continue;

         for (let x = 0; x < this.obstacle[y].length; x++) {
            if (this.obstacle[y][x] !== '#') continue;

            const object = {
               x: x * this.blockSize * this.scale + this.x,
               y: y * this.blockSize * this.scale + this.y,
               width: this.blockSize * this.scale,
               height: this.blockSize * this.scale,
               scale: this.scale,
            };

            if (this.enemyBC.collideWith(object) || this.playerBC.collideWith(object)) {
               this.obstacleHit(x, y, 3);
            }
         }
      }
   }

   obstacleHit(x, y, damage = 3) {
      const height = this.height / this.blockSize;
      const width = this.width / this.blockSize;
      let leftDamage = 0;
      let rightDamage = 0;
      let verticalDamage = 0;

      let left = function checkLeft(d) {
         if (x - d >= 0) {
            leftDamage = d;
         } else {
            checkLeft(d - 1);
         }
      };

      let right = function checkRight(d) {
         if (x + d <= width) {
            rightDamage = d;
         } else {
            checkRight(d - 1);
         }
      };

      let vertical = function checkVertical(d) {
         if (y + d <= height) {
            verticalDamage = d;
         } else {
            checkVertical(d - 1);
         }
      };
      vertical(damage);

      for (let innerY = 0; innerY < verticalDamage; innerY++) {
         left(damage - innerY);
         right(damage - innerY);
         let line = this.obstacle[y + innerY].split('');
         let newLine = '';

         for (let innerX = 0; innerX < leftDamage + rightDamage - 1; innerX++) {
            line[innerX + x - leftDamage] = ' ';
         }

         for (let i = 0; i < this.obstacle[0].length; i++) {
            newLine += line[i];
         }

         this.obstacle[y + innerY] = newLine;
      }
   }

   countBlocks() {
      let blocks = 0;
      for (let y = 0; y < this.obstacle.length; y++) {
         for (let x = 0; x < this.obstacle[y].length; x++) {
            if (this.obstacle[y][x] === '#') {
               blocks++;
            }
         }
      }
      return blocks;
   }
}
