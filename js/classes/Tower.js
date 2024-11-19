import { ctx } from "../CanvasInit.js";
import Sprite from "./Sprite.js";

//Tower : Building
class Tower {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.width = 64 * 2;
    this.height = 64;
    this.color = "blue";
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.level = 1;
    this.cost = 10;
    this.projectiles = []; // active bullets
    this.rangeOfFire = 180; // min range [180-400]
    this.targetEnemy = null; //whom to kill
    this.frames = 0; //frameCount for projectile shoot rate
    this.rateOfFire = 100; // 1/100 frames
    this.attackForce = 2;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    //range of fire //todo: fill & remove
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.rangeOfFire, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.stroke();
  }

  update() {
    this.draw();

    if (this.frames % this.rateOfFire === 0 && this.targetEnemy)
      this.projectiles.push(
        new Projectile({
          position: { x: this.center.x, y: this.center.y },
          enemy: this.targetEnemy,
          power: this.attackForce,
        })
      );
    this.frames += 1;
  }

  // update() {
  //   this.draw();

  //   if (this.frames % this.rateOfFire === 0 && this.targetEnemy) {
  //     const projectileCount = 3; // Number of projectiles to fire
  //     const spreadAngle = 120; // Angle in degrees for spread effect

  //     for (let i = 0; i < projectileCount; i++) {
  //       const angleOffset = (i - Math.floor(projectileCount / 2)) * spreadAngle;

  //       this.projectiles.push(
  //         new Projectile({
  //           position: { x: this.center.x, y: this.center.y },
  //           enemy: this.targetEnemy,
  //           power: this.attackForce,
  //           angleOffset: angleOffset, // Optional: for spread-based behavior
  //         })
  //       );
  //     }
  //   }

  //   this.frames += 1;
  // }
}

// Projectiles
class Projectile extends Sprite {
  constructor({ position = { x: 0, y: 0 }, enemy, power }) {
    super({ position, imageSrc: "./assets/img/projectile.png" });
    this.position = position;
    this.velocity = { x: 0, y: 0 };
    this.color = "yellow";
    this.radius = 10;
    this.enemy = enemy;
    this.speed = 5;
    this.power = power; //destructive power
  }

  // draw() {
  //   ctx.beginPath();
  //   ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
  //   ctx.fillStyle = this.color;
  //   ctx.fill();
  // }

  update() {
    // this.draw();
    super.draw();

    const targetX = this.enemy.center.x - this.position.x;
    const targetY = this.enemy.center.y - this.position.y;

    const angle = Math.atan2(targetY, targetX);

    this.velocity.x = Math.cos(angle) * this.speed;
    this.velocity.y = Math.sin(angle) * this.speed;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

export default Tower;
