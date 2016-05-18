'use strict';

class Tile {
	constructor() {
		this.color = null;
	}

	getValue() {
		return +(this.color == 'white')
		       -(this.color == 'black');
	}

	print() {
		switch (this.color) {
			case 'white': return 'w';
			case 'black': return 'b';
			default: return '.';
		}
	}
}

module.exports = Tile;