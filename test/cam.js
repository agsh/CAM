var assert = require('assert')
	, cam = require('../cam');

describe('CAM', function(){
	describe('basic commands', function(){
		it('sum', function(){
			var c = new cam.Machine({
				code: [
					{name: "push"},
					{name: "quote", quoted: "2"},
					{name: "swap"},
					{name: "quote", quoted: "3"},
					{name: "cons"},
					{name: "add"}
				]
			});
			assert.equal(c.exec(), '(5)');
		})
	})
});