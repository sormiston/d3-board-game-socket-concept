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

const width = 600;
const height = 600;
const radius = 28;

async function d3Tokens(tokens) {
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

  function dragstarted(event) {
    svg.select(`#token${event.subject.index}`).attr('stroke', 'black');
    // socket emit
    if (!event.remote) {
      socket.emit('dragStart', {
        event,
        actor: socketId
      });
    }
  }
  function dragged(event) {
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
  function dragended(event) {
    svg.select(`#token${event.subject.index}`).attr('stroke', null);
    
    attemptMove(this)
    
    // socket emit
    if (!event.remote) {
      socket.emit('dragEnd', {
        event,
        actor: socketId
      });
    }
  }

  const drag = d3
    .drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);


  const xScale = d3.scalePoint().domain(d3.range(1,13)).range([52, 789]);
  const yScale = d3.scalePoint().domain(d3.range(1,9)).range([56, 585]);


  const root = d3.select('#chart-area');

  await d3.svg('assets/Frame2.svg').then((board) => {
    const boardSvg = board.firstChild;
    boardSvg.id = 'game-board';
    root.node().append(boardSvg);
  });
  
  const svg = d3.select('#game-board');
  
  const g = svg.append('g');
  g.selectAll('circle')
    .data(tokens, (d) => d.index)
    .join('circle')
    .attr('id', (d) => `token${d.index}`)
    .attr('cx', (d) => xScale(d.col))
    .attr('cy', (d) => yScale(d.row))
    .attr('r', radius)
    .attr('fill', (d) => d3.schemeCategory10[d.index % 10])
    .call(drag)
    .on('click', clicked);

  function update() {
    console.log('ran an update');
    console.log(tokens)
    const pieces = g.selectAll('circle')
  }
  
 
  function attemptMove(token, newPos) {
    const oldPos = [token.__data__.col, token.__data__.row]
    const tokenInData = tokens.find(t => t.index === token.__data__.index)
    console.log('token passed from event')
    console.dir(token);
    console.log(('token identified in data'))
    console.log(tokenInData);
    console.log(`Equivalence: ${tokenInData === token}`);
  }
  
  function clicked(event, d) {
    if (event.defaultPrevented) return; // dragged

    d3.select(this)
      .transition()
      .attr('fill', 'black')
      .attr('r', radius * 2)
      .transition()
      .attr('r', radius)
      .attr('fill', d3.schemeCategory10[d.index % 10]);
  }
}
