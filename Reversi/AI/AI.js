'use strict';

const MinMaxAB = require('./MinMaxAB.js');
const Player = require('./../Player/Player.js');

class AI extends Player {
	constructor(board, color, depth, time) {
		super(...arguments);

		this.depth = depth;
		this.time = time;
		this.opponentColor = this.color === 'w' ? 'b' : 'w';
		this.MinMaxAB = new MinMaxAB(this.boardGen.bind(this), this.heuristic.bind(this));
	}

	createTestBoard(oldBoard, discColor, discPlacement) {

		let newBoard = oldBoard.clone();
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
		if (board.canPass())
			yield this.createTestBoard(board, discColor, 'pass');
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
				this.board.placeDisc(this.color, 'pass');
			} else {
				console.log(this.color + ': With my intellect, I choose ' + bestNode.move);
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
