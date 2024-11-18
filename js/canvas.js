import { ctx, canvas } from "./CanvasInit.js";
import { Enemy, PlacementTile, Tower } from "./classes.js";
import { mapImagePath, waypoints, placementTilesData } from "./constant.js";
// import { mapImagePath, waypoints, placementTilesData } from "./level1.js";

const canvasCreate = () => {
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

  //setting a map image
  const mapImage = new Image();
  mapImage.src = mapImagePath;

  //setting placement tiles

  const placementTilesData2D = [];
  const palcementTilesArray = [];

  for (let i = 0; i < placementTilesData.length; i += 20) {
    placementTilesData2D.push(placementTilesData.slice(i, i + 20));
  }

  placementTilesData2D.forEach((row, rowIndex) => {
    row.forEach((tile, tileIndex) => {
      if (tile === 14) {
        const placementTile = new PlacementTile({
          position: {
            x: tileIndex * 64,
            y: rowIndex * 64,
          },
        });
        palcementTilesArray.push(placementTile);
      }
    });
  });

  //Building Tower
  const buildings = [];
  let activeTile = undefined;

  //animation : Blood of the game
  function animation() {
    requestAnimationFrame(animation); //recursive loop

    //clear canvas for each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw the map image after cleanup
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

    //spawn enemies, movement of enemies
    enemies.forEach((enemy) => enemy.update());

    //testing : placement tiles
    palcementTilesArray.forEach((tile) => tile.highlight(mouse));

    //draw towers
    buildings.forEach((building) => building.draw());
  }

  // Game loop : Here Begins it all
  mapImage.onload = () => {
    animation();
    spawnEnemies(5, 1000); // Spawn 10 enemies in 2 second
  };

  //*********************** EVENT LISTENER ********************

  const mouse = { x: undefined, y: undefined };
  window.addEventListener("mousemove", (e) => {
    // console.log(e.clientX, e.clientY); //!log
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    //check for active placement tile
    activeTile = null; //clear active tile
    for (let i = 0; i < palcementTilesArray.length; i++) {
      const tile = palcementTilesArray[i];
      if (tile.highlight(mouse)) {
        activeTile = tile;
        break;
      }
    }
    // console.log("active tile collision :", activeTile); //!logs
  });

  canvas.addEventListener("click", (e) => {
    if (activeTile && !activeTile.isOccupied) {
      const building = new Tower({ position: activeTile.position });
      buildings.push(building);
      activeTile.isOccupied = true;
      console.log("Tower Built");
    }
  });
};

export default canvasCreate;
