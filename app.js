const tileSize = 48;
let canvas = null;
let ctx = null;

cw = 672;
ch = 864;

let map = [];

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

for (let i = 0; i < cw / tileSize; i++) {
  map[i] = [];
  for (let j = 0; j < ch / tileSize; j++) {
    map[i][j] = getRandomColor();
  }
}

window.onload = function () {
  canvas = document.getElementById("game");
  ctx = canvas.getContext("2d");

  canvas.width = cw;
  canvas.height = ch;

  setInterval(draw, 1000 / 60);
};

function draw() {
  ctx.fillStyle = "grey";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < cw / tileSize; i++) {
    for (let j = 0; j < ch / tileSize; j++) {
      ctx.fillStyle = map[i][j];
      ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
    }
  }
}
