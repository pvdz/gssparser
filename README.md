GSS Parser
=============

This is a full fledged parser for _CSS_ __and__ _GSS_. GSS is a DSL constraint driven CSS flavour used by thegrid.io

Once build and minified, the script will return an object with three parsers. The main entry point for parsing is `window.parsers.css`. The other two are sub-parsers exposed for testing purposes.

Usage
-----------

To run the parser simply run `window.parsers.css('input');`. This will return you a specific parse tree to be used elsewhere.

```js
var tree = window.parsers.css('a { b: c; }');

// ->
["rule", ["tag", "a"], [["set", "b", ['get', "c"]]]]
```

Additionally you should find all the tokens of the last parse in `window.parsers.css.allTokens`, which is an array with objects of the form:

```js
token = {
    _: <token type: string> // dev only, removed in build
    value: <value: string>,
    type: <token type: number>, // see lexer or parser constants
    offset: <token offset: number>,
    len: <token len: number>,
    row: <line number of start of token: number>,
    col: <col number of start of token: number>, // note that tabs are always one character here!
    pbws: <indicates whether there was any whitespace before this token: boolean>,
url: url <the url argument for url tokens: string>
};
```
See the lexer (csstok.js) for details.

Build
-----------

To build a new version run `bin/build.js` from anywhere. This script will strip some developer artifacts from the sources and put everything in `build/build.dev.js`.

Minify
-----------

Copy the results of building in [https://closure-compiler.appspot.com/home](Closure Compiler) and run it in Simple mode (advanced seems to screw up at the time of writing but the difference is minor anyways).

Closure should turn replace the constants with their actual values and eliminate unused vars afterwards, as well as a bunch of other magic :)

Tests
----------

There's an extensive set of tests available. You can run all of them through `test/iframe.html`, which includes a few static test runners in an iframe. From there you can click through.

You can find those files and the others on `test/index.html` as well. There are two fuzzer pages and test pages to run a single test case.

Note that these files aren't very polished. They were used for debugging and development. </excuses>
