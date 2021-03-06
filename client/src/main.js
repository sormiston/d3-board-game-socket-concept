import GameLogic from './GameLogic.mjs';
import rootSvgSrc from './assets/Frame3.svg';
import * as utils from './utils.js';
import './style.css';

let initialized = false
let socket = io();  //
let socketId;

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
      .on('start', (e) => utils.dragstarted.call(this, e, socket))
      .on('drag', (e) => utils.dragged.call(this, e, socket))
      .on('end', (e) => utils.dragended.call(this, e, socket));

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
    this.xTopAxis = (player) =>
      d3
        .axisTop(player.toLowerCase() === 'black' ? this.xMirrorScale : this.xScale)
        .tickFormat((d) => String.fromCharCode(d + 65));
    this.xBottomAxis = (player) =>
      d3
        .axisBottom(
          player.toLowerCase() === 'black' ? this.xMirrorScale : this.xScale
        )
        .tickFormat((d) => String.fromCharCode(d + 65));
    this.yLeftAxis = (player) =>
      d3.axisLeft(player.toLowerCase() === 'black' ? this.yScale : this.yMirrorScale);
    this.yRightAxis = (player) =>
      d3.axisRight(
        player.toLowerCase() === 'black' ? this.yScale : this.yMirrorScale
      );

    // Set Socket listeners
    socket.on('remoteDragStart', (payload) => {
      utils.dragstarted.call(this, { ...payload.event, remote: true }, socket);
    });
    socket.on('remoteDrag', (payload) => {
      utils.dragged.call(
        this,
        {
          ...payload.event,
          x: utils.xMirrorTransform.call(this, payload.event.x),
          y: utils.yMirrorTransform.call(this, payload.event.y),
          remote: true
        },
        socket
      );
    });
    socket.on('remoteDragEnd', (payload) => {
      utils.dragended.call(
        this,
        {
          ...payload.event,
          x: utils.xMirrorTransform.call(this, payload.event.x),
          y: utils.yMirrorTransform.call(this, payload.event.y),
          remote: true
        },
        socket
      );
    });

    // Initialization call
    this.initGame();
  }

  updateToPlayDisplay() {
    this.game.toPlay = this.game.toPlay.toLowerCase() === 'white' ? 'Black' : 'White';
    this.toPlayDisplay.innerText = `${this.game.toPlay} to move`;
  }

  async drawGrid() {
    const parser = new DOMParser();
    const rootSvgData = parser.parseFromString(rootSvgSrc, 'image/svg+xml');

    d3.select(this.parent).node().append(rootSvgData.firstChild);
    const rootSvg = d3.select('#view');
    rootSvg
      .append('g')
      .attr('id', 'xAxisBottom')
      .attr('transform', `translate(40, 680)`)
      .call(this.xBottomAxis(this.game.player));
    rootSvg
      .append('g')
      .attr('id', 'yAxisLeft')
      .attr('transform', 'translate(40, 40)')
      .call(this.yLeftAxis(this.game.player));
    rootSvg
      .append('g')
      .attr('id', 'xAxisTop')
      .attr('transform', 'translate(40, 40)')
      .call(this.xTopAxis(this.game.player));
    rootSvg
      .append('g')
      .attr('id', 'yAxisRight')
      .attr('transform', 'translate(880, 40)')
      .call(this.yRightAxis(this.game.player));

    rootSvg.call((g) => {
      g.selectAll('.domain').remove();
      g.selectAll('.tick line').attr('opacity', 0);
    });
  }

  async initGame() {
    this.game.player = prompt('Playing black or white?');
    document.body.classList.add(`${this.game.player.toLowerCase()}`);
    await this.drawGrid();
    this.gameBoardSvg = d3.select('#game-board');
    this.boardWidth = parseInt(this.gameBoardSvg.attr('width'));
    this.boardHeight = parseInt(this.gameBoardSvg.attr('height'));
    this.tokenLayer = this.gameBoardSvg.append('g');
    this.toPlayDisplay = document.querySelector('#toPlay');
    this.toPlayDisplay.innerText = `${this.game.toPlay} to move`;
    this.game.view = this;
    this.renderTokens();
  }

  renderTokens() {
    console.log('rendering tokens');
    const getX = (piece) => {
      const col = this.game.getPosition(piece, 'col');
      return this.game.player === 'black' ? this.xMirrorScale(col) : this.xScale(col);
    };
    const getY = (piece) => {
      const row = this.game.getPosition(piece, 'row');
      return this.game.player === 'black' ? this.yScale(row) : this.yMirrorScale(row);
    };
    const t = this.tokenLayer.transition().duration(500);
    this.tokenLayer
      .selectAll('.token')
      .data(this.game.pieces, (piece) => piece.id)
      .join(
        (enter) => {
          const enterToken = enter
            .append('g')
            .attr('class', 'token')
            .attr('id', (piece) => `token${piece.id}`)
            .call(this.drag)
            .on('click', (e) => utils.clicked.call(this, e));

          enterToken
            .append('circle')
            .attr('cx', (piece) => getX(piece))
            .attr('cy', (piece) => getY(piece))
            .attr('r', this.RADIUS)
            .attr('fill', (piece) =>
              piece.color === 'white' ? '#E9E5CE' : '#555D50'
            );

          enterToken
            .append('circle')
            .attr('cx', (piece) => getX(piece))
            .attr('cy', (piece) => getY(piece))
            .attr('r', this.RADIUS * 0.75)
            .attr('stroke', (piece) =>
              piece.color === 'white' ? '#555D50' : '#E9E5CE'
            );

          enterToken
            .append('circle')
            .attr('cx', (piece) => getX(piece))
            .attr('cy', (piece) => getY(piece))
            .attr('r', this.RADIUS * 0.69)
            .attr('stroke', (piece) =>
              piece.color === 'white' ? '#555D50' : '#E9E5CE'
            );

          enterToken
            .append('circle')
            .attr('cx', (piece) => getX(piece))
            .attr('cy', (piece) => getY(piece))
            .attr('r', this.RADIUS * 0.34)
            .attr('stroke', '#1f1f1f')
            .attr('fill', '#d8b646')
            .style('opacity', (piece) => (piece.type === 'dux' ? 1 : 0));
        },
        (update) =>
          update.call((update) =>
            update
              .selectAll('circle')
              .transition(t)
              .attr('cx', (piece) => {
                const col = this.game.getPosition(piece, 'col');
                return this.game.player === 'black'
                  ? this.xMirrorScale(col)
                  : this.xScale(col);
              })
              .attr('cy', (piece) => {
                const row = this.game.getPosition(piece, 'row');
                return this.game.player === 'black'
                  ? this.yScale(row)
                  : this.yMirrorScale(row);
              })
          ),
        (exit) =>
          exit
            .selectAll('circle')
            .call((exit) => exit.transition(t).style('opacity', 0).remove())
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
