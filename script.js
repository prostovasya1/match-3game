const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const gridSize = 8;
const tileSize = canvas.width / gridSize;
const numColors = 3;
const colors = ['#FF0000', '#00FF00', '#0000FF'];

let board = [];
let score = 0;
let selectedTile = null;

function initBoard() {
    board = [];
    for (let row = 0; row < gridSize; row++) {
        board[row] = [];
        for (let col = 0; col < gridSize; col++) {
            let newColor;
            do {
                newColor = Math.floor(Math.random() * numColors);
                board[row][col] = newColor;
            } while (hasInitialMatches(row, col));
        }
    }
}

function hasInitialMatches(currentRow, currentCol) {
    const currentColor = board[currentRow][currentCol];

    // Check horizontal matches to the left
    if (currentCol > 1 &&
        board[currentRow][currentCol - 1] === currentColor &&
        board[currentRow][currentCol - 2] === currentColor) {
        return true;
    }

    // Check vertical matches above
    if (currentRow > 1 &&
        board[currentRow - 1][currentCol] === currentColor &&
        board[currentRow - 2][currentCol] === currentColor) {
        return true;
    }

    return false;
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const tileX = col * tileSize;
            const tileY = row * tileSize;
            ctx.fillStyle = colors[board[row][col]];
            ctx.fillRect(tileX, tileY, tileSize, tileSize);
            ctx.strokeRect(tileX, tileY, tileSize, tileSize);
        }
    }
}

function handleКлік(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const col = Math.floor(mouseX / tileSize);
    const row = Math.floor(mouseY / tileSize);

    if (selectedTile) {
        if (isAdjacent(selectedTile.row, selectedTile.col, row, col)) {
            swapTiles(selectedTile.row, selectedTile.col, row, col);
            selectedTile = null;
        } else {
            selectedTile = { row: row, col: col };
        }
    } else {
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
    drawBoard();
    handleMatches();
}

function findMatches() {
    const matches = [];

    // Check horizontal matches
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize - 2; col++) {
            const color = board[row][col];
            if (color === board[row][col + 1] && color === board[row][col + 2]) {
                let matchLength = 3;
                while (col + matchLength < gridSize && board[row][col + matchLength] === color) {
                    matchLength++;
                }
                const match = [];
                for (let i = 0; i < matchLength; i++) {
                    match.push({ row: row, col: col + i });
                }
                matches.push(match);
                col += matchLength - 1;
            }
        }
    }

    // Check vertical matches
    for (let col = 0; col < gridSize; col++) {
        for (let row = 0; row < gridSize - 2; row++) {
            const color = board[row][col];
            if (color === board[row + 1][col] && color === board[row + 2][col]) {
                let matchLength = 3;
                while (row + matchLength < gridSize && board[row + matchLength][col] === color) {
                    matchLength++;
                }
                const match = [];
                for (let i = 0; i < matchLength; i++) {
                    match.push({ row: row + i, col: col });
                }
                matches.push(match);
                row += matchLength - 1;
            }
        }
    }

    return matches;
}

function handleMatches() {
    const matches = findMatches();
    if (matches.length > 0) {
        // Visual feedback before processing
        highlightMatches(matches);
        setTimeout(() => {
            processMatches(matches);
        }, 500); // Delay for visual feedback
    }
}

function highlightMatches(matches) {
    matches.forEach(match => {
        match.forEach(tile => {
            const tileX = tile.col * tileSize;
            const tileY = tile.row * tileSize;
            ctx.strokeStyle = 'yellow'; // Highlight color
            ctx.lineWidth = 5;
            ctx.strokeRect(tileX + 2, tileY + 2, tileSize - 4, tileSize - 4);
        });
    });
}

function processMatches(matches) {
    matches.forEach(match => {
        if (match.length === 3) {
            score += 10;
        } else if (match.length > 3) {
            score += 5;
        }
        match.forEach(tile => {
            board[tile.row][tile.col] = -1;
        });
    });

    removeMatches();
    updateScoreDisplay();
}

function removeMatches() {
    // Apply gravity - move tiles down
    for (let col = 0; col < gridSize; col++) {
        let emptyRow = gridSize - 1;
        for (let row = gridSize - 1; row >= 0; row--) {
            if (board[row][col] !== -1) {
                board[emptyRow][col] = board[row][col];
                if (row !== emptyRow) {
                    board[row][col] = -1;
                }
                emptyRow--;
            }
        }
    }

    // Fill the top empty spaces with new tiles
    for (let col = 0; col < gridSize; col++) {
        for (let row = 0; row < gridSize; row++) {
            if (board[row][col] === -1) {
                board[row][col] = Math.floor(Math.random() * numColors);
            }
        }
    }
    drawBoard();
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Game initialization
initBoard();
drawBoard();
updateScoreDisplay();

// Event listener for clicks
canvas.addEventListener('click', handleКлік);
