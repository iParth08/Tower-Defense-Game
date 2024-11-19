import { ctx } from "../CanvasInit.js";

//Parent Class for all Sprites
class Sprite {
  constructor({
    position = { x: 0, y: 0 },
    imageSrc,
    frames = { max: 1, hold: 10 },
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.frames = {
      max: frames.max,
      current: 0,
      elapsed: 0,
      hold: frames.hold,
    };
    this.offset = offset;
  }

  draw() {
    this.crop();
  }

  crop() {
    const cropWidth = this.image.width / this.frames.max;

    const crop = {
      position: {
        x: cropWidth * this.frames.current,
        y: 0,
      },
      height: this.image.height,
      width: cropWidth,
    };

    //croping api
    ctx.drawImage(
      this.image,
      crop.position.x,
      crop.position.y,
      crop.width,
      crop.height,
      this.position.x + this.offset.x,
      this.position.y + this.offset.y,
      //set width & height or scale here
      crop.width,
      crop.height
    );
  }

  animateFrames() {
    this.frames.elapsed++;

    if (this.frames.elapsed % this.frames.hold === 0) {
      this.frames.current++;
      if (this.frames.current >= this.frames.max) this.frames.current = 0;
    }
  }
}

export default Sprite;
