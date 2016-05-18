'use strict';

class BoardDimensionError extends Error {
	constructor(message) {
		super(message);
	}
}

module.exports = BoardDimensionError;