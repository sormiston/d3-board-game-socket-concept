const server = require('express');
const http = require('http').createServer(server);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.port || 3000;
const range = require('lodash.range');



// original (random pixel coord) generator
// const circles = range(20).map((i) => ({
//   x: Math.random() * (width - radius * 2) + radius,
//   y: Math.random() * (height - radius * 2) + radius,
// }));

const users = [];
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);
  io.emit('handshake', socket.id);
  io.emit('initialize', { tokens, id: socket.id });

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

http.listen(PORT, () => {
  console.log('Server started!  Listening on port ' + PORT);
});
