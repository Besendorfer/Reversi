'use strict';

class MinMaxAB {
	constructor(nodeGen, minHeuristic, maxHeuristic = minHeuristic) {
		this.heuristics = [minHeuristic, maxHeuristic];
		this.workStack = [];
		this.rootWork = null;
		this.nodeGen = nodeGen;
	}

	getBestMove() {
		return this.rootWork.bestChild && this.rootWork.bestChild.node;
	}

	beginCalc(cb, rootNode) {
		this.onStop = cb;
		this.workStack = [];
		this.rootWork = new Work(this.nodeGen, null, rootNode);
		this.workStack.push(this.rootWork);
		this.calc();
	}

	calc() {
		let work = this.workStack.pop();
		if (work === undefined) {
			this.stopCalc();
			return;
		}

		if (work.depth == 0) {
			work.χ = this.heuristics[+work.myTurn](work.node);
			this.calcLoop = setImmediate(() => this.calc());
			return;
		}

		let childWork = work.children.next().value;
		if (childWork == undefined) {
			if (!work.hadChild) {
				// the end of the game
				work.χ = this.heuristics[+work.myTurn](work.node) * Number.POSITIVE_INFINITY;
			}
			this.calcLoop = setImmediate(() => this.calc());
			return;
		}

		this.workStack.push(work);
		this.workStack.push(childWork);

		this.calcLoop = setImmediate(() => this.calc());
	}

	stopCalc() {
		clearImmediate(this.calcLoop);
		if (this.onStop) {
			this.onStop(this.getBestMove());
			this.onStop = null;
		}
	}
}

class Work {

	constructor(nodeGen, parent, node) {
		this.parent = parent;
		this.node = node;
		this.hadChild = false;
		this.inheritValues(parent || Work.DEFAULT);

		this.children = (function* getChildren() {
			for (let childNode of nodeGen(this.node, this.myTurn)) {
				this.hadChild = true;
				yield new Work(nodeGen, this, childNode);
			}
		}.bind(this))();
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
		if (this.χ == newχ && Number.isFinite(newχ))
			return this.χ;

		this[['α', 'β'][+!this.myTurn]] = newχ;
		this.propagate();
		return newχ;
	}

	propagate() {
		if (this.parent == null)
			return;

		let limiter = [Math.max, Math.min][+!this.parent.myTurn];
		let originalχ = this.parent.χ;
		this.parent.χ = limiter(originalχ, this.χ);
		if (this.parent.χ != originalχ || !Number.isFinite(this.parent.χ))
			this.parent.bestChild = this;

		if (this.parent.β <= this.parent.α)
			this.parent.children = (function* prune() {})();
	}
}

Work.DEFAULT = {
	myTurn: false,
	α: Number.NEGATIVE_INFINITY,
	β: Number.POSITIVE_INFINITY,
	depth: 2
};

module.exports = MinMaxAB;
