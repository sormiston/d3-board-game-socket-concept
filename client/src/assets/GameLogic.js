import { v4 as uuidv4 } from 'uuid'
import range from 'lodash.range'

class Piece {
  constructor(color, type) {
    this.color = color;
    this.type = type;
    this.id = uuidv4();
  }
};

class BoardModel {
  constructor() {
    this.board = []
    this.pieces = []
    // more state stuff ...
    this.setup();
  }
  addPiece(piece, pos) {
    this.pieces.push(piece)
    this.board[pos[0]][pos[1]] = piece;
  }
  
  getPosition(piece) {
    for (let row in range(0, 8)) {
      for (let col in range(0, 12)) {
        if (this.board[row][col] && this.board[row][col] === piece) {
          return [row, col]
        }
      }
    }
    return null
  }
  setup() {
    for (let row of range(0, 8)) {
      this.board.push(new Array(12).fill(null));
    }
    
    for (let row of [0]) {
      for (let col of range(0, 12)) {
        this.addPiece(new Piece('white', 'pawn'), [row, col]);
      }
    }
  }
};

export {
  BoardModel,
  Piece
}