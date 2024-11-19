import { ctx } from "../CanvasInit.js";
import { waypoints } from "../constant.js";
import Sprite from "./Sprite.js";

// ENEMY
class Enemy extends Sprite {
  constructor({ color = "red", position = { x: 0, y: 0 }, onDeath = null }) {
    super({
      position,
      imageSrc: "./assets/img/orc.png",
      frames: { max: 7, hold: 10 },
    });

    this.position = position;
    this.width = 64;
    this.height = 64;
    this.radius = 32;
    this.color = color;
    this.waypointIndex = 0;
    this.level = 1;
    this.drop = 5; // [5-25] multiplier and Chance
    this.speed = 1; //min speed [1-4]
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
    super.draw();
    super.animateFrames();

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

  die() {
    if (typeof this.onDeath === "function") {
      this.onDeath(); // Trigger the death callback
    }
  }
}

export default Enemy;
