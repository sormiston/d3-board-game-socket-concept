let socket = io('http://localhost:3000');

let initialized = false;
let socketId;

socket.on('connect', () => {
  console.log('Connected!');
  socket.on('initialize', (data) => {
    if (!initialized) {
      socketId = data.id;
      const circles = data.circles;
      d3Circles(circles);
      initialized = true;
    }
  });
});

const width = 600;
const height = 600;
const radius = 32;

function d3Circles(circles) {
  socket.on('remoteDragStart', (payload) => {
    if (payload.actor === socketId) return;
    console.log(payload);
    dragstarted({ remote: true, subject: { index: payload.target } });
  });
  function dragstarted(event) {
    svg.select(`#circle${event.subject.index}`).attr('stroke', 'black');
    // socket emit
    if (!event.remote) {
      socket.emit('dragStart', {
        actor: socketId,
        target: event.subject.index
      });
    }
  }

  function dragged(event, d) {
    svg
      .select(`#circle${event.subject.index}`)
      // if implementing raise, normalize on dragend
      .raise()
      .attr('cx', (d.x = event.x))
      .attr('cy', (d.y = event.y));

    console.log(event.subject.index);
    console.log(d.index);
  }

  function dragended(_, d) {
    svg.select(`#circle${d.index}`).attr('stroke', null);
  }

  const drag = d3
    .drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);

  const svg = d3
    .select('#chart-area')
    .append('svg')
    .attr('width', 600)
    .attr('height', 600)
    .attr('stroke-width', 2);

  // const circles = d3.range(20).map((i) => ({
  //   x: Math.random() * (width - radius * 2) + radius,
  //   y: Math.random() * (height - radius * 2) + radius,
  //   index: i
  // }));

  svg
    .selectAll('circle')
    .data(circles, (d) => d.index)
    .join('circle')
    .attr('id', (d) => `circle${d.index}`)
    .attr('cx', (d) => d.x)
    .attr('cy', (d) => d.y)
    .attr('r', radius)
    .attr('fill', (d) => d3.schemeCategory10[d.index % 10])
    .call(drag)
    .on('click', clicked);

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
