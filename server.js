import path from 'path'
import express from 'express';
import { createServer } from 'http'
import { Server } from 'socket.io';
import GameLogic from './client/src/GameLogic.mjs';


const __dirname = path.resolve();
const DIST = 'client/dist'
const PORT = process.env.port || 3000;

const app = express()
app.use(express.static(DIST))
  
const httpServer = createServer(app);
const io = new Server(httpServer);
  
const game = new GameLogic.BoardModel();
game.setup();

const users = [];
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);
  io.emit('handshake', socket.id);
  io.emit('initialize', { gameSetup: game, id: socket.id });
  socket.on('dragStart', (payload) => {
    socket.broadcast.emit('remoteDragStart', {
      event: payload.event
    });
  });

  socket.on('drag', (payload) => {
    socket.broadcast.emit('remoteDrag', {
      event: payload.event
    });
  });

  socket.on('dragEnd', (payload) => {
    socket.broadcast.emit('remoteDragEnd', {
      event: payload.event
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected: ' + socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log('Server started!  Listening on port ' + PORT);
});
