var ROOT = __dirname+'/../';
var SRC = ROOT+'src/';
var BUILD = ROOT + 'build/';

var fs = require('fs');

var strings = [
  fs.readFileSync(SRC+'csstok.js').toString('utf-8'),
  fs.readFileSync(SRC+'csspar.js').toString('utf-8'),
  fs.readFileSync(SRC+'gsspar.js').toString('utf-8'),
];

strings.forEach(function(source, sourceIndex) {
  // we assume that LOG(, WARN(, and ERROR( are only used in this context and never contain functional code
  // we will skip over paren pairs of any sort and replace the whole thing with a `0` to preserve surrounding code
  // the redundant zeroes will be stripped away by minification. or should be.

  // we can assume valid source code (mainly means proper pairs)

  source = filter(/LOG\(/g, 'LOG(', source);
  source = filter(/WARN\(/g, 'WARN(', source);
  source = filter(/ERROR\(/g, 'ERROR(', source);

  strings[sourceIndex] = source;
});

function filter(rex, needle, source) {
  var needleLen = needle.length;
  var starts = [];
  // using replace to search is sloppy but not very relevant :)
  source.replace(rex, function(str, offset) {
    starts.push(offset + str.length - needleLen);
  });

  var i = starts.length;
  while (i--) {
    var start = starts[i] + needleLen;
    if (source.slice(start-needleLen, start) !== needle) throw 'assertion error: slice('+(start-needleLen)+','+start+') should be at a '+needle+') but was: `'+source.slice(start-needleLen, start)+'`';

    var end = findEnd(source, start);
    if (end-start > 1000) throw 'start='+start+', end='+end+', len='+(end-start);
    console.log('found: `'+source.slice(start-needleLen, end+1)+'`');

    source = source.slice(0, start-needleLen) + 0 + source.slice(end+1);

  }

  return source;
}

var output =
  'window[\'parsers\'] = (function(){\n'+
  strings
    .join('\n\n')
    // drop LOG functions
    .replace(/\/\/BUILD_REMOVE_BEGIN[\s\S]*?\/\/BUILD_REMOVE_END/g, '')
    .replace(/^\s*0\s*;\s*$/mg, '') // remove dead "zero statements" because minifier wont
    .replace(/while\s*\(\s*0\s*,/g, 'while(')// `while (0, foo)` is equal to `while (foo)`
    .replace(/return\s+0\s*,/g, 'return ')
    +

    '\nvar obj = {};\n'+
    'obj[\'tok\'] = CSSTok;\n'+
    'obj[\'css\'] = CSSPar;\n'+
    'obj[\'gss\'] = GSSPar;\n'+
    'return obj;\n'+
  '})();'+
'';



if (!fs.existsSync(BUILD)) fs.mkdir(BUILD);
fs.writeFileSync(BUILD+'build.dev.js', output);

function findEnd(source, index) {
  var pairs = 0;
  while (index < source.length) {
    switch (source[index]) {
      // Note: this will BREAK if the log contains the character `(` or `)` inside a regex or string... (or comment)
      case ')':
        if (pairs) --pairs;
        else return index;
        break;
      case '(':
        ++pairs;
        break;
    }
    ++index;
  }
}