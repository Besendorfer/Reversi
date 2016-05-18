'use strict';

let Tile = require('./Tile.js');

class Board {
	constructor(dimension) {
		this.dimension = dimension;

		this.tiles = Array.from({ length: dimension }).map((column, cIndex) => {
			return	 Array.from({ length: dimension }).map((row, rIndex) => {
				return new Tile();
			});
		});
	}

	getTiles() {
		return this.tiles;
	}
}

module.exports = Board;