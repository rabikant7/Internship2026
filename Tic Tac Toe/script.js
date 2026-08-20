// State management variables
let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;

const statusDisplay = document.getElementById("status");
const cells = document.querySelectorAll(".cell");
const resetBtn = document.getElementById("reset-btn");

// Every combination that constitutes a standard match win
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Handles turn actions upon hitting a valid grid square
function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    // Guard clause: stop action if cell is filled or game concluded
    if (boardState[clickedCellIndex] !== "" || !isGameActive) return;

    updateCell(clickedCell, clickedCellIndex);
    checkForResults();
}

// Writes visual data and tracking variables to the state array
function updateCell(cell, index) {
    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);
}

// Switches dynamic game turns
function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

// Runs array calculations to determine wins or draws
function checkForResults() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] === "" || boardState[b] === "" || boardState[c] === "") continue;
        
        if (boardState[a] === boardState[b] && boardState[b] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Player ${currentPlayer} Wins! 🎉`;
        isGameActive = false;
        return;
    }

    // Handles scenarios where all grid options are exhausted
    if (!boardState.includes("")) {
        statusDisplay.textContent = "It's a Tie! 🤝";
        isGameActive = false;
        return;
    }

    handlePlayerChange();
}

// Reinitializes initial runtime environments
function resetGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    statusDisplay.textContent = "Player X's turn";
    
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("X", "O");
    });
}

// Operational event bindings
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", resetGame);