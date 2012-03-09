/**
 * @author und <a.d.laptev@gmail.com>
 */

/**
 * CAM namespace
 * @namespace cam
 */
var cam = {};

/**
 * Categorical abstract machine class
 * @constructor
 * @param params parameters
 */
cam.machine = function(params) {
	/**Machine name*/
	this.name = params.name || "default";
	this.code = params.code || [];
	this.stack = [];
	this.term = {value: ""};
};

cam.machine.prototype.error = function(text) {
	console.log("Error: " + text + "!");
};

cam.machine.prototype.execOnce = function() {
	if (this.code.length > 0) {
		var cmd = this.code.shift(); // вместо pop
		console.log(cmd.name);
		if (this[cmd.name]) {
			try {
				this[cmd.name](cmd);
			} catch(e) {
				this.error(e);
			}
		} else {
			this.error(cmd.name + " - unexcepted cam command");
		}
	} else {
		this.error("code is empty");
	}
};

cam.machine.prototype.push = function() {
	this.stack.unshift(_.clone(this.term));
};

cam.machine.prototype.quote = function(env) {
	if (env.quoted) {
		this.term = {value: env.quoted};
	} else {
		this.error("there is no quoted mark in quote instruction");
	}
};

cam.machine.prototype.swap = function() {
	var tmpLink = this.stack.shift();
	this.stack.unshift(this.term);
	this.term = tmpLink;
};

cam.machine.prototype.car = function() {
	this.term = this.term.left;
};

cam.machine.prototype.cdr = function() {
	this.term = this.term.right;
};

cam.machine.prototype.cur = function(env) {
	if (env.curried) {
		this.term = {value: "", delimiter: ":", left: env.curried, right: this.term};
	} else {
		this.error("there is nothing curried mark in cur instruction");
	}
};

cam.machine.prototype.app = function() {
	if (this.term.left && (this.term.left.delimiter === ":") && this.term.left.left && this.term.left.right && this.term.right) {
		this.code = this.term.left.left.concat(this.code);
		this.term = {value: this.term.value, left: this.term.left.right, right: this.term.right};
	} else {
		this.error("uncondition term for app instruction");
	}
}

cam.machine.prototype.cons = function() {
	this.term = {value: "", left: this.stack.shift(), right: this.term}
};

cam.machine.prototype.add = function() {
	this.term = {value: parseInt(this.term.left.value, 10) + parseInt(this.term.right.value, 10)};
};

cam.machine.prototype.show = function() {
	return this.showTerm() + "| " + this.showCode() + "| " + this.showStack();
};

cam.machine.prototype.showCode = function() {
	return _.reduce(this.code, function(acc, cmd) {return acc + " " + cmd.name + (cmd.quoted?"("+cmd.quoted+")":"")}, "");
};

cam.machine.prototype.showStack = function() {
	return _.reduce(this.stack, function(acc, term) {return acc + " " + cam.termShow(term)}, "");
};

cam.machine.prototype.showTerm = function() {
	return cam.termShow(this.term);
};

cam.termShow = function(term) {
	var s = "(";
	if (term.left) {
		s += cam.termShow(term.left) + ", ";
	}
	if (term.value) {
		s += term.value;
	}
	if (term.right) {
		s += ", " + cam.termShow(term.right);
	}
	s += ")";
	return s;
};