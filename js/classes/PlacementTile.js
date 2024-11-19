import { ctx } from "../CanvasInit.js";

// PLACEMENT TILE
class PlacementTile {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.size = 64;
    this.color = "rgba(255, 255, 255, 0.1)";
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
      this.color = "rgba(82, 191, 53, 0.4)";
      this.draw();
      //   console.log("collision at :", mouse.x, mouse.y); //!log
      return true; //collision happened with this tile
    } else {
      this.color = "rgba(255, 255, 255, 0.1)";
    }
  }
}

export default PlacementTile;
