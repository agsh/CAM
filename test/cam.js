var assert = require('assert')
	, cam = require('../cam');

describe('CAM', function(){
	describe('basic commands', function(){
		it('sum', function(){
			var c = new cam.Machine({
				code: [
					{name: 'push'},
					{name: 'quote', quoted: '2'},
					{name: 'swap'},
					{name: 'quote', quoted: '3'},
					{name: 'cons'},
					{name: 'add'}
				]
			});
			assert.equal(c.exec(), '(5)');
		})
	});
	// < cur ( < cur ( cdr add ) , < quote (3)  , Snd > > app ) , quote (2)  > app
	describe('currying', function(){
		it('sum', function(){
			var c = new cam.Machine({
				code: [
					{name: 'push'},
					{name: 'cur', curried: [
						{name: 'push'},
						{name: 'cur', curried: [
							{name: 'cdr'},
							{name: 'add'}
						]},
						{name: 'swap'},
						{name: 'push'},
						{name: 'quote', quoted: '2'},
						{name: 'swap'},
						{name: 'cdr'},
						{name: 'cons'},
						{name: 'cons'},
						{name: 'app'}
					]},
					{name: 'swap'},
					{name: 'quote', quoted: '4'},
					{name: 'cons'},
					{name: 'app'}
				]
			});
			assert.equal(c.exec(), '(6)');
		})
	});
});