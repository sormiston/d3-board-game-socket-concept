const Piece = class Piece {
  constructor(color, type, id) {
    this.color = color
    this.type = type
    this.id = id
  }
}

const BoardModel = class BoardModel {
  constructor() {
    this.board = []
    // more state stuff ...
    this.setup()
  }

  addPiece(piece, pos) {
    this.board[pos[0]][pos[1]] = piece
  }
  setup() {
    for (let row of range(0, 8)) {
      this.board.push(new Array(12).fill(null));
    }
    
    for ()
    const tokens = range(20).map(i => ({
      row: Math.ceil(Math.random() * 8),
      col: Math.ceil(Math.random() * 12),
      index: i
    }))
    
    
  }
  }