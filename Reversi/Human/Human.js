'use strict';

const Prompt = require('./../Prompt/Prompt.js');
const Player = require('./../Player/Player.js');

class Human extends Player {
	constructor() {
		super(...arguments);
	}

	takeTurn(cb) {
		Prompt.askPiece((x, y) => {
			if (!this.board.placeDisc(this.color, [x, y])) {
				console.error('Invalid location');
				return this.takeTurn(cb);
			}

			return cb();
		}, this.board.currentTurn);
	}
}

module.exports = Human;
