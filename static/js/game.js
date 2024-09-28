// Constants
const CELL_SIZE = 16;
const PACMAN_SIZE = 14;
const GHOST_SIZE = 14;
const DOT_SIZE = 4;
const ROWS = 31;
const COLS = 28;
const WALL = 0;
const DOT = 1;
const EMPTY = 2;

// Game state
let pacman = { x: 14, y: 23 };
let ghost = { x: 14, y: 11 };
let score = 0;
let gameOver = false;

// Audio
const eatDotSound = new Audio('/static/audio/eat_dot.mp3');
const gameOverSound = new Audio('/static/audio/game_over.mp3');

// Maze layout
const initialMaze = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,2,2,2,2,2,2,2,2,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,0,2,2,2,2,2,2,0,2,0,0,1,0,0,0,0,0,0],
    [2,2,2,2,2,2,1,2,2,2,0,2,2,2,2,2,2,0,2,2,2,1,2,2,2,2,2,2],
    [0,0,0,0,0,0,1,0,0,2,0,2,2,2,2,2,2,0,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,2,2,2,2,2,2,2,2,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,0,0,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,0,0,1,1,1,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

let maze = JSON.parse(JSON.stringify(initialMaze));

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const pacmanImg = new Image();
pacmanImg.src = '/static/images/pacman.svg';
const ghostImg = new Image();
ghostImg.src = '/static/images/ghost.svg';

// Game loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Update game state
function update() {
    if (gameOver) return;

    // Move ghost randomly
    const directions = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}];
    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    const newGhostX = ghost.x + randomDir.x;
    const newGhostY = ghost.y + randomDir.y;

    if (maze[newGhostY][newGhostX] !== WALL) {
        ghost.x = newGhostX;
        ghost.y = newGhostY;
    }

    // Check collision with ghost
    if (pacman.x === ghost.x && pacman.y === ghost.y) {
        gameOver = true;
        gameOverSound.play();
    }

    // Eat dot
    if (maze[pacman.y][pacman.x] === DOT) {
        maze[pacman.y][pacman.x] = EMPTY;
        score += 10;
        document.getElementById('scoreValue').textContent = score;
        eatDotSound.play();
    }
}

// Draw game state
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw maze
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (maze[y][x] === WALL) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else if (maze[y][x] === DOT) {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, DOT_SIZE / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Draw Pacman
    ctx.drawImage(pacmanImg, pacman.x * CELL_SIZE + (CELL_SIZE - PACMAN_SIZE) / 2, pacman.y * CELL_SIZE + (CELL_SIZE - PACMAN_SIZE) / 2, PACMAN_SIZE, PACMAN_SIZE);

    // Draw Ghost
    ctx.drawImage(ghostImg, ghost.x * CELL_SIZE + (CELL_SIZE - GHOST_SIZE) / 2, ghost.y * CELL_SIZE + (CELL_SIZE - GHOST_SIZE) / 2, GHOST_SIZE, GHOST_SIZE);

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    }
}

// Reset game state
function resetGame() {
    pacman = { x: 14, y: 23 };
    ghost = { x: 14, y: 11 };
    score = 0;
    gameOver = false;
    maze = JSON.parse(JSON.stringify(initialMaze));
    document.getElementById('scoreValue').textContent = score;
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (key === 'Enter') {
        resetGame();
        gameLoop();
        return;
    }

    if (gameOver) return;

    let newX = pacman.x;
    let newY = pacman.y;

    switch (key) {
        case 'ArrowUp':
            newY--;
            break;
        case 'ArrowDown':
            newY++;
            break;
        case 'ArrowLeft':
            newX--;
            break;
        case 'ArrowRight':
            newX++;
            break;
    }

    if (maze[newY][newX] !== WALL) {
        pacman.x = newX;
        pacman.y = newY;
    }
});

// Start the game
gameLoop();
