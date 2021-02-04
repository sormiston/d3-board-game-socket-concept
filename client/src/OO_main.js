import { BoardModel, Piece } from './assets/GameLogic.js'
import gridSvgSrcCode from './assets/Frame2.svg'

let socket = io('http://localhost:3000');
let initialized = false;
let socketId;

const self = this;

class BoardView {
  radius = 28;
  constructor(game, parent) {
    this.game = game;
    // in demo, parent will be w3 selector `#chart-area`
    this.parent = parent;
    this.drag = d3
      .drag()
      .on('start', this.dragstarted)
      .on('drag', this.dragged)
      .on('end', this.dragended);

    // TODO: soft-code this to take params (from board param?)
    this.xScale = d3.scalePoint().domain(d3.range(1, 13)).range([52, 789]);
    this.yScale = d3.scalePoint().domain(d3.range(1, 9)).range([56, 585]);

    socket.on('remoteDragStart', (payload) => {
      if (payload.actor === socketId) return;
      dragstarted({ ...payload.event, remote: true });
    });
    socket.on('remoteDrag', (payload) => {
      if (payload.actor === socketId) return;
      dragged({ ...payload.event, remote: true });
    });
    socket.on('remoteDragEnd', (payload) => {
      if (payload.actor === socketId) return;
      dragended({ ...payload.event, remote: true });
    });
    
    this.initGame();
  }

  dragstarted(event) {
    svg.select(`#token${event.subject.id}`).attr('stroke', 'black');
    // socket emit
    if (!event.remote) {
      socket.emit('dragStart', {
        event,
        actor: socketId
      });
    }
  }
  dragged(event) {
    svg
      .select(`#token${event.subject.id}`)
      .raise()
      .attr('cx', (d) => (d.x = event.x))
      .attr('cy', (d) => (d.y = event.y));

    if (!event.remote) {
      socket.emit('drag', {
        event,
        actor: socketId
      });
    }
  }
  dragended(event) {
    svg.select(`#token${event.subject.id}`).attr('stroke', null);
    // this.board.attemptMove(this);

    // if remote; call renderTokens for update
    // socket emit
    if (!event.remote) {
      socket.emit('dragEnd', {
        event,
        actor: socketId
      });
    }
  }

  clicked(event, d) {
    if (event.defaultPrevented) return; // dragged

    d3.select(this)
      .transition()
      .attr('r', this.radius * 2)
      .transition()
      .attr('r', this.radius);
  }

  async drawGrid() {
    // const grid = await d3.svg('./assets/Frame2.svg');
    let parser = new DOMParser()
    let gridSvgDoc = parser.parseFromString(gridSvgSrcCode, 'image/svg+xml')
    const gridSvg = gridSvgDoc.firstChild;
    gridSvg.id = 'game-board';
    d3.select(this.parent).node().append(gridSvg);
  }

  async initGame() {
    await this.drawGrid();
    const svg = d3.select('#game-board');
    const g = svg.append('g');
    this.renderTokens(g);
  }

  renderTokens(parent) {
    const t = parent.transition().duration(750);
    parent
      .selectAll('circle')
      .data(this.game.pieces, (piece) => piece.id)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('id', (piece) => `token${piece.id}`)
            .attr('cx', (piece) => {
              console.log(this);
              const pos = this.getPosition(piece);
            })
            .attr('cy', (piece) => this.yScale(piece.row))
            .attr('r', this.radius)
            .attr('fill', (piece) =>
              piece.color === 'white' ? '#E9E5CE' : '#555D50'
            )
            .call(this.drag)
            .on('click', this.clicked),
        (update) =>
          update
            .call((update) => update.transition(t))
            .attr('cx', (piece) => xScale(piece.col))
            .attr('cy', (piece) => yScale(piece.row)),
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
      new BoardView(gameState, '#chart-area');
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
