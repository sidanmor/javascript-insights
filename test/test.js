// TODO - write real tests :)

var jsInsights = require('../src/index');

// const path = require('path');
//
jsInsights.setObjectName(jsInsights, 'jsInsights');
// jsInsights.setObjectName(path, 'path');
//
jsInsights.start();

//
// path.basename('C:\\temp\\myfile.html');
//
// var arr = [];
// arr.push(__dirname);

// const assert = require('assert');
//
// const obj1 = {
//     a: {
//         b: 1
//     }
// };
// const obj2 = {
//     a: {
//         b: 2
//     }
// };
// const obj3 = {
//     a: {
//         b: 1
//     }
// };
// const obj4 = Object.create(obj1);
//
// assert.deepEqual(obj1, obj1);
// OK, object is equal to itself

// const buf1 = Buffer.alloc(10);
// const buf4 = Buffer.from([1, 2, 3]);

// const { spawn } = require('child_process');
// const ls = spawn('ls', ['-lh', '/usr']);
//
// ls.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
// });
//
// ls.stderr.on('data', (data) => {
//     console.log(`stderr: ${data}`);
// });
//
// ls.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
// });

// console.clear()

// const crypto = require('crypto');
// const secret = 'abcdefg';
// const hash = crypto.createHmac('sha256', secret)
//     .update('I love cupcakes')
//     .digest('hex');
// console.log(hash);

// const dns = require('dns');
//
// dns.resolve4('archive.org', (err, addresses) => {
//     if (err) throw err;
//
// console.log(`addresses: ${JSON.stringify(addresses)}`);
//
// addresses.forEach((a) => {
//     dns.reverse(a, (err, hostnames) => {
//     if (err) {
//         throw err;
//     }
//     console.log(`reverse for ${a}: ${JSON.stringify(hostnames)}`);
// });
// });
// });

// const EventEmitter = require('events');
//
// class MyEmitter extends EventEmitter {}
//
// const myEmitter = new MyEmitter();
// myEmitter.on('event', () => {
//     console.log('an event occurred!');
// });
// myEmitter.emit('event');


// const fs = require('fs');
//
// fs.unlink('/tmp/hello', (err) => {
//     if (err) throw err;
// console.log('successfully deleted /tmp/hello');
// });

// const net = require('net');
// const server = net.createServer((socket) => {
//     socket.end('goodbye\n');
// }).on('error', (err) => {
//     // handle errors here
//     throw err;
// });
//
// // grab an arbitrary unused port.
// server.listen(() => {
//     console.log('opened server on', server.address());
// });

// const os = require('os');
// os.arch();
// os.arch();
// os.arch();
// os.arch();
// os.arch();

// const path = require('path');
// path.basename('C:\\temp\\myfile.html');

// const { performance } = require('perf_hooks');
// performance.mark('A');
// doSomeLongRunningProcess(() => {
//     performance.mark('B');
// performance.measure('A to B', 'A', 'B');
// const measure = performance.getEntriesByName('A to B')[0];
// console.log(measure.duration);
// // Prints the number of milliseconds between Mark 'A' and Mark 'B'
// });

// process.chdir('/tmp');
// process.cwd()

// const punycode = require('punycode');
// punycode.decode('maana-pta'); // 'mañana'

// const querystring = require('querystring');
// querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });

// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });


// const repl = require('repl');
// const msg = 'message';
//
// repl.start('> ').context.m = msg;

// const fs   = require('fs');
// const file = fs.createWriteStream('example.txt');
// file.write('hello, ');
// file.end('world!');

// const { StringDecoder } = require('string_decoder');
// const decoder = new StringDecoder('utf8');

// var arr = new Array(1);
// arr.push(2);

// const { StringDecoder } = require('string_decoder');
// const decoder = new StringDecoder('utf8');
//
// decoder.write(Buffer.from([0xE2]));

// process.stdout.on('resize', () => {
//     console.log('screen size has changed!');
// console.log(`${process.stdout.columns}x${process.stdout.rows}`);
// });

// const dgram = require('dgram');
// const server = dgram.createSocket('udp4');
//
// server.on('error', (err) => {
//     console.log(`server error:\n${err.stack}`);
// server.close();
// });
//
// server.on('message', (msg, rinfo) => {
//     console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
// });
//
// server.on('listening', () => {
//     const address = server.address();
// console.log(`server listening ${address.address}:${address.port}`);
// });
//
// server.bind(41234);

// const { URL } = require('url');
// const myURL = new URL('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');

// const url = require('url');
// const myURL =
//           url.parse('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');

// var x =new RegExp('asdf');
// x.test('32323sdfa');

// const { URL, URLSearchParams } = require('url');
// const myURL = new URL('https://example.org/?abc=123');
// console.log(myURL.searchParams.get('abc'));
// // Prints 123
//
// myURL.searchParams.append('abc', 'xyz');
// console.log(myURL.href);
// // Prints https://example.org/?abc=123&abc=xyz
//
// myURL.searchParams.delete('abc');
// myURL.searchParams.set('a', 'b');
// console.log(myURL.href);
// Prints https://example.org/?a=b


// const newSearchParams = new URLSearchParams(myURL.searchParams);
// The above is equivalent to
// const newSearchParams = new URLSearchParams(myURL.search);

// newSearchParams.append('a', 'c');


// const util = require('util');
//
// async function fn() {
//     return 'hello world';
// }
// const callbackFunction = util.callbackify(fn);
//
// callbackFunction((err, ret) => {
//     if (err) throw err;
// console.log(ret);
// });

// const v8 = require('v8');
// v8.setFlagsFromString('--trace_gc');

// const vm = require('vm');
// const x = 1;
// const sandbox = { x: 2 };
// vm.createContext(sandbox); // Contextify the sandbox.

// const zlib = require('zlib');
// const gzip = zlib.createGzip();
// const fs = require('fs');
// const inp = fs.createReadStream('example.txt');
// const out = fs.createWriteStream('example.txt.gz');
// inp.pipe(gzip).pipe(out);

// const input = '.................................';
// zlib.deflate(input, (err, buffer) => {
//     if (!err) {
//     console.log(buffer.toString('base64'));
// } else {
//     // handle error
// }
// });

// setTimeout(function () {
//     console.log(__dirname);
//     console.log(__filename);
//     console.log(JSON.stringify(jsInsights.getInsights(), null, '\t'));
// }, 1000);
//

console.log(JSON.stringify(jsInsights.getInsights(), null, '\t'));
