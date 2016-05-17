'use strict';

var Tile = require('./Tile.js');

class Board {
	constructor(dimension) {
		this.dimension = dimension;

		this.tiles = Array.from({ length: dimension }).map((column, cIndex) => {
			return	 Array.from({ length: dimension }).map((row, rIndex) => {
				row = new Tile();

				if (cIndex === dimension / 2 && rIndex === dimension / 2 - 1)
					row.color = 'black';
				else if (cIndex === dimension / 2 - 1 && rIndex === dimension / 2)
					row.color = 'black';
				else if (cIndex === dimension / 2 && rIndex === dimension / 2)
					row.color = 'white';
				else if (cIndex === dimension / 2 - 1 && rIndex === dimension / 2 - 1)
					row.color = 'white';

				return row;
			});
		});
	}

	getTiles() {
		return this.tiles;
	}
}

module.exports = Board;