// Obstacle Generation & Movement:
// Implement obstacle spawning at regular intervals.
// Ensure obstacles move toward the player at a consistent pace.
// Randomize obstacle placement (height, position) to add variety.

let obstacles = []; //array that will hold all the obstacle objects currently in the game.
let obstacleInterval = 100; // Time between new obstacles
let frameCount = 0; //keeps track of the number of frames that have passed since the start of the game. It is incremented during each iteration of a game loop.

// Generate obstacles
function generateObstacles() {
  if (frameCount % obstacleInterval === 0) {
    //Every time frameCount reaches a multiple of 100 (like 100, 200, 300, etc.), the remainder is 0. every 100 frames, a new obstacle is created.
    obstacles.push({ x: canvas.width, y: 150, width: 20, height: 20 });
  }
}

// Update obstacles
function updateObstacles() {
  //moves each obstacle, draws it on the canvas and removes.
  for (let i = 0; i < obstacles.length; i++) {
    //iterates over every obstacle in the obstacles array
    obstacles[i].x -= 2; // Move obstacles to the left
    ctx.fillStyle = "green";
    ctx.fillRect(
      obstacles[i].x,
      obstacles[i].y,
      obstacles[i].width,
      obstacles[i].height
    );
  }

  if (obstacles.length > 0 && obstacles[0].x + obstacles[0].width <= 0) {
    obstacles.shift(); // Remove the first obstacle if it is off-screen
  }
}
