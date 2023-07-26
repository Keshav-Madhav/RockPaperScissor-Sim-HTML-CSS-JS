let fps = 60;
let interval = 1000 / fps;
let lastTime = performance.now();
let frameRateDisplay = document.createElement("div");
document.body.appendChild(frameRateDisplay);
let frameCount = 0;
let lastFrameTime = performance.now();

let board;
let boardWidth=1000;
let boardHeight=1000;
let context;

let rockImg= new Image();
rockImg.src="./Assets/Rock.png"
let rockHeight= 28;
let rockWidth= 50;
let rockX;
let rockY;

let paperImg= new Image();
paperImg.src= "./Assets/Paper.png"
let paperHeight= 28;
let paperWidth= 50;
let paperX;
let paperY;

let scissorImg= new Image();
scissorImg.src="./assets/Scissor.png"
let scissorHeight= 28;
let scissorWidth= 50;
let scissorX;
let scissorY;

let VelocityX;
let VelocityY;

let winnner;

window.onload = function (){
    board = document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context = board.getContext("2d");

    requestAnimationFrame(update);
}

function update(){
    context.clearRect(0,0,boardWidth,boardHeight);

    
    let currentTime = performance.now();
    let deltaTime = (currentTime - lastFrameTime) / 16;

    showfps(currentTime);
    requestAnimationFrame();
}


function detectCollision(a,b){
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

// Update frame rate display
function showfps(currentTime){
    frameCount++;
    let frameRate = frameCount / ((currentTime - lastFrameTime) / 1000);
    // frameRateDisplay.textContent = `FPS: ${frameRate.toFixed(1)}`;
    frameCount = 0;
    lastFrameTime = currentTime;
}
