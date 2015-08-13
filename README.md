This is a full fletched parser for CSS and GSS. GSS is a DSL constraint driven CSS flavour used by thegrid.io

The minified script will return an object with three parsers. The main entry point for parsing is `window.parsers.css`. The other two are sub-parsers exposed for testing purposes.

To run the parser simply run `window.parsers.css('input');`. This will return you a specific parse tree to be used elsewhere.
 
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

To build a new version run `bin/build.js` from anywhere. This script will strip some developer artifacts from the sources and put everything in `build/build.dev.js`. Copy this in [https://closure-compiler.appspot.com/home](Closure Compiler) and run it in Simple mode (advanced seems to screw up at the time of writing but the difference is minor anyways).

Closure should turn replace the constants with their actual values and eliminate unused vars afterwards, as well as a bunch of other magic :)
