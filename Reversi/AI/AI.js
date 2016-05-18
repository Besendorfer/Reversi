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
		return board.tiles.reduce(function (total, row) {
			return total + row.reduce(function (total, tile) {
				return tile.getValue();
			}, 0);
		}, 0);
	}
}

module.exports = AI;
