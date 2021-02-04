/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/OO_main.js":
/*!************************!*\
  !*** ./src/OO_main.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_GameLogic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets/GameLogic.js */ "./src/assets/GameLogic.js");
var _this = undefined;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var socket = io('http://localhost:3000');
var initialized = false;
var socketId;
var self = undefined;
socket.on('connect', function () {
  console.log('Connected!');
  socket.on('initialize', function (data) {
    if (!initialized) {
      socketId = data.id;
      var gameState = data.gameSetup;
      _this.game = new BoardView(gameState, '#chart-area');
      initialized = true;
    }
  });
});

var BoardView = /*#__PURE__*/function () {
  function BoardView(gameState, parent) {
    _classCallCheck(this, BoardView);

    _defineProperty(this, "radius", 28);

    this.gameState = gameState; // in demo, parent will be w3 selector `#chart-area`

    this.parent = parent;
    this.drag = d3.drag().on('start', this.dragstarted).on('drag', this.dragged).on('end', this.dragended); // TODO: soft-code this to take params (from board param?)

    this.xScale = d3.scalePoint().domain(d3.range(1, 13)).range([52, 789]);
    this.yScale = d3.scalePoint().domain(d3.range(1, 9)).range([56, 585]);
    socket.on('remoteDragStart', function (payload) {
      if (payload.actor === socketId) return;
      dragstarted(_objectSpread(_objectSpread({}, payload.event), {}, {
        remote: true
      }));
    });
    socket.on('remoteDrag', function (payload) {
      if (payload.actor === socketId) return;
      dragged(_objectSpread(_objectSpread({}, payload.event), {}, {
        remote: true
      }));
    });
    socket.on('remoteDragEnd', function (payload) {
      if (payload.actor === socketId) return;
      dragended(_objectSpread(_objectSpread({}, payload.event), {}, {
        remote: true
      }));
    });
    console.log(this.gameState);
    this.initGame();
  }

  _createClass(BoardView, [{
    key: "dragstarted",
    value: function dragstarted(event) {
      svg.select("#token".concat(event.subject.id)).attr('stroke', 'black'); // socket emit

      if (!event.remote) {
        socket.emit('dragStart', {
          event: event,
          actor: socketId
        });
      }
    }
  }, {
    key: "dragged",
    value: function dragged(event) {
      svg.select("#token".concat(event.subject.id)).raise().attr('cx', function (d) {
        return d.x = event.x;
      }).attr('cy', function (d) {
        return d.y = event.y;
      });

      if (!event.remote) {
        socket.emit('drag', {
          event: event,
          actor: socketId
        });
      }
    }
  }, {
    key: "dragended",
    value: function dragended(event) {
      svg.select("#token".concat(event.subject.id)).attr('stroke', null); // this.board.attemptMove(this);
      // if remote; call renderTokens for update
      // socket emit

      if (!event.remote) {
        socket.emit('dragEnd', {
          event: event,
          actor: socketId
        });
      }
    }
  }, {
    key: "clicked",
    value: function clicked(event, d) {
      if (event.defaultPrevented) return; // dragged

      d3.select(this).transition().attr('r', this.radius * 2).transition().attr('r', this.radius);
    }
  }, {
    key: "drawGrid",
    value: function () {
      var _drawGrid = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var grid, gridSvg;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return d3.svg('assets/Frame2.svg');

              case 2:
                grid = _context.sent;
                gridSvg = grid.firstChild;
                gridSvg.id = 'game-board';
                d3.select(this.parent).node().append(gridSvg);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function drawGrid() {
        return _drawGrid.apply(this, arguments);
      }

      return drawGrid;
    }()
  }, {
    key: "initGame",
    value: function () {
      var _initGame = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var svg, g;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.drawGrid();

              case 2:
                svg = d3.select('#game-board');
                g = svg.append('g');
                this.renderTokens(g);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function initGame() {
        return _initGame.apply(this, arguments);
      }

      return initGame;
    }()
  }, {
    key: "renderTokens",
    value: function renderTokens(parent) {
      var _this2 = this;

      var t = parent.transition().duration(750);
      parent.selectAll('circle').data(this.gameState.pieces, function (piece) {
        return piece.id;
      }).join(function (enter) {
        return enter.append('circle').attr('id', function (piece) {
          return "token".concat(piece.id);
        }).attr('cx', function (piece) {
          console.log(_this2);

          var pos = _this2.getPosition(piece);
        }).attr('cy', function (piece) {
          return _this2.yScale(piece.row);
        }).attr('r', _this2.radius).attr('fill', function (piece) {
          return piece.color === 'white' ? '#E9E5CE' : '#555D50';
        }).call(_this2.drag).on('click', _this2.clicked);
      }, function (update) {
        return update.call(function (update) {
          return update.transition(t);
        }).attr('cx', function (piece) {
          return xScale(piece.col);
        }).attr('cy', function (piece) {
          return yScale(piece.row);
        });
      }, function (exit) {
        return exit.call(function (exit) {
          return exit.transition(t);
        }).attr('opacity', 0).remove();
      });
    }
  }]);

  return BoardView;
}(); // attemptMove(token, newPos) {
// const oldPos = [token.__data__.col, token.__data__.row];
// const tokenInData = tokens.find((t) => t.id === token.__data__.id);
// console.log('token passed from event');
// console.dir(token);
// console.log('token identified in data');
// console.log(tokenInData);
// console.log(`Equivalence: ${tokenInData === token}`);
// }

