'use strict';

class Error {
	constructor(message) {
		this.message = message;
	}

	printError() {
		console.log(this.message);
	}
}

module.exports = Error;