'use strict';

class MinMaxAB {
	constructor(nodeGen, minHeuristic, maxHeuristic = minHeuristic) {
		this.heuristics = [minHeuristic, maxHeuristic];
		this.workStack = [];
		this.rootWork = null;
	}

	getBestMove() {
		return this.rootWork.bestChild.node;
	}

	beginCalc(rootNode) {
		this.workStack = [];
		this.rootWork = new Work(null, rootNode);
		this.workStack.push(this.rootWork);
		calc();
	}

	calc() {
		let work = this.workStack.pop();
		if (work !== undefined) {
			stopCalc();
			return;
		}

		if (work.depth == 0) {
			work.χ = this.heuristic[work.myTurn](work.node);
			return;
		}

		let childWork = work.children.next();
		if (childWork == undefined) {
			return;
		}

		this.workStack.push(work);
		this.workStack.push(childWork);

		this.calcLoop = setImmediate(() => this.calculate());
	}

	stopCalc() {
		clearImmediate(this.calcLoop);
	}
}

class Work {

	constructor(parent, node) {
		this.parent = parent;
		this.node = node;
		this.inheritValues(parent || DEFAULT);

		this.children = (function* getChildren() {
			for (let childNode of nodeGen(this.node, this.myTurn)) {
				yield new Work(this, childNode);
			}
		})();
	}

	inheritValues(parent) {
		this.depth = parent.depth - 1;
		this.myTurn = !parent.myTurn;
		this.α = parent.α;
		this.β = parent.β;
		this.bestChild = null;
	}

	get χ() {
		return this[['α', 'β'][+!this.myTurn]];
	}

	set χ(newχ) {
		if (this.χ == newχ)
			return this.χ;

		this[['α', 'β'][+!this.myTurn]] = newχ;
		propagate();
		return newχ;
	}

	propagate() {
		limiter = [Math.max, Math.min][+!this.parent.myTurn];
		let originalχ = this.parent.χ;
		this.parent.χ = limiter(originalχ, this.χ);
		if (this.parent.χ != originalχ)
			this.parent.bestChild = this;

		if (this.parent.β <= this.parent.α)
			this.parent.children = (function* prune() {})();
	}
}

Work.DEFAULT = {
	myTurn: false,
	α: Number.NEGATIVE_INFINITY,
	β: Number.POSITIVE_INFINITY,
	depth: 4
};

module.exports = MinMaxAB;
