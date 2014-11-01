/**
 * @author Andrew D.Laptev <a.d.laptev@gmail.com>
 */

// attach lodash
var _;
if (typeof _ === 'undefined') {
	_ = require('lodash');
}

/**
 * CAM namespace
 * @namespace cam
 */
var cam = {

};

/**
 * Categorical abstract machine term class
 * @param obj
 * @constructor
 */
cam.Term = function(obj) {
	/**
	 * Term value
	 * @type {string}
	 */
	this.value = obj ? obj.value || '' : '';
	if (obj) {
		if (obj.left)
			/**
			 * Left part
			 * @type {cam.Term|null}
			 */
			this.left = obj.left;
		if (obj.right)
			/**
			 * Right part
			 * @type {cam.Term|null}
			 */
			this.right = obj.right;
		if (obj.delimiter)
			/**
			 * Delimiter for term. Default is comma, colon for curried construction
			 * @type {string}
			 */
			this.delimiter = obj.delimiter;
	}
};
var Term = cam.Term;

/**
 * Clone a term
 * @returns {Term}
 */
Term.prototype.clone = function() {
	return new Term({
		value: this.value
		, left: this.left
		, right: this.right
	})
};

/**
 * Categorical abstract machine class
 * @constructor
 * @param params parameters
 */
cam.Machine = function(params) {
	/**Machine name*/
	this.name = params.name || 'default';
	this.code = params.code || [];
	this.stack = [];
	this.term = new Term();
};

cam.Machine.prototype.error = function(text) {
	throw new Error(text);
};

cam.Machine.prototype.execOnce = function() {
	if (this.code.length > 0) {
		var cmd = this.code.shift();
		// console.log(cmd.name);
		if (this[cmd.name]) {
			try {
				this[cmd.name](cmd);
			} catch(e) {
				this.error(e);
			}
		} else {
			this.error(cmd.name + ' - unexcepted cam command');
		}
	} else {
		this.error('code is empty');
	}
};

cam.Machine.prototype.exec = function() {
    while (this.code.length > 0) {
        this.execOnce();
    }
    return this.showTerm();
};

cam.Machine.prototype.push = function() {
	this.stack.unshift(this.term.clone());
};

cam.Machine.prototype.quote = function(env) {
	if (env.quoted) {
		this.term = new Term({value: env.quoted});
	} else {
		this.error('there is no quoted mark in quote instruction');
	}
};

cam.Machine.prototype.swap = function() {
	var tmpLink = this.stack.shift();
	this.stack.unshift(this.term);
	this.term = tmpLink;
};

cam.Machine.prototype.car = function() {
	if (this.term.left) {
		this.term = this.term.left;
	} else {
		this.error('Wrong term construction for car command');
	}
};

cam.Machine.prototype.cdr = function() {
	if (this.term.right) {
		this.term = this.term.right;
	} else {
		this.error('Wrong term construction for car command');
	}
};

cam.Machine.prototype.cur = function(env) {
	if (env.curried) {
		this.term = new Term({value: '', delimiter: ':', left: env.curried, right: this.term});
	} else {
		this.error("there is nothing curried mark in cur instruction");
	}
};

cam.Machine.prototype.app = function() {
	if (this.term.left && (this.term.left.delimiter === ":") && this.term.left.left && this.term.left.right && this.term.right) {
		this.code = this.term.left.left.concat(this.code);
		this.term = new Term({value: this.term.value, left: this.term.left.right, right: this.term.right});
	} else {
		this.error('Wrong term for app instruction');
	}
};

cam.Machine.prototype.cons = function() {
	this.term = new Term({value: '', left: this.stack.shift(), right: this.term});
};

cam.Machine.prototype.add = function() {
	this.term = new Term({value: parseInt(this.term.left.value, 10) + parseInt(this.term.right.value, 10)});
};

cam.Machine.prototype.show = function() {
	return this.showTerm() + '\t|\t' + this.showCode() + '\t|\t' + this.showStack();
};

cam.Machine.prototype.showCode = function() {
	return _.reduce(this.code
		, function(acc, cmd) {return acc + ' ' + cmd.name + (cmd.quoted ? '(' + cmd.quoted + ')' : '')}, ''
	);
};

cam.Machine.prototype.showStack = function() {
	return _.reduce(this.stack, function(acc, term) {return acc + ' ' + cam.termShow(term)}, '');
};

cam.Machine.prototype.showTerm = function() {
	return cam.termShow(this.term);
};

cam.termShow = function(term) {
	var s = '(';
	if (term.left) {
		s += cam.termShow(term.left) + ', ';
	}
	if (term.value) {
		s += term.value;
	}
	if (term.right) {
		s += ', ' + cam.termShow(term.right);
	}
	s += ')';
	return s;
};

if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = cam;
	}
	exports.cam = cam;
}