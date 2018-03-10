var insights;
var userFunc;

var timers          = require('timers');
var assert          = require('assert');
var asyncHooks      = require('async_hooks');
var childProcess    = require('child_process');
var cluster         = require('cluster');
var crypto          = require('crypto');
var dns             = require('dns');
var domain          = require('domain');
var events          = require('events');
var fs              = require('fs');
var net             = require('net');
var os              = require('os');
var path            = require('path');
// var perfHooks       = require('perf_hooks');
var punycode        = require('punycode');
var querystring     = require('querystring');
var readline        = require('readline');
var repl            = require('repl');
var streamReadable  = require('stream').Readable;
var streamWritable  = require('stream').Writable;
var streamDuplex    = require('stream').Duplex;
var streamTransform = require('stream').Transform;
var stringDecoder   = require('string_decoder');
var tls             = require('tls');
var tty             = require('tty');
var dgram           = require('dgram');
var url             = require('url');
var util            = require('util');
var v8              = require('v8');
var vm              = require('vm');
var zlib            = require('zlib');


// Override apply function
//-------------------------
var origApply = Function.prototype.apply;
var origCall  = Function.prototype.call;

var objectKeys                     = Object.keys;
var objectGetOwnPropertyNames      = Object.getOwnPropertyNames;
var objectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var objectAssign                   = Object.assign;
var objectDefineProperty           = Object.defineProperty;

objectKeys.apply                     = origApply;
objectGetOwnPropertyNames.apply      = origApply;
objectGetOwnPropertyDescriptor.apply = origApply;
objectAssign.apply                   = origApply;
objectDefineProperty.apply           = origApply;

objectKeys.call                     = origCall;
objectGetOwnPropertyNames.call      = origCall;
objectGetOwnPropertyDescriptor.call = origCall;
objectAssign.call                   = origCall;
objectDefineProperty.call           = origCall;

var getStackTrace = function () {
    var err = new Error();
    if (err.stack) return err.stack;
    try {
        null[0];
    } catch (ex) {
        return ex.stack || '';
    }
    return '';
};

var getObjectName = function (obj) {

    if (obj.name) return obj.name;
    if (obj.__jsInsightsName) return obj.__jsInsightsName;
    if (obj === process) return 'process';
    if (obj === console) return 'console';
    if (obj === Math) return 'math';
    if (obj === JSON) return 'JSON';
    if (obj === timers) return 'timers';
    if (obj === assert) return 'assert';
    if (obj === asyncHooks) return 'asyncHooks';
    if (obj === childProcess) return 'childProcess';
    if (obj === cluster) return 'cluster';
    if (obj === crypto) return 'crypto';
    if (obj === dns) return 'dns';
    if (obj === domain) return 'domain';
    if (obj === events) return 'events';
    if (obj === fs) return 'fs';
    if (obj === net) return 'net';
    if (obj === os) return 'os';
    if (obj === path) return 'path';
    // if (obj === perfHooks) return 'perfHooks';
    if (obj === punycode) return 'punycode';
    if (obj === querystring) return 'querystring';
    if (obj === readline) return 'readline';
    if (obj === repl) return 'repl';
    if (obj === streamReadable) return 'streamReadable';
    if (obj === streamWritable) return 'streamWritable';
    if (obj === streamDuplex) return 'streamDuplex';
    if (obj === streamTransform) return 'streamTransform';
    if (obj === stringDecoder) return 'stringDecoder';
    if (obj === tls) return 'tls';
    if (obj === tty) return 'tty';
    if (obj === dgram) return 'dgram';
    if (obj === url) return 'url';
    if (obj === util) return 'util';
    if (obj === v8) return 'v8';
    if (obj === vm) return 'vm';
    if (obj === zlib) return 'zlib';
    return obj.toString();
};

var start = function (objs) {

    // list of object to clone
    if (!objs) {
        objs = [
            process,
            Buffer,

            console,
            exports,
            // TODO - check how can I override this also
            // global,
            module,
            require,

            Array,
            Boolean,
            Date,
            Error,
            Math,
            Number,
            // TODO - check how can I override this also
            // Object,
            RegExp,
            String,
            JSON,
            Function,

            __dirname,
            __filename,
            clearImmediate,
            clearInterval,
            clearTimeout,
            setImmediate,
            setInterval,
            setTimeout,
            timers,
            assert,
            asyncHooks,
            childProcess,
            cluster,
            crypto,
            dns,
            domain,
            events,
            fs,
            net,
            os,
            path,
            // TODO - check how can I override this also
            // perfHooks,
            punycode,
            querystring,
            readline,
            repl,

            streamReadable,
            streamWritable,
            streamDuplex,
            streamTransform,

            // TODO - check how can I override this also
            // stringDecoder,
            tls,
            tty,
            dgram,
            url,
            util,
            v8,
            vm,
            zlib
        ];
    }

    for (var i = 0, objsLen = objs.length; i < objsLen; i++) {

        var obj = objs[i],
            j, k,
            sourceArrLen,
            keysLen,
            originDescriptor,
            keys;

        // override the object and its prototype if it has one
        var source    = obj;
        var sourceArr = [source];
        if (source.prototype) sourceArr.push(source.prototype);

        for (k = 0, sourceArrLen = sourceArr.length; k < sourceArrLen; k++) {

            source = sourceArr[k];

            // get the overrides object OwnPropertyName
            if (obj === process) {
                keys = Object.getOwnPropertyNames(source).filter(function (e) {
                    return ['__proto__', 'arguments', 'caller', 'prototype', 'nextTick', '_tickCallback'].indexOf(e) === -1;
                });
            } else {
                keys = Object.getOwnPropertyNames(source).filter(function (e) {
                    return ['__proto__', 'arguments', 'caller', 'prototype'].indexOf(e) === -1;
                });
            }

            // go over the object OwnPropertyName and try to override them
            for (j = 0, keysLen = keys.length; j < keysLen; j++) {

                originDescriptor = Object.getOwnPropertyDescriptor(source, keys[j]);


                // TODO - check constructor
                // const { URL, URLSearchParams } = require('url');
                // const myURL = new URL('https://example.org/?abc=123');
                // console.log(myURL.searchParams.get('abc'));
                // I will fillter them for now:

                if (source === url && (keys[j] === 'URL' || keys[j] === 'URLSearchParams')) continue;

                if (!originDescriptor || originDescriptor.writable === false || originDescriptor.configurable === false) continue;

                var newDescriptor = Object.assign({}, originDescriptor);

                // if the Property is a function
                if (originDescriptor.value && typeof originDescriptor.value === 'function') {

                    originDescriptor.value.apply = origApply;
                    originDescriptor.value.call  = origCall;

                    (function (drv, propObj, propKey) {

                        var prop = [propObj, propKey].join('.');

                        newDescriptor.value = function () {
                            try {

                                if (!insights) return drv.apply(this, arguments);

                                if (!insights.overrider) {
                                    insights.overrider = {};
                                }

                                if (!insights.overrider[propObj]) {
                                    insights.overrider[propObj] = {};
                                }

                                if (!insights.overrider[propObj][propKey] || typeof insights.overrider[propObj][propKey] !== 'number') {
                                    insights.overrider[propObj][propKey] = 0;
                                }

                                // TODO - add call stack
                                switch (true) {
                                    case 'Storage.setItem' === prop:
                                        var stackTrace     = getStackTrace();
                                        var stackTraceProp = prop + '.stackTrace';
                                        if (!insights.overrider[stackTraceProp]) insights.overrider[stackTraceProp] = {};
                                        insights.overrider[stackTraceProp][insights.overrider[prop]] = stackTrace;
                                        break;
                                }

                                // TODO - add arguments
                                switch (true) {
                                    case 'Storage.setItem' === prop:
                                        var argsProp = prop + '.invocations';
                                        if (!insights.overrider[argsProp]) insights.overrider[argsProp] = {};
                                        insights.overrider[argsProp][insights.overrider[prop]] = arguments;
                                        break;
                                }

                                // TODO - get script URLs
                                switch (true) {
                                    case 'Document.write' === prop:
                                    case 'Document.writeln' === prop:
                                    case 'XMLHttpRequest.open' === prop:
                                    case 'window.open' === prop:
                                    case 'window.fetch' === prop:
                                    case 'Navigator.sendBeacon' === prop:
                                    case 'Document.querySelectorAll' === prop:
                                    case 'Document.querySelector' === prop:
                                    case 'Node.insertAdjacentHTML' === prop:
                                        if (arguments.length) {
                                            for (var l = 0, lenl = arguments.length; l < lenl; l++) {
                                                if (typeof arguments[l] === 'string') {
                                                    var urls = arguments[l].match(urlsRegexWithoutHttp);
                                                    if (urls) {
                                                        if (!urls.length) urls = [urls];

                                                        if (!insights.argumentsInsights) insights.argumentsInsights = {
                                                            counter : 0,
                                                            urls    : {}
                                                        };

                                                        for (var p = 0, lenp = urls.length; p < lenp; p++) {
                                                            insights.argumentsInsights.urls[insights.argumentsInsights.counter] = {
                                                                url  : urls[p],
                                                                func : prop
                                                            };
                                                            insights.argumentsInsights.counter++;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        break;
                                }

                                insights.overrider[propObj][propKey]++;

                                // invoke user function
                                userFunc && userFunc.apply(this, arguments);

                                // invoke the origin function
                                return drv.apply(this, arguments);
                            } catch (e) {
                                console.log('### javascript-insights caught an error: ', e);
                                throw e;
                            }
                        };
                        objectDefineProperty.apply(source, [source, keys[j], newDescriptor]);
                    })(originDescriptor.value, getObjectName(obj), keys[j]);
                } else {
                    // if the Property is an object with a getter function
                    // TODO - use a user input function
                    if (originDescriptor.get) {
                        (function (drv, propObj, propKey, propFunc) {

                            var prop = [propObj, propKey, propFunc].join('.');

                            drv.apply = origApply;
                            drv.call  = origCall;

                            newDescriptor.get = function () {
                                try {

                                    if (!insights) return drv.apply(this, arguments);

                                    if (!insights.overrider[propObj]) {
                                        insights.overrider[propObj] = {};
                                    }

                                    if (!insights.overrider[propObj][propKey]) {
                                        insights.overrider[propObj][propKey] = {};
                                    }

                                    if (!insights.overrider[propObj][propKey][propFunc]) {
                                        insights.overrider[propObj][propKey][propFunc] = 0;
                                    }

                                    // TODO - add call stack
                                    switch (true) {
                                        case 'Document.cookie.get' === prop:
                                        case 'Document.cookie.set' === prop:
                                            var stackTrace     = getStackTrace();
                                            var stackTraceProp = prop + '.stackTrace';
                                            if (!insights.overrider[stackTraceProp]) insights.overrider[stackTraceProp] = {};
                                            insights.overrider[stackTraceProp][insights.overrider[prop]] = stackTrace;
                                            break;
                                    }

                                    // TODO - add arguments
                                    switch (true) {
                                        case 'Document.cookie.get' === prop:
                                        case 'Document.cookie.set' === prop:
                                            var argsProp = prop + '.invocations';
                                            if (!insights.overrider[argsProp]) insights.overrider[argsProp] = {};
                                            insights.overrider[argsProp][insights.overrider[prop]] = arguments;
                                            break;
                                    }

                                    // TODO - get script URLs
                                    switch (true) {
                                        case 'Node.insertAdjacentHTML' === prop:
                                            if (arguments.length) {
                                                for (var l = 0, lenl = arguments.length; l < lenl; l++) {
                                                    if (typeof arguments[l] === 'string') {
                                                        var urls = arguments[l].match(urlsRegexWithoutHttp);
                                                        if (urls) {
                                                            if (!urls.length) urls = [urls];

                                                            if (!insights.argumentsInsights) insights.argumentsInsights = {
                                                                counter : 0,
                                                                urls    : {}
                                                            };

                                                            for (var p = 0, lenp = urls.length; p < lenp; p++) {
                                                                insights.argumentsInsights.urls[insights.argumentsInsights.counter] = {
                                                                    url  : urls[p],
                                                                    func : prop
                                                                };
                                                                insights.argumentsInsights.counter++;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            break;
                                    }

                                    insights.overrider[propObj][propKey][propFunc]++;

                                    // invoke user function
                                    userFunc && userFunc.apply(this, arguments);

                                    // invoke the origin function
                                    return drv.apply(this, arguments);
                                } catch (e) {
                                    console.log('### javascript-insights caught an error: ', e);
                                    throw e;
                                }
                            };
                            objectDefineProperty.apply(source, [source, keys[j], newDescriptor]);
                        })(originDescriptor.get, getObjectName(obj), keys[j], 'get');
                    }

                    // if the Property is an object with a setter function
                    if (originDescriptor.set) {
                        (function (drv, propObj, propKey, propFunc) {

                            var prop = [propObj, propKey, propFunc].join('.');

                            drv.apply = origApply;
                            drv.call  = origCall;

                            newDescriptor.set = function () {
                                try {

                                    if (!insights) return drv.apply(this, arguments);

                                    if (!insights.overrider[propObj]) {
                                        insights.overrider[propObj] = {};
                                    }

                                    if (!insights.overrider[propObj][propKey]) {
                                        insights.overrider[propObj][propKey] = {};
                                    }

                                    if (!insights.overrider[propObj][propKey][propFunc]) {
                                        insights.overrider[propObj][propKey][propFunc] = 0;
                                    }

                                    // TODO - add call stack
                                    switch (true) {
                                        case 'Document.cookie.get' === prop:
                                        case 'Document.cookie.set' === prop:
                                            var stackTrace     = getStackTrace();
                                            var stackTraceProp = prop + '.stackTrace';
                                            if (!insights.overrider[stackTraceProp]) insights.overrider[stackTraceProp] = {};
                                            insights.overrider[stackTraceProp][insights.overrider[prop]] = stackTrace;
                                            break;
                                    }

                                    // TODO - add arguments
                                    switch (true) {
                                        case 'Document.cookie.get' === prop:
                                        case 'Document.cookie.set' === prop:
                                            var argsProp = prop + '.invocations';
                                            if (!insights.overrider[argsProp]) insights.overrider[argsProp] = {};
                                            insights.overrider[argsProp][insights.overrider[prop]] = arguments;
                                            break;
                                    }

                                    // TODO - get script URLs
                                    switch (true) {
                                        case 'Node.insertAdjacentHTML' === prop:
                                            if (arguments.length) {
                                                for (var l = 0, lenl = arguments.length; l < lenl; l++) {
                                                    if (typeof arguments[l] === 'string') {
                                                        var urls = arguments[l].match(urlsRegexWithoutHttp);
                                                        if (urls) {
                                                            if (!urls.length) urls = [urls];

                                                            if (!insights.argumentsInsights) insights.argumentsInsights = {
                                                                counter : 0,
                                                                urls    : {}
                                                            };

                                                            for (var p = 0, lenp = urls.length; p < lenp; p++) {
                                                                insights.argumentsInsights.urls[insights.argumentsInsights.counter] = {
                                                                    url  : urls[p],
                                                                    func : prop
                                                                };
                                                                insights.argumentsInsights.counter++;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            break;
                                    }

                                    insights.overrider[propObj][propKey][propFunc]++;

                                    // invoke user function
                                    userFunc && userFunc.apply(this, arguments);

                                    // invoke the origin function
                                    return drv.apply(this, arguments);
                                } catch (e) {
                                    console.log('### javascript-insights caught an error: ', e);
                                    throw e;
                                }
                            };
                            objectDefineProperty.apply(source, [source, keys[j], newDescriptor]);
                        })(originDescriptor.set, getObjectName(obj), keys[j], 'set');
                    }
                }
            }
        }

        // set the global value with the override ones
        setInterval   = timers.setInterval;
        clearInterval = timers.clearInterval;

        setImmediate   = timers.setImmediate;
        clearImmediate = timers.clearImmediate;

        setTimeout   = timers.setTimeout;
        clearTimeout = timers.clearTimeout;

        // TODO - try to override objects constructors
        // override constructor
        // if (typeof window[obj] === 'function' && window[obj].prototype && window[obj].prototype.constructor) {
        //     window[obj] = (function (obj) {
        //         var constructor = window[obj];
        //
        //         constructor.apply = origApply;
        //         constructor.call  = origCall;
        //
        //         function F() {
        //             if (!window.insights.overrider[obj]) window.insights.overrider[obj] = { counter : 0 };
        //             window.insights.overrider[obj].counter++;
        //             return constructor.apply(this, arguments);
        //         }
        //
        //         F.prototype = constructor.prototype;
        //
        //         return function () {
        //             return new F(arguments);
        //         }
        //
        //     })(obj);
        // }

        // if (typeof window[obj] === 'function' && window[obj].prototype && window[obj].prototype.constructor) {
        //
        //     window[obj] = (function (o) {
        //
        //         var constructor = window[o];
        //
        //         var createInstance = function () {
        //             if (!window.insights.overrider[o]) window.insights.overrider[o] = { counter : 0 };
        //             window.insights.overrider[o].counter++;
        //
        //             var res;
        //             switch (arguments.length) {
        //                 case 0:
        //                     res = new constructor();
        //                     break;
        //                 case 1:
        //                     res = new constructor(arguments[0]);
        //                     break;
        //                 case 2:
        //                     res = new constructor(arguments[0], arguments[1]);
        //                     break;
        //                 case 3:
        //                     res = new constructor(arguments[0], arguments[1], arguments[2]);
        //                     break;
        //                 case 4:
        //                     res = new constructor(arguments[0], arguments[1], arguments[2], arguments[3]);
        //                     break;
        //                 case 5:
        //                     res = new constructor(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
        //                     break;
        //                 case 6:
        //                     res = new constructor(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        //                     break;
        //                 case 7:
        //                     res = new constructor(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
        //                     break;
        //                 case 8:
        //                     res = new constructor(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
        //                     break;
        //                 case 9:
        //                     res = new constructor(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
        //                     break;
        //                 case 10:
        //                     res = new constructor(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
        //                     break;
        //                 default:
        //                     res = new constructor();
        //                     break;
        //             }
        //             // res.prototype = constructor.prototype;
        //             return res;
        //         };
        //
        //         createInstance.apply = origApply;
        //         createInstance.call  = origCall;
        //
        //         return function () {
        //             try {
        //                 return createInstance.apply(createInstance, arguments);
        //             } catch (e) {
        //                 console.log('--- error ---');
        //                 console.log(e);
        //                 console.log('--- error ---');
        //             }
        //         }
        //     })(obj)
        // }
    }
};

exports.start = function (objs) {
    start(objs);
    insights           = {};
    insights.overrider = {};
};

exports.getInsights = function () {
    return objectAssign.apply({}, [{}, insights]);
};

exports.setObjectName = function (obj, name) {
    obj.__jsInsightsName = name;
};

// TODO - set user function
// exports.setFunction = function (func) {
//     userFunc       = func;
//     userFunc.apply = origApply;
// };
