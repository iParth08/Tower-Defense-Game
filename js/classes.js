import { ctx } from "./CanvasInit.js";
import { waypoints } from "./constant.js";
// import { waypoints } from "./level1.js";

// ENEMY
class Enemy {
  constructor({ color = "red", position = { x: 0, y: 0 } }) {
    this.position = position;
    this.width = 64;
    this.height = 64;
    this.color = color;
    this.waypointIndex = 0;
    this.speed = 1;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
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
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

export { Enemy, PlacementTile, Tower };
