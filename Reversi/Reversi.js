'use strict';

const AI = require('./AI/AI.js');
const Board = require('./Board/Board.js');
const BoardDimensionError = require('./Error/BoardDimensionError.js');

// Should this instead be called the 'Game' class?
class Reversi {
	constructor(dimension) {

		this.board = new Board(dimension);
		this.AI = new AI(this.board);
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