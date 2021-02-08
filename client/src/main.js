import GameLogic from './GameLogic.mjs';
import rootSvgSrc from './assets/Board.svg';
import * as dragUtils from './dragUtils.js';
import './style.css';

let socket = io('http://localhost:3000');
let initialized = false;
let socketId;

// document.body.style.cursor = `url(${handPng})`;

class BoardView {
  RADIUS = 28;
  L = 54;
  R = 786;
  T = 58;
  B = 582;

  constructor(game, parent) {
    this.game = game;
    this.parent = parent;
    // defined after instanciation
    this.boardWidth;
    this.boardHeight;
    this.toPlayDisplay;

    this.drag = d3
      .drag()
      .on('start', (e) => dragUtils.dragstarted.call(this, e, socket))
      .on('drag', (e) => dragUtils.dragged.call(this, e, socket))
      .on('end', (e) => dragUtils.dragended.call(this, e, socket));

    // D3 Scale definitions
    this.xScale = d3.scalePoint().domain(d3.range(0, 12)).range([this.L, this.R]);
    this.yScale = d3.scalePoint().domain(d3.range(0, 8)).range([this.T, this.B]);
    this.xReverseScale = d3
      .scaleQuantize()
      .domain([this.L, this.R])
      .range(d3.range(0, 12));
    this.yReverseScale = d3
      .scaleQuantize()
      .domain([this.T, this.B])
      .range(d3.range(0, 8));
    // Mirror transformations for white player
    this.xMirrorScale = d3
      .scalePoint()
      .domain(d3.range(11, -1, -1))
      .range([this.L, this.R]);
    this.yMirrorScale = d3
      .scalePoint()
      .domain(d3.range(7, -1, -1))
      .range([this.T, this.B]);
    this.xMirrorReverseScale = d3
      .scaleQuantize()
      .domain([this.L, this.R])
      .range(d3.range(11, -1, -1));
    this.yMirrorReverseScale = d3
      .scaleQuantize()
      .domain([this.T, this.B])
      .range(d3.range(7, -1, -1));

    // Axis Definitions

    // Set Socket listeners
    socket.on('remoteDragStart', (payload) => {
      dragUtils.dragstarted.call(this, { ...payload.event, remote: true }, socket);
    });
    socket.on('remoteDrag', (payload) => {
      dragUtils.dragged.call(
        this,
        {
          ...payload.event,
          x: dragUtils.xMirrorTransform.call(this, payload.event.x),
          y: dragUtils.yMirrorTransform.call(this, payload.event.y),
          remote: true
        },
        socket
      );
    });
    socket.on('remoteDragEnd', (payload) => {
      dragUtils.dragended.call(
        this,
        {
          ...payload.event,
          x: dragUtils.xMirrorTransform.call(this, payload.event.x),
          y: dragUtils.yMirrorTransform.call(this, payload.event.y),
          remote: true
        },
        socket
      );
    });

    // Initialization call
    this.initGame();
  }
  // Mirror transform to be applied on broadcast to opponent

  updateToPlayDisplay() {
    this.game.toPlay = this.game.toPlay.toLowerCase() === 'white' ? 'Black' : 'White';
    this.toPlayDisplay.innerText = `${this.game.toPlay} to move`;
  }

  async drawGrid() {
    const parser = new DOMParser();
    const rootSvgData = parser.parseFromString(rootSvgSrc, 'image/svg+xml');
    const rootSvg = rootSvgData.firstChild;

    d3.select(this.parent).node().append(rootSvg);
  }

  async initGame() {
    this.game.player = prompt('Playing black or white?');
    await this.drawGrid();
    this.gameBoardSvg = d3.select('#game-board');
    this.boardWidth = parseInt(this.gameBoardSvg.attr('width'));
    this.boardHeight = parseInt(this.gameBoardSvg.attr('height'));
    this.tokenLayer = this.gameBoardSvg.append('g');
    this.toPlayDisplay = document.querySelector('h2');
    this.toPlayDisplay.innerText = `${this.game.toPlay} to move`;
    this.renderTokens();
  }

  renderTokens() {
    console.log('rendering tokens');
    const t = this.tokenLayer.transition().duration(750);
    this.tokenLayer
      .selectAll('circle')
      .data(this.game.pieces, (piece) => piece.id)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('id', (piece) => `token${piece.id}`)
            .attr('cx', (piece) => {
              const col = this.game.getPosition(piece, 'col');

              return this.game.player === 'black'
                ? this.xScale(col)
                : this.xMirrorScale(col);
            })
            .attr('cy', (piece) => {
              const row = this.game.getPosition(piece, 'row');
              return this.game.player === 'black'
                ? this.yScale(row)
                : this.yMirrorScale(row);
            })
            .attr('r', this.RADIUS)
            .attr('fill', (piece) =>
              piece.color === 'white' ? '#E9E5CE' : '#555D50'
            )
            .call(this.drag)
            .on('click', (e) => dragUtils.clicked.call(this, e)),
        (update) =>
          update
            .call((update) => update.transition(t))
            .attr('cx', (piece) => {
              const col = this.game.getPosition(piece, 'col');
              return this.game.player === 'black'
                ? this.xScale(col)
                : this.xMirrorScale(col);
            })
            .attr('cy', (piece) => {
              const row = this.game.getPosition(piece, 'row');
              return this.game.player === 'black'
                ? this.yScale(row)
                : this.yMirrorScale(row);
            }),
        (exit) =>
          exit
            .call((exit) => exit.transition(t))
            .attr('opacity', 0)
            .remove()
      );
  }
}

socket.on('connect', () => {
  console.log('Connected!');
  socket.on('initialize', (data) => {
    if (!initialized) {
      socketId = data.id;
      const gameState = data.gameSetup;
      const boardModel = new GameLogic.BoardModel(gameState.board, gameState.pieces);
      new BoardView(boardModel, '#game-area');
      initialized = true;
    }
  });
});
