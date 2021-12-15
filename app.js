const tileSize = 48;
let canvas = null;
let ctx = null;

cw = 672;
ch = 864-48;

stdColor = "#222222";

let map = [];
let score = 0;

blocks = [
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ],
];
colors = ["30c7ef", "5a65ad", "ef7922", "f5d507", "ec2329", "40b73f", "ad4e9e"];

objects = [];

mainBlockId = 0;

function createObject(x, y, shape, color) {
  let id = objects.push({
    x: x,
    y: y,
    shape: shape,
    color: color,
  });
  updateMap();
  return id - 1;
}

function readObject(id) {
  return objects[id];
}

function writeObject(id, obj) {
  objects[id] = obj;
  updateMap();
}

function rotateShape(shape) {
  const answer = [];
  const row = shape.length;
  const col = shape[0].length;

  for (let i = 0; i < col; i++) {
    // create temporary array;
    const temp = [];

    for (let j = 0; j < row; j++) {
      temp.push(shape[j][row - 1 - i]);
    }
    // finally, push temp array to answer array
    answer.push(temp);
  }

  return answer;
}

for (let i = 0; i < cw / tileSize; i++) {
  map[i] = [];
  for (let j = 0; j < ch / tileSize; j++) {
    map[i][j] = stdColor;
  }
}

window.onload = function () {
  canvas = document.getElementById("game");
  ctx = canvas.getContext("2d");

  canvas.width = cw;
  canvas.height = ch;

  setInterval(draw, 1000 / 60);

  startGame();
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

function updateMap() {
  for (let i = 0; i < cw / tileSize; i++) {
    for (let j = 0; j < ch / tileSize; j++) {
      map[i][j] = stdColor;
    }
  }
  for (let k = 0; k < objects.length; k++) {
    for (let i = 0; i < objects[k].shape.length; i++) {
      for (let j = 0; j < objects[k].shape[i].length; j++) {
        if (objects[k].shape[i][j] == 1) {
          map[objects[k].x + i][objects[k].y + j] = "#" + objects[k].color;
        }
      }
    }
  }
}

function newMainBlock() {
  let rand = Math.floor(Math.random() * blocks.length);
  let shape = blocks[rand];
  let x = 5;
  let y = 0;
  let color = colors[rand];
  mainBlockId = createObject(x, y, shape, color);
}

dropIntv = 0;

function startGame() {
  clearInterval(dropIntv);
  for (let i = 0; i < cw / tileSize; i++) {
    map[i] = [];
    for (let j = 0; j < ch / tileSize; j++) {
      map[i][j] = stdColor;
    }
  }
  objects = [];
  newMainBlock();
  dropIntv = setInterval(dropMainBlock, 1000 * 0.75);
}

function dropMainBlock() {
  let obj = readObject(mainBlockId);

  if (checkPossibleMoveY(obj.x, obj.y+1, obj.shape)) {
    obj.y += 1;
    writeObject(mainBlockId, obj);
  } else {
    // Check if any lines are full
    let linesFull = 0;
    for (let i = 0; i < ch / tileSize; i++) {
      let full = true;
      for (let j = 0; j < map.length; j++) {
        if (map[j][i] == stdColor) {
          full = false;
          break;
        }
      }
      if (full) {
        linesFull++;
        for (let k = 0; k < objects.length; k++) {
          objects[k].y += 1;
        }
      }
    }
    if (linesFull > 0) {
      score += linesFull * 100;
      document.getElementById("score").innerHTML = "Score: "+score;
    }
    newMainBlock();
  }
}

function checkPossibleMoveY(x, y, shape) {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] == 1) {
        if (y + j >= ch / tileSize) {
          return false;
        }
      }
    }
  }
  let cmaskA = [];
  for (let i = 0; i < cw / tileSize; i++) {
    cmaskA[i] = [];
    for (let j = 0; j < ch / tileSize; j++) {
      cmaskA[i][j] = 0;
    }
  }
  for (let k = 0; k < objects.length - 1; k++) {
    for (let ki = 0; ki < objects[k].shape.length; ki++) {
      for (let kj = 0; kj < objects[k].shape[ki].length; kj++) {
        if (objects[k].shape[ki][kj] == 1) {
          cmaskA[objects[k].x + ki, objects[k].y + kj] = 1;
        }
      }
    }
  }
  let cmaskB = [];
  for (let i = 0; i < cw / tileSize; i++) {
    cmaskB[i] = [];
    for (let j = 0; j < ch / tileSize; j++) {
      cmaskB[i][j] = 0;
    }
  }
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] == 1) {
        cmaskB[x + i][y + j] = 1;
      }
    }
  }
  console.log(cmaskA);
  console.log(cmaskB);
  for (let i = 0; i < cw / tileSize; i++) {
    for (let j = 0; j < ch / tileSize; j++) {
      if (cmaskA[i][j] == 1 && cmaskB[i][j] == 1) {
        return false;
      }
    }
  }
  return true;
}

document.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    let obj = readObject(mainBlockId);
    let lowestShapeX = obj.shape.length;
    for (let i = 0; i < obj.shape.length; i++) {
      for (let j = 0; j < obj.shape[i].length; j++) {
        if (obj.shape[i][j] == 1) {
          if (lowestShapeX > i) {
            lowestShapeX = i;
          }
        }
      }
    }
    if (obj.x+lowestShapeX > 0) {
      obj.x -= 1;
      writeObject(mainBlockId, obj);
    }
  } else if (event.keyCode == 39) {
    let obj = readObject(mainBlockId);
    let highestShapeX = 0;
    for (let i = 0; i < obj.shape.length; i++) {
      for (let j = 0; j < obj.shape[i].length; j++) {
        if (obj.shape[i][j] == 1) {
          if (highestShapeX < i) {
            highestShapeX = i;
          }
        }
      }
    }
    if (obj.x+highestShapeX < cw / tileSize - 1) {
      obj.x += 1;
      writeObject(mainBlockId, obj);
    }
  } else if (event.keyCode == 40) {
    dropMainBlock();
  } else if (event.keyCode == 38) {
    let obj = readObject(mainBlockId);
    let newShape = rotateShape(obj.shape);
    let validRot = true;
    for (let i = 0; i < newShape.length; i++) {
      for (let j = 0; j < newShape[i].length; j++) {
        if (newShape[i][j] == 1) {
          if (obj.x + i < 0 || obj.x + i >= cw / tileSize || obj.y + j >= ch / tileSize) {
            validRot = false;
            break;
          }
        }
      }
    }
    if (validRot) {
      obj.shape = newShape;
      writeObject(mainBlockId, obj);
    }
  }
});

// TODO: Collision detection
