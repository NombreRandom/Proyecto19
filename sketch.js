var PLAY = 1;
var END = 0;
var gameState = PLAY;

var jay, jay_running, jay_collided;
var corredor, invisibleGround, corredorImage;

var arbolGroup, arbolImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score;

var gameOverImage, restartImage;


function preload(){
  jay_running = loadAnimation("JayIdle.png","JayWalk.png");
  jay_collided = loadAnimation("JayCollided.png");
  
  corredorImage = loadImage("CorredorInfinito.png");
  
  arbolImage = loadImage("Arbol.png");
  
  obstacle1 = loadImage("Hoyo1.png");
  obstacle2 = loadImage("Hoyo2.png");
  obstacle3 = loadImage("Operador.png");

  gameOverImage = loadImage("GameOver.png");
  restartImage = loadImage("ResetButton.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  jay = createSprite(50,350,20,50);
  jay.addAnimation("running", jay_running);
  jay.addAnimation("collided" , jay_collided);
  jay.scale = 0.5;
  
  corredor = createSprite(width/2,180,width,20);
  corredor.addImage("corredor",corredorImage);
  corredor.x = corredor.width/2;

  gameOver = createSprite(width/2, 60, 10, 10);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5

  restart = createSprite(width/2, 200, 10, 10);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,350,400,10);
  invisibleGround.visible = false;
  

  obstaclesGroup = createGroup();
  arbolGroup = createGroup();
  
  score = 0;
  jay.setCollider("circle", 0, 0, 40);

  jay.debug=true;
}


function draw() {
  background(50);

  text("Puntuación: "+ score, width-100,50);
  
  if(gameState === PLAY){

    corredor.velocityX = -4;

    gameOver.visible = false;
    restart.visible = false;

    score = score + Math.round(getFrameRate()/60);   


    if (corredor.x < 0){
      corredor.x = corredor.width/2;
    }
    

    if(keyDown("space")&& jay.y >= 150) {
        jay.velocityY = -13;
        touches = [ ];
    }
    

    jay.velocityY = jay.velocityY + 1
  

    spawnArbol();
  

    spawnObstacles();
    
    if(obstaclesGroup.isTouching(jay)){
        gameState = END;
    }
  }
   else if (gameState === END) {
      corredor.velocityX = 0;
     
      gameOver.visible = true;
      restart.visible = true;
      
     obstaclesGroup.setVelocityXEach(0);
     arbolGroup.setVelocityXEach(0);
     jay.changeAnimation("collided" , jay_collided);
     obstaclesGroup.setLifetimeEach(-1);
     arbolGroup.setLifetimeEach(-1);
     jay.velocityY=0;
    
    if(mousePressedOver(restart)){

      reset();

    } 
     
   }
  
 

  jay.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,355,10,40);
   obstacle.velocityX = -6;
   

    var rand = Math.round(random(1,6));
   
        
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   

    obstaclesGroup.add(obstacle);
 }
}

function spawnArbol() {

   if (frameCount % 60 === 0) {
     arbol = createSprite(1867,350,40,10);
    arbol.addImage(arbolImage);
    arbol.scale = 0.5;
    arbol.velocityX = -3;
    

    arbol.lifetime = 645;
    
  
    arbol.depth = jay.depth;
    corredor.depth = jay.depth;
    jay.depth = jay.depth + 1;
    
   arbolGroup.add(arbol);
    }
}

function reset(){

  
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  arbolGroup.destroyEach();
  jay.changeAnimation("running", jay_running);
  score=0;
}