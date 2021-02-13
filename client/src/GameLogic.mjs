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
    this.view = undefined;
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
    this.addPiece(new Piece('white', 'dux'), [1, 6]);
    this.addPiece(new Piece('black', 'dux'), [6, 5]);
  }

  attemptMove(piece, oldPos, newPos) {
    const moveConfirmed = this.checkLegality(newPos, oldPos);
    if (moveConfirmed) {
      this.board[oldPos.row][oldPos.col] = null;
      this.board[newPos.row][newPos.col] = piece;

      this.combat(piece, newPos);

      this.view.updateToPlayDisplay();
      this.view.renderTokens();
    } else {
      // calling render function wihthout mutating state "rolls back" any illegal user action
      this.view.renderTokens();
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
  combat(attacker, newPos) {
    let combats = [
      { ...newPos, row: newPos.row + 1, attackVector: 'bottom' },
      { ...newPos, col: newPos.col + 1, attackVector: 'left' },
      { ...newPos, row: newPos.row - 1, attackVector: 'top' },
      { ...newPos, col: newPos.col - 1, attackVector: 'right' }
    ];

    combats.forEach((square) => {
      const defender = this.getPiece(square);
      if (defender && defender.color !== attacker.color) {
        this.checkCustody(square, defender, attacker);
      }
    });
  }

  checkCustody(square, defender, attacker) {
    if (defender.type === 'dux') {
      console.log('dux case');
      // corner cases, below
    } else if (square.row === 0 && square.col === 0) {
      if (square.attackVector === 'bottom') {
        const support = this.getPiece({ ...square, row: square.row + 1 });
      }
    } else if (square.row === 0 && square.col === 11) {
    } else if (square.row === 7 && square.col === 0) {
    } else if (square.row === 7 && square.col === 11) {
    } else {
      // conventional open field combat
      if (square.attackVector === 'bottom') {
        this.custodialCapture(square, defender, attacker, { row: square.row + 1 });
      } else if (square.attackVector === 'left') {
        this.custodialCapture(square, defender, attacker, { col: square.col + 1 });
      } else if (square.attackVector === 'top') {
        this.custodialCapture(square, defender, attacker, { row: square.row - 1 });
      } else if (square.attackVector === 'right') {
        this.custodialCapture(square, defender, attacker, { col: square.col - 1 });
      }
    }
  }
  // dependent on checkCustody func closure availability to square, defender, attacker
  custodialCapture(square, defender, attacker, offset) {
    const support = this.getPiece({ ...square, ...offset });
    if (support && support.color === attacker.color) {
      this.removePiece(square, defender);
    }
  }

  getPiece(square) {
    if (square.row > 7 || square.row < 0 || square.col > 11 || square.col < 0) {
      return null;
    } else {
      return this.board[square.row][square.col] || null;
    }
  }
  removePiece(square, defender) {
    this.pieces = this.pieces.filter((piece) => piece.id !== defender.id);
    this.board[square.row][square.col] = null;
  }
  // not used currently
  normalizeCoords(obj) {
    obj.row = Math.max(0, Math.min(7, obj.row));
    obj.col = Math.max(0, Math.min(11, obj.col));
    return obj;
  }
}

export default {
  BoardModel,
  Piece
};
