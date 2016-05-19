'use strict';

class Player {
	constructor(board, color) {
		if (new.target === Player)
			throw new Error("Abstract class player must be subclassed!");

		this.board = board;
		this.color = color;
	}

	takeTurn(cb) {
		throw new Error("Abstract class player must be subclassed!");
	}
}

module.exports = Player;
