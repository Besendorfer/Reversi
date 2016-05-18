'use strict';

class BoardDimensionError extends Error {
	constructor(...args) {
		super(...args);
	}
}

module.exports = BoardDimensionError;