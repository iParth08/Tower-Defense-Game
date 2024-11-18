import { waypoints, placementTilesData } from "./constant.js";

const canvasCreate = () => {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d"); //contextAPI
  canvas.width = 1280;
  canvas.height = 768; //pixel

  console.log(ctx);

  //drawing a rectangle
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // OBJECTS :
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
        console.log(this.waypointIndex);
      }
    }
  }

  //spawn enemies
  const enemies = [];
  const enemyColors = ["purple", "yellow", "blue", "green", "orange", "pink"];

  function spawnEnemies(spawnCount, spawnDelay) {
    let spawnIndex = 0;

    const spawnInterval = setInterval(() => {
      if (spawnIndex >= spawnCount) {
        clearInterval(spawnInterval); // Stop spawning after reaching count
        return;
      }

      const color = enemyColors[spawnIndex % enemyColors.length]; // Rotate through colors
      const positionOffset = spawnIndex * 150; // Offset for starting position

      const enemy = new Enemy({
        color,
        position: {
          x: waypoints[0].x - positionOffset,
          y: waypoints[0].y,
        },
      });

      enemies.push(enemy);
      spawnIndex++;
    }, spawnDelay);
  }
  //animation
  function animation() {
    requestAnimationFrame(animation); //recursive loop
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
    enemies.forEach((enemy) => enemy.update());
  }

  //setting a map image
  const mapImage = new Image();
  mapImage.src = "./public/img/gameMap.png";

  mapImage.onload = () => {
    animation();
    spawnEnemies(5, 1000); // Spawn 10 enemies in 2 second
  };
};

export default canvasCreate;
