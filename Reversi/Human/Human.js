'use strict';

const Player = require('./../Player/Player.js');

class Human extends Player {
	constructor() {
		super(...arguments);
	}

	takeTurn(cb) {
		// TODO: actually take turn
		this.board.placeDisc(this.color, [0, 0]);
		cb();
	}
}

module.exports = Human;
