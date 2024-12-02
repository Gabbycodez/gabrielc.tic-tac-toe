const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleClick(e) {
    const cell = e.target;
    const cellIndex = [...cells].indexOf(cell);

    if (gameState[cellIndex] !== '' || !gameActive) return;

    makeMove(cellIndex, 'X');
    
    if (!gameActive) return;
    
    // Computer's turn
    setTimeout(() => {
        computerMove();
    }, 500);
}

function makeMove(cellIndex, player) {
    gameState[cellIndex] = player;
    cells[cellIndex].classList.add(player);
    cells[cellIndex].innerHTML = `<div class="symbol">${player}</div>`;

    if (checkWin(player)) {
        gameActive = false;
        status.textContent = player === 'X' ? "You Win!" : "Computer Wins!";
        return;
    }

    if (checkDraw()) {
        gameActive = false;
        status.textContent = "Game Draw!";
        return;
    }

    status.textContent = player === 'X' ? "Computer's Turn (O)" : "Your Turn (X)";
}

function computerMove() {
    if (!gameActive) return;

    // Try to win
    const winningMove = findBestMove('O');
    if (winningMove !== -1) {
        makeMove(winningMove, 'O');
        return;
    }

    // Take center if available
    if (gameState[4] === '') {
        makeMove(4, 'O');
        return;
    }

    // Take random available corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => gameState[i] === '');
    if (availableCorners.length > 0) {
        const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        makeMove(randomCorner, 'O');
        return;
    }

    // Take any available space
    const emptySpaces = gameState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    if (emptySpaces.length > 0) {
        const randomSpace = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
        makeMove(randomSpace, 'O');
    }
}

function findBestMove(player) {
    for (let combination of winningCombinations) {
        const values = combination.map(index => gameState[index]);
        const playerCount = values.filter(val => val === player).length;
        const emptyCount = values.filter(val => val === '').length;
        
        if (playerCount === 2 && emptyCount === 1) {
            return combination[values.indexOf('')];
        }
    }
    return -1;
}

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => gameState[index] === player);
    });
}

function checkDraw() {
    return gameState.every(cell => cell !== '');
}

function resetGame() {
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    status.textContent = "Your Turn (X)";
    cells.forEach(cell => {
        cell.classList.remove('X', 'O');
        cell.innerHTML = '';
    });
}

cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
    
    cell.addEventListener('mouseover', () => {
        if (cell.classList.contains('X') || cell.classList.contains('O')) return;
        cell.style.transform = 'scale(1.05)';
    });

    cell.addEventListener('mouseout', () => {
        cell.style.transform = 'scale(1)';
    });
});

resetButton.addEventListener('click', resetGame);
