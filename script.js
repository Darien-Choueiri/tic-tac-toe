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

    return { markSpot, printBoard, checkWinner};
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

const gameController = (function(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    const players = [
        {
            name: playerOneName,
            mark: 'X'
        },
        {
            name: playerTwoName,
            mark: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        gameBoard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const playRound = (row, column) => {
        
        let result = gameBoard.markSpot(column, row, getActivePlayer().mark);

        if (result === 1) {
            console.log(`location column:${column} and row:${row} is taken, please try a different spot.`);
        } else {
            switchPlayerTurn();
        }
        
        if (gameBoard.checkWinner('X') === 1) {
            console.log("X WINS");
        }
        else if (gameBoard.checkWinner('O') === 1){
            console.log("O WINS");
        }
        
        printNewRound();
    }

    return {
        playRound
    };
})();