
Example source from Observable:
https://observablehq.com/@d3/click-vs-drag?collection=@d3/d3-drag

On a dragstart event in one browser...
```
function dragstarted(event, d) {
  
  // d.index in the dragging browser can be used as reference to select the equivalent circle in the other browser, and style accordingly.  Convert below into an io emit.
  
  // STACK OVERFLOW: 
  // https://stackoverflow.com/questions/28390754/get-one-element-from-d3js-selection-by-index
  
  const circle = d3.select(svg.selectAll('circle').nodes()[d.index]);
   
}
```

* Board will have to render "upside down" for whoever is playing black.  Least invasive way (to not mutate Board.model.board coord data) to do this would be to control flow BoardView.renderTokens to use inverting scales

## Piece movement flow
