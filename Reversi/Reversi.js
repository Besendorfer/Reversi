'use strict';

var Board = require('./Board/Board.js');
var BoardDimensionError = require('./Error/BoardDimensionError.js');

// Should this instead be called the 'Game' class?
class Reversi {
	constructor(dimension) {
		if (dimension > 10)
			throw new BoardDimensionError('Must give a dimension 10 or less');
		if (dimension % 2 !== 0)
			throw new BoardDimensionError('Must give an even dimension.');

		this.board = new Board(dimension);
	}

	run() {
		// Before the start of a new game, ask which color our computer should be.
		// Display board.
		// Get input from user for opponent computer.
		// Once game ends, ask if want to play another game.
		// Always give option to exit.

		console.log(this.board.getTiles());
	}
}

module.exports = Reversi;