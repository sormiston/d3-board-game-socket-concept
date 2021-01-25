let socket = io('http://localhost:3000');


socket.on('connect', () => {
  console.log('Connected!');
  socket.on('initialize', (data) => {
    const circles = data;
    d3Circles(circles)
  });
});

const width = 600;
const height = 600;
const radius = 32;


function d3Circles(circles) {

  function dragstarted(event, d) {
    console.log(this.__data__.index);
    console.log(d.index);
    const circle = d3.select(svg.selectAll('circle').nodes()[d.index]);
    circle.attr('fill', 'grey');
    d3.select(this).attr('stroke', 'black');
  }

  function dragged(event, d) {
    d3.select(this)
      // if implementing raise, normalize on dragend
      // .raise()
      .attr('cx', (d.x = event.x))
      .attr('cy', (d.y = event.y));
  }

  function dragended() {
    d3.select(this).attr('stroke', null);
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