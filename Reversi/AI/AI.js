'use strict';

const MinMaxAB = require('./MinMaxAB.js');
const Player = require('./../Player/Player.js');
const _ = require('lodash');

class AI extends Player {
	constructor(board, color, depth) {
		super(...arguments);

		this.depth = depth;
		this.opponentColor = this.color === 'w' ? 'b' : 'w';
		this.MinMaxAB = new MinMaxAB(this.boardGen.bind(this), this.heuristic.bind(this));
	}

	createTestBoard(board, discColor, discPlacement) {
		let newBoard = null;

		newBoard = _.cloneDeep(board);
		newBoard.placeDisc(discColor, discPlacement);
		newBoard.move = discPlacement;

		return newBoard;
	}

	*boardGen(board, myTurn) {
		let discColor = myTurn ? this.color : this.opponentColor;

		for (let i = 0; i < board.getTiles().length; i++) {
			for (let j = 0; j < board.getTiles().length; j++) {
				if (board.isValidMove(discColor, [ i, j ]))
					yield this.createTestBoard(board, discColor, [ i, j ]);
			}
		}
	}

	heuristic(board) {
		return board.tiles.reduce(function (total, row) {
			return total + row.reduce(function (total, tile) {
				return total + tile.getValue();
			}, 0);
		}, 0);
	}

	takeTurn(cb) {
		console.log('\n' + this.color + ': Begins thinking');
		console.log('Depth limit: ' + (this.depth === 0 ? 'many' : this.depth));
		this.MinMaxAB.beginCalc((bestNode) => {
			clearTimeout(this.timeout);
			console.log(this.color + ': With my intellect, I choose this spot');
			this.board.placeDisc(this.color, bestNode.move);
			cb();
		}, this.board, this.depth, this.depth === 0);

		this.timeout = setTimeout(() => { console.log('\ntimes up!'); this.MinMaxAB.stopCalc() }, 500);
	}
}

module.exports = AI;
