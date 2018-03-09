var jsInsights = require('../../src/index');

jsInsights.setObjectName(jsInsights, 'jsInsights');
jsInsights.start();

setTimeout(function () {
    console.log('https://sidanmor.com');
    console.log(JSON.stringify(jsInsights.getInsights(), null, '\t'));
}, 1000);