/***/ }),

/***/ "./src/assets/GameLogic.js":
/*!*********************************!*\
  !*** ./src/assets/GameLogic.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoardModel": () => (/* binding */ BoardModel),
/* harmony export */   "Piece": () => (/* binding */ Piece)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var lodash_range__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash.range */ "./node_modules/lodash.range/index.js");
/* harmony import */ var lodash_range__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_range__WEBPACK_IMPORTED_MODULE_0__);
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var Piece = function Piece(color, type) {
  _classCallCheck(this, Piece);

  this.color = color;
  this.type = type;
  this.id = (0,uuid__WEBPACK_IMPORTED_MODULE_1__.default)();
};

;

var BoardModel = /*#__PURE__*/function () {
  function BoardModel() {
    _classCallCheck(this, BoardModel);

    this.board = [];
    this.pieces = []; // more state stuff ...

    this.setup();
  }

  _createClass(BoardModel, [{
    key: "addPiece",
    value: function addPiece(piece, pos) {
      this.pieces.push(piece);
      this.board[pos[0]][pos[1]] = piece;
    }
  }, {
    key: "getPosition",
    value: function getPosition(piece) {
      for (var row in lodash_range__WEBPACK_IMPORTED_MODULE_0___default()(0, 8)) {
        for (var col in lodash_range__WEBPACK_IMPORTED_MODULE_0___default()(0, 12)) {
          if (this.board[row][col] && this.board[row][col] === piece) {
            return [row, col];
          }
        }
      }

      return null;
    }
  }, {
    key: "setup",
    value: function setup() {
      var _iterator = _createForOfIteratorHelper(lodash_range__WEBPACK_IMPORTED_MODULE_0___default()(0, 8)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _row = _step.value;
          this.board.push(new Array(12).fill(null));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      for (var _i = 0, _arr = [0]; _i < _arr.length; _i++) {
        var row = _arr[_i];

        var _iterator2 = _createForOfIteratorHelper(lodash_range__WEBPACK_IMPORTED_MODULE_0___default()(0, 12)),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var col = _step2.value;
            this.addPiece(new Piece('white', 'pawn'), [row, col]);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }
  }]);

  return BoardModel;
}();

;


/***/ }),

/***/ "./node_modules/lodash.range/index.js":
/*!********************************************!*\
  !*** ./node_modules/lodash.range/index.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax = Math.max;

/**
 * The base implementation of `_.range` and `_.rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}

/**
 * Creates a `_.range` or `_.rangeRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new range function.
 */
function createRange(fromRight) {
  return function(start, end, step) {
    if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
      end = step = undefined;
    }
    // Ensure the sign of `-0` is preserved.
    start = toFinite(start);
    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = toFinite(end);
    }
    step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
    return baseRange(start, end, step, fromRight);
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
 * `start` is specified without an `end` or `step`. If `end` is not specified,
 * it's set to `start` with `start` then set to `0`.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.rangeRight
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(-4);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
var range = createRange();

