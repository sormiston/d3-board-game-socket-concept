
On a dragstart event in one browser...
```
function dragstarted(event, d) {
  
  // d.index in the dragging browser can be used as reference to select the equivalent circle in the other browser, and style accordingly.  Convert below into an io emit.
  
  const circle = d3.select(svg.selectAll('circle').nodes()[d.index]);
   
}
```
