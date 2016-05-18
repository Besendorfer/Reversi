'use strict';

let MinMaxAB = require('./MinMaxAB.js');

class AI {
	constructor(board) {
		this.board = board;
		this.MinMaxAB = new MinMaxAB(this.boardGen(), this.heuristic.bind(this));
	}

	*boardGen(board, myTurn) {
		newBoard = null; // TODO: generate next possible board
		yield newBoard;
	}

	heuristic(board) {
		return 0; // TODO: return a heristical value for this board
	}
}

module.exports = AI;
