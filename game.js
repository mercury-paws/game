import CactiController from "./js/CactiController.js";
import Ground from "./js/Ground.js";
import Player from "./js/Player.js";
import Score from "./js/Score.js";
import { setupGameReset, removeGameReset } from "./js/reset.js";
import {
  GAME_SPEED_START,
  GAME_SPEED_INCREMENT,
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  MAX_JUMP_HEIGHT,
  MIN_JUMP_HEIGHT,
  GROUND_WIDTH,
  GROUND_HEIGHT,
  GROUND_AND_CACTUS_SPEED,
  CACTI_CONFIG
} from "./js/constants.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Objects
let player = null;
let ground = null;
let cactiController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

function createSprites() {
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio
  );

  ground = new Ground(
    ctx,
    groundWidthInGame,
    groundHeightInGame,
    GROUND_AND_CACTUS_SPEED,
    scaleRatio
  );

  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image: image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });

  cactiController = new CactiController(
    ctx,
    cactiImages,
    scaleRatio,
    GROUND_AND_CACTUS_SPEED
  );

  score = new Score(ctx, scaleRatio);
}

function resetGame() {
  gameOver = false;
  gameSpeed = GAME_SPEED_START;
  previousTime = null;
  score.reset();
  cactiController.reset();
  player.reset();
  waitingToStart = true;

  removeGameReset();

  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  if (gameOver) {
    return;
  }

  if (!previousTime) {
    previousTime = timestamp;
    requestAnimationFrame(gameLoop);
    return;
  }

  const deltaTime = timestamp - previousTime;
  previousTime = timestamp;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  ground.update(gameSpeed, deltaTime);
  ground.draw();

  // Draw player
  player.update(gameSpeed, deltaTime);
  player.draw();

  // Spawn and move obstacles
  cactiController.update(gameSpeed, deltaTime);
  cactiController.draw();

  // Draw score
  score.update(deltaTime);
  score.draw();

  // Check for collision
  if (!gameOver && cactiController.collideWith(player)) {
    gameOver = true;
    setupGameReset(canvas, resetGame);
    score.setHighScore();
  }

  // Draw game objects
  ground.draw();
  cactiController.draw();
  player.draw();
  score.draw();

  if (gameOver) {
    showGameOver();
  }

  if (waitingToStart) {
    showStartGameText();
  }

  requestAnimationFrame(gameLoop);
}

function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "grey";
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText("GAME OVER", x, y);
}

function showStartGameText() {
  const fontSize = 50 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "grey";
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText("Press Space to Start", x, y);
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;

  createSprites();
}

// Handle key press for jumping
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !waitingToStart) {
    player.jump();
  } else if (waitingToStart) {
    waitingToStart = false;
    requestAnimationFrame(gameLoop);
  }
});

createSprites();
setScreen();
// Use setTimeout on Safari mobile rotation otherwise works fine on desktop
window.addEventListener("resize", () => setTimeout(setScreen, 500));

if (screen.orientation) {
  screen.orientation.addEventListener("change", setScreen);
}

function getScaleRatio() {
  const screenHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight
  );

  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth
  );

  // window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

// Initial draw to show the start game text
function initialDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ground.draw();
  player.draw();
  showStartGameText();
}

initialDraw();