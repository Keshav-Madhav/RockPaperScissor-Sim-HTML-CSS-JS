let fps = 60;
let interval = 1000 / fps;
let lastTime = performance.now();
let frameCount = 0;
let lastFrameTime = performance.now();

let board;
let boardWidth=400;
let boardHeight=670;
let context;

let speed = 0.01;
let jitter = 0.001;
let directionChangeRate = 0.001;
let VelocityX= (Math.random()) * speed;
let VelocityY= (Math.random()) * speed;

let rockImg= new Image();
rockImg.src="./Assets/Rock.png"
let rockHeight= 18;
let rockWidth= 20;

let paperImg= new Image();
paperImg.src= "./Assets/Paper.png"
let paperHeight= 23;
let paperWidth= 26;

let scissorImg= new Image();
scissorImg.src="./Assets/Scissor.png"
let scissorHeight= 27;
let scissorWidth= 29;

let objects=[];

let startButton = document.getElementById("start");
startButton.addEventListener("click", startSimulation);

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    spawnObjects(30,30,30);

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

    // Check for collisions between objects
    for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
            let a = objects[i];
            let b = objects[j];
            if (detectCollision(a, b)) {
                if ((a.type === "rock" && b.type === "scissor") || (a.type === "scissor" && b.type === "rock")) {
                    // Rock beats scissors
                    if (a.type === "scissor") {
                        changeProperties(a,"rock");
                    } else {
                        changeProperties(b,"rock");
                    }
                } else if ((a.type === "paper" && b.type === "rock") || (a.type === "rock" && b.type === "paper")) {
                    // Paper beats rock
                    if (a.type === "rock") {
                        changeProperties(a,"paper");
                    } else {
                        changeProperties(b,"paper");
                    }
                } else if ((a.type === "scissor" && b.type === "paper") || (a.type === "paper" && b.type === "scissor")) {
                    // Scissors beat paper
                    if (a.type === "paper") {
                        changeProperties(a,"scissor");
                    } else {
                        changeProperties(b,"scissor");
                    }
                }
            }
        }
    }

    requestAnimationFrame(update);
}

function changeProperties(object, newType) {
    // Set the type property
    object.type = newType;

    // Set the image, width, and height properties based on the new type
    if (newType === "rock") {
        object.image = rockImg;
        object.width = rockWidth;
        object.height = rockHeight;
    } else if (newType === "paper") {
        object.image = paperImg;
        object.width = paperWidth;
        object.height = paperHeight;
    } else if (newType === "scissor") {
        object.image = scissorImg;
        object.width = scissorWidth;
        object.height = scissorHeight;
    }
}


function startSimulation() {
    let numRocks = parseInt(document.getElementById("rockInp").value);
    let numPapers = parseInt(document.getElementById("PaperInp").value);
    let numScissors = parseInt(document.getElementById("scissorInp").value);

    objects = [];

    // Call the spawnObjects function with the new values
    spawnObjects(numRocks, numPapers, numScissors);
}

function spawnObjects(numRocks, numPapers, numScissors) {
    // Check if random spawning is enabled
    let isRandomSpawning = document.getElementById("random").checked;

    // Set the size of each spawn area based on the number of objects being spawned
    let rockSpawnAreaSize = Math.min(300, numRocks * 2);
    let paperSpawnAreaSize = Math.min(300, numPapers * 2);
    let scissorSpawnAreaSize = Math.min(300, numScissors * 2);

    // Set the position of the spawn area for each type of object
    let rockSpawnAreaX, rockSpawnAreaY;
    let paperSpawnAreaX, paperSpawnAreaY;
    let scissorSpawnAreaX, scissorSpawnAreaY;

    if (isRandomSpawning) {
        // Set the distance between the spawn areas
        let spawnAreaDistance = 100;

        // Set the position of the first spawn area for each type of object
        rockSpawnAreaX = Math.random() * (boardWidth - rockSpawnAreaSize);
        rockSpawnAreaY = Math.random() * (boardHeight - rockSpawnAreaSize);

        // Set the position of the second spawn area for each type of object
        do {
            paperSpawnAreaX = Math.random() * (boardWidth - paperSpawnAreaSize);
            paperSpawnAreaY = Math.random() * (boardHeight - paperSpawnAreaSize);
        } while (Math.sqrt(Math.pow(paperSpawnAreaX - rockSpawnAreaX, 2) + Math.pow(paperSpawnAreaY - rockSpawnAreaY, 2)) < spawnAreaDistance);

        // Set the position of the third spawn area for each type of object
        do {
            scissorSpawnAreaX = Math.random() * (boardWidth - scissorSpawnAreaSize);
            scissorSpawnAreaY = Math.random() * (boardHeight - scissorSpawnAreaSize);
        }while ((Math.sqrt(Math.pow(scissorSpawnAreaX - rockSpawnAreaX, 2) + Math.pow(scissorSpawnAreaY - rockSpawnAreaY, 2)) < spawnAreaDistance) || (Math.sqrt(Math.pow(scissorSpawnAreaX - paperSpawnAreaX, 2) + Math.pow(scissorSpawnAreaY - paperSpawnAreaY, 2)) < spawnAreaDistance));
    } 
    else {
        // Use fixed spawning
        rockSpawnAreaX = 30;
        rockSpawnAreaY = 130;
        paperSpawnAreaX = 260;
        paperSpawnAreaY = 130;
        scissorSpawnAreaX = 150;
        scissorSpawnAreaY = 330;
    }

    let spawnAreaSize = 100;

    // Create the rock objects
    for (let i = 0; i < numRocks; i++) {
        let object = {
            x: rockSpawnAreaX + Math.random() * spawnAreaSize,
            y: rockSpawnAreaY + Math.random() * spawnAreaSize,
            width: rockWidth,
            height: rockHeight,
            velocityX: (Math.random() - 0.5) * speed,
            velocityY: (Math.random() - 0.5) * speed,
            image: rockImg,
            type: "rock"
        };
        objects.push(object);
    }

    // Create the paper objects
    for (let i = 0; i < numPapers; i++) {
        let object = {
            x: paperSpawnAreaX + Math.random() * spawnAreaSize,
            y: paperSpawnAreaY + Math.random() * spawnAreaSize,
            width: paperWidth,
            height: paperHeight,
            velocityX: (Math.random() - 0.5) * speed,
            velocityY: (Math.random() - 0.5) * speed,
            image: paperImg,
            type: "paper"
        };
        objects.push(object);
    }

    // Create the scissor objects
    for (let i = 0; i < numScissors; i++) {
        let object = {
            x: scissorSpawnAreaX + Math.random() * spawnAreaSize,
            y: scissorSpawnAreaY + Math.random() * spawnAreaSize,
            width: scissorWidth,
            height: scissorHeight,
            velocityX: (Math.random() - 0.5) * speed,
            velocityY: (Math.random() - 0.5) * speed,
            image: scissorImg,
            type: "scissor"
        };
        objects.push(object);
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