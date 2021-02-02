let socket = io('http://localhost:3000');

let initialized = false;
let socketId;

socket.on('connect', () => {
  console.log('Connected!');
  socket.on('initialize', (data) => {
    if (!initialized) {
      socketId = data.id;
      const tokens = data.tokens;
      d3Tokens(tokens);
      initialized = true;
    }
  });
});

class BoardView {
  radius = 28;
  constructor(board, parent) {
    this.board = board;
    // in demo, parent will be w3 selector `#chart-area`
    this.parent = parent;
    this.drag = d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);

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
  }

  dragstarted(event) {
    svg.select(`#token${event.subject.index}`).attr('stroke', 'black');
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
      .select(`#token${event.subject.index}`)
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
    svg.select(`#token${event.subject.index}`).attr('stroke', null);
    this.board.attemptMove(this);

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
      .attr('r', radius * 2)
      .transition()
      .attr('r', radius);
  }

  async drawGrid() {
    const grid = await d3.svg('assets/Frame2.svg');
    const gridSvg = grid.firstChild;
    gridSvg.id = 'game-board';
    d3.select(this.parent).node().append(gridSvg);
  }

  async initGame() {
    await this.drawGrid();
    const svg = d3.select('#game-board');
    const g = svg.append('g');
    console.log(g);
    renderTokens(g);
  }
  renderTokens(parent) {
    const t = parent.transition().duration(750);
    parent
      .selectAll('circle')
      .data(this.board.model.tokens, (d) => d)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('id', (d) => `token${d.index}`)
            .attr('cx', (d) => xScale(d.col))
            .attr('cy', (d) => yScale(d.row))
            .attr('r', radius)
            .attr('fill', (d) => (d.color === 'white' ? '#E9E5CE' : '#555D50'))
            .call(drag)
            .on('click', clicked),
        (update) =>
          update
            .call((update) => update.transition(t))
            .attr('cx', (d) => xScale(d.col))
            .attr('cy', (d) => yScale(d.row)),
        (exit) =>
          exit
            .call((exit) => exit.transition(t))
            .attr('opacity', 0)
            .remove()
      );
  }
}
class BoardModel {
  
}

class Board {
  constructor() {
    this.model = new BoardModel
  }
  
  attemptMove(token, newPos) {
    // const oldPos = [token.__data__.col, token.__data__.row];
    // const tokenInData = tokens.find((t) => t.index === token.__data__.index);
    // console.log('token passed from event');
    // console.dir(token);
    // console.log('token identified in data');
    // console.log(tokenInData);
    // console.log(`Equivalence: ${tokenInData === token}`);
  }
}
