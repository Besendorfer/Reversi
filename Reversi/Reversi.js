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

		let getDepth = (cb, ...args) => {
			Prompt.askRange((answer) => cb(...(args.concat([answer]))),
			'How deep should I look? (0 = variable) ',
			[0, this.board.dimension * this.board.dimension]);
		};

		let getTime = (cb, ...args) => {
			Prompt.askRange((answer) => cb(...(args.concat([answer]))),
			'How long should I think (ms)?',
			[1, Number.POSITIVE_INFINITY]);
		};

		let initPlayers = (cb, d1, t1, d2, t2) => {
			this.players.b = new PlayerOneClass(this.board, 'b', d1, t1);
			this.players.w = new PlayerTwoClass(this.board, 'w', d2, t2);

			console.log('Player 1 is ' + this.players.b.constructor.name);
			console.log('Player 2 is ' + this.players.w.constructor.name);

			return cb();
		};

		let queue = [];
		if (PlayerOneClass == AI) {
			queue.push((cb, ...args) => {console.log('AI player:'); cb(...args)});
			queue.push(getDepth);
			queue.push(getTime);
		}

		if (PlayerTwoClass) {
			queue.push((cb, ...args) => {console.log('Second AI player:'); cb(...args)});
			queue.push(getDepth);
			queue.push(getTime);
		}

		queue.push(initPlayers);
		this.runQueue(queue)(cb);
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

		if (this.board.numDiscs.w < this.board.numDiscs.b) {
			console.log('Black wins!');
		} else if (this.board.numDiscs.b < this.board.numDiscs.w) {
			console.log('White wins!');
		} else {
			console.log('It\'s a tie!');
		}
		console.log('B: ' + this.board.numDiscs.b + ', W: ' + this.board.numDiscs.w);
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
