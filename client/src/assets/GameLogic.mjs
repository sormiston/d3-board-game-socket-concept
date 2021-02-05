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
  constructor(board = [], pieces = []) {
    this.board = board
    this.pieces = pieces
    // more state stuff ...
    
  }
  addPiece(piece, pos) {
    this.pieces.push(piece)
    this.board[pos[0]][pos[1]] = piece;
  }
  
  // Searching through matrix must iterate row:col,
  // but for now, reasoning will be done in col:row, like in chess algebraic
  getPosition(piece, coord) {
    for (let row of range(0, 8)) {
      for (let col of range(0, 12)) {
        if (this.board[row][col] && this.board[row][col].id === piece.id) {
          return coord === 'row' ? row : coord === 'col' ? col : [col, row]
        }
      }
    }
    // potentially breaking...?
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
  
  attemptMove(movedToken) {
    const isLegal = this.checkLegality(movedToken)
    
  }
  
  checkLegality(movedToken) {
    
    // is orthogonal
  }
};

export default {
  BoardModel,
  Piece
}