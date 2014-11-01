##Categorical Abstract Machine implementation in javascript.

[![Coverage Status](https://coveralls.io/repos/agsh/CAM/badge.png)](https://coveralls.io/r/agsh/CAM)

Sample program:

```javascript
var c = new cam.machine({
	code: [
		{name: "push"},
		{name: "quote", quoted: "2"},
		{name: "swap"},
		{name: "quote", quoted: "3"},
		{name: "cons"},
		{name: "add"}
	]
});
```

console.log(c.exec()); // 5