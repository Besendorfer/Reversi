'use strict';

let Reversi = require('./Reversi/Reversi.js');
let BoardDimensionError = require('./Reversi/Error/BoardDimensionError.js');

try {
	Reversi = new Reversi(8);

	Reversi.run();

} catch (e) {
	console.error(e);
}