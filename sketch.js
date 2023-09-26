let font;
let roadImage;
let roadImage2;
let roadImage3;
let roadImage4;
let carImage;
let oppositecarImage;
let roadHeight = 1500;
let roadSpeed = 3;
let roadY1 = 0;
let roadY2 = -roadHeight;
let roadY3 = roadY2 - roadHeight;
let roadY4 = roadY3 - roadHeight;
let playerCarX;
let playerCarY;
let playerCarSpeed = 10;
let oppositeCarX;
let oppositeCarY;
let oppositeCarSpeed = 1;
let lastSpeedIncreaseTime = 0;
let gameStopped = false;
let gameState = 'start';
let score = 0;
let instructionsVisible = true;
let dareVisible = true;
let startSound, collisionSound;
let currentHighScore = getHighScore();
let congratulationVisible = false;

function preload() {
  //road in 4 seasons
  roadImage = loadImage('road.png');
  roadImage2 = loadImage('road2.png');
  roadImage3 = loadImage('road3.png');
  roadImage4 = loadImage('road4.png');
  //the players car
  carImage = loadImage('car.png');
  //car in opposite site
  oppositecarImage = loadImage('car2.png');
  //font using in game
  font = loadFont('font.ttf');
  //sound in game and hitting sfx
  startSound = loadSound('music.mp3');
  collisionSound = loadSound('crash.mp3');
}

function setup() {
  const canvas = createCanvas(800, 715);
  canvas.parent('canvas-container');

  playerCarX = width / 2 - carImage.width / 2;
  playerCarY = height - carImage.height - 20;

  oppositeCarX = random(60, width - 60 - carImage.width);
  oppositeCarY = -carImage.height;
  
  currentHighScore = getHighScore();
}

function draw() {
  background(115);

  if (gameState === 'start') {
    displayStartScreen();
  } else if (gameState === 'playing') {
    image(roadImage, 0, roadY1, width, roadHeight);
    image(roadImage2, 0, roadY2, width, roadHeight);
    image(roadImage3, 0, roadY3, width, roadHeight);
    image(roadImage4, 0, roadY4, width, roadHeight);

    image(carImage, playerCarX, playerCarY);

    image(oppositecarImage, oppositeCarX, oppositeCarY);
    roadY1 += roadSpeed;
    roadY2 += roadSpeed;
    roadY3 += roadSpeed;
    roadY4 += roadSpeed;

    if (roadY1 >= height) {
  roadY1 = roadY4 - roadHeight;
}
if (roadY2 >= height) {
  roadY2 = roadY1 - roadHeight;
}
if (roadY3 >= height) {
  roadY3 = roadY2 - roadHeight;
}
if (roadY4 >= height) {
  roadY4 = roadY3 - roadHeight;
}

    if (keyIsDown(LEFT_ARROW) && playerCarX > 50) {
      playerCarX -= playerCarSpeed;
    }
    if (keyIsDown(RIGHT_ARROW) && playerCarX < width - carImage.width - 50) {
      playerCarX += playerCarSpeed;
    }

    let currentTime = millis();
    if (currentTime - lastSpeedIncreaseTime > 1000) {
      oppositeCarSpeed += 0.5;
      lastSpeedIncreaseTime = currentTime;
    }

    oppositeCarY += oppositeCarSpeed;

    if (oppositeCarY > height) {
      oppositeCarY = -carImage.height;
      oppositeCarX = random(50, width - 50 - carImage.width);
      incrementScore();
    }

    if (playerHasCollided()) {
      gameStopped = true;
      gameState = 'gameOver';
      onCollision(); 
    }

    displayScore();

  } else if (gameState === 'gameOver') {
    displayGameOverScreen();
  }
    if (score > currentHighScore && congratulationVisible) {
  fill(255, 215, 0);
  textSize(30);
  textAlign(CENTER, TOP);
  text('Congratulations! New High Score: ' + score, width / 2, height / 2 - 200);
  }
}

function playerHasCollided() {
  return (
    playerCarX < oppositeCarX + oppositecarImage.width &&
    playerCarX + carImage.width > oppositeCarX &&
    playerCarY < oppositeCarY + oppositecarImage.height &&
    playerCarY + carImage.height > oppositeCarY
  );
}

function incrementScore() {
  score++;
}

function displayScore() {
  fill(115);
  textSize(40);
  textAlign(CENTER, TOP);
  text('Score: ' + score, width / 2, 20);
}

