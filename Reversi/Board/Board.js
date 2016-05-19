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

		this.numDiscs = 0;

		this.currentTurn = 'b';
	}

	getTiles() {
		return this.tiles;
	}

	toString() {
		return this.tiles.reduce(function (total, row, rowi) {
			return total + row.reduce(function (total, tile) {
				return total + tile.toString();
			}, '\n') + rowi;
		}, '01234567');
	}

	isCapturable(discColor, loc, direction, capture = false) {
		let min = 0;
		let max = this.dimension - 1;

		// Off the board? Not valid.
		if (loc[0] < min || loc[1] < min ||
			loc[0] > max || loc[1] > max)
			return false;

		let tile = this.tiles[loc[0]][loc[1]];
		// Empty tile? Not valid.
		if (tile.color == null)
			return false;

		// Player disc? Valid!
		if (tile.color === discColor) {
			return true;
		}

		// Opponent disc? Keep going.
		let nextLoc = [
			loc[0] + direction[0],
			loc[1] + direction[1]
		];

		let capturable = this.isCapturable(discColor, nextLoc, direction, capture);
		if (capturable && capture) {
			tile.color = discColor;
		}
		return capturable;
	}

	getOpponentAdjacent(discColor, loc) {
		let r = loc[0];
		let c = loc[1];
		let min = 0;
		let max = this.dimension - 1;
		let dirRow = [-1, -1, -1, 0, 1, 1, 1, 0];
		let dirCol = [-1, 0, 1, 1, 1, 0, -1, -1];

		let opponentAdjacent = [];

		for (let i = 0; i < 8; i++) {
			if (r + dirRow[i] < min || c + dirCol[i] < min ||
				r + dirRow[i] > max || c + dirCol[i] > max)
				continue;

			let adj = {
				direction: [ dirRow[i], dirCol[i] ],
				loc: [r + dirRow[i], c + dirCol[i]]
			};

			if (this.tiles[adj.loc[0]][adj.loc[1]].color !== discColor) opponentAdjacent.push(adj);
		}

		return opponentAdjacent;
	}

	isValidMove(discColor, loc, capture = false) {
		let min = 0;
		let max = this.dimension - 1;
		if (loc[0] < min || loc[1] < min ||
			loc[0] > max || loc[1] > max)
			return false;

		if (this.tiles[loc[0]][loc[1]].color != null)
			return false;

		if (this.numDiscs < 4) {
			let isCenter =  ((loc[0] === this.dimension / 2 || loc[0] === this.dimension / 2 - 1) &&
			                 (loc[1] === this.dimension / 2 || loc[1] === this.dimension / 2 - 1));

			if (isCenter && capture) {
				this.tiles[loc[0]][loc[1]].color = discColor;
				this.numDiscs++;
			}

			return isCenter;
		}

		let opponentAdjacent = this.getOpponentAdjacent(discColor, loc);

		// Check if player disc on opposite end of opponent disc
		let validMove = false;
		for (let oppTile of opponentAdjacent) {
			if (this.isCapturable(discColor, oppTile.loc, oppTile.direction, capture)) {
				validMove = true;
				if (!capture)
					break;
			}
		}

		if (validMove && capture) {
			this.tiles[loc[0]][loc[1]].color = discColor;
			this.numDiscs++;
		}

		return validMove;
	}

	placeDisc(color, loc) {
		let succeeded = this.isValidMove(color, loc, true);
		if (succeeded)
			this.currentTurn = this.currentTurn === 'b' ? 'w' : 'b';

		return succeeded;
	}

	isGameOver() {
		// TODO: return if game is over
		return false;
	}
}

module.exports = Board;
