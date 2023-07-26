let fps = 60;
let interval = 1000 / fps;
let lastTime = performance.now();
let frameCount = 0;
let lastFrameTime = performance.now();

let board;
let boardWidth=400;
let boardHeight=670;
let context;

let VelocityX;
let VelocityY;
let speed = 0.01;
let jitter = 0.001;
let directionChangeRate = 0.001;


let rockImg= new Image();
rockImg.src="./Assets/Rock.png"
let rockHeight= 18;
let rockWidth= 20;
let rockX;
let rockY;
let rock = {
    x: Math.random() * boardWidth,
    y: Math.random() * boardHeight,
    width: rockWidth,
    height: rockHeight,
    velocityX: VelocityX,
    velocityY: VelocityY,
    image: rockImg
};

let paperImg= new Image();
paperImg.src= "./Assets/Paper.png"
let paperHeight= 23;
let paperWidth= 26;
let paperX;
let paperY;
let paper = {
    x: Math.random() * boardWidth,
    y: Math.random() * boardHeight,
    width: paperWidth,
    height: paperHeight,
    velocityX: VelocityX,
    velocityY: VelocityY,
    image: paperImg
};

let scissorImg= new Image();
scissorImg.src="./assets/Scissor.png"
let scissorHeight= 27;
let scissorWidth= 29;
let scissorX;
let scissorY;
let scissor = {
    x: Math.random() * boardWidth,
    y: Math.random() * boardHeight,
    width: scissorWidth,
    height: scissorHeight,
    velocityX: VelocityX,
    velocityY: VelocityY,
    image: scissorImg
};

let objects=[];

let winnner;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    spawnObjects();

    requestAnimationFrame(update);
}

function update(){
    context.clearRect(0,0,boardWidth,boardHeight);

    let currentTime = performance.now();
    let deltaTime = (currentTime - lastFrameTime) / 1000;

    // Update and draw each object
    for (let object of objects) {
        updatePosition(object, deltaTime);
        context.drawImage(object.image, object.x, object.y, object.width, object.height);
    }

    requestAnimationFrame(update);
}

function spawnObjects(){

    // Create the rock objects
    for (let i = 0; i < 30; i++) {
        rock = {
            x: Math.random() * boardWidth,
            y: Math.random() * boardHeight,
            width: rockWidth,
            height: rockHeight,
            velocityX: (Math.random() - 0.5) * speed,
            velocityY: (Math.random() - 0.5) * speed,
            image: rockImg
        };
        objects.push(rock);
    }

    // Create the paper objects
    for (let i = 0; i < 30; i++) {
        paper = {
            x: Math.random() * boardWidth,
            y: Math.random() * boardHeight,
            width: paperWidth,
            height: paperHeight,
            velocityX: (Math.random() - 0.5) * speed,
            velocityY: (Math.random() - 0.5) * speed,
            image: paperImg
        };
        objects.push(paper);
    }

    // Create the scissor objects
    for (let i = 0; i < 30; i++) {
        scissor = {
            x: Math.random() * boardWidth,
            y: Math.random() * boardHeight,
            width: scissorWidth,
            height: scissorHeight,
            velocityX: (Math.random() - 0.5) * speed,
            velocityY: (Math.random() - 0.5) * speed,
            image: scissorImg
        };
        objects.push(scissor);
    }
}


function updatePosition(object, deltaTime) {

    // Add a constant jitter value to the x and y velocities
    object.velocityX += (Math.random() < 0.5 ? -jitter : jitter);
    object.velocityY += (Math.random() < 0.5 ? -jitter : jitter);

    // Gradually change the direction of the x and y velocities
    object.velocityX += (Math.random() < 0.5 ? -directionChangeRate : directionChangeRate);
    object.velocityY += (Math.random() < 0.5 ? -directionChangeRate : directionChangeRate);

    // Normalize the velocity vector to have a constant speed
    let magnitude = Math.sqrt(object.velocityX * object.velocityX + object.velocityY * object.velocityY);
    object.velocityX = (object.velocityX / magnitude) * speed;
    object.velocityY = (object.velocityY / magnitude) * speed;

    object.x += object.velocityX * deltaTime;
    object.y += object.velocityY * deltaTime;

    // Check if the object has hit the edge of the canvas
    if (object.x < 0 || object.x + object.width > boardWidth) {
        // Reverse the x velocity
        object.velocityX = -object.velocityX;
        if (object.x < 0) {
            object.x = 0;
        } else {
            object.x = boardWidth - object.width;
        }
    }
    if (object.y < 0 || object.y + object.height > boardHeight) {
        // Reverse the y velocity
        object.velocityY = -object.velocityY;
        if (object.y < 0) {
            object.y = 0;
        } else {
            object.y = boardHeight - object.height;
        }
    }
}

function detectCollision(a,b){
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}