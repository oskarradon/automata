var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

const gameWidth    = 400;
const gameHeight   = 400;
const canvasWidth  = canvas.width;
const canvasHeight = canvas.height;
const gameSpeed    = 25;
let cells = initializeCells();

// returns array of arrays representing all "pixels" on canvas
function initializeCells() {
  const screenBuffer = [];
  for(var i=0; i<gameWidth; i++) {
    screenBuffer.push((new Array(gameHeight)).fill(false));
  }
  return screenBuffer;
}

// draw function
function draw(screenBuffer) {
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvasWidth,canvasHeight);
  ctx.fillStyle = "black";
  for(var i=0; i<screenBuffer.length; i++) {
    for(var j=0; j<screenBuffer[i].length; j++) {
      if(screenBuffer[i][j]) {
        drawPixel(i,j);
      }
    }
  }
}

// Draw "pixel" based on game and canvas size
function drawPixel(x,y) {
  let pixelWidth  = canvasWidth/gameWidth;
  let pixelHeight = canvasHeight/gameHeight;
  ctx.fillRect(x*pixelWidth, y*pixelHeight, pixelWidth, pixelHeight);
}

let animationProgress = 0;
let previousTimestamp = null;

// animation loop
function step(timestamp) {
  if (!previousTimestamp) timestamp = timestamp;
  animationProgress += timestamp - previousTimestamp;
  previousTimestamp = timestamp;
  if (animationProgress > gameSpeed) {
    console.log('step');
    // console.log(cells);
    // debugger;
    update(cells);
    animationProgress = 0;
  }
  draw(cells);
  window.requestAnimationFrame(step);
}

function update() {
  const newGrid = initializeCells();

  for (var i=0; i<cells.length; i++) {
    for (var j=0; j<cells.length; j++) {
      let aliveNeighbors = getNeighbors(cells,i,j).filter(cell => cell);
      // console.log('Alive neighbors');
      // console.log(aliveNeighbors);
      newGrid[i][j] = isAlive(aliveNeighbors, cells[i][j]);
    }
  }
  cells = newGrid;
}

function getNeighbors(cells,x,y) {
  let left = x-1;
  let right = x+1;
  let upper = y+1;
  let lower = y-1;

  if (left === -1) {
    left = cells.length - 1;
  } else if (right === cells.length) {
    right = 0;
  }
  if (upper === cells[0].length) {
    upper = 0;
  } else if (upper === -1) {
    upper = cells[0].length - 1;
  }

  return [
    cells[left][lower],
    cells[x][lower],
    cells[right][lower],
    cells[left][y],
    cells[right][y],
    cells[left][upper],
    cells[x][upper],
    cells[right][upper]
  ];

}

function isAlive(neighbors, cell) {
  //Any live cell with fewer than two live neighbors dies, as if caused by under-population.
  if (cell && neighbors.length < 2) {
    return false;
  }
  // Any live cell with two or three live neighbors lives on to the next generation.
  if (cell && (neighbors.length === 2 || neighbors.length === 3)) {
    return true;
  }
  // Any live cell with more than three live neighbors dies, as if by over-population.
  if (cell && neighbors.length > 3) {
    return false;
  }
  // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
  if (!cell && neighbors.length === 3) {
    return true;
  }
}

function initializeAutomata(cells) {
  for (var i = 0; i < cells.length; i++) {
    for (var j = 0; j < cells.length; j++) {
      if (Math.random() > .85) {
        cells[i][j] = true;
      }
    }
  }
}

initializeAutomata(cells);

// init
window.requestAnimationFrame(step);
