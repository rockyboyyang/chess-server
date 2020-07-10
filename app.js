
const express = require('express');
const path = require('path');
const { createServer } = require('http');
const morgan = require('morgan');

const { port } = require('./config');

const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = createServer(app);

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
