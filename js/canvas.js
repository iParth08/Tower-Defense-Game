import {
  ctx,
  canvas,
  gameOverScreen,
  levelCompleteScreen,
} from "./CanvasInit.js";
import {
  Enemy,
  PlacementTile,
  Tower,
  Village,
  Sprite,
} from "./classes/index.js";
import {
  mapImagePath,
  waypoints,
  placementTilesData,
} from "./data/tutorial.js";

let stopGame = false;
let waveCount = 2; // for tutorial [3-10]
const enemyPerWave = 2; // leve1 wave1
const enemyIncreaseRate = 3;
const spawnDelay = 1000;
let totalActiveEnemies = 0;
const explosions = [];

const canvasCreate = () => {
  //* Setting the containers

  // setting a village && Enemies
  const enemies = [];
  const village = new Village();

  // Some variables on Village //note: html update
  heartCount.innerText = village.hearts;
  coinCount.innerText = village.coins;

  //setting a map image
  const mapImage = new Image();
  mapImage.src = mapImagePath;

  //setting placement tiles
  const placementTilesData2D = [];
  const palcementTilesArray = [];

  //?Check if wave is completed func
  function checkWaveCompletion() {
    if (totalActiveEnemies === 0 && waveCount > 0) {
      // Spawn the next wave with increased difficulty
      spawnEnemies(enemyPerWave + enemyIncreaseRate, spawnDelay);
    } else if (totalActiveEnemies === 0 && waveCount === 0) {
      stopGame = true; //todo: task1 -> Next Level
      levelCompleteScreen.style.display = "flex";
    }
  }

  //?spawnEnemies func
  function spawnEnemies(spawnCount, spawnDelay) {
    waveCount -= 1;
    totalActiveEnemies += spawnCount;

    let spawnIndex = 0;

    const spawnInterval = setInterval(() => {
      if (spawnIndex >= spawnCount) {
        clearInterval(spawnInterval);
        return;
      }

      const positionOffset = spawnIndex * 150; // Offset for starting position

      const enemy = new Enemy({
        color: "red",
        position: {
          x: waypoints[0].x - positionOffset,
          y: waypoints[0].y,
        },
      });

      //? Death of enemies func
      enemy.onDeath = () => {
        totalActiveEnemies -= 1;
        village.coins += enemy.drop;
        coinCount.innerText = village.coins;
        coinImg.style.transform = "scale(1.2)";
        setTimeout(() => {
          coinImg.style.transform = "scale(1)";
        }, 1000);
        checkWaveCompletion();
      };

      enemies.push(enemy);
      spawnIndex++;
    }, spawnDelay);
  }

  //? place tiles func
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

  //!animation : Blood of the game
  function animation() {
    if (stopGame) {
      //clear canvas for last time
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
      return;
    }
    requestAnimationFrame(animation); //recursive loop

    //clear canvas for each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw the map image after cleanup
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

    //spawn enemies, movement of enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      if (enemy.health > 0) enemy.update();

      //Enemies out of canvas i.e into Village
      if (enemy.position.x > canvas.width) {
        console.log("Enemy out of canvas, Kill a Villager"); //!log
        // console.log(village.health); //!log
        village.health -= enemy.attackPower;

        // console.log("ORCS LEFT :", enemies.length); //!log
        if (village.health <= 0) {
          //! task : GAME OVER SCREEN, STOP THE GAME
          village.hearts -= 1;
          heartCount.innerText = village.hearts; //print hearts
          heartImg.src = `./assets/icons/heart-broken.gif`;
          heartImg.style.transform = "scale(2.5)";

          setTimeout(() => {
            heartImg.src = `./assets/icons/heart-live.gif`;
            heartImg.style.transform = "scale(1)";
          }, 1000);

          console.warn("Village is getting Destroyed");

          //All Security & Lives Destroyed
          if (village.hearts === 0) {
            stopGame = true; // ?Reload or transition to the next level
            console.warn("GAME OVER", gameOverScreen);
            gameOverScreen.style.display = "flex";
          }
        }
        enemies.splice(i, 1);
        enemy.die();
      }
    }

    //explosions
    for (let i = explosions.length - 1; i >= 0; i--) {
      const explosion = explosions[i];
      explosion.draw();
      explosion.animateFrames();
      // 0 1 2 3
      if (explosion.frames.current >= explosion.frames.max - 1) {
        explosions.splice(i, 1);
      }
    }

    //testing : placement tiles
    palcementTilesArray.forEach((tile) => tile.highlight(mouse));

    //draw towers
    buildings.forEach((building) => {
      building.update();
      building.targetEnemy = null; //CLEAR TARGET ENEMY ARRAY

      //check for enemies in range of fire
      const validEnemies = enemies.filter((enemy) => {
        const dx = enemy.center.x - building.center.x;
        const dy = enemy.center.y - building.center.y;
        const distance = Math.hypot(dx, dy);

        return distance < enemy.radius + building.rangeOfFire;
      });

      building.targetEnemy = validEnemies[0]; //SET TARGET ENEMY to 1st

      for (let i = building.projectiles.length - 1; i >= 0; i--) {
        const projectile = building.projectiles[i];
        projectile.update();

        //collision detection with enemies
        const dx = projectile.enemy.center.x - projectile.position.x;
        const dy = projectile.enemy.center.y - projectile.position.y;
        const distance = Math.hypot(dx, dy);

        // here : projectile hits an enemy
        if (distance < projectile.enemy.radius + projectile.radius) {
          projectile.enemy.color = "red";

          //note: remove projectile
          explosions.push(
            new Sprite({
              position: projectile.position,
              imageSrc: "./assets/img/explosion.png",
              frames: { max: 4, hold: 5 },
              offset: { x: 0, y: 0 },
            })
          );
          building.projectiles.splice(i, 1);

          projectile.enemy.health -= projectile.power;
          if (projectile.enemy.health <= 0) {
            //note:remove dead enemy
            const enemyIndex = enemies.indexOf(projectile.enemy);
            if (enemyIndex > -1) {
              projectile.enemy.die();
              enemies.splice(enemyIndex, 1);
            }
          }
        }
      }
    });
  }

  // Game loop : Here Begins it all
  mapImage.onload = () => {
    animation();
    spawnEnemies(enemyPerWave, spawnDelay); // Spawn 10 enemies in 2 second
  };

  //*********************** EVENT LISTENER ********************

  const mouse = { x: undefined, y: undefined };

  //Suggest placement for tower
  window.addEventListener("mousemove", (e) => {
    // console.log(e.clientX, e.clientY); //!log

    if (stopGame) return;

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
  });

  //Build Tower on Click
  canvas.addEventListener("click", () => {
    if (stopGame) return;

    if (activeTile && !activeTile.isOccupied) {
      const building = new Tower({ position: activeTile.position });

      //check for cost of tower
      if (village.coins < building.cost) {
        return; //not enough coins for build
      }

      village.coins -= building.cost;
      coinCount.innerText = village.coins; //print coins
      coinImg.style.transform = "scale(2.5)";
      setTimeout(() => {
        coinImg.style.transform = "scale(1)";
      }, 1000);

      buildings.push(building);
      activeTile.isOccupied = true;

      //sort buildings so that towers are on top : corrects perspective
      buildings.sort((a, b) => a.position.y - b.position.y);
    }
  });
};

export default canvasCreate;
