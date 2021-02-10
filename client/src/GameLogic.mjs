import { v4 as uuidv4 } from 'uuid';
import range from 'lodash.range';
import isEqual from 'lodash.isequal';

class Piece {
  constructor(color, type) {
    this.color = color;
    this.type = type;
    this.id = uuidv4();
  }
}

class BoardModel {
  constructor(board = [], pieces = []) {
    this.board = board;
    this.pieces = pieces;
    this.player = undefined;
    this.toPlay = 'White';
    // more state stuff ...
  }
  addPiece(piece, pos) {
    this.pieces.push(piece);
    this.board[pos[0]][pos[1]] = piece;
  }

  // Searching through matrix must iterate row:col,
  // but for now, reasoning will be done in col:row, like in chess algebraic
  getPosition(piece, coord) {
    for (let row of range(0, 8)) {
      for (let col of range(0, 12)) {
        if (this.board[row][col] && this.board[row][col].id === piece.id) {
          return coord === 'row' ? row : coord === 'col' ? col : { row, col };
        }
      }
    }
    // potentially breaking...?
    return null;
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

    for (let row of [7]) {
      for (let col of range(0, 12)) {
        this.addPiece(new Piece('black', 'pawn'), [row, col]);
      }
    }
  }

  attemptMove(view, piece, oldPos, newPos) {
    const moveConfirmed = this.checkLegality(newPos, oldPos);
    if (moveConfirmed) {
      this.board[oldPos.row][oldPos.col] = null;
      this.board[newPos.row][newPos.col] = piece;

      this.checkCapture(newPos);
      view.updateToPlayDisplay();
      view.renderTokens();
    } else {
      // calling render function "rolls back" illegal user action
      view.renderTokens();
    }
  }

  checkLegality(newPos, oldPos) {
    // false if not actually moved
    if (isEqual(newPos, oldPos)) return false;
    // constants for reasoning
    const { col: oldCol, row: oldRow } = oldPos;
    const { col: newCol, row: newRow } = newPos;
    // Check for orthagonality - no diagonals
    if (oldCol !== newCol && oldRow !== newRow) {
      return false;
    }
    // Blocking piece checks --
    // if movement along COL...
    if (oldCol === newCol) {
      const col = oldCol;
      // movement DOWN on col..?
      if (oldRow < newRow) {
        // non-null hit detection on path
        for (let row of range(oldRow + 1, newRow + 1)) {
          if (this.board[row][col]) return false;
        }
        // else movement UP on col...
      } else if (oldRow > newRow) {
        // non-null hit detection on path
        for (let row of range(oldRow - 1, newRow - 1, -1)) {
          if (this.board[row][col]) return false;
        }
      }
      // checks pass
      return true;

      // else if movement along ROW...
    } else if (oldRow === newRow) {
      const row = oldRow;
      // movement RIGHT on row...?
      if (oldCol < newCol) {
        // non-null hit detection
        for (let col of range(oldCol + 1, newCol + 1)) {
          if (this.board[row][col]) return false;
        }
        // else if movement LEFT on row...?
      } else if (oldCol > newCol) {
        for (let col of range(oldCol - 1, newCol - 1, -1)) {
          if (this.board[row][col]) return false;
        }
      }
      // checks pass
      return true;
    }
  }
  checkCapture() {
    console.log('ding!');
  }
}

export default {
  BoardModel,
  Piece
};
