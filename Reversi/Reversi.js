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
			Prompt.askDimensions.bind(Prompt),
			this.setDimensions.bind(this),

			Prompt.askPlayers.bind(Prompt),
			this.setPlayers.bind(this),

			Prompt.askColor.bind(Prompt),
			this.setColor.bind(this),

			this.runQueue(this.gameLoop),

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

		this.players.b = new PlayerOneClass(this.board, 'b');
		this.players.w = new PlayerTwoClass(this.board, 'w');

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