import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
// const io = require('socket.io')(http, {
//   cors: {
//     origin: 'http://localhost:8080',
//     methods: ['GET', 'POST']
//   }
// });
const PORT = process.env.port || 3000;
// const range = require('lodash.range');
import range from 'lodash.range'
import GameLogic from './client/src/assets/GameLogic.mjs'
// const { BoardModel, Piece } = require('./GameLogic.js');


const httpServer = createServer(express)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST']
  }
})


const game = new GameLogic.BoardModel()
game.setup()


const users = [];
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);
  io.emit('handshake', socket.id);
  io.emit('initialize', { gameSetup: game, id: socket.id });
  socket.on('dragStart', (payload) => {
    io.emit('remoteDragStart', {
      event: payload.event,
      actor: payload.actor
    });
  });

  socket.on('drag', (payload) => {
    io.emit('remoteDrag', {
      event: payload.event,
      actor: payload.actor
    });
  });

  socket.on('dragEnd', (payload) => {
    io.emit('remoteDragEnd', {
      event: payload.event,
      actor: payload.actor
    });
  });

  // add logic to only emit to NEW connections

  // old reference code:
  // socket.on('send', (text) => {
  //   let newText = '<' + socket.id + '> ' + text;
  //   console.log('emitting: ' + newText);

  //   if (text === 'cyberGent card') {
  //     io.emit('cyberGent create', 130, 180);
  //     console.log('Command detected');
  //   }

  //   if (text === 'cyberGent token') {
  //     io.emit('cyberGent create', 100, 100);
  //     console.log('Command detected');
  //   }

  //   io.emit('receive', newText);
  // });

  socket.on('disconnect', () => {
    console.log('A user disconnected: ' + socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log('Server started!  Listening on port ' + PORT);
});
