import { ctx } from "../CanvasInit.js";

//Parent Class for all Sprites
// class Sprite {
//   constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
//     this.position = position;
//     this.image = new Image();
//     this.image.src = imageSrc;
//     this.scale = scale;
//     this.framesMax = framesMax;
//     this.framesCurrent = 0;
//     this.framesElapsed = 0;
//     this.framesHold = 10;
//     this.offset = { x: 0, y: 0 };
//   }

//   draw() {
//     ctx.drawImage(
//       this.image,
//       this.framesCurrent * (this.image.width / this.framesMax),
//       0,
//       this.image.width / this.framesMax,
//       this.image.height,
//       this.position.x - this.offset.x,
//       this.position.y - this.offset.y,
//       (this.image.width / this.framesMax) * this.scale,
//       this.image.height * this.scale
//     );
//   }

//   animateFrames() {
//     this.framesElapsed += 1;

//     if (this.framesElapsed % this.framesHold === 0) {
//       if (this.framesCurrent < this.framesMax - 1) this.framesCurrent += 1;
//       else this.framesCurrent = 0;
//     }
//   }
// }

class Sprite {
  constructor({ position = { x: 0, y: 0 }, imageSrc, framesMax = 1 }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

export default Sprite;
