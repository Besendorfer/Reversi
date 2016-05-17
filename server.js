'use strict';

var Reversi = require('./Reversi/Reversi.js');
var BoardDimensionError = require('./Reversi/Error/BoardDimensionError.js');

try {
	Reversi = new Reversi(10);

	Reversi.run();
}
catch (e) {
	if (e instanceof BoardDimensionError)
		e.printError();
}