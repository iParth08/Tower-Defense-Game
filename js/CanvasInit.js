const gameOverScreen = document.querySelector("#game-over-screen");
const levelCompleteScreen = document.querySelector("#level-complete-screen");
const heartCount = document.querySelector("#heartCount");
const coinCount = document.querySelector("#coinCount");
const heartImg = document.querySelector("#heartImg");
const coinImg = document.querySelector("#coinImg");
const gameOverButton = document.querySelector("#replay");
const newGameButton = document.querySelector("#new-game");

const canvas = document.querySelector("#map-canvas");
const ctx = canvas.getContext("2d"); //contextAPI
canvas.width = 1280;
canvas.height = 768; //pixel

//drawing a rectangle
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

console.log(ctx);

export { canvas, ctx, gameOverScreen, levelCompleteScreen };
