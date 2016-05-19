'use strict';

const AI = require('./AI/AI.js');
const Human = require('./Human/Human.js');
const Board = require('./Board/Board.js');
const Prompt = require('./Prompt/Prompt.js');
const BoardDimensionError = require('./Error/BoardDimensionError.js');

// Should this instead be called the 'Game' class?
class Reversi {
	constructor(dimension) {
		this.board = null;
		this.AI = null;
		this.players = {
			'b': null,
			'w': null
		};

		this.gameLoop = [
			(cb) => cb(console.log(this.board.toString())),
			this.placePiece.bind(this),
			(cb) => cb(!this.board.isGameOver())
		];
		this.gameLoop.push(this.reloop(this.gameLoop));

		this.startGame = [
			// Prompt.askDimensions.bind(Prompt),
			(cb) => cb(8),
			this.setDimensions.bind(this),

			Prompt.askPlayers.bind(Prompt),
			// (cb) => cb(1),
			this.setPlayers.bind(this),

			// Prompt.askColor.bind(Prompt),
			(cb) => cb('b'),
			this.setColor.bind(this),

			this.runQueue(this.gameLoop),
			this.declareWinner.bind(this),

			Prompt.askAgain.bind(Prompt)
		];
		this.startGame.push(this.reloop(this.startGame));
	}

	runQueue(cbQueue) {
		return (cb) => {
			setImmediate(cbQueue.reduceRight((prev, next) => {
				return next.bind(this, setImmediate.bind(this, prev));
			}, cb));
		}
	}

	run() {
		this.runQueue(this.startGame)((exit) => process.exit(0));
	}

	placePiece(cb) {
		this.players[this.board.currentTurn].takeTurn(cb);
	}

	setDimensions(cb, dimension) {
		this.board = new Board(dimension);
		return cb();
	}

	setPlayers(cb, numPlayers) {
		let PlayerOneClass = numPlayers === 2 ? Human : AI;
		let PlayerTwoClass = numPlayers !== 0 ? Human : AI;

		this.players.b = new PlayerOneClass(this.board, 'b', 5);
		this.players.w = new PlayerTwoClass(this.board, 'w', 0);

		console.log('Player 1 is ' + this.players.b.constructor.name);
		console.log('Player 2 is ' + this.players.w.constructor.name);

		return cb();
	}

	setColor(cb, playerOneColor) {
		if (playerOneColor === 'w') {
			// we initialized the opposite, so just switch
			let temp = this.players.b;
			this.players.b = this.players.w;
			this.players.w = temp;

			this.players.b.color = 'b';
			this.players.w.color = 'w';
		}
		return cb();
	}

	declareWinner(cb) {
		console.log('---------------------');
		console.log(this.board.toString());
		let black = this.board.tiles.reduce(function (total, row) {
			return total + row.reduce(function (total, tile) {
				return total + (tile.color == 'b' ? 1 : 0);
			}, 0);
		}, 0);

		let white = this.board.tiles.reduce(function (total, row) {
			return total + row.reduce(function (total, tile) {
				return total + (tile.color == 'w' ? 1 : 0);
			}, 0);
		}, 0);

		if (white < black) {
			console.log('Black wins!');
		} else if (black < white) {
			console.log('White wins!');
		} else {
			console.log('It\'s a tie!');
		}
		console.log('B: ' + black + ', W: ' + white);
		console.log('---------------------');
		cb();
	}

	reloop(queue) {
		let run = this.runQueue(queue);
		return (cb, restart) => {
			if (restart) {
				return run(cb);
			}
			return cb();
		}
	}

}

module.exports = Reversi;
