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

		for (let i = 0; i < board.dimension; i++) {
			for (let j = 0; j < board.dimension; j++) {
				if (board.isValidMove(discColor, [ i, j ]))
					yield this.createTestBoard(board, discColor, [ i, j ]);
			}
		}
	}

	heuristic(board) {
		return board.numDiscs[this.color] - board.numDiscs[this.opponentColor];
	}

	takeTurn(cb) {
		console.log('\n' + this.color + ': Begins thinking');
		let maxDepth = this.depth;
		if (this.depth === 0) {
			maxDepth = (this.board.dimension * this.board.dimension) -
			           (this.board.numDiscs.b + this.board.numDiscs.w);
		}
		console.log('Depth limit: ' + maxDepth);
		this.MinMaxAB.beginCalc((bestNode) => {
			console.log();
			clearTimeout(this.timeout);
			if (bestNode == null) {
				console.log(this.color + ': I cannot move! I pass.');
				this.board.changeTurn();
			} else {
				console.log(this.color + ': With my intellect, I choose this spot');
				this.board.placeDisc(this.color, bestNode.move);
			}
			cb();
		}, this.board, this.depth, maxDepth);

		this.timeout = setTimeout(() => {
			console.log('\ntimes up!');
			this.MinMaxAB.stopCalc()
		}, 5000);
	}
}

module.exports = AI;
