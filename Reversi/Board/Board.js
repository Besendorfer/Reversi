'use strict';

class Board {
	constructor(dimension) {
		if (dimension > 10)
			throw new BoardDimensionError('Must give a dimension 10 or less');
		if (dimension % 2 !== 0)
			throw new BoardDimensionError('Must give an even dimension.');

		this.dimension = dimension;

		let row = '.'.repeat(dimension).split('');
		this.tiles = new Array(8);
		for (var i = 0; i < dimension; i++) {
			this.tiles[i] = row.slice();
		}

		this.numDiscs = {
			b: 0,
			w: 0
		};

		this.currentTurn = 'b';
	}

	clone() {
		let newBoard = Object.create(Board.prototype);
		newBoard.dimension = this.dimension;
		newBoard.tiles = new Array(this.dimension);
		for (var i = 0; i < this.dimension; i++) {
			newBoard.tiles[i] = new Array(this.dimension);
			for (var j = 0; j < this.dimension; j++) {
				newBoard.tiles[i][j] = this.tiles[i][j];
			}
		}
		newBoard.numDiscs = {
			b: this.numDiscs.b,
			w: this.numDiscs.w
		};
		newBoard.currentTurn = this.currentTurn; 
		return newBoard;
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
		if (tile === '.')
			return false;

		// Player disc? Valid!
		if (tile === discColor) {
			return true;
		}

		// Opponent disc? Keep going.
		let nextLoc = [
			loc[0] + direction[0],
			loc[1] + direction[1]
		];

		let capturable = this.isCapturable(discColor, nextLoc, direction, capture);
		if (capturable && capture) {
			this.numDiscs[tile]--;
			this.tiles[loc[0]][loc[1]] = discColor;
			this.numDiscs[discColor]++;
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

			if (this.tiles[adj.loc[0]][adj.loc[1]] !== discColor)
				opponentAdjacent.push(adj);
		}

		return opponentAdjacent;
	}

	isValidMove(discColor, loc, capture = false) {
		let min = 0;
		let max = this.dimension - 1;
		if (loc[0] < min || loc[1] < min ||
			loc[0] > max || loc[1] > max)
			return false;

		if (this.tiles[loc[0]][loc[1]] !== '.')
			return false;

		if (this.numDiscs.b + this.numDiscs.w < 4) {
			let isCenter =  ((loc[0] === this.dimension / 2 || loc[0] === this.dimension / 2 - 1) &&
			                 (loc[1] === this.dimension / 2 || loc[1] === this.dimension / 2 - 1));

			if (isCenter && capture) {
				this.tiles[loc[0]][loc[1]] = discColor;
				this.numDiscs[discColor]++;
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
			this.tiles[loc[0]][loc[1]] = discColor;
			this.numDiscs[discColor]++;
		}

		return validMove;
	}

	placeDisc(color, loc) {
		let succeeded = loc === 'pass' || this.isValidMove(color, loc, true);
		if (succeeded)
			this.changeTurn();

		return succeeded;
	}

	changeTurn() {
		return this.currentTurn = this.currentTurn === 'b' ? 'w' : 'b';
	}

	isGameOver() {
		for (let i = 0; i < this.dimension; i++) {
			for (let j = 0; j < this.dimension; j++) {
				if (this.isValidMove('w', [ i, j ]) ||
					this.isValidMove('b', [ i, j ]))
					return false;
			}
		}

		return true;
	}
}

module.exports = Board;
