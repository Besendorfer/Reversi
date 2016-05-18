'use strict';

class Tile {
	constructor() {
		this.color = null;
	}

	getValue() {
		return +(this.color == "white")
		       -(this.color == "black");
	}
}

module.exports = Tile;