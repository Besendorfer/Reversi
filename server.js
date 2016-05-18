'use strict';

var Reversi = require('./Reversi/Reversi.js');
var BoardDimensionError = require('./Reversi/Error/BoardDimensionError.js');

try {
	Reversi = new Reversi(8);

	Reversi.run();

} catch (e) {
	e.printError();
}