'use strict';

let Tile = require('./Tile.js');

class Board {
	constructor(dimension) {
		this.dimension = dimension;

		this.tiles = Array.from({ length: dimension }).map((row, rIndex) => {
			return	 Array.from({ length: dimension }).map((col, cIndex) => {
				return new Tile();
			});
		});
	}

	getTiles() {
		return this.tiles;
	}

	print() {
		return this.tiles.reduce(function (total, row) {
			return total + row.reduce(function (total, tile) {
				return total + tile.print();
			}, '\n');
		}, '');
	}
}

module.exports = Board;