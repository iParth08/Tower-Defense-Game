import { ctx } from "./CanvasInit.js";
import { waypoints } from "./constant.js";
// import { waypoints } from "./level1.js";

// PLAYER i.e VILLAGE
class Village {
  constructor() {
    this.level = 1;
    this.health = 10;
    this.maxHealth = 10; //max health for min Village health [10-200]
    this.powerUps = {
      shield: { active: false, duration: 0, kill: 0 },
      dragon: { active: false, duration: 0, kill: 0 },
    };
  }
}
// ENEMY
class Enemy {
  constructor({ color = "red", position = { x: 0, y: 0 }, onDeath = null }) {
    this.position = position;
    this.width = 64;
    this.height = 64;
    this.radius = 32;
    this.color = color;
    this.waypointIndex = 0;
    this.level = 1;
    this.drop = 5; // [5-25] multiplier and Chance
    this.speed = 1; //min speed [1-6]
    this.health = 6;
    this.maxHealth = 6; //min health [6-60]
    this.attackPower = 4; // [4-20]
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.onDeath = onDeath;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    //health bar
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y - 20, this.width, 10);
    ctx.fillStyle = "green";
    ctx.fillRect(
      this.position.x,
      this.position.y - 20,
      (this.width / this.maxHealth) * this.health,
      10
    );
  }

  update() {
    this.draw();

    if (this.waypointIndex >= waypoints.length) {
      return; // No more waypoints to follow
    }

    const waypoint = waypoints[this.waypointIndex];
    const yDistance = waypoint.y - this.center.y;
    const xDistance = waypoint.x - this.center.x;

    const angle = Math.atan2(yDistance, xDistance);

    //speed and direction

    this.position.x += Math.cos(angle) * this.speed;
    this.position.y += Math.sin(angle) * this.speed;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };

    const distance = Math.hypot(xDistance, yDistance);
    if (distance < 5 && this.waypointIndex < waypoints.length - 1) {
      this.waypointIndex += 1;
      //   console.log(this.waypointIndex); //!log
    }
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    if (typeof this.onDeath === "function") {
      this.onDeath(); // Trigger the death callback
    }
  }
}

// PLACEMENT TILE
class PlacementTile {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.size = 64;
    this.color = "rgba(82, 191, 53, 0.2)";
    this.occupied = false;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
  }

  highlight(mouse) {
    this.draw(); //initial draw

    // collision detection
    if (
      mouse.x > this.position.x &&
      mouse.x < this.position.x + this.size &&
      mouse.y > this.position.y &&
      mouse.y < this.position.y + this.size
    ) {
      this.color = "rgba(82, 191, 53, 0.8)";
      this.draw();
      //   console.log("collision at :", mouse.x, mouse.y); //!log
      return true; //collision happened with this tile
    } else {
      this.color = "rgba(82, 191, 53, 0.2)";
    }
  }
}

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
    this.cost = 5;
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
}

// Projectiles
class Projectile {
  constructor({ position = { x: 0, y: 0 }, enemy, power }) {
    this.position = position;
    this.velocity = { x: 0, y: 0 };
    this.color = "yellow";
    this.radius = 10;
    this.enemy = enemy;
    this.speed = 5;
    this.power = power; //destructive power
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();

    const targetX = this.enemy.center.x - this.position.x;
    const targetY = this.enemy.center.y - this.position.y;

    const angle = Math.atan2(targetY, targetX);

    this.velocity.x = Math.cos(angle) * this.speed;
    this.velocity.y = Math.sin(angle) * this.speed;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

export { Village, Enemy, PlacementTile, Tower };
