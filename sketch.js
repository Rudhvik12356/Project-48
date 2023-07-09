var scene, sceneImage, fighterJet, fighterJetImage, missile, missileImage;
var asteroid, asteroids, asteroid1Image, asteroid2Image;
var gameOver, gameOverImage, resetButton, resetImage;
var explosion1, explosion1Image, explosion2, explosion2Image, muteButton, play, greeting;

var SERVE = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var BGMusic, boomSound, sadSound, winSound;

var score = 0;
var life = 3;

var missiles = [];

function preload() {
  sceneImage = loadImage("assets/scene.png");
  fighterJetImage = loadImage("assets/fighterJet.png");
  missileImage = loadImage("assets/missile.png");

  explosion1Image = loadImage("assets/explosion1.png");
  explosion2Image = loadImage("assets/explosion2.png");

  asteroid1Image = loadImage("assets/asteroid1.png");
  asteroid2Image = loadImage("assets/asteroid2.png");

  resetImage = loadImage("assets/resetButton.png");
  gameOverImage = loadImage("assets/gameOver.png");

  BGMusic = loadSound("assets/fight-142564.mp3");
  boomSound = loadSound("assets/hq-explosion-6288.mp3");
  sadSound = loadSound("assets/dramatic-synth-echo-43970.mp3");
  winSound = loadSound("assets/success-fanfare-trumpets-6185.mp3");

  BGMusic.looping = true;
  winSound.looping = false;
}

function setup() {
  createCanvas(1300, 650);

  BGMusic.play();
  BGMusic.setVolume(0.5);

  fighterJet = createSprite(width / 2, height / 2 + 250, 50, 50);
  fighterJet.addImage("jet", fighterJetImage);
  fighterJet.addImage("explode", explosion1Image);
  fighterJet.addImage("explode2", explosion2Image);
  fighterJet.scale = 0.5;
  fighterJet.scale = 0.4;
  fighterJet.setCollider("circle", 0, 0, 100);

  missile = createSprite(width / 2, height / 2 + 250, 20, 20);
  missile.addImage("missile", missileImage);
  missile.scale = 0.1;
  missile.visible = false;

  gameOver = createSprite(width / 2, height / 2 - 50, 100, 100);
  gameOver.addImage("gameOver", gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  resetButton = createSprite(width / 2, height / 2 + 50, 50, 50);
  resetButton.addImage("reset", resetImage);
  resetButton.scale = 0.3;
  resetButton.visible = false;

  muteButton = createImg("assets/muteButton.png");
  muteButton.position(width / 2 + 500, height / 2 - 275);
  muteButton.size(100, 70);
  muteButton.mouseClicked(mute);

  asteroids = new Group();
}

function draw() {
  background(sceneImage);
  if (gameState == PLAY) {
    if (keyIsDown(RIGHT_ARROW) && fighterJet.x < 1697.5) {
      fighterJet.x = fighterJet.x + 15;
    }
    
    if (keyIsDown(LEFT_ARROW) && fighterJet.x > 190.5) {
      fighterJet.x = fighterJet.x - 15;
    }

    showAsteroids();

    if (keyCode === 32) {
      missile.velocityY = -7;
      missile.visible = true;
      missiles.push(missile);

      missile.x = fighterJet.x;
    }

    for (var i = 0; i < missiles.length; i++) {
      if (keyDown("space")) {
        missile = createSprite(width / 2, height / 2 + 320, 20, 20);
        missile.addImage("missile", missileImage);
        missile.scale = 0.1;
        missile.visible = false;
      }
    }

    if (score == 500) {
      winSound.play();
      winSound.setVolume(0.07);
      BGMusic.stop();

      asteroids.destroyEach();
      missile.velocityY = 0;

      resetButton.visible = true;

      if (mousePressedOver(resetButton)) {
        reset();
        life = 3;
        window.location.reload();
      }

      textSize(40);
      fill("cyan");
      text("Mission Completed!", width / 2 - 177, height / 2 - 50);
    }

    if (asteroids.isTouching(missile)) {
      score = score + 50;
      missile.destroy();
      asteroids.destroyEach();

      boomSound.play();
      boomSound.setVolume(0.25);

      asteroids.setVelocityYEach(10);
    }

    if (asteroids.isTouching(fighterJet)) {
      gameState = END;

      BGMusic.stop();
      sadSound.play();
      sadSound.setVolume(1);

      life = life - 1;
      missile.destroy();

      fighterJet.changeImage("explode");
    }

  } else if (gameState == END) {
    asteroids.destroyEach();
    missile.velocityY = 0;

    gameOver.visible = false;
    resetButton.visible = true;

    if (life == 0) {
      textSize(40);
      fill("cyan");

      BGMusic.stop();
      score = 0;

      asteroids.destroyEach();
      missile.destroy();

      resetButton.visible = true;
      gameOver.visible = true;

      if (mousePressedOver(resetButton)) {
        reset();
        life = 3;
      }
    }

    if (mousePressedOver(resetButton)) {
      reset();
    }
  }

  textSize(20);
  fill("lime");
  text("Score: " + score, 50, 100);

  textSize(20);
  fill("lime");
  text("Lives: " + life, 50, 130);

  fill("cyan");
  textSize(40);
  text("Asteroid Attack", width / 2 - 165, 100)

  textSize(30);
  fill("lime");
  text("Press The Space Bar To Shoot!", width / 2 - 240, 150);
  drawSprites();
}

function reset() {
  asteroids.destroyEach();

  gameOver.visible = false;
  resetButton.visible = false;

  gameState = PLAY;


  BGMusic.play();
  BGMusic.setVolume(0.1);

  fighterJet.changeImage("jet");
}

function showAsteroids() {
  if (frameCount % 40 === 0) {
    asteroid = createSprite(random(50, width), height / 2 - 400, 100, 100);
    asteroid.velocityY = 10;

    var rand = Math.round(random(1, 2));

    switch (rand) {
      case 1:
        asteroid.addImage("asteroid1", asteroid1Image);
        asteroid.scale = 0.3;
        break;
      case 2:
        asteroid.addImage("asteroid2", asteroid2Image);
        asteroid.scale = 0.3;
        break;
      default:
        break;
    }
    asteroids.add(asteroid);
  }
}

function resizedCanvas() {
  resize(windowWidth, windowHeight);
}

function mute() {
  if (BGMusic.isPlaying()) {
    BGMusic.pause();
  } else {
    BGMusic.play();
  }
}