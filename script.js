const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const gridSize = 8; // Number of rows and columns
const tileSize = canvas.width / gridSize;
const numColors = 3; // Reduced number of colors
const colors = ['#FF0000', '#00FF00', '#0000FF']; // Red, Green, Blue

let board = [];
let score = 0;
let selectedTile = null;

// Initialize the game board
function initBoard() {
    board = [];
    for (let row = 0; row < gridSize; row++) {
        board[row] = [];
        for (let col = 0; col < gridSize; col++) {
            board[row][col] = Math.floor(Math.random() * numColors);
        }
    }
}

// Draw the game board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const tileX = col * tileSize;
            const tileY = row * tileSize;
            ctx.fillStyle = colors[board[row][col]];
            ctx.fillRect(tileX, tileY, tileSize, tileSize);
            ctx.strokeRect(tileX, tileY, tileSize, tileSize); // Optional: Add tile borders
        }
    }
}

// Handle clicks on the canvas
function handle клік(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const col = Math.floor(mouseX / tileSize);
    const row = Math.floor(mouseY / tileSize);

    if (selectedTile) {
        // Second tile selected, check if it's adjacent
        if (isAdjacent(selectedTile.row, selectedTile.col, row, col)) {
            swapTiles(selectedTile.row, selectedTile.col, row, col);
            selectedTile = null; // Deselect
        } else {
            // Select the new tile
            selectedTile = { row: row, col: col };
        }
    } else {
        // First tile selected
        selectedTile = { row: row, col: col };
    }
}

function isAdjacent(r1, c1, r2, c2) {
    return (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);
}

function swapTiles(row1, col1, row2, col2) {
    let temp = board[row1][col1];
    board[row1][col1] = board[row2][col2];
    board[row2][col2] = temp;
    drawBoard(); // Redraw the board after swapping
}

// Game initialization
initBoard();
drawBoard();

// Event listener for clicks
canvas.addEventListener('click', handle клік);
