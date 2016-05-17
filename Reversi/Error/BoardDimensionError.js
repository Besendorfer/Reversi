'use strict';

var Error = require('./Error.js');

class BoardDimensionError extends Error {
	constructor(message) {
		super(message);
	}
}

module.exports = BoardDimensionError;