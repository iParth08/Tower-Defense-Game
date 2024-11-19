import { ctx } from "../CanvasInit.js";
import Sprite from "./Sprite.js";

//Tower : Building
class Tower extends Sprite {
  constructor({ position = { x: 0, y: 0 } }) {
    super({
      position,
      imageSrc: "./assets/img/tower.png",
      frames: { max: 19, hold: 10 },
      offset: { x: 0, y: -80 },
    });
    this.width = 64 * 2;
    this.height = 64;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.cost = 10;
    this.projectiles = []; // active bullets
    this.rangeOfFire = 180; // min range [180-400]
    this.targetEnemy = null; //whom to kill
    this.attackForce = 2;
  }

  draw() {
    super.draw();
    if (this.targetEnemy || (!this.targetEnemy && this.frames.current != 0))
      super.animateFrames();

    //fixme: where you require to test
    // this.drawRange();
  }

  drawRange() {
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.rangeOfFire, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
    ctx.fill();
  }

  update() {
    this.draw();

    if (
      this.frames.current === 6 &&
      this.targetEnemy &&
      this.frames.elapsed % this.frames.hold === 0
    ) {
      this.shoot();
    }
  }

  shoot() {
    this.projectiles.push(
      new Projectile({
        position: {
          x: this.center.x - 22,
          y: this.center.y + this.offset.y - 30,
        },
        enemy: this.targetEnemy,
        power: this.attackForce,
      })
    );
  }
}

// Projectiles
class Projectile extends Sprite {
  constructor({ position = { x: 0, y: 0 }, enemy, power }) {
    super({
      position,
      imageSrc: "./assets/img/projectile.png",
      frames: { max: 1 },
    });

    this.velocity = { x: 0, y: 0 };
    this.color = "yellow";
    this.radius = 10;
    this.enemy = enemy;
    this.speed = 5;
    this.power = power; //destructive power
  }

  update() {
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
