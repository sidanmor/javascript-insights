# javascript-insights
Javascript Insights will try to override all Javascript pure functions and properties that it can and count their usage

## Installation
``` sh
npm i javascript-insights
```

## Usage
```js
var javascriptInsights = require('javascript-insights');

javascriptInsights.setObjectName(javascriptInsights, 'javascriptInsights');
javascriptInsights.start();

var arr = [0];
arr.push(1);
arr.push(2);

var res = javascriptInsights.getInsights();

console.log(JSON.stringify(res, null, '\t'));
```
## API

##### start([modules])

Accepts array of modules to overrid.

The default are all the existing modules in Node.js, include your required modules.

##### getInsights()

Returns the insights data.

##### setObjectName(obj, name)

Set the module name for modules that it can't decode.

If you encounter any issues or you have any questions, you are more then welcome to contact me sidanmor@gmail.com

## License

[MIT](https://opensource.org/licenses/MIT)

<!-- badge URLs -->
[npm-url]: https://npmjs.org/package/input
[npm-image]: https://img.shields.io/npm/v/input.svg?style=flat-square

[depstat-url]: https://david-dm.org/callumlocke/input
[depstat-image]: https://img.shields.io/david/callumlocke/input.svg?style=flat-square

[devdepstat-url]: https://david-dm.org/callumlocke/input#info=devDependencies
[devdepstat-image]: https://img.shields.io/david/dev/callumlocke/input.svg?style=flat-square&label=devDeps