function displayStartScreen() {
  background(16, 78, 139);
  fill(255);
  textSize(32);
  textFont(font);
  textAlign(CENTER, CENTER);
  let textY = height / 2 - 70;
  text('Press Start to Play', width / 2, textY);

  let buttonWidth = 200;
  let buttonHeight = 50;
  let buttonX = width / 2 - buttonWidth / 2;
  let buttonY = height / 2 - 20;

  if (
    mouseX > buttonX &&
    mouseX < buttonX + buttonWidth &&
    mouseY > buttonY &&
    mouseY < buttonY + buttonHeight
  ) {
    fill(0, 128, 128);
  } else {
    fill(0, 206, 209);
  }
  rect(buttonX, buttonY, buttonWidth, buttonHeight);

  fill(255);
  textSize(24);
  let buttonTextY = height / 2 + 5; 
  text('START', width / 2, buttonTextY);

  // Instructions text
  textSize(18);
  textAlign(CENTER, TOP);
  fill(255);
  let instructionsY = height / 2 + 75;

  fill(255, 165, 0);
  text('Instructions:', width / 2, instructionsY);
  
  // Blink text
  if (millis() % 300 > 90) {
    if (instructionsVisible) {
      textSize(18);
      textAlign(CENTER, TOP);
      fill(255);
      let instructionsY = height / 2 + 75;
      text('Instructions:', width / 2, instructionsY);
    }
  } else {
    instructionsVisible = !instructionsVisible;
  }
  text('Use LEFT and RIGHT arrow keys to move the car.', width / 2, instructionsY + 30);
  text('Avoid colliding with the oncoming cars.', width / 2, instructionsY + 60);
  
  fill(30,144,255);
  textSize(30);
  text('I bet you CANNOT score 30!', width / 2, 150);
  fill(30,144,253);
  text('Dare to prove me wrong?', width/2, 190);
}

// GameOverScreen
function displayGameOverScreen() {
  background(139, 26, 26);
  fill(255);
  textSize(80);
  textFont(font);
  textAlign(CENTER, CENTER);
  text('Game Over', width / 2, height / 2 - 100);

  let finalScoreY = height / 2;
  let highScoreY = finalScoreY + 80;

  fill(255);
  textSize(70);
  textFont(font);
  text('Score: ' + score, width / 2, finalScoreY);

  fill(255);
  textSize(30);
  text('High Score: ' + currentHighScore, width / 2, highScoreY - 10);

  fill(255);
  textSize(20);
  textFont(font);
  text('Press R to Restart', width / 2, highScoreY + 40);
}

// HighScore
function setHighScore(score) {
  localStorage.setItem('highScore', score);
}

function getHighScore() {
  const highScore = localStorage.getItem('highScore');
  return highScore ? parseInt(highScore) : 0;
}

if (score > currentHighScore) {
  currentHighScore = score;
      setHighScore(score);
}

function mousePressed() {
  if (gameState === 'start') {
    // Play start sound when the button is clicked
    startGame('music.mp3');

    // Check if the mouse is over the start button
    let buttonWidth = 200;
    let buttonHeight = 50;
    let buttonX = width / 2 - buttonWidth / 2;
    let buttonY = height / 2 - 20;

    if (
      mouseX > buttonX &&
      mouseX < buttonX + buttonWidth &&
      mouseY > buttonY &&
      mouseY < buttonY + buttonHeight
    ) {
     
      gameState = 'playing';

      roadY1 = 0;
      roadY2 = -roadHeight;
    }
    currentHighScore = getHighScore();  // Get the latest high score
  if (score > currentHighScore) {
    setHighScore(score);
    currentHighScore = score;
    congratulationVisible = true;
  }

  score = 0;
  }
  if (score > currentHighScore && congratulationVisible) {
  fill(255, 215, 0);
  textSize(30);
  textAlign(CENTER, TOP);
  text('Congratulations! New High Score: ' + score, width / 2, height / 2 - 200);
  }
}

function keyPressed() {
  if (keyCode === 82 || keyCode === 114) {  // 'R' or 'r' key
    resetGame();
  }
}

function resetGame() {
  gameStopped = false;
  gameState = 'playing';
  playerCarX = width / 2 - carImage.width / 2;
  playerCarY = height - carImage.height - 20;
  oppositeCarX = random(50, width - 50 - carImage.width);
  oppositeCarY = -carImage.height;
  oppositeCarSpeed = 1;
  lastSpeedIncreaseTime = millis();

  // Update high score
  currentHighScore = getHighScore();  // Get the latest high score
  if (score > currentHighScore) {
    setHighScore(score);
    currentHighScore = score;
  }
  score = 0;
  congratulationVisible = false;
}

function startGame() {
  startSound.loop();
  startSound.setVolume(0.1);
}

function onCollision() {
  collisionSound.play();
}
