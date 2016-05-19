'use strict';

const Tile = require('./Tile.js');

class Board {
	constructor(dimension) {
		if (dimension > 10)
			throw new BoardDimensionError('Must give a dimension 10 or less');
		if (dimension % 2 !== 0)
			throw new BoardDimensionError('Must give an even dimension.');

		this.dimension = dimension;

		this.tiles = Array.from({ length: dimension }).map((row, rIndex) => {
			return	 Array.from({ length: dimension }).map((col, cIndex) => {
				return new Tile();
			});
		});

		this.currentTurn = 'b';
	}

	getTiles() {
		return this.tiles;
	}

	toString() {
		return this.tiles.reduce(function (total, row) {
			return total + row.reduce(function (total, tile) {
				return total + tile.toString();
			}, '\n');
		}, '');
	}

	validMove(color, location) {
		// TODO: return if valid move
		return true;
	}

	placeDisc(color, location) {
		// TODO: place a disc and flip in-betweens
		this.currentTurn = this.currentTurn === 'b' ? 'w' : 'b';
	}

	isGameOver() {
		// TODO: return if game is over
		return false;
	}
}

module.exports = Board;