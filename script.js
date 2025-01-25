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

    return { checkForWinner, placeTile, printTiles, allTilesTaken, tileIsEmpty, tiles };
})();


const gameController = (function(board) {
    let currentTurn = "x";

    function playTurn(target) {
        console.log(`Play turn target: ${target}`);
        if (!board.tileIsEmpty(target)) return false;
        board.placeTile(target, currentTurn);
        board.printTiles();
        if (board.checkForWinner(currentTurn)) {
            console.log(`${currentTurn} is the winner!`);
        }
        else if (board.allTilesTaken()) {
            console.log("It's a tie!");
        }
        else {
            nextTurn();
            console.log(`${currentTurn}'s turn`);
        }
    }

    function nextTurn() {
        currentTurn === "x" ? currentTurn = "o" : currentTurn = "x";
    }

    return { playTurn };
})(gameBoard);


const domController = (function(game, board) {
    const tiles = document.querySelectorAll(".tile");

    function getCorrespondingImage(mark) {
        switch(mark) {
            case "x": 
                return "url(assets/images/x-black.svg)";
            case "o":
                return "url(assets/images/o-black.svg)";
            default:
                break;
        }
    }

    function updateDisplay() {
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].style.backgroundImage = getCorrespondingImage(board.tiles[i]);
        }
    }

    tiles.forEach((tile) => {
        tile.addEventListener("click", (event) => {
            game.playTurn(tile.getAttribute("data-index"));
            updateDisplay();
        });
    });

    return {};
})(gameController, gameBoard);