const gameBoard = (function() {
    let tiles = ["", "", "", "", "", "", "", "", ""];

    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    function checkForWinner(mark) {
        for (let i = 0; i < winPatterns.length; i++) {
            let patternMatches = true;
            let pattern = winPatterns[i];
            for (let ii = 0; ii < pattern.length; ii++) {
                let tileIndex = pattern[ii];
                if (!tileTakenBy(tileIndex, mark)) patternMatches = false;
            }
            if (patternMatches) return true;
        }
        return false;
    }

    function tileIsEmpty(target) {
        return tiles[target] === "";
    }

    function printTiles() {
        console.log(`
            --Tiles--
            | ${tiles[0]} | ${tiles[1]} | ${tiles[2]} |
            | ${tiles[3]} | ${tiles[4]} | ${tiles[5]} |
            | ${tiles[6]} | ${tiles[7]} | ${tiles[8]} |
        `);
    }

    function allTilesTaken() {
        for (let i = 0; i < tiles.length; i++) {
            if (tileIsEmpty(i)) return false;
        }
        return true;
    }

    function tileTakenBy(target, mark) {
        return tiles[target] === mark;
    }

    function placeTile(target, mark) {
        tiles[target] = mark;
    }

    function resetTiles() {
        tiles = ["", "", "", "", "", "", "", "", ""];
    }

    function getTiles() {
        return tiles;
    }

    return { checkForWinner, placeTile, printTiles, allTilesTaken, tileIsEmpty, getTiles, resetTiles };
})();


const gameController = (function(board) {
    let currentTurn = "x";
    let gameState = "xsTurn";

    function playTurn(target) {
        if (gameState !== "xsTurn" && gameState !== "osTurn") return false;

        console.log(`Play turn target: ${target}`);

        if (!board.tileIsEmpty(target)) return false;

        board.placeTile(target, currentTurn);
        board.printTiles();
        if (board.checkForWinner(currentTurn)) {
            gameState = `${currentTurn}Won`;
            console.log(`${currentTurn} is the winner!`);
        }
        else if (board.allTilesTaken()) {
            gameState = "tie";
            console.log("It's a tie!");
        }
        else {
            nextTurn();
            gameState = `${currentTurn}sTurn`;
            console.log(`${currentTurn}'s turn`);
        }

        console.log(`Game state: ${gameState}`);
    }

    function getGameState() {
        return gameState;
    }

    function nextTurn() {
        currentTurn === "x" ? currentTurn = "o" : currentTurn = "x";
    }

    function resetGame() {
        currentTurn = "x";
        gameState = "xsTurn";
        board.resetTiles();
    }

    return { playTurn, gameState, getGameState, resetGame };
})(gameBoard);


const domController = (function(game, board) {
    const tiles = document.querySelectorAll(".tile");
    const gameStateText = document.querySelector(".gameStateText");
    const restartButton = document.querySelector("#restartButton");

    function getCorrespondingImage(mark) {
        switch(mark) {
            case "x": 
                return "url(assets/images/x.svg)";
            case "o":
                return "url(assets/images/o.svg)";
            default:
                return "";
        }
    }

    function updateDisplay() {
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].style.backgroundImage = getCorrespondingImage(board.getTiles()[i]);
        }
        // debugger;
        console.log(game.getGameState());
        switch(game.getGameState()) {
            case "xWon":
                gameStateText.textContent = "X wins!";
                break;
            case "oWon":
                gameStateText.textContent = "O wins!";
                break;
            case "xsTurn":
                gameStateText.textContent = "X's turn";
                break;
            case "osTurn":
                gameStateText.textContent = "O's turn";
                break;
            case "tie":
                gameStateText.textContent = "It's a tie!";
                break;
            default:
                break;
        }
    }

    updateDisplay();

    tiles.forEach((tile) => {
        tile.addEventListener("click", (e) => {
            game.playTurn(tile.getAttribute("data-index"));
            updateDisplay();
        });
    });

    restartButton.addEventListener("click", (e) => {
        game.resetGame();
        updateDisplay();
    });

    return {};
})(gameController, gameBoard);