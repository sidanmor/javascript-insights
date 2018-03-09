var jsInsights = require('../../src/index');

jsInsights.setObjectName(jsInsights, 'jsInsights');
jsInsights.start();

var arr = [0];
arr.push(1);
arr.push(2);

console.log(JSON.stringify(jsInsights.getInsights(), null, '\t'));
