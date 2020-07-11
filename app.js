
const express = require('express');
const path = require('path');
const { createServer } = require('http');
const morgan = require('morgan');
const WebSocket = require('ws')
const { port } = require('./config');
const { Match, Player } = require('./gameState');

const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = createServer(app);
const wss = new WebSocket.Server({ server });
let match = null;

const broadcastMessage = (type, data, players) => {
  const message = JSON.stringify({
    type,
    data
  })

  // console.log(`Broadcasting message ${message}...`)

  players.forEach((player) => {
    player.ws.send(message, (err) => {
      if(err) {
        // TODO Handle errors.
        console.log(err);
      }
    })
  })
}

const addNewPlayer = (playerName, ws) => {
  const player = new Player(playerName, ws)
  if(match === null) {
    match = new Match(player);
  } else if (match.playerTwo === null) {
    match.playerTwo = player;
    startGame();
  } else {
    // TODO Ignore any additional player connections.
    // console.log(`Ignoring player ${playerName}...`)
    ws.close()
  }
}

const startGame = () => {
  const data = match.getData();
  data.statusMessage = `Make your move ${match.currentPlayer.playerName}`;
  broadcastMessage('start-game', data, match.getPlayers());
}

const updateGameBoard = (gameBoard) => {
  // console.log('match', match.squareValues)
  match.squareValues = gameBoard.gameBoard;
  const newTurn = gameBoard.turn
  const gameboard= match.squareValues
  // console.log(match)
  // console.log('match object', match.squareValues)
  const message = JSON.stringify({
    type: 'update-board',
    data: { gameboard },
    newTurn,
  });
  match.playerOne.ws.send(message)
  match.playerTwo.ws.send(message)
}

const processIncomingMessage = (jsonData, ws) => {
  // console.log(`Processing incoming message ${jsonData}...`);

  const message = JSON.parse(jsonData);
  // console.log(message)
  switch (message.type) {
    case 'add-new-player':
      addNewPlayer(message.data.playerName, ws);
      break;
    case 'update-gameboard':
      updateGameBoard(message.data);
      break;
    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
};

// const sendLayout = () => {
//   if(match !== null) {
//     let gameboard = match.squareValues
//     const message = JSON.stringify({
//       type: 'update-board',
//       data: { gameboard },
//     });
//     ws.send(message)
//   }
// }

wss.on('connection', (ws) => {
  ws.on('message', (jsonData) => {
    processIncomingMessage(jsonData, ws);
  });

  ws.on('close', () => {
    // console.log(match.squareValues)
    if(match !== null) {
      const { playerOne, playerTwo } = match;
      // console.log(match.playerOne, match.playerTwo, 'yo')
      // console.log(match)
      if (playerOne.ws === ws || (playerTwo !== null && playerTwo.ws === ws)) {
        if (playerOne.ws !== ws) {
          playerOne.ws.close();
        } else if (playerTwo !== null) {
          playerTwo.ws.close();
        }
        match = null;
      }
    }
  });
});

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
