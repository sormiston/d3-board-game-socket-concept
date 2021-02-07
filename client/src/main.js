import GameLogic from './assets/GameLogic.mjs';
import gridSvgSrcCode from './assets/Board.svg';

let socket = io('http://localhost:3000');
let initialized = false;
let socketId;

class BoardView {
  RADIUS = 28;
  L = 54;
  R = 786;
  T = 58;
  B = 582;

  constructor(game, parent) {
    this.game = game;
    // in demo, parent will be w3 selector `#chart-area`
    this.parent = parent;
    this.drag = d3
      .drag()
      .on('start', (e) => this.dragstarted(e))
      .on('drag', (e) => this.dragged(e))
      .on('end', (e) => this.dragended(e));

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
      .domain([this.R, this.L])
      .range(d3.range(0, 12));
    this.yMirrorReverseScale = d3
      .scaleQuantize()
      .domain([this.B, this.T])
      .range(d3.range(0, 8));

    // Set Socket listeners
    socket.on('remoteDragStart', (payload) => {
      this.dragstarted({ ...payload.event, remote: true });
    });
    socket.on('remoteDrag', (payload) => {
      this.dragged({ ...payload.event, remote: true });
    });
    socket.on('remoteDragEnd', (payload) => {
      this.dragended({ ...payload.event, remote: true });
    });

    // Initialization call
    this.initGame();
  }

  dragstarted(event) {
    this.tokenLayer.select(`#token${event.subject.id}`).attr('stroke', 'black');
    // socket emit
    if (!event.remote) {
      socket.emit('dragStart', {
        event
      });
    }
  }
  dragged(event) {
    this.tokenLayer
      .select(`#token${event.subject.id}`)
      .raise()
      .attr('cx', (d) => Math.max(52, Math.min(789, event.x)))
      .attr('cy', (d) => Math.max(56, Math.min(585, event.y)));

    if (!event.remote) {
      socket.emit('drag', {
        event
      });
    }
  }
  dragended(event) {
    this.tokenLayer.select(`#token${event.subject.id}`).attr('stroke', null);

    // Visual checks for legality required before passing to matrix-coordinate based logic checks:
    // Must be within board bounds
    if (event.x >= 800 || event.x <= 52 || event.y >= 620 || event.y <= 20) {
      this.renderTokens();
      return;
    }
    // Get relevant args for next tests
    const piece = event.subject;
    // ROW:COL
    const oldPos = this.game.getPosition(piece);
    const newPos = {
      row: this.yReverseScale(event.y),
      col: this.xReverseScale(event.x)
    };

    // store boolean result of legality checks
    const moveConfirmed = this.game.checkLegality(newPos, oldPos);
    // result: mutate state + broadcast to server/opponent OR do not mutate state and renderTokens() to rollback illegal move
    if (moveConfirmed) {
      const piece = this.game.board[oldPos.row][oldPos.col];
      this.game.board[oldPos.row][oldPos.col] = null;
      this.game.board[newPos.row][newPos.col] = piece;
      // local update to fine tune token placement
      this.renderTokens();
      // TODO: socket broadcast updated board
    } else {
      this.renderTokens();
    }
    // TODO: socket listen -> if remote AND this player is not actor -> call renderTokens for update

    // socket emit
    if (!event.remote) {
      socket.emit('dragEnd', {
        event
      });
    }
  }

  clicked(event) {
    if (event.defaultPrevented) return; // dragged
    this.tokenLayer
      .select(`#${event.target.id}`)
      .transition()
      .attr('r', this.RADIUS * 2)
      .transition()
      .attr('r', this.RADIUS);
  }

  async drawGrid() {
    const parser = new DOMParser();
    const gridSvgDoc = parser.parseFromString(gridSvgSrcCode, 'image/svg+xml');
    const gridSvg = gridSvgDoc.firstChild;
    gridSvg.id = 'game-board';
    d3.select(this.parent).node().append(gridSvg);
  }

  async initGame() {
    this.game.player = prompt('Playing black or white?');
    await this.drawGrid();
    this.svg = d3.select('#game-board');
    this.tokenLayer = this.svg.append('g');
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
            .on('click', (e) => this.clicked(e)),
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