module.exports = range;


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.default)(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__.default.test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/OO_main.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvT09fbWFpbi5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvYXNzZXRzL0dhbWVMb2dpYy5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvbG9kYXNoLnJhbmdlL2luZGV4LmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcmVnZXguanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NC5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL2NsaWVudC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jbGllbnQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jbGllbnQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jbGllbnQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jbGllbnQvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbInNvY2tldCIsImlvIiwiaW5pdGlhbGl6ZWQiLCJzb2NrZXRJZCIsInNlbGYiLCJvbiIsImNvbnNvbGUiLCJsb2ciLCJkYXRhIiwiaWQiLCJnYW1lU3RhdGUiLCJnYW1lU2V0dXAiLCJnYW1lIiwiQm9hcmRWaWV3IiwicGFyZW50IiwiZHJhZyIsImQzIiwiZHJhZ3N0YXJ0ZWQiLCJkcmFnZ2VkIiwiZHJhZ2VuZGVkIiwieFNjYWxlIiwic2NhbGVQb2ludCIsImRvbWFpbiIsInJhbmdlIiwieVNjYWxlIiwicGF5bG9hZCIsImFjdG9yIiwiZXZlbnQiLCJyZW1vdGUiLCJpbml0R2FtZSIsInN2ZyIsInNlbGVjdCIsInN1YmplY3QiLCJhdHRyIiwiZW1pdCIsInJhaXNlIiwiZCIsIngiLCJ5IiwiZGVmYXVsdFByZXZlbnRlZCIsInRyYW5zaXRpb24iLCJyYWRpdXMiLCJncmlkIiwiZ3JpZFN2ZyIsImZpcnN0Q2hpbGQiLCJub2RlIiwiYXBwZW5kIiwiZHJhd0dyaWQiLCJnIiwicmVuZGVyVG9rZW5zIiwidCIsImR1cmF0aW9uIiwic2VsZWN0QWxsIiwicGllY2VzIiwicGllY2UiLCJqb2luIiwiZW50ZXIiLCJwb3MiLCJnZXRQb3NpdGlvbiIsInJvdyIsImNvbG9yIiwiY2FsbCIsImNsaWNrZWQiLCJ1cGRhdGUiLCJjb2wiLCJleGl0IiwicmVtb3ZlIiwiUGllY2UiLCJ0eXBlIiwidXVpZHY0IiwiQm9hcmRNb2RlbCIsImJvYXJkIiwic2V0dXAiLCJwdXNoIiwiQXJyYXkiLCJmaWxsIiwiYWRkUGllY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUEsSUFBSUEsTUFBTSxHQUFHQyxFQUFFLENBQUMsdUJBQUQsQ0FBZjtBQUNBLElBQUlDLFdBQVcsR0FBRyxLQUFsQjtBQUNBLElBQUlDLFFBQUo7QUFFQSxJQUFNQyxJQUFJLEdBQUcsU0FBYjtBQUVBSixNQUFNLENBQUNLLEVBQVAsQ0FBVSxTQUFWLEVBQXFCLFlBQU07QUFDekJDLFNBQU8sQ0FBQ0MsR0FBUixDQUFZLFlBQVo7QUFDQVAsUUFBTSxDQUFDSyxFQUFQLENBQVUsWUFBVixFQUF3QixVQUFDRyxJQUFELEVBQVU7QUFDaEMsUUFBSSxDQUFDTixXQUFMLEVBQWtC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RXZDO0FBQ0E7QUFDQSwrQ0FBK0MsNENBQUcsSUFBSTs7QUFFdEQ7QUFDQSxrQ0FBa0M7O0FBRWxDO0FBQ0E7O0FBRUEsbUJBQW1CLFFBQVE7QUFDM0I7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFNBQVMsc0RBQVM7QUFDbEI7O0FBRUEsaUVBQWUsRUFBRSxFOzs7Ozs7Ozs7Ozs7Ozs7O0FDdkJjOztBQUUvQjtBQUNBLHFDQUFxQyxtREFBVTtBQUMvQzs7QUFFQSxpRUFBZSxRQUFRLEU7Ozs7OztVQ052QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGdDQUFnQyxZQUFZO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJtYWluLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJvYXJkTW9kZWwsIFBpZWNlIH0gZnJvbSAnLi9hc3NldHMvR2FtZUxvZ2ljLmpzJ1xuXG5sZXQgc29ja2V0ID0gaW8oJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcpO1xubGV0IGluaXRpYWxpemVkID0gZmFsc2U7XG5sZXQgc29ja2V0SWQ7XG5cbmNvbnN0IHNlbGYgPSB0aGlzO1xuXG5zb2NrZXQub24oJ2Nvbm5lY3QnLCAoKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdDb25uZWN0ZWQhJyk7XG4gIHNvY2tldC5vbignaW5pdGlhbGl6ZScsIChkYXRhKSA9PiB7XG4gICAgaWYgKCFpbml0aWFsaXplZCkge1xuICAgICAgc29ja2V0SWQgPSBkYXRhLmlkO1xuICAgICAgY29uc3QgZ2FtZVN0YXRlID0gZGF0YS5nYW1lU2V0dXA7XG4gICAgICB0aGlzLmdhbWUgPSBuZXcgQm9hcmRWaWV3KGdhbWVTdGF0ZSwgJyNjaGFydC1hcmVhJyk7XG4gICAgICBpbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5jbGFzcyBCb2FyZFZpZXcge1xuICByYWRpdXMgPSAyODtcbiAgY29uc3RydWN0b3IoZ2FtZVN0YXRlLCBwYXJlbnQpIHtcbiAgICB0aGlzLmdhbWVTdGF0ZSA9IGdhbWVTdGF0ZTtcbiAgICAvLyBpbiBkZW1vLCBwYXJlbnQgd2lsbCBiZSB3MyBzZWxlY3RvciBgI2NoYXJ0LWFyZWFgXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5kcmFnID0gZDNcbiAgICAgIC5kcmFnKClcbiAgICAgIC5vbignc3RhcnQnLCB0aGlzLmRyYWdzdGFydGVkKVxuICAgICAgLm9uKCdkcmFnJywgdGhpcy5kcmFnZ2VkKVxuICAgICAgLm9uKCdlbmQnLCB0aGlzLmRyYWdlbmRlZCk7XG5cbiAgICAvLyBUT0RPOiBzb2Z0LWNvZGUgdGhpcyB0byB0YWtlIHBhcmFtcyAoZnJvbSBib2FyZCBwYXJhbT8pXG4gICAgdGhpcy54U2NhbGUgPSBkMy5zY2FsZVBvaW50KCkuZG9tYWluKGQzLnJhbmdlKDEsIDEzKSkucmFuZ2UoWzUyLCA3ODldKTtcbiAgICB0aGlzLnlTY2FsZSA9IGQzLnNjYWxlUG9pbnQoKS5kb21haW4oZDMucmFuZ2UoMSwgOSkpLnJhbmdlKFs1NiwgNTg1XSk7XG5cbiAgICBzb2NrZXQub24oJ3JlbW90ZURyYWdTdGFydCcsIChwYXlsb2FkKSA9PiB7XG4gICAgICBpZiAocGF5bG9hZC5hY3RvciA9PT0gc29ja2V0SWQpIHJldHVybjtcbiAgICAgIGRyYWdzdGFydGVkKHsgLi4ucGF5bG9hZC5ldmVudCwgcmVtb3RlOiB0cnVlIH0pO1xuICAgIH0pO1xuICAgIHNvY2tldC5vbigncmVtb3RlRHJhZycsIChwYXlsb2FkKSA9PiB7XG4gICAgICBpZiAocGF5bG9hZC5hY3RvciA9PT0gc29ja2V0SWQpIHJldHVybjtcbiAgICAgIGRyYWdnZWQoeyAuLi5wYXlsb2FkLmV2ZW50LCByZW1vdGU6IHRydWUgfSk7XG4gICAgfSk7XG4gICAgc29ja2V0Lm9uKCdyZW1vdGVEcmFnRW5kJywgKHBheWxvYWQpID0+IHtcbiAgICAgIGlmIChwYXlsb2FkLmFjdG9yID09PSBzb2NrZXRJZCkgcmV0dXJuO1xuICAgICAgZHJhZ2VuZGVkKHsgLi4ucGF5bG9hZC5ldmVudCwgcmVtb3RlOiB0cnVlIH0pO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuZ2FtZVN0YXRlKTtcbiAgICB0aGlzLmluaXRHYW1lKCk7XG4gIH1cblxuICBkcmFnc3RhcnRlZChldmVudCkge1xuICAgIHN2Zy5zZWxlY3QoYCN0b2tlbiR7ZXZlbnQuc3ViamVjdC5pZH1gKS5hdHRyKCdzdHJva2UnLCAnYmxhY2snKTtcbiAgICAvLyBzb2NrZXQgZW1pdFxuICAgIGlmICghZXZlbnQucmVtb3RlKSB7XG4gICAgICBzb2NrZXQuZW1pdCgnZHJhZ1N0YXJ0Jywge1xuICAgICAgICBldmVudCxcbiAgICAgICAgYWN0b3I6IHNvY2tldElkXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgZHJhZ2dlZChldmVudCkge1xuICAgIHN2Z1xuICAgICAgLnNlbGVjdChgI3Rva2VuJHtldmVudC5zdWJqZWN0LmlkfWApXG4gICAgICAucmFpc2UoKVxuICAgICAgLmF0dHIoJ2N4JywgKGQpID0+IChkLnggPSBldmVudC54KSlcbiAgICAgIC5hdHRyKCdjeScsIChkKSA9PiAoZC55ID0gZXZlbnQueSkpO1xuXG4gICAgaWYgKCFldmVudC5yZW1vdGUpIHtcbiAgICAgIHNvY2tldC5lbWl0KCdkcmFnJywge1xuICAgICAgICBldmVudCxcbiAgICAgICAgYWN0b3I6IHNvY2tldElkXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgZHJhZ2VuZGVkKGV2ZW50KSB7XG4gICAgc3ZnLnNlbGVjdChgI3Rva2VuJHtldmVudC5zdWJqZWN0LmlkfWApLmF0dHIoJ3N0cm9rZScsIG51bGwpO1xuICAgIC8vIHRoaXMuYm9hcmQuYXR0ZW1wdE1vdmUodGhpcyk7XG5cbiAgICAvLyBpZiByZW1vdGU7IGNhbGwgcmVuZGVyVG9rZW5zIGZvciB1cGRhdGVcbiAgICAvLyBzb2NrZXQgZW1pdFxuICAgIGlmICghZXZlbnQucmVtb3RlKSB7XG4gICAgICBzb2NrZXQuZW1pdCgnZHJhZ0VuZCcsIHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIGFjdG9yOiBzb2NrZXRJZFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY2xpY2tlZChldmVudCwgZCkge1xuICAgIGlmIChldmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47IC8vIGRyYWdnZWRcblxuICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmF0dHIoJ3InLCB0aGlzLnJhZGl1cyAqIDIpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuYXR0cigncicsIHRoaXMucmFkaXVzKTtcbiAgfVxuXG4gIGFzeW5jIGRyYXdHcmlkKCkge1xuICAgIGNvbnN0IGdyaWQgPSBhd2FpdCBkMy5zdmcoJ2Fzc2V0cy9GcmFtZTIuc3ZnJyk7XG4gICAgY29uc3QgZ3JpZFN2ZyA9IGdyaWQuZmlyc3RDaGlsZDtcbiAgICBncmlkU3ZnLmlkID0gJ2dhbWUtYm9hcmQnO1xuICAgIGQzLnNlbGVjdCh0aGlzLnBhcmVudCkubm9kZSgpLmFwcGVuZChncmlkU3ZnKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRHYW1lKCkge1xuICAgIGF3YWl0IHRoaXMuZHJhd0dyaWQoKTtcbiAgICBjb25zdCBzdmcgPSBkMy5zZWxlY3QoJyNnYW1lLWJvYXJkJyk7XG4gICAgY29uc3QgZyA9IHN2Zy5hcHBlbmQoJ2cnKTtcbiAgICB0aGlzLnJlbmRlclRva2VucyhnKTtcbiAgfVxuXG4gIHJlbmRlclRva2VucyhwYXJlbnQpIHtcbiAgICBjb25zdCB0ID0gcGFyZW50LnRyYW5zaXRpb24oKS5kdXJhdGlvbig3NTApO1xuICAgIHBhcmVudFxuICAgICAgLnNlbGVjdEFsbCgnY2lyY2xlJylcbiAgICAgIC5kYXRhKHRoaXMuZ2FtZVN0YXRlLnBpZWNlcywgKHBpZWNlKSA9PiBwaWVjZS5pZClcbiAgICAgIC5qb2luKFxuICAgICAgICAoZW50ZXIpID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAuYXR0cignaWQnLCAocGllY2UpID0+IGB0b2tlbiR7cGllY2UuaWR9YClcbiAgICAgICAgICAgIC5hdHRyKCdjeCcsIChwaWVjZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcbiAgICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy5nZXRQb3NpdGlvbihwaWVjZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ2N5JywgKHBpZWNlKSA9PiB0aGlzLnlTY2FsZShwaWVjZS5yb3cpKVxuICAgICAgICAgICAgLmF0dHIoJ3InLCB0aGlzLnJhZGl1cylcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgKHBpZWNlKSA9PlxuICAgICAgICAgICAgICBwaWVjZS5jb2xvciA9PT0gJ3doaXRlJyA/ICcjRTlFNUNFJyA6ICcjNTU1RDUwJ1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmNhbGwodGhpcy5kcmFnKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsIHRoaXMuY2xpY2tlZCksXG4gICAgICAgICh1cGRhdGUpID0+XG4gICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAuY2FsbCgodXBkYXRlKSA9PiB1cGRhdGUudHJhbnNpdGlvbih0KSlcbiAgICAgICAgICAgIC5hdHRyKCdjeCcsIChwaWVjZSkgPT4geFNjYWxlKHBpZWNlLmNvbCkpXG4gICAgICAgICAgICAuYXR0cignY3knLCAocGllY2UpID0+IHlTY2FsZShwaWVjZS5yb3cpKSxcbiAgICAgICAgKGV4aXQpID0+XG4gICAgICAgICAgZXhpdFxuICAgICAgICAgICAgLmNhbGwoKGV4aXQpID0+IGV4aXQudHJhbnNpdGlvbih0KSlcbiAgICAgICAgICAgIC5hdHRyKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgIC5yZW1vdmUoKVxuICAgICAgKTtcbiAgfVxufVxuXG4vLyBhdHRlbXB0TW92ZSh0b2tlbiwgbmV3UG9zKSB7XG4vLyBjb25zdCBvbGRQb3MgPSBbdG9rZW4uX19kYXRhX18uY29sLCB0b2tlbi5fX2RhdGFfXy5yb3ddO1xuLy8gY29uc3QgdG9rZW5JbkRhdGEgPSB0b2tlbnMuZmluZCgodCkgPT4gdC5pZCA9PT0gdG9rZW4uX19kYXRhX18uaWQpO1xuLy8gY29uc29sZS5sb2coJ3Rva2VuIHBhc3NlZCBmcm9tIGV2ZW50Jyk7XG4vLyBjb25zb2xlLmRpcih0b2tlbik7XG4vLyBjb25zb2xlLmxvZygndG9rZW4gaWRlbnRpZmllZCBpbiBkYXRhJyk7XG4vLyBjb25zb2xlLmxvZyh0b2tlbkluRGF0YSk7XG4vLyBjb25zb2xlLmxvZyhgRXF1aXZhbGVuY2U6ICR7dG9rZW5JbkRhdGEgPT09IHRva2VufWApO1xuLy8gfVxuIiwiaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCdcbmltcG9ydCByYW5nZSBmcm9tICdsb2Rhc2gucmFuZ2UnXG5cbmNsYXNzIFBpZWNlIHtcbiAgY29uc3RydWN0b3IoY29sb3IsIHR5cGUpIHtcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLmlkID0gdXVpZHY0KCk7XG4gIH1cbn07XG5cbmNsYXNzIEJvYXJkTW9kZWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmJvYXJkID0gW11cbiAgICB0aGlzLnBpZWNlcyA9IFtdXG4gICAgLy8gbW9yZSBzdGF0ZSBzdHVmZiAuLi5cbiAgICB0aGlzLnNldHVwKCk7XG4gIH1cbiAgYWRkUGllY2UocGllY2UsIHBvcykge1xuICAgIHRoaXMucGllY2VzLnB1c2gocGllY2UpXG4gICAgdGhpcy5ib2FyZFtwb3NbMF1dW3Bvc1sxXV0gPSBwaWVjZTtcbiAgfVxuICBcbiAgZ2V0UG9zaXRpb24ocGllY2UpIHtcbiAgICBmb3IgKGxldCByb3cgaW4gcmFuZ2UoMCwgOCkpIHtcbiAgICAgIGZvciAobGV0IGNvbCBpbiByYW5nZSgwLCAxMikpIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93XVtjb2xdICYmIHRoaXMuYm9hcmRbcm93XVtjb2xdID09PSBwaWVjZSkge1xuICAgICAgICAgIHJldHVybiBbcm93LCBjb2xdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBzZXR1cCgpIHtcbiAgICBmb3IgKGxldCByb3cgb2YgcmFuZ2UoMCwgOCkpIHtcbiAgICAgIHRoaXMuYm9hcmQucHVzaChuZXcgQXJyYXkoMTIpLmZpbGwobnVsbCkpO1xuICAgIH1cbiAgICBcbiAgICBmb3IgKGxldCByb3cgb2YgWzBdKSB7XG4gICAgICBmb3IgKGxldCBjb2wgb2YgcmFuZ2UoMCwgMTIpKSB7XG4gICAgICAgIHRoaXMuYWRkUGllY2UobmV3IFBpZWNlKCd3aGl0ZScsICdwYXduJyksIFtyb3csIGNvbF0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IHtcbiAgQm9hcmRNb2RlbCxcbiAgUGllY2Vcbn0iLCIvKipcbiAqIGxvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMCxcbiAgICBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MSxcbiAgICBNQVhfSU5URUdFUiA9IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4LFxuICAgIE5BTiA9IDAgLyAwO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUNlaWwgPSBNYXRoLmNlaWwsXG4gICAgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmFuZ2VgIGFuZCBgXy5yYW5nZVJpZ2h0YCB3aGljaCBkb2Vzbid0XG4gKiBjb2VyY2UgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgVGhlIHN0YXJ0IG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhlIGVuZCBvZiB0aGUgcmFuZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gc3RlcCBUaGUgdmFsdWUgdG8gaW5jcmVtZW50IG9yIGRlY3JlbWVudCBieS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSByYW5nZSBvZiBudW1iZXJzLlxuICovXG5mdW5jdGlvbiBiYXNlUmFuZ2Uoc3RhcnQsIGVuZCwgc3RlcCwgZnJvbVJpZ2h0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KG5hdGl2ZUNlaWwoKGVuZCAtIHN0YXJ0KSAvIChzdGVwIHx8IDEpKSwgMCksXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIHJlc3VsdFtmcm9tUmlnaHQgPyBsZW5ndGggOiArK2luZGV4XSA9IHN0YXJ0O1xuICAgIHN0YXJ0ICs9IHN0ZXA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgYF8ucmFuZ2VgIG9yIGBfLnJhbmdlUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHJhbmdlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVSYW5nZShmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgICBpZiAoc3RlcCAmJiB0eXBlb2Ygc3RlcCAhPSAnbnVtYmVyJyAmJiBpc0l0ZXJhdGVlQ2FsbChzdGFydCwgZW5kLCBzdGVwKSkge1xuICAgICAgZW5kID0gc3RlcCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gRW5zdXJlIHRoZSBzaWduIG9mIGAtMGAgaXMgcHJlc2VydmVkLlxuICAgIHN0YXJ0ID0gdG9GaW5pdGUoc3RhcnQpO1xuICAgIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZCA9IHRvRmluaXRlKGVuZCk7XG4gICAgfVxuICAgIHN0ZXAgPSBzdGVwID09PSB1bmRlZmluZWQgPyAoc3RhcnQgPCBlbmQgPyAxIDogLTEpIDogdG9GaW5pdGUoc3RlcCk7XG4gICAgcmV0dXJuIGJhc2VSYW5nZShzdGFydCwgZW5kLCBzdGVwLCBmcm9tUmlnaHQpO1xuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KVxuICAgICAgKSB7XG4gICAgcmV0dXJuIGVxKG9iamVjdFtpbmRleF0sIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA4LTkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGlzT2JqZWN0KHZhbHVlKSA/IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBmaW5pdGUgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMi4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9GaW5pdGUoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9GaW5pdGUoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvRmluaXRlKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0Zpbml0ZSgnMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9GaW5pdGUodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogMDtcbiAgfVxuICB2YWx1ZSA9IHRvTnVtYmVyKHZhbHVlKTtcbiAgaWYgKHZhbHVlID09PSBJTkZJTklUWSB8fCB2YWx1ZSA9PT0gLUlORklOSVRZKSB7XG4gICAgdmFyIHNpZ24gPSAodmFsdWUgPCAwID8gLTEgOiAxKTtcbiAgICByZXR1cm4gc2lnbiAqIE1BWF9JTlRFR0VSO1xuICB9XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyB2YWx1ZSA6IDA7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG51bWJlcnMgKHBvc2l0aXZlIGFuZC9vciBuZWdhdGl2ZSkgcHJvZ3Jlc3NpbmcgZnJvbVxuICogYHN0YXJ0YCB1cCB0bywgYnV0IG5vdCBpbmNsdWRpbmcsIGBlbmRgLiBBIHN0ZXAgb2YgYC0xYCBpcyB1c2VkIGlmIGEgbmVnYXRpdmVcbiAqIGBzdGFydGAgaXMgc3BlY2lmaWVkIHdpdGhvdXQgYW4gYGVuZGAgb3IgYHN0ZXBgLiBJZiBgZW5kYCBpcyBub3Qgc3BlY2lmaWVkLFxuICogaXQncyBzZXQgdG8gYHN0YXJ0YCB3aXRoIGBzdGFydGAgdGhlbiBzZXQgdG8gYDBgLlxuICpcbiAqICoqTm90ZToqKiBKYXZhU2NyaXB0IGZvbGxvd3MgdGhlIElFRUUtNzU0IHN0YW5kYXJkIGZvciByZXNvbHZpbmdcbiAqIGZsb2F0aW5nLXBvaW50IHZhbHVlcyB3aGljaCBjYW4gcHJvZHVjZSB1bmV4cGVjdGVkIHJlc3VsdHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhlIGVuZCBvZiB0aGUgcmFuZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0ZXA9MV0gVGhlIHZhbHVlIHRvIGluY3JlbWVudCBvciBkZWNyZW1lbnQgYnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHJhbmdlIG9mIG51bWJlcnMuXG4gKiBAc2VlIF8uaW5SYW5nZSwgXy5yYW5nZVJpZ2h0XG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ucmFuZ2UoNCk7XG4gKiAvLyA9PiBbMCwgMSwgMiwgM11cbiAqXG4gKiBfLnJhbmdlKC00KTtcbiAqIC8vID0+IFswLCAtMSwgLTIsIC0zXVxuICpcbiAqIF8ucmFuZ2UoMSwgNSk7XG4gKiAvLyA9PiBbMSwgMiwgMywgNF1cbiAqXG4gKiBfLnJhbmdlKDAsIDIwLCA1KTtcbiAqIC8vID0+IFswLCA1LCAxMCwgMTVdXG4gKlxuICogXy5yYW5nZSgwLCAtNCwgLTEpO1xuICogLy8gPT4gWzAsIC0xLCAtMiwgLTNdXG4gKlxuICogXy5yYW5nZSgxLCA0LCAwKTtcbiAqIC8vID0+IFsxLCAxLCAxXVxuICpcbiAqIF8ucmFuZ2UoMCk7XG4gKiAvLyA9PiBbXVxuICovXG52YXIgcmFuZ2UgPSBjcmVhdGVSYW5nZSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJhbmdlO1xuIiwiZXhwb3J0IGRlZmF1bHQgL14oPzpbMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMS01XVswLTlhLWZdezN9LVs4OWFiXVswLTlhLWZdezN9LVswLTlhLWZdezEyfXwwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDApJC9pOyIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuIEluIHRoZSBicm93c2VyIHdlIHRoZXJlZm9yZVxuLy8gcmVxdWlyZSB0aGUgY3J5cHRvIEFQSSBhbmQgZG8gbm90IHN1cHBvcnQgYnVpbHQtaW4gZmFsbGJhY2sgdG8gbG93ZXIgcXVhbGl0eSByYW5kb20gbnVtYmVyXG4vLyBnZW5lcmF0b3JzIChsaWtlIE1hdGgucmFuZG9tKCkpLlxudmFyIGdldFJhbmRvbVZhbHVlcztcbnZhciBybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJuZygpIHtcbiAgLy8gbGF6eSBsb2FkIHNvIHRoYXQgZW52aXJvbm1lbnRzIHRoYXQgbmVlZCB0byBwb2x5ZmlsbCBoYXZlIGEgY2hhbmNlIHRvIGRvIHNvXG4gIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgLy8gZ2V0UmFuZG9tVmFsdWVzIG5lZWRzIHRvIGJlIGludm9rZWQgaW4gYSBjb250ZXh0IHdoZXJlIFwidGhpc1wiIGlzIGEgQ3J5cHRvIGltcGxlbWVudGF0aW9uLiBBbHNvLFxuICAgIC8vIGZpbmQgdGhlIGNvbXBsZXRlIGltcGxlbWVudGF0aW9uIG9mIGNyeXB0byAobXNDcnlwdG8pIG9uIElFMTEuXG4gICAgZ2V0UmFuZG9tVmFsdWVzID0gdHlwZW9mIGNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKSB8fCB0eXBlb2YgbXNDcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT09ICdmdW5jdGlvbicgJiYgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQobXNDcnlwdG8pO1xuXG4gICAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY3J5cHRvLmdldFJhbmRvbVZhbHVlcygpIG5vdCBzdXBwb3J0ZWQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQjZ2V0cmFuZG9tdmFsdWVzLW5vdC1zdXBwb3J0ZWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbn0iLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG4vKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cblxudmFyIGJ5dGVUb0hleCA9IFtdO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleC5wdXNoKChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSkpO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkoYXJyKSB7XG4gIHZhciBvZmZzZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG4gIC8vIE5vdGU6IEJlIGNhcmVmdWwgZWRpdGluZyB0aGlzIGNvZGUhICBJdCdzIGJlZW4gdHVuZWQgZm9yIHBlcmZvcm1hbmNlXG4gIC8vIGFuZCB3b3JrcyBpbiB3YXlzIHlvdSBtYXkgbm90IGV4cGVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZC9wdWxsLzQzNFxuICB2YXIgdXVpZCA9IChieXRlVG9IZXhbYXJyW29mZnNldCArIDBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDNdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA1XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDZdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgN11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA4XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDldXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTNdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTVdXSkudG9Mb3dlckNhc2UoKTsgLy8gQ29uc2lzdGVuY3kgY2hlY2sgZm9yIHZhbGlkIFVVSUQuICBJZiB0aGlzIHRocm93cywgaXQncyBsaWtlbHkgZHVlIHRvIG9uZVxuICAvLyBvZiB0aGUgZm9sbG93aW5nOlxuICAvLyAtIE9uZSBvciBtb3JlIGlucHV0IGFycmF5IHZhbHVlcyBkb24ndCBtYXAgdG8gYSBoZXggb2N0ZXQgKGxlYWRpbmcgdG9cbiAgLy8gXCJ1bmRlZmluZWRcIiBpbiB0aGUgdXVpZClcbiAgLy8gLSBJbnZhbGlkIGlucHV0IHZhbHVlcyBmb3IgdGhlIFJGQyBgdmVyc2lvbmAgb3IgYHZhcmlhbnRgIGZpZWxkc1xuXG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZ2lmaWVkIFVVSUQgaXMgaW52YWxpZCcpO1xuICB9XG5cbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmluZ2lmeTsiLCJpbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpOyAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG5cbiAgcm5kc1s2XSA9IHJuZHNbNl0gJiAweDBmIHwgMHg0MDtcbiAgcm5kc1s4XSA9IHJuZHNbOF0gJiAweDNmIHwgMHg4MDsgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG5cbiAgaWYgKGJ1Zikge1xuICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICBidWZbb2Zmc2V0ICsgaV0gPSBybmRzW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICByZXR1cm4gc3RyaW5naWZ5KHJuZHMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2NDsiLCJpbXBvcnQgUkVHRVggZnJvbSAnLi9yZWdleC5qcyc7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHV1aWQpIHtcbiAgcmV0dXJuIHR5cGVvZiB1dWlkID09PSAnc3RyaW5nJyAmJiBSRUdFWC50ZXN0KHV1aWQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0ZTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvT09fbWFpbi5qc1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=