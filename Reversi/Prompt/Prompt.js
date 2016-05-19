'use strict';

const Readline = require('readline');

const readline = Readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

class Prompt {
	static ask(cb, question, answers) {
		answers = answers.map((s) => s.toLowerCase());
		let letters = answers.map((s) => s.charAt(0));
		letters[0] = letters[0].toUpperCase();
		let questionHint = question + ' [' + letters.join() + '] ';
		letters[0] = letters[0].toLowerCase();
		return readline.question(questionHint, (answer) => {
			if (answer === "")
				return cb(answers[0]);

			let index = letters.indexOf(answer.toLowerCase().charAt(0));
			if (index !== -1)
				return cb(answers[index]);

			console.error('Invalid choice!');
			return Prompt.ask(cb, question, answers);
		});
	}

	static askRange(cb, question, range) {
		let questionHint = question + ' [' + range[0] + '-' + range[1] + '] ';
		return readline.question(questionHint, (answer) => {
			let answerNum = Number.parseInt(answer, 10);
			if (!Number.isNaN(answerNum) &&
				range[0] <= answerNum && answerNum <= range[1])
				return cb(answerNum);

			console.error('Invalid choice!');
			return Prompt.askRange(cb, question, range);
		});
	}

	static askPlayers(cb) {
		return Prompt.askRange(cb, 'How many players?', [0, 2]);
	}

	static askDimensions(cb) {
		let parseAnswer = (answer) => {
			if (answer % 2 !== 0) {
				console.error('Must give an even dimension!');
				return Prompt.askDimensions(cb);
			}
			return cb(answer);
		};
		return Prompt.askRange(parseAnswer, 'What size board are you playing?', [2, 10]);
	}

	static askAgain(cb) {
		let parseAnswer = (answer) => {
			return cb(answer === 'yes' ? true : false);
		};
		return Prompt.ask(parseAnswer, 'Would you like to play again?', ['yes', 'no']);
	}

	static askColor(cb) {
		let parseAnswer = (answer) => {
			return cb(answer == 'white' ? 'w' : 'b');
		};
		return Prompt.ask(parseAnswer, 'What color would player 1 like to be?', ['black', 'white']);
	}

	static askPiece(cb, currentTurn) {
		readline.question(currentTurn + ': Where would you like to place your piece? [x,y] ', (answer) => {
			answer = answer.split(',').map((s) => Number.parseInt(s, 10));
			if (answer.length === 2 && !isNaN(answer[0]) && !isNaN(answer[1]))
				return cb(answer[0], answer[1]);

			console.error('Invalid location!');
			return this.askPiece(cb);
		});
	}
}

module.exports = Prompt;
