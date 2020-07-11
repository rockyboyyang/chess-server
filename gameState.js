class Player {
    constructor(playerName, ws) {
        this.playerName = playerName;
        this.ws = ws;
    }

    getData() {
        return {
            playerName: this.playerName,
        };
    }
}
const squares = Array(64).fill('null');

for (let i = 8; i < 16; i++) {
    squares[i] = 'pawn-black';
    squares[i + 40] = 'pawn-white';
}
squares[0] = 'rook-black'
squares[7] = 'rook-black';
squares[56] = 'rook-white';
squares[63] = 'rook-white';

squares[1] = 'knight-black';
squares[6] = 'knight-black';
squares[57] = 'knight-white';
squares[62] = 'knight-white';

squares[2] = 'bishop-black';
squares[5] = 'bishop-black';
squares[58] = 'bishop-white';
squares[61] = 'bishop-white';

squares[3] = 'queen-black';
squares[4] = 'king-black';

squares[59] = 'queen-white';
squares[60] = 'king-white';

class Match {
    constructor(playerOne) {
        this.playerOne = playerOne;
        this.playerTwo = null;
        this.playerOneColor = 'white';
        this.playerTwoColor = 'black';
        this.currentPlayer = playerOne;
        this.squareValues = squares
        this.gameOver = false;
        this.winner = null;
        this.statusMessage = null
    }

    getPlayers() {
        // console.log(this.playerOne, this.playerTwo)
        return [this.playerOne, this.playerTwo];
    }
    // might not need square values
    getData() {
        return {
            playerOne: this.playerOne.getData(),
            playerTwo: this.playerTwo.getData(),
            playerOneColor: this.playerOneColor,
            playerTwoColor: this.playerTwoColor,
            currentPlayer: this.currentPlayer.getData(),
            squareValues: this.squareValues = squares,
            gameOver: this.gameOver,
            winner: this.winner ? this.winner.getData() : null,
            statusMessage: this.statusMessage
        }
    }
}


module.exports = {
    Match,
    Player,
};