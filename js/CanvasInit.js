const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d"); //contextAPI
canvas.width = 1280;
canvas.height = 768; //pixel

//drawing a rectangle
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

console.log(ctx);

export { canvas, ctx };
