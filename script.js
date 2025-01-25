const gameboard = (function() {
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
            tileIsEmpty(i);
        }
    }

    function tileTakenBy(target, mark) {
        return tiles[target] === mark;
    }

    function placeTile(target, mark) {
        tiles[target] = mark;
    }

    return { checkForWinner, placeTile, printTiles, allTilesTaken };
})();

const gameController = (function() {
    let currentTurn = "x";

    function playTurn(target) {
        gameboard.placeTile(target, currentTurn);
        gameboard.printTiles();
        if (gameboard.checkForWinner(currentTurn)) {
            console.log(`${currentTurn} is the winner!`);
        }
        else if (gameboard.allTilesTaken()) {
            console.log("It's a tie!");
        }
        else nextTurn();
    }

    function nextTurn() {
        currentTurn === "x" ? currentTurn = "o" : currentTurn = "x";
    }

    return { playTurn };
})();