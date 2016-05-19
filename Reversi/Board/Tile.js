'use strict';

class Tile {
	constructor() {
		this.color = null;
	}

	getValue() {
		return +(this.color == 'w')
		       -(this.color == 'b');
	}

	toString() {
		return this.color || '.';
	}
}

module.exports = Tile;