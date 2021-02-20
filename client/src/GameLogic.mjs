import { v4 as uuidv4 } from 'uuid';
import range from 'lodash.range';
import isEqual from 'lodash.isequal';

class CustomError extends Error {
  constructor(message, type) {
    super(message);
    this.type = type;
  }
}
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
    this.gameOver = false;
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
    // testing set up
    // this.addPiece(new Piece('white', 'dux'), [0, 0]);
    // this.addPiece(new Piece('white', 'dux'), [7, 0]);
    // this.addPiece(new Piece('black', 'dux'), [0, 11]);
    // this.addPiece(new Piece('black', 'dux'), [7, 11]);

    // this.addPiece(new Piece('white', 'pawn'), [0, 1]);
    // this.addPiece(new Piece('white', 'pawn'), [0, 6]);
    // this.addPiece(new Piece('black', 'pawn'), [1, 4]);

    // this.addPiece(new Piece('white', 'pawn'), [6, 4]);

    // standard set up
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
    try {
      this.checkLegality(newPos, oldPos);

      this.board[oldPos.row][oldPos.col] = null;
      this.board[newPos.row][newPos.col] = piece;

      this.combat(piece, newPos);

      if (!this.gameOver) {
        this.view.updateToPlayDisplay();
        this.view.renderTokens();
      }
    } catch (error) {
      console.log(error.type, error.message);

      if (error.type === 2) {
        this.board[oldPos.row][oldPos.col] = piece;
        this.board[newPos.row][newPos.col] = null;
      }

      this.view.renderTokens();
    }
  }

  checkLegality(newPos, oldPos) {
    // false if not actually moved
    if (isEqual(newPos, oldPos))
      throw new CustomError('piece touched but not moved', 1);
    // constants for reasoning
    const { col: oldCol, row: oldRow } = oldPos;
    const { col: newCol, row: newRow } = newPos;
    // Check for orthagonality - no diagonals
    if (oldCol !== newCol && oldRow !== newRow) {
      throw new CustomError('non-orthogonal piece movement', 1);
    }
    // Blocking piece checks --
    // if movement along COL...
    if (oldCol === newCol) {
      const col = oldCol;
      // movement DOWN on col..?
      if (oldRow < newRow) {
        // non-null hit detection on path
        for (let row of range(oldRow + 1, newRow + 1)) {
          if (this.board[row][col])
            throw new CustomError(
              `path blocked at ${String.fromCharCode(col + 65)}${row.toString()}`,
              1
            );
        }
        // else movement UP on col...
      } else if (oldRow > newRow) {
        // non-null hit detection on path
        for (let row of range(oldRow - 1, newRow - 1, -1)) {
          if (this.board[row][col])
            throw new CustomError(
              `path blocked at ${String.fromCharCode(col + 65)}${row.toString()}`,
              1
            );
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
          if (this.board[row][col])
            throw new CustomError(
              `path blocked at ${String.fromCharCode(col + 65)}${row.toString()}`,
              1
            );
        }
        // else if movement LEFT on row...?
      } else if (oldCol > newCol) {
        for (let col of range(oldCol - 1, newCol - 1, -1)) {
          if (this.board[row][col])
            throw new CustomError(
              `path blocked at ${String.fromCharCode(col + 65)}${row.toString()}`,
              1
            );
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
      if (defender && defender.type === 'dux' && defender.color === attacker.color) {
        this.checkCustody(square, defender, attacker, true);
      }
      if (defender && defender.color !== attacker.color) {
        this.checkCustody(square, defender, attacker);
      }
    });
  }

  declareWinner(defender) {
    alert(defender.color === 'white' ? 'Black wins!' : 'White wins!');
  }

  checkCustody(square, defender, attacker, suicide = false) {
    if (defender.type === 'dux') {
      console.log('dux case');
      // Checkmate through immobilization, incl. smothered mate (friendly pieces as blocking hazards)
      // corner cases
      if (
        (square.row === 0 &&
          square.col === 0 &&
          this.getPiece({ ...square, row: square.row + 1 }) &&
          this.getPiece({ ...square, col: square.col + 1 })) ||
        (square.row === 0 &&
          square.col === 11 &&
          this.getPiece({ ...square, row: square.row + 1 }) &&
          this.getPiece({ ...square, col: square.col - 1 })) ||
        (square.row === 7 &&
          square.col === 0 &&
          this.getPiece({ ...square, row: square.row - 1 }) &&
          this.getPiece({ ...square, col: square.col + 1 })) ||
        (square.row === 7 &&
          square.col === 11 &&
          this.getPiece({ ...square, row: square.row - 1 }) &&
          this.getPiece({ ...square, col: square.col - 1 })) ||
        // edge cases
        (square.row === 0 &&
          this.getPiece({ ...square, col: square.col - 1 }) &&
          this.getPiece({ ...square, row: square.row + 1 }) &&
          this.getPiece({ ...square, col: square.col + 1 })) ||
        (square.col === 0 &&
          this.getPiece({ ...square, row: square.row - 1 }) &&
          this.getPiece({ ...square, col: square.col + 1 }) &&
          this.getPiece({ ...square, row: square.row + 1 })) ||
        (square.row === 7 &&
          this.getPiece({ ...square, col: square.col - 1 }) &&
          this.getPiece({ ...square, row: square.row - 1 }) &&
          this.getPiece({ ...square, col: square.col + 1 })) ||
        (square.col === 11 &&
          this.getPiece({ ...square, row: square.row - 1 }) &&
          this.getPiece({ ...square, col: square.col - 1 }) &&
          this.getPiece({ ...square, row: square.row + 1 })) ||
        // open-field
        (this.getPiece({ ...square, col: square.col - 1 }) &&
          this.getPiece({ ...square, row: square.row + 1 }) &&
          this.getPiece({ ...square, col: square.col + 1 }) &&
          this.getPiece({ ...square, row: square.row - 1 }))
      ) {
        if (suicide) throw new CustomError('cannot trap own dux', 2);
        else {
          this.removePiece(defender);
          this.view.renderTokens();
          this.declareWinner(defender);
          this.gameOver = true;
        }
      }
    }
    // pawn-to-pawn combat
    // corner cases
    else if (square.row === 0 && square.col === 0) {
      if (square.attackVector === 'top') {
        this.custodialCapture(square, defender, attacker, { col: square.col + 1 });
      } else if (square.attackVector === 'right') {
        this.custodialCapture(square, defender, attacker, { row: square.row + 1 });
      }
    } else if (square.row === 0 && square.col === 11) {
      if (square.attackVector === 'top') {
        this.custodialCapture(square, defender, attacker, { col: square.col - 1 });
      } else if (square.attackVector === 'left') {
        this.custodialCapture(square, defender, attacker, { row: square.row + 1 });
      }
    } else if (square.row === 7 && square.col === 0) {
      if (square.attackVector === 'bottom') {
        this.custodialCapture(square, defender, attacker, { col: square.col + 1 });
      } else if (square.attackVector === 'right') {
        this.custodialCapture(square, defender, attacker, { row: square.row - 1 });
      }
    } else if (square.row === 7 && square.col === 11) {
      if (square.attackVector === 'bottom') {
        this.custodialCapture(square, defender, attacker, { col: square.col - 1 });
      } else if (square.attackVector === 'left') {
        this.custodialCapture(square, defender, attacker, { row: square.row - 1 });
      }

      // standard pawn to pawn open field combat
    } else {
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

  custodialCapture(square, defender, attacker, offsetOverwrite) {
    const coattacker = this.getPiece({ ...square, ...offsetOverwrite });
    if (coattacker && coattacker.color === attacker.color) {
      this.removePiece(defender);
    }
  }

  getPiece(square) {
    if (square.row > 7 || square.row < 0 || square.col > 11 || square.col < 0) {
      return null;
    } else {
      return this.board[square.row][square.col] || null;
    }
  }
  removePiece(defender) {
    this.pieces = this.pieces.filter((piece) => piece.id !== defender.id);
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
