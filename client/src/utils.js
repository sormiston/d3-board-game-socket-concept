function xMirrorTransform(x) {
  return this.boardWidth - x;
}
function yMirrorTransform(y) {
  return this.boardHeight - y;
}
// Drag event handler defs
function dragstarted(event, socket) {
  const pieceSelect = this.tokenLayer.select(`#token${event.subject.id}`);
  const pieceColor = event.subject.color;
  if (
    !event.remote &&
    (pieceColor.toLowerCase() !== this.game.player.toLowerCase() ||
      this.game.player.toLowerCase() !== this.game.toPlay.toLowerCase())
  ) {
    return;
  }
  pieceSelect.attr('stroke', 'black');
  // socket emit
  if (!event.remote) {
    socket.emit('dragStart', {
      event
    });
  }
}
function dragged(event, socket) {
  const pieceSelect = this.tokenLayer.select(`#token${event.subject.id}`);
  const pieceColor = event.subject.color;
  if (
    !event.remote &&
    (pieceColor.toLowerCase() !== this.game.player.toLowerCase() ||
      this.game.player.toLowerCase() !== this.game.toPlay.toLowerCase())
  ) {
    return;
  }
  pieceSelect
    .raise()
    .attr('cx', (d) => Math.max(this.L, Math.min(this.R, event.x)))
    .attr('cy', (d) => Math.max(this.T, Math.min(this.B, event.y)));

  if (!event.remote) {
    socket.emit('drag', {
      event
    });
  }
}
function dragended(event, socket) {
  const pieceSelect = this.tokenLayer.select(`#token${event.subject.id}`);
  const pieceColor = event.subject.color;
  if (
    !event.remote &&
    (pieceColor.toLowerCase() !== this.game.player.toLowerCase() ||
      this.game.player.toLowerCase() !== this.game.toPlay.toLowerCase())
  ) {
    return;
  }

  pieceSelect.attr('stroke', null);
  if (event.x >= 820 || event.x <= 20 || event.y >= 640 || event.y <= 20) {
    this.renderTokens();
    return;
  }

  // TODO: consider splitting the below as an "attemptMove" method of this.game
  const piece = event.subject;
  const oldPos = this.game.getPosition(piece);
  const newPos = {
    row:
      this.game.player === 'black'
        ? this.yReverseScale(event.y)
        : this.yMirrorReverseScale(event.y),
    col:
      this.game.player === 'black'
        ? this.xMirrorReverseScale(event.x)
        : this.xReverseScale(event.x)
  };
  this.game.attemptMove(this, piece, oldPos, newPos);

  // socket emit
  if (!event.remote) {
    socket.emit('dragEnd', {
      event
    });
  }
}

function clicked(event) {
  if (event.defaultPrevented) return; // dragged
  this.tokenLayer
    .select(`#${event.target.id}`)
    .transition()
    .attr('r', this.RADIUS * 2)
    .transition()
    .attr('r', this.RADIUS);
}

export {
  xMirrorTransform,
  yMirrorTransform,
  dragstarted,
  dragged,
  dragended,
  clicked
};
