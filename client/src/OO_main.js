import GameLogic from './assets/GameLogic.mjs';
import gridSvgSrcCode from './assets/Frame2.svg';

let socket = io('http://localhost:3000');
let initialized = false;
let socketId;

let boardModel;
let boardView;

class BoardView {
  radius = 28;

  constructor(game, parent) {
    this.game = game;
    // in demo, parent will be w3 selector `#chart-area`
    this.parent = parent;
    this.drag = d3
      .drag()
      .on('start', (e) => this.dragstarted(e))
      .on('drag', (e) => this.dragged(e))
      .on('end', (e) => this.dragended(e));

    // TODO: soft-code this to take params (from board param?)
    this.xScale = d3.scalePoint().domain(d3.range(0, 12)).range([52, 789]);
    this.yScale = d3.scalePoint().domain(d3.range(0, 9)).range([56, 585]);
    this.xReverseScale = d3.scaleQuantize().domain([52, 789]).range(d3.range(0, 12));
    this.yReverseScale = d3.scaleQuantize().domain([56, 585]).range(d3.range(0, 9));

    socket.on('remoteDragStart', (payload) => {
      if (payload.actor === socketId) return;
      this.dragstarted({ ...payload.event, remote: true });
    });
    socket.on('remoteDrag', (payload) => {
      if (payload.actor === socketId) return;
      this.dragged({ ...payload.event, remote: true });
    });
    socket.on('remoteDragEnd', (payload) => {
      if (payload.actor === socketId) return;
      this.dragended({ ...payload.event, remote: true });
    });

    this.initGame();
  }

  dragstarted(event) {
    this.tokenLayer.select(`#token${event.subject.id}`).attr('stroke', 'black');
    // socket emit
    if (!event.remote) {
      socket.emit('dragStart', {
        event,
        actor: socketId
      });
    }
  }
  dragged(event) {
    console.log(event);
    this.tokenLayer
      .select(`#token${event.subject.id}`)
      .raise()
      .attr('cx', (d) => Math.max(52, Math.min(789, event.x)))
      .attr('cy', (d) => Math.max(56, Math.min(585, event.y)))

    if (!event.remote) {
      socket.emit('drag', {
        event,
        actor: socketId
      });
    }
  }
  dragended(event) {
    this.tokenLayer.select(`#token${event.subject.id}`).attr('stroke', null);
    // Visual checks for legality required to pass to logic checks:
    // Must be within board bounds
    if (event.x >= 800 || event.x <= 52 || event.y >= 620 || event.y <= 20) {
      this.renderTokens();
      return;
    }
    // Get relevant args for logic
    const piece = event.subject;
    const oldPos = boardModel.getPosition(piece);
    const newPos = [this.xReverseScale(event.x), this.yReverseScale(event.y)];

    console.log(oldPos);
    console.log(newPos);

    // drill to HTML element and pass on to boardModel to for gaming logic
    // const movedTokenHTMLElt = moved._groups[0];
    // boardModel.attemptMove(movedTokenHTMLElt, event);

    // if remote; call renderTokens for update
    // socket emit
    if (!event.remote) {
      socket.emit('dragEnd', {
        event,
        actor: socketId
      });
    }
  }

  clicked(event) {
    if (event.defaultPrevented) return; // dragged
    this.tokenLayer
      .select(`#${event.target.id}`)
      .transition()
      .attr('r', this.radius * 2)
      .transition()
      .attr('r', this.radius);
  }

  async drawGrid() {
    // const grid = await d3.svg('./assets/Frame2.svg');
    const parser = new DOMParser();
    const gridSvgDoc = parser.parseFromString(gridSvgSrcCode, 'image/svg+xml');
    const gridSvg = gridSvgDoc.firstChild;
    gridSvg.id = 'game-board';
    d3.select(this.parent).node().append(gridSvg);
  }

  async initGame() {
    await this.drawGrid();
    this.svg = d3.select('#game-board');
    this.tokenLayer = this.svg.append('g');
    this.renderTokens();
  }

  renderTokens() {
    console.log('rendering tokens');
    console.log(this.tokenLayer)
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
              // boardModel is referencing its OWN state here...careful..
              const col = boardModel.getPosition(piece, 'col');
              return this.xScale(col);
            })
            .attr('cy', (piece) => {
              const row = boardModel.getPosition(piece, 'row');
              return this.yScale(row);
            })
            .attr('r', this.radius)
            .attr('fill', (piece) =>
              piece.color === 'white' ? '#E9E5CE' : '#555D50'
            )
            .call(this.drag)
            .on('click', (e) => this.clicked(e)),
        (update) =>
          update
            .call((update) => update.transition(t))
            .attr('cx', (piece) => {
              const col = boardModel.getPosition(piece, 'col');

              return this.xScale(col);
            })
            .attr('cy', (piece) => {
              const row = boardModel.getPosition(piece, 'row');
              return this.yScale(row);
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
      boardModel = new GameLogic.BoardModel(gameState.board, gameState.pieces);
      boardView = new BoardView(gameState, '#chart-area');
      initialized = true;
    }
  });
});

// attemptMove(token, newPos) {
// const oldPos = [token.__data__.col, token.__data__.row];
// const tokenInData = tokens.find((t) => t.id === token.__data__.id);
// console.log('token passed from event');
// console.dir(token);
// console.log('token identified in data');
// console.log(tokenInData);
// console.log(`Equivalence: ${tokenInData === token}`);
// }
