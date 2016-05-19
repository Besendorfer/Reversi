'use strict';

const MinMaxAB = require('./MinMaxAB.js');
const Player = require('./../Player/Player.js');

class AI extends Player {
	constructor() {
		super(...arguments);

		this.MinMaxAB = new MinMaxAB(this.boardGen(), this.heuristic.bind(this));
	}

	*boardGen(board, myTurn) {
		newBoard = null; // TODO: generate next possible board
		yield newBoard;
	}

	heuristic(board) {
		return board.tiles.reduce(function (total, row) {
			return total + row.reduce(function (total, tile) {
				return total + tile.getValue();
			}, 0);
		}, 0);
	}

	takeTurn(cb) {
		// TODO: actually take turn
		this.board.placeDisc(this.color, [0, 0]);
		cb();
	}
}

module.exports = AI;
