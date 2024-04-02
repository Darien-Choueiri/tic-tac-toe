const gameBoard = (function() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++){
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const clearBoard = () => {
        board.map((row) => row.map((cell) => cell.addMark(null)));
    };

    const getBoard = () => board;

    const markSpot = (column, row, player) => {

        //checks if spot is already marked
        if (board[row][column].getValue() !== null) return 1;
        
        //marks spot
        board[row][column].addMark(player);
    }; 

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues); 
    }
    
    // function needs to check if the the symbol is three accross
    const checkWinner = (symbol) => {
        const checkRows = () => {
            for (let i = 0; i < rows; i++){
                let count = 0;
                for (let j = 0; j < columns; j++){
                    if (board[i][j].getValue() === symbol){
                        count += 1;
                    }
                }
                if (count === rows){
                    return 1;
                }  
            }
        } 

        const checkColumns = () => {
            for (let  i = 0; i < columns; i++){
                let count = 0;
                for (let j = 0; j < rows; j++){
                    if (board[j][i].getValue() === symbol){
                        count += 1;
                    }
                }
                if (count === columns){
                    return 1;
                }
            }
        }
        
        const checkDiaganols = () => {  
            if (board[0][0].getValue() === symbol && board[0][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][2].getValue()){
                return 1;
            } else if (board[0][2].getValue() === symbol && board[0][2].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][0].getValue()){
                return 1;
            }
        }

        return checkRows() || checkColumns() || checkDiaganols();

    }

    const checkFull = () => {
        let count = 0;
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < columns; j++) {
                if (board[i][j].getValue() != null){
                    count += 1;
                }
            }
        }
        return count === rows*columns ? 1 : 0;
    }

    return { markSpot, printBoard, checkWinner, getBoard, clearBoard, checkFull};
})();

function Cell() {
    let value = null;

    //allow a player to add their mark to the cell
    const addMark = (player) => {
        value = player;
    };

    //retrieve current value
    const getValue = () => value;

    return {
        addMark,
        getValue
    };
}

const gameController = (
    playerOneName = 'playerOne',
    playerTwoName = 'playerTwo'
) => {
    const players = [
        {
            name: playerOneName,
            mark: 'X',
            victory: false
        },
        {
            name: playerTwoName,
            mark: 'O',
            victory: false
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const resetVictories = () => {
            players[0].victory = false;
            players[1].victory = false;
    }

    const getVictory = (player) => player.victory;

    const checkVictories = () => players[0].victory || players[1].victory;

    const printNewRound = () => {
        gameBoard.printBoard();
    }

    const playRound = (row, column) => {
        
        let result = gameBoard.markSpot(column, row, getActivePlayer().mark);

        if (result === 1) {
            console.log(`location column:${column} and row:${row} is taken, please try a different spot.`);
        } else {
            switchPlayerTurn();
        }
        
        if (gameBoard.checkWinner('X') === 1 && players[1].victory === false) {
            players[0].victory = true;
            console.log("X WINS");
        }
        else if (gameBoard.checkWinner('O') === 1 && players[0].victory === false){
            players[1].victory = true;
            console.log("O WINS");
        }
        
        printNewRound();
    }

    return {
        playRound,
        getActivePlayer,
        getVictory,
        checkVictories,
        resetVictories
    };
};

function ScreenController() {
    

    const game = gameController();
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = '';

        const board = gameBoard.getBoard();
        board.forEach((row, rindex) => {
            row.forEach((cell, cindex) => {

                const tile = document.createElement('div');
                tile.classList.add('cell');
                tile.dataset.row = rindex;
                tile.dataset.column = cindex;
                tile.textContent = cell.getValue();
                boardDiv.appendChild(tile);
            });
        });
    }

    const victory = document.querySelector('.victory');
    boardDiv.addEventListener('click', (event) => {
        if (game.checkVictories() === false) {
            const currentPlayer = game.getActivePlayer();
            const selectedRow = event.target.dataset.row;
            const selectedColumn = event.target.dataset.column;
            
            game.playRound(selectedRow, selectedColumn);
            if (game.getVictory(currentPlayer) === true && victory.textContent === ''){
                
                const winner = document.createElement('div');
                winner.classList.add('winner');
                const name = document.querySelector(`#${currentPlayer.name}`).value;
                console.log(`name: ${name}`);
                winner.textContent = `${name} has won!`;
                victory.appendChild(winner);
                updateScreen();
            }

            if (gameBoard.checkFull() === 1 && game.checkVictories() === false) {
                const tie = document.createElement('div');
                tie.classList.add('winner');
                tie.textContent = `It's a tie!`;
                victory.appendChild(tie);
                updateScreen();
            } 
            updateScreen();
        } 
    });

    const reset = document.querySelector('.game > button');
    reset.addEventListener('click', () => {
        gameBoard.clearBoard();
        const victory = document.querySelector('.victory');
        victory.textContent = '';
        game.resetVictories();
        updateScreen();
    });

    updateScreen();
}

ScreenController();