// not used, but possible sources of additional tests:
// - http://sourceforge.net/p/cssparser/code/HEAD/tree/trunk/cssparser/src/test/resources/
// - https://github.com/reworkcss/css/tree/master/test/cases
// - https://github.com/sabberworm/PHP-CSS-Parser/tree/master/tests/files
// - https://github.com/SimonSapin/tinycss/tree/master/tinycss/tests
// - https://github.com/radkovo/jStyleParser/tree/master/src/test/java/test

// all tests are in the form: [input, output, desc].
// - input may be a string or an array of strings.
// - an array if input strings are all expected to have the same output

var NO_THROW_TEST = 'TEST SHOULD SIMPLY NOT THROW'; // dont confirm output, only make sure the test did not throw (uncaught)
var NO_ERROR_TEST = 'SHOULD NOT REPORT AN ERROR'; // dont confirm output, only make sure it contains no errors
var MULTI_BODY = true; // see wrap() arg

var tokenTestsOk = [
  // whitespace stuff (tokens dont end up in stream, make sure they dont screw up surroundings)
  [0, '/* comment */', 'basic multiline comment'],
  [2, 'a/* comment */b', 'between idents'],
  [2, 'a b', 'space'],
  [2, 'a\tb', 'tab'],
  [2, 'a\rb', 'newline CR'],
  [2, 'a\nb', 'newline LF'],
  [2, 'a\r\nb', 'newline CRLF'],
  [2, 'a\n\rb', 'newline LFCR'],
  [2, 'a\fb', 'newline FF'],

  [1, '~=', 'INCLUDES token'],
  [1, '|=', 'DASHMATCH token'],
  [1, '^=', 'PREFIXMATCH token'],
  [1, '$=', 'SUFFIXMATCH token'],
  [1, '*=', 'SUBSTRINGMATCH token'],
  [1, '<!--', 'CDO token'],
  [1, '-->', 'CDC token'],

  [1, 'x', 'IDENT (1)'],
  [1, 'xx', 'IDENT (2)'],
  [1, 'xxx', 'IDENT (3)'],
  [1, '-x', 'IDENT (1)'],
  [1, '-xx', 'IDENT (2)'],
  [1, '-xxx', 'IDENT (3)'],
  [1, 'aoo', 'IDENT'],
  [1, 'boo', 'IDENT'],
  [1, 'coo', 'IDENT'],
  [1, 'doo', 'IDENT'],
  [1, 'eoo', 'IDENT'],
  [1, 'foo', 'IDENT'],
  [1, 'goo', 'IDENT'],
  [1, 'hoo', 'IDENT'],
  [1, 'ioo', 'IDENT'],
  [1, 'joo', 'IDENT'],
  [1, 'koo', 'IDENT'],
  [1, 'loo', 'IDENT'],
  [1, 'moo', 'IDENT'],
  [1, 'noo', 'IDENT'],
  [1, 'ooo', 'IDENT'],
  [1, 'poo', 'IDENT'],
  [1, 'qoo', 'IDENT'],
  [1, 'roo', 'IDENT'],
  [1, 'soo', 'IDENT'],
  [1, 'too', 'IDENT'],
  [1, 'uoo', 'IDENT'],
  [1, 'voo', 'IDENT'],
  [1, 'woo', 'IDENT'],
  [1, 'xoo', 'IDENT'],
  [1, 'yoo', 'IDENT'],
  [1, 'zoo', 'IDENT'],
  [1, 'Aoo', 'IDENT'],
  [1, 'Boo', 'IDENT'],
  [1, 'Coo', 'IDENT'],
  [1, 'Doo', 'IDENT'],
  [1, 'Eoo', 'IDENT'],
  [1, 'Foo', 'IDENT'],
  [1, 'Goo', 'IDENT'],
  [1, 'Hoo', 'IDENT'],
  [1, 'Ioo', 'IDENT'],
  [1, 'Joo', 'IDENT'],
  [1, 'Koo', 'IDENT'],
  [1, 'Loo', 'IDENT'],
  [1, 'Moo', 'IDENT'],
  [1, 'Noo', 'IDENT'],
  [1, 'Ooo', 'IDENT'],
  [1, 'Poo', 'IDENT'],
  [1, 'Qoo', 'IDENT'],
  [1, 'Roo', 'IDENT'],
  [1, 'Soo', 'IDENT'],
  [1, 'Too', 'IDENT'],
  [1, 'Uoo', 'IDENT'],
  [1, 'Voo', 'IDENT'],
  [1, 'Woo', 'IDENT'],
  [1, 'Xoo', 'IDENT'],
  [1, 'Yoo', 'IDENT'],
  [1, 'Zoo', 'IDENT'],
  [1, '-aoo', 'IDENT'],
  [1, '-boo', 'IDENT'],
  [1, '-coo', 'IDENT'],
  [1, '-doo', 'IDENT'],
  [1, '-eoo', 'IDENT'],
  [1, '-foo', 'IDENT'],
  [1, '-goo', 'IDENT'],
  [1, '-hoo', 'IDENT'],
  [1, '-ioo', 'IDENT'],
  [1, '-joo', 'IDENT'],
  [1, '-koo', 'IDENT'],
  [1, '-loo', 'IDENT'],
  [1, '-moo', 'IDENT'],
  [1, '-noo', 'IDENT'],
  [1, '-ooo', 'IDENT'],
  [1, '-poo', 'IDENT'],
  [1, '-qoo', 'IDENT'],
  [1, '-roo', 'IDENT'],
  [1, '-soo', 'IDENT'],
  [1, '-too', 'IDENT'],
  [1, '-uoo', 'IDENT'],
  [1, '-voo', 'IDENT'],
  [1, '-woo', 'IDENT'],
  [1, '-xoo', 'IDENT'],
  [1, '-yoo', 'IDENT'],
  [1, '-zoo', 'IDENT'],
  [1, '-Aoo', 'IDENT'],
  [1, '-Boo', 'IDENT'],
  [1, '-Coo', 'IDENT'],
  [1, '-Doo', 'IDENT'],
  [1, '-Eoo', 'IDENT'],
  [1, '-Foo', 'IDENT'],
  [1, '-Goo', 'IDENT'],
  [1, '-Hoo', 'IDENT'],
  [1, '-Ioo', 'IDENT'],
  [1, '-Joo', 'IDENT'],
  [1, '-Koo', 'IDENT'],
  [1, '-Loo', 'IDENT'],
  [1, '-Moo', 'IDENT'],
  [1, '-Noo', 'IDENT'],
  [1, '-Ooo', 'IDENT'],
  [1, '-Poo', 'IDENT'],
  [1, '-Qoo', 'IDENT'],
  [1, '-Roo', 'IDENT'],
  [1, '-Soo', 'IDENT'],
  [1, '-Too', 'IDENT'],
  [1, '-Uoo', 'IDENT'],
  [1, '-Voo', 'IDENT'],
  [1, '-Woo', 'IDENT'],
  [1, '-Xoo', 'IDENT'],
  [1, '-Yoo', 'IDENT'],
  [1, '-Zoo', 'IDENT'],
  [1, '--aoo', 'IDENT'],
  [1, '--boo', 'IDENT'],
  [1, '--coo', 'IDENT'],
  [1, '--doo', 'IDENT'],
  [1, '--eoo', 'IDENT'],
  [1, '--foo', 'IDENT'],
  [1, '--goo', 'IDENT'],
  [1, '--hoo', 'IDENT'],
  [1, '--ioo', 'IDENT'],
  [1, '--joo', 'IDENT'],
  [1, '--koo', 'IDENT'],
  [1, '--loo', 'IDENT'],
  [1, '--moo', 'IDENT'],
  [1, '--noo', 'IDENT'],
  [1, '--ooo', 'IDENT'],
  [1, '--poo', 'IDENT'],
  [1, '--qoo', 'IDENT'],
  [1, '--roo', 'IDENT'],
  [1, '--soo', 'IDENT'],
  [1, '--too', 'IDENT'],
  [1, '--uoo', 'IDENT'],
  [1, '--voo', 'IDENT'],
  [1, '--woo', 'IDENT'],
  [1, '--xoo', 'IDENT'],
  [1, '--yoo', 'IDENT'],
  [1, '--zoo', 'IDENT'],
  [1, '--Aoo', 'IDENT'],
  [1, '--Boo', 'IDENT'],
  [1, '--Coo', 'IDENT'],
  [1, '--Doo', 'IDENT'],
  [1, '--Eoo', 'IDENT'],
  [1, '--Foo', 'IDENT'],
  [1, '--Goo', 'IDENT'],
  [1, '--Hoo', 'IDENT'],
  [1, '--Ioo', 'IDENT'],
  [1, '--Joo', 'IDENT'],
  [1, '--Koo', 'IDENT'],
  [1, '--Loo', 'IDENT'],
  [1, '--Moo', 'IDENT'],
  [1, '--Noo', 'IDENT'],
  [1, '--Ooo', 'IDENT'],
  [1, '--Poo', 'IDENT'],
  [1, '--Qoo', 'IDENT'],
  [1, '--Roo', 'IDENT'],
  [1, '--Soo', 'IDENT'],
  [1, '--Too', 'IDENT'],
  [1, '--Uoo', 'IDENT'],
  [1, '--Voo', 'IDENT'],
  [1, '--Woo', 'IDENT'],
  [1, '--Xoo', 'IDENT'],
  [1, '--Yoo', 'IDENT'],
  [1, '--Zoo', 'IDENT'],
  [1, '--0oo', 'IDENT'],
  [1, '--1oo', 'IDENT'],
  [1, '--2oo', 'IDENT'],
  [1, '--3oo', 'IDENT'],
  [1, '--4oo', 'IDENT'],
  [1, '--5oo', 'IDENT'],
  [1, '--6oo', 'IDENT'],
  [1, '--7oo', 'IDENT'],
  [1, '--8oo', 'IDENT'],
  [1, '--9oo', 'IDENT'],
  [1, 'aaoo', 'IDENT'],
  [1, 'aboo', 'IDENT'],
  [1, 'acoo', 'IDENT'],
  [1, 'adoo', 'IDENT'],
  [1, 'aeoo', 'IDENT'],
  [1, 'afoo', 'IDENT'],
  [1, 'agoo', 'IDENT'],
  [1, 'ahoo', 'IDENT'],
  [1, 'aioo', 'IDENT'],
  [1, 'ajoo', 'IDENT'],
  [1, 'akoo', 'IDENT'],
  [1, 'aloo', 'IDENT'],
  [1, 'amoo', 'IDENT'],
  [1, 'anoo', 'IDENT'],
  [1, 'aooo', 'IDENT'],
  [1, 'apoo', 'IDENT'],
  [1, 'aqoo', 'IDENT'],
  [1, 'aroo', 'IDENT'],
  [1, 'asoo', 'IDENT'],
  [1, 'atoo', 'IDENT'],
  [1, 'auoo', 'IDENT'],
  [1, 'avoo', 'IDENT'],
  [1, 'awoo', 'IDENT'],
  [1, 'axoo', 'IDENT'],
  [1, 'ayoo', 'IDENT'],
  [1, 'azoo', 'IDENT'],
  [1, 'aAoo', 'IDENT'],
  [1, 'aBoo', 'IDENT'],
  [1, 'aCoo', 'IDENT'],
  [1, 'aDoo', 'IDENT'],
  [1, 'aEoo', 'IDENT'],
  [1, 'aFoo', 'IDENT'],
  [1, 'aGoo', 'IDENT'],
  [1, 'aHoo', 'IDENT'],
  [1, 'aIoo', 'IDENT'],
  [1, 'aJoo', 'IDENT'],
  [1, 'aKoo', 'IDENT'],
  [1, 'aLoo', 'IDENT'],
  [1, 'aMoo', 'IDENT'],
  [1, 'aNoo', 'IDENT'],
  [1, 'aOoo', 'IDENT'],
  [1, 'aPoo', 'IDENT'],
  [1, 'aQoo', 'IDENT'],
  [1, 'aRoo', 'IDENT'],
  [1, 'aSoo', 'IDENT'],
  [1, 'aToo', 'IDENT'],
  [1, 'aUoo', 'IDENT'],
  [1, 'aVoo', 'IDENT'],
  [1, 'aWoo', 'IDENT'],
  [1, 'aXoo', 'IDENT'],
  [1, 'aYoo', 'IDENT'],
  [1, 'aZoo', 'IDENT'],
  [1, 'a-oo', 'IDENT'],
  [1, '_oo', 'IDENT'],
  [1, '-_oo', 'IDENT'],
  [1, 'a_oo', 'IDENT'],
  [1, '\x80oo', 'IDENT (first non-ascii start)'],
  [1, 'a\x80oo', 'IDENT (second non-ascii start)'],
  [1, '-\x80oo', 'IDENT (first non-ascii start)'],
  [1, '\u03A0oo', 'IDENT (omega start)'],
  [1, 'a\u03A0oo', 'IDENT (second start)'],
  [1, '-\u03A0oo', 'IDENT (omega start)'],
  [1, '\\zoo', 'IDENT (escaped z, is ok)'],
  [1, 'a\\zoo', 'IDENT (escaped z, is ok)'],
  [1, '-\\zoo', 'IDENT (escaped z, is ok)'],
  [1, '\\x80oo', 'IDENT (escaped 127, is ok)'],
  [1, 'a\\x80oo', 'IDENT (escaped 127, is ok)'],
  [1, '-\\x80oo', 'IDENT (escaped 127, is ok)'],
  [1, '\\u03A0oo', 'IDENT (escaped omega, is ok)'],
  [1, 'a\\u03A0oo', 'IDENT (escaped omega, is ok)'],
  [1, '-\\u03A0oo', 'IDENT (escaped omega, is ok)'],
  [1, '\\$oo', 'IDENT (escaped $, is ok)'],
  [1, '-\\$oo', 'IDENT (escaped $, is ok)'],
  [1, '--\\$oo', 'IDENT (escaped $, is ok)'],
  [1, '---\\$oo', 'IDENT (escaped $, is ok)'],
  [1, 'a\\$oo', 'IDENT (escaped $, is ok)'],
  [1, '\\\\03A0oo', 'IDENT (escaped backslash, is ok..)'],
  [1, '-\\\\03A0oo', 'IDENT (escaped backslash, is ok..)'],
  [1, 'a\\\\03A0oo', 'IDENT (escaped backslash, is ok..)'],
  [1, '\\--oo', 'IDENT (double -- start by means of escaping the first - seems to be okay)'],
  [1, '-\\-oo', 'IDENT (double -- start by means of escaping the second - seems to be okay)'],
  [1, 'a--oo', 'double dash is fine later'],
  [1, 'a\\--oo', 'double dash is fine later'],
  [1, 'a-\\-oo', 'double dash is fine later'],
  [1, 'a-_oo', 'IDENT'],
  [1, 'a-\x80oo', 'IDENT (non-ascii content)'],
  [1, 'a\u03A0oo', 'IDENT (omega content)'],
  [1, 'adsa\u03A0', 'IDENT (unicode finish)'],
  [1, 'adsa\\z', 'IDENT (escaped G finish)'],
  [1, '\\8numberstart', 'IDENT (start with escaped hex number)'],
  [1, '\\9numberstart', 'IDENT (start with escaped non-hex number)'],
  [1, 'adsa\\\\', 'IDENT (escaped backslash finish)'],
  [1, '\\u0065oo', 'IDENT (unicode escape in css has no leading u but it still parses fine)'],
  [1, '\\afoo', 'escaped hex digit can start ident'],
  [1, '\\bfoo', 'escaped hex digit can start ident'],
  [1, '\\cfoo', 'escaped hex digit can start ident'],
  [1, '\\dfoo', 'escaped hex digit can start ident'],
  [1, '\\efoo', 'escaped hex digit can start ident'],
  [1, '\\ffoo', 'escaped hex digit can start ident'],
  [1, '\\Afoo', 'escaped hex digit can start ident'],
  [1, '\\Bfoo', 'escaped hex digit can start ident'],
  [1, '\\Cfoo', 'escaped hex digit can start ident'],
  [1, '\\Dfoo', 'escaped hex digit can start ident'],
  [1, '\\Efoo', 'escaped hex digit can start ident'],
  [1, '\\Ffoo', 'escaped hex digit can start ident'],
  [1, '\\1foo', 'escaped numbers can start an identifier'],
  [1, '\\2foo', 'escaped numbers can start an identifier'],
  [1, '\\3foo', 'escaped numbers can start an identifier'],
  [1, '\\4foo', 'escaped numbers can start an identifier'],
  [1, '\\5foo', 'escaped numbers can start an identifier'],
  [1, '\\6foo', 'escaped numbers can start an identifier'],
  [1, '\\7foo', 'escaped numbers can start an identifier'],
  [1, '\\8foo', 'escaped numbers can start an identifier'],
  [1, '\\9foo', 'escaped numbers can start an identifier'],
  [1, '\\0foo', 'escaped numbers can start an identifier'],

  // special: An+B cases
  [1, 'n', 'An+B: IDENT'],
  [2, 'n-', 'An+B: IDENT DASH (illegal IDENT, makes An+B hack simpler in lexer)'],
  [2, '+n', 'An+B: PLUS IDENT'],
  [2, '-n', 'An+B: DASH IDENT'],
  [3, '-n-', 'An+B: DASH IDENT DASH (illegal IDENT, makes An+B hack simpler in lexer)'],
  [2, '+ n', 'An+B: PLUS IDENT'],
  [2, '- n', 'An+B: DASH IDENT'],
  [4, '10n+5', 'An+B: NUMBER IDENT PLUS NUMBER'],
  [5, '+10n+5', 'An+B: PLUS NUMBER IDENT PLUS NUMBER'],
  [5, '-10n+5', 'An+B: DASH NUMBER IDENT PLUS NUMBER'],
  [3, 'n+5', 'An+B: IDENT PLUS NUMBER'],
  [4, '+n+5', 'An+B: PLUS IDENT PLUS NUMBER'],
  [4, '-n+5', 'An+B: DASH IDENT PLUS NUMBER'],
  [4, '10n-5', 'An+B: NUMBER IDENT DASH NUMBER'],
  [5, '+10n-5', 'An+B: PLUS NUMBER IDENT DASH NUMBER'],
  [5, '-10n-5', 'An+B: DASH NUMBER IDENT DASH NUMBER'],
  [3, 'n-5', 'An+B: IDENT DASH NUMBER'],
  [4, '+n-5', 'An+B: PLUS IDENT DASH NUMBER'],
  [4, '-n-5', 'An+B: DASH IDENT DASH NUMBER'],
  [2, '10n', 'An+B: NUMBER IDENT'],
  [3, '+10n', 'An+B: PLUS NUMBER IDENT'],
  [3, '-10n', 'An+B: DASH NUMBER IDENT'],
  [1, '10', 'An+B: NUMBER'],
  [2, '+10', 'An+B: PLUS NUMBER'],
  [2, '-10', 'An+B: DASH NUMBER'],
  [4, '8n +3', 'An+B NUMBER IDENT PLUS NUMBER'],
  [4, '8n -3', 'An+B NUMBER IDENT DASH NUMBER'],
  [4, '8n+ 3', 'An+B NUMBER IDENT PLUS NUMBER'],
  [4, '8n- 3', 'An+B NUMBER IDENT DASH NUMBER'],
  [4, '8n + 3', 'An+B NUMBER IDENT PLUS NUMBER'],
  [4, '8n - 3', 'An+B NUMBER IDENT DASH NUMBER'],
  [4, '8n\f-3', 'An+B NUMBER IDENT DASH NUMBER weird newline case'],
  [4, '8n\r-3', 'An+B NUMBER IDENT DASH NUMBER weird newline case'],

  // unicode ranges
  //['u+ff?', [], 'unicode-range-token for unicode-range property'] // http://www.w3.org/TR/css-syntax-3/#typedef-unicode-range-token and https://developer.mozilla.org/en-US/docs/Web/CSS/unicode-range

  [1, '"foo"', 'double quoted STRING'],
  [1, '"\\"foo"', 'double quoted STRING, escaped double quote start'],
  [1, '"f\\"oo"', 'double quoted STRING, escaped double quote middle'],
  [1, '"foo\\""', 'double quoted STRING, escaped double quote end'],
  [1, '"\\\'foo"', 'double quoted STRING, escaped single quote start'],
  [1, '"f\\\'oo"', 'double quoted STRING, escaped single quote middle'],
  [1, '"foo\\\'"', 'double quoted STRING, escaped single quote end'],
  [1, '\'foo\'', 'single quoted STRING'], // we'll assume single uses same parser as double for most tests...
  [1, '\'\\\'foo\'', 'single quoted STRING, escaped single quote middle'],
  [1, '\'f\\\'oo\'', 'single quoted STRING, escaped single quote start'],
  [1, '\'foo\\\'\'', 'single quoted STRING, escaped single quote end'],
  [1, '\'\\\"foo\'', 'single quoted STRING, escaped double quote middle'],
  [1, '\'f\\\"oo\'', 'single quoted STRING, escaped double quote start'],
  [1, '\'foo\\\"\'', 'single quoted STRING, escaped double quote end'],
  [1, '"fo\\\no"', 'line continuation (\\n) in a string'],
  [1, '"fo\\\ro"', 'line continuation (\\r) in a string'],
  [1, '"fo\\\fo"', 'line continuation (\\f) in a string'],
  [1, '"fo\\\n\\\ro"', 'line continuation (\\n\\r, crlf) in a string'],
  [1, '"f\x80oo"', '127 in STRING'],
  [1, '"f\u03A0oo"', 'omega in STRING'],
  [1, '"f\\00doo"', 'hex escaped newline in STRING'],

  [1, '0', 'NUMBER'],
  [1, '1', 'NUMBER'],
  [1, '2', 'NUMBER'],
  [1, '3', 'NUMBER'],
  [1, '4', 'NUMBER'],
  [1, '5', 'NUMBER'],
  [1, '6', 'NUMBER'],
  [1, '7', 'NUMBER'],
  [1, '8', 'NUMBER'],
  [1, '9', 'NUMBER'],
  [1, '00', 'NUMBER'],
  // ... procedurally generate numbers 000 ~ 999 this way
  [1, '0.0', 'NUMBER'],
  [1, '00.0', 'NUMBER'],
  [1, '0.00', 'NUMBER'],
  [1, '00.00', 'NUMBER'],
  [1, '.0', 'NUMBER'],
  [1, '.00', 'NUMBER'],
  // ... procedurally generate numbers 000 ~ 999 this way, one with and one without integer
  [2, '+15', 'NUMBER int positive prefix'],
  [2, '-15', 'NUMBER int negative prefix'],
  [2, '+0.547', 'NUMBER float positive prefix'],
  [2, '-84.67', 'NUMBER float negative prefix'],
  // ... procedurally for all ten digits following - and +

  [1, '#foo', 'HASH, two tokens not one'],
  [1, '#-foo', 'HASH identifier can start with dash'],
  [1, '#\\zfoo', 'HASH identifier can have escape'],
  [1, '#\u03A0foo', 'HASH identifier can have unicode'],
  [1, '#\x80foo', 'HASH identifier can have 127'],
  [1, '#1foo', 'HASH identifier can start with a number'], // normal idents cannot
  [1, '#abc', 'HASH identifier hex'],
  [1, '#000', 'HASH identifier hex zeroes'],
  [1, '#abcdef', 'HASH identifier hex'],
  [1, '#000000', 'HASH identifier hex zeroes'],
  [1, '#00000000', 'HASH identifier even more zeroes'],
  [1, '#--foo', 'HASH identifier can start with double dash'],

  [2, ':foo', 'COLON pseudo-class'],
  [5, ':foo(x)', 'COLON pseudo-class func'],
  [3, '::foo', 'COLON pseudo-element'],
  [6, '::foo(x)', 'COLON pseudo-element func'],
  [5, ':not(foo)', 'COLON not is special lexer case'],
  [2, ':first-line', 'COLON special single colon case'],
  [2, ':first-letter', 'COLON special single colon case'],
  [2, ':before', 'COLON special single colon case'],
  [2, ':after', 'COLON special single colon case'],
  [3, '::first-line', 'COLON tbd'],
  [3, '::first-letter', 'COLON tbd'],
  [3, '::before', 'COLON tbd'],
  [3, '::after', 'COLON tbd'],
  [3, 'foo:bar', 'COLON after IDENT'],
  [4, 'button::-moz-focus-inner', 'dash start after double colon'],

  [2, '25px', 'DIMENSION is two tokens'],
  [2, '25 px', 'DIMENSION is two tokens'],
  [2, '45%', 'PERCENTAGE is two tokens'],
  [2, '45 %', 'PERCENTAGE is two tokens'],
  [2, '1em2em', 'as per spec, the unit would be em2em which is illegal'], // but this is just a lexer test

  // url token may end the file, end with EOF instead of )
  [1, 'url', 'url can still be an identifier'],
  [1, 'url()', 'URL needs no arguments'],
  [1, 'url(  )', 'URL needs no arguments, whitespace ignored'],
  [1, 'url(', 'URL also safely closes at EOF'],
  [1, 'url("foo")', 'URL can have string'],
  [1, 'url( "foo")', 'URL string can have leading whitespace'],
  [1, 'url("foo" )', 'URL string can have trailing whitespace'],
  [1, 'url( "foo" )', 'URL string can have whitespace padding'],
  [1, 'url(\'foo\')', 'URL can have string'],
  [1, 'url( \'foo\')', 'URL string can have leading whitespace'],
  [1, 'url(\'foo\' )', 'URL string can have trailing whitespace'],
  [1, 'url( \'foo\' )', 'URL string can have whitespace padding'],
  [1, 'url(1)', 'URL with number is BADURL'],

  [2, '!important', 'this is important'],

  // "An identifier with the value "&B" could be written as \26 B or \000026B."
  // "A "real" space after the escape sequence must be doubled."
  [2, '&B', 'PUNC and IDENT, duh'],
  [1, '\\26 B', 'single identifier (single space must be skipped)'],
  [1, '\\026 B', 'single identifier (single space must be skipped)'],
  [1, '\\0026 B', 'single identifier (single space must be skipped)'],
  [1, '\\00026 B', 'single identifier (single space must be skipped)'],
  [1, '\\000026 B', 'single identifier (single space must be skipped)'],
  [1, '\\000026B', 'single identifier (single space must be skipped)'],
  [2, '\\26  B', 'two identifiers, the double space serves as disambiguation'],
  [2, '\\026  B', 'two identifiers, the double space serves as disambiguation'],
  [2, '\\0026  B', 'two identifiers, the double space serves as disambiguation'],
  [2, '\\00026  B', 'two identifiers, the double space serves as disambiguation'],
  [2, '\\000026  B', 'two identifiers, the double space serves as disambiguation'],

  [1, '\r\\.', 'regression; this should not make the lexer throw up but parse a newline and a weird identifier'],
];

var parserSimpleSelectorTests = [
  // simple selectors
  ['div {}', ['rule', ['tag', 'div'], []], 'element selector'],
  ['.hello {}', ['rule', ['.', 'hello'], []], 'class name'],
  ['#hello {}', ['rule', ['#', 'hello'], []], 'hash name'],
  ['* {}', ['rule', ['tag', '*'], []], 'element selector'],
  ['a, b {}', ['rule', [',', ['tag', 'a'], ['tag', 'b']], []], 'list of two elements'],
  ['b, a {}', ['rule', [',', ['tag', 'b'], ['tag', 'a']], []], 'normalize? a,b is same as b,a'],
  ['.a, #b, c {}', ['rule', [',', ['.', 'a'], ['#', 'b'], ['tag', 'c']], []], 'list of various simple types'],

  // combinators
  ['a b {}', ['rule', [['tag', 'a'], [' '], ['tag', 'b']], []], 'descendant'],
  ['a > b {}', ['rule', [['tag', 'a'], ['>'], ['tag', 'b']], []], 'direct child'],
  ['a + b {}', ['rule', [['tag', 'a'], ['+'], ['tag', 'b']], []], 'adjacent sibling'],
  ['a ~ b {}', ['rule', [['tag', 'a'], ['~'], ['tag', 'b']], []], 'general sibling'],
  ['.a.b {}', ['rule', [['.', 'a'], ['.', 'b']], []], 'two classes same element'],
  ['.b.a {}', ['rule', [['.', 'b'], ['.', 'a']], []], 'normalized? .a.b is same as .b.a'],
  ['.a .b {}', ['rule', [['.', 'a'], [' '], ['.', 'b']], []], 'two classes descending elements'],
  ['.a #b {}', ['rule', [['.', 'a'], [' '], ['#', 'b']], []], 'hash descending from class'],
  ['a.b#c {}', ['rule', [['tag', 'a'], ['.', 'b'], ['#', 'c']], []], 'hash descending from class'],
  ['a.b#c, #d {}', ['rule', [',', [['tag', 'a'], ['.', 'b'], ['#', 'c']], ['#', 'd']], []], 'combined and multiple'],
  ['a * {}', ['rule', [['tag', 'a'], [' '], ['tag', '*']], []], 'space combinator with star'],
  ['a* {}', ['rule', [['tag', 'a'], ['tag', '*']], []], 'tag star without space'],
  ['a#b {}', ['rule', [['tag', 'a'], ['#', 'b']], []], 'hash without space'],
  ['a #b {}', ['rule', [['tag', 'a'], [' '], ['#', 'b']], []], 'hash with space'],

// combinator precedence/mix
  ['a b c {}', ['rule', [['tag', 'a'], [' '], ['tag', 'b'], [' '], ['tag', 'c']], []], 'three levels'],
  ['a > b > c {}', ['rule', [['tag', 'a'], ['>'], ['tag', 'b'], ['>'], ['tag', 'c']], []], 'three direct levels'],
  ['a b > c {}', ['rule', [['tag', 'a'], [' '], ['tag', 'b'], ['>'], ['tag', 'c']], []], 'three levels mixed'],
  ['article.featured > img {}', ['rule', [['tag', 'article'], ['.', 'featured'], ['>'], ['tag', 'img']], []], 'together and child mix'],

  // attr
  ['[b] {}', ['rule', ['[]', 'b'], []], 'orphan attr'],
  ['a[b] {}', ['rule', [['tag', 'a'], ['[]', 'b']], []], 'simple attr'],
  ['.a.b[c] {}', ['rule', [['.', 'a'], ['.', 'b'], ['[]', 'c']], []], 'attr with double class'],
  ['div:hover[x] {}', ['rule', [['tag', 'div'], [':hover'], ['[]', 'x']], []], 'attr after pseudo'],
  ['div > [x] {}', ['rule', [['tag', 'div'], ['>'], ['[]', 'x']], []], 'edge case, make sure attr as start of (sub)selector is no problem'],
  ['div [x] {}', ['rule', [['tag', 'div'], [' '], ['[]', 'x']], []], 'edge case, make sure attr as start of (sub)selector is no problem'],
  ['div + [x] {}', ['rule', [['tag', 'div'], ['+'], ['[]', 'x']], []], 'edge case, make sure attr as start of (sub)selector is no problem'],
  ['[a][b] {}', ['rule', [['[]', 'a'], ['[]', 'b']], []], 'double attrs, tbd'], // tbd
  ['[b][a] {}', ['rule', [['[]', 'b'], ['[]', 'a']], []], 'double attrs, same as other order, normalize?'],
  // unquoted attr values
  ['[b=a] {}', ['rule', ['=', 'b', 'a'], []], 'base unquoted attr value'],
  ['[b=foo] {}', ['rule', ['=', 'b', 'foo'], []], 'base unquoted attr value, multi char'],
  ['[b=a12] {}', ['rule', ['=', 'b', 'a12'], []], 'base unquoted attr value, with numbers'],
  ['[b=_a] {}', ['rule', ['=', 'b', '_a'], []], 'base unquoted attr value, leading underscore'],
  ['[b=-a] {}', ['rule', ['=', 'b', '-a'], []], 'base unquoted attr value, leading dash'],
  ['[b= a] {}', ['rule', ['=', 'b', 'a'], []], 'unquoted attr value, space after ='],
  ['[b =a] {}', ['rule', ['=', 'b', 'a'], []], 'unquoted attr value, space before ='],
  ['[b = a] {}', ['rule', ['=', 'b', 'a'], []], 'unquoted attr value, space around ='],
  // double quoted attr values
  ['[b="a"] {}', ['rule', ['=', 'b', 'a'], []], 'base double quoted attr value'],
  ['[b= "a"] {}', ['rule', ['=', 'b', 'a'], []], 'double quoted attr value, space after ='],
  ['[b ="a"] {}', ['rule', ['=', 'b', 'a'], []], 'double quoted attr value, space before ='],
  ['[b = "a"] {}', ['rule', ['=', 'b', 'a'], []], 'double quoted attr value, space around ='],
  // single quoted attr values
  ['[b=\'a\'] {}', ['rule', ['=', 'b', 'a'], []], 'base double quoted attr value'],
  ['[b= \'a\'] {}', ['rule', ['=', 'b', 'a'], []], 'double quoted attr value, space after ='],
  ['[b =\'a\'] {}', ['rule', ['=', 'b', 'a'], []], 'double quoted attr value, space before ='],
  ['[b = \'a\'] {}', ['rule', ['=', 'b', 'a'], []], 'double quoted attr value, space around ='],

  // pseudo
  [':hover {}', ['rule', [':hover'], []], 'pseudos dont need a preceeding value part'],
  ['*:hover {}', ['rule', [['tag', '*'], [':hover']], []], 'pseudos go in same arrays as other value parts'],
  ['div:hover {}', ['rule', [['tag', 'div'], [':hover']], []], 'pseudo without combinator'],
  ['div :hover {}', ['rule', [['tag', 'div'], [' '], [':hover']], []], 'pseudo with space combinator'],
  [':hover.foo {}', ['rule', [[':hover'], ['.', 'foo']], []], 'pseudos can get a class succeeding them'],
  [':hover > .foo {}', ['rule', [[':hover'], ['>'], ['.', 'foo']], []], 'pseudos can be preceded by combiners'],
  ['.foo > :hover {}', ['rule', [['.', 'foo'], ['>'], [':hover']], []], 'pseudos can be succeeded by combiners'],
  [':foo() {}', ['rule', [':foo'], []], 'pseudo call with no params'],
  [':foo(15) {}', ['rule', [':foo', 15], []], 'pseudo call with number param'],
  [':foo("bar") {}', ['rule', [':foo', ['virtual', 'bar']], []], 'pseudo call with double quoted string as param (virtual because double quotes)'],
  [':foo(\'bar\') {}', ['rule', [':foo', 'bar'], []], 'pseudo call with single quoted string as param'],
  [':foo(bar) {}', ['rule', [':foo', ['tag', 'bar']], []], 'pseudo call with element as param'],
  [':foo(.bar) {}', ['rule', [':foo', ['.', 'bar']], []], 'pseudo call with class as param'],
  [':foo(#bar) {}', ['rule', [':foo', ['#', 'bar']], []], 'pseudo call with id as param'],
  [':foo(:bar(baz)) {}', ['rule', [':foo', [':bar', ['tag', 'baz']]], []], 'nested pseudo calls'],
  [':foo(bar):baz(foo) {}', ['rule', [[':foo', ['tag', 'bar']], [':baz', ['tag', 'foo']]], []], 'consecutive pseudo calls'],
  [':foo:baz(foo) {}', ['rule', [[':foo'], [':baz', ['tag', 'foo']]], []], 'consecutive pseudo calls'],
  [':foo(bar):baz {}', ['rule', [[':foo', ['tag', 'bar']], [':baz']], []], 'consecutive pseudos'],
  [':foo:baz {}', ['rule', [[':foo'], [':baz']], []], 'consecutive pseudos'],
  ['::foo {}', ['rule', [':foo'], []], 'double colon becomes single'],

  // white space tests
  ['a{}', ['rule', ['tag', 'a'], []], 'no white before body'],
  ['a {}', ['rule', ['tag', 'a'], []], 'space before body'],
  ['a\n{}', ['rule', ['tag', 'a'], []], 'newline before body'],
  ['a,b {}', ['rule', [',', ['tag', 'a'], ['tag', 'b']], []], 'no white around comma'],
  ['a ,b {}', ['rule', [',', ['tag', 'a'], ['tag', 'b']], []], 'space before comma'],
  ['a, b {}', ['rule', [',', ['tag', 'a'], ['tag', 'b']], []], 'space after comma'],
  ['a , b {}', ['rule', [',', ['tag', 'a'], ['tag', 'b']], []], 'space around comma'],
  ['a\n, b {}', ['rule', [',', ['tag', 'a'], ['tag', 'b']], []], 'newline space around comma'],
  ['a ,\tb {}', ['rule', [',', ['tag', 'a'], ['tag', 'b']], []], 'space tab around comma'],
  ['a .b {}', ['rule', [['tag', 'a'], [' '], ['.', 'b']], []], 'space as combinator'],
  ['a\t.b {}', ['rule', [['tag', 'a'], [' '], ['.', 'b']], []], 'tab as combinator should still result in space'],
  ['a\n.b {}', ['rule', [['tag', 'a'], [' '], ['.', 'b']], []], 'newline as combinator should still result in space'],
  ['a \t\n.b {}', ['rule', [['tag', 'a'], [' '], ['.', 'b']], []], 'multiple whitespace as combinator shoudl result in a single space'],
  ['a[x="a\\\nb"] {}', ['rule', [['tag', 'a'], ['=', 'x', 'ab']], []], 'escaped newline should be removed from string values'],

  // comment tests
  ['a/*crap*/{}', ['rule', ['tag', 'a'], []], 'comment before body'],
  ['a/* crap */.b {}', ['rule', [['tag', 'a'], ['.', 'b']], []], 'comment does not count as whitespace'],

  // An+B
  ['li:nth-child(even) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 2, 0]]], []], 'an+b'],
  ['li:nth-child(odd) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 2, 1]]], []], 'an+b'],
  ['li:nth-child(n) {}', ['rule', [['tag', 'li'], [':nth-child', 'n']], []], 'not an+b but the var `n`'],
  ['li:nth-child(-n) {}', ['rule', [['tag', 'li'], [':nth-child', ['-', 'n']]], []], 'not an+b but the var `n`'],
  ['li:nth-child(+n) {}', ['rule', [['tag', 'li'], [':nth-child', 'n']], []], 'an+b'],
  ['li:nth-child(8n+3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b'],
  ['li:nth-child(0n+0) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 0, 0]]], []], 'an+b'],
  ['li:nth-child(+0n+0) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 0, 0]]], []], 'an+b'],
  ['li:nth-child(-0n+0) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 0, 0]]], []], 'an+b'],
  ['li:nth-child(-2n+5) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', -2, 5]]], []], 'an+b'],
  ['li:nth-child(+2n+5) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 2, 5]]], []], 'an+b'],
  ['li:nth-child(n+1) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 1, 1]]], []], 'an+b'],
  ['li:nth-child(-n+3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', -1, 3]]], []], 'an+b'],
  ['li:nth-child(+n+4) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 1, 4]]], []], 'an+b'],
  ['li:nth-child(2n-5) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 2, -5]]], []], 'an+b'],
  ['li:nth-child(+2n-5) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 2, -5]]], []], 'an+b'],
  ['li:nth-child(-2n-5) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', -2, -5]]], []], 'an+b'],
  ['li:nth-child(0n-0) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 0, 0]]], []], 'an+b'],
  ['li:nth-child(+0n-0) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 0, 0]]], []], 'an+b'],
  ['li:nth-child(-0n-0) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 0, 0]]], []], 'an+b'],
  ['li:nth-child(n-2) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 1, -2]]], []], 'an+b'],
  ['li:nth-child(+n-6) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 1, -6]]], []], 'an+b'],
  ['li:nth-child(-n-5) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', -1, -5]]], []], 'an+b'],
  ['li:nth-child(8n) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 0]]], []], 'an+b'],
  ['li:nth-child(+6n) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 6, 0]]], []], 'an+b'],
  ['li:nth-child(-4n) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', -4, 0]]], []], 'an+b'],
  ['li:nth-child(15) {}', ['rule', [['tag', 'li'], [':nth-child', 15]], []], 'an+b'],
  ['li:nth-child(+7) {}', ['rule', [['tag', 'li'], [':nth-child', 7]], []], 'an+b'],
  ['li:nth-child(-5) {}', ['rule', [['tag', 'li'], [':nth-child', -5]], []], 'an+b'],
  ['li:nth-child(8n +3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n   +3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n \t +3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n \n +3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n \f +3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n+ 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n+   3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n+ \t 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n+ \n 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n+ \f 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n + 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n\t+   3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n + \t 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n\f+ \n 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n\r+ \f 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, 3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n -3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n   -3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n \t -3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n \n -3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n \f -3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n- 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n-   3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n- \t 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n- \n 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n- \f 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n - 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n\t-   3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n - \t 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n\f- \n 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],
  ['li:nth-child(8n\r- \f 3) {}', ['rule', [['tag', 'li'], [':nth-child', ['anb', 8, -3]]], []], 'an+b whitespace'],

  // flatten nested comma lists
  [[
    'a, b, c, e {}',
    '(a, b, c), e {}',
    'a, (b, c), e {}',
    'a, (b, c, e) {}',
    '(a, b), (c, e) {}',
  ],
    ['rule', [',', ['tag', 'a'], ['tag', 'b'], ['tag', 'c'], ['tag', 'e']], []],
    'comma lists should be flattened'
  ],

  // !important
  [wrap('color: red !important;'), wrap(['set', 'color', [['get', 'red'], '!', 'important']]), 'TBD important syntax'],


  // virtuals in preamble

  /*
   https://thegrid.slack.com/archives/gss/p1437163340002401
   a {
   "my-variable-context" { // does not change DOM socpe
   width: == 10;
   a == 20;
   img {
   width: == a + ^width + ^^width;
   }
   }
   "another-context" {
   a == 30;
   }
   }

   https://thegrid.slack.com/archives/gss/p1437163501002410
   .my-page {
   "header" {
   h1 { }
   .logo {}
   }
   }
   */

// namespace (todo)
//['a|b {}', ['rule', ['+', 'a', 'b'], []], 'sibling'],
];

var parserSimpleDeclarationTests = [
  [wrap(''), wrap([]), 'confirm skeleton is okay'],

  // classic style properties
  [wrap('color: red;'), wrap(['set', 'color', ['get', 'red']]), 'base'],
  [wrap('margin-left: 5;'), wrap(['set', 'margin-left', 5]), 'dashed property'],
  [wrap('-moz-margin-left: 5;'), wrap(['set', '-moz-margin-left', 5]), 'vendor prefixed'],
  [wrap('foo: +5;'), wrap(['set', 'foo', 5]), 'explicitly positive number'],
  [wrap('foo: -5;'), wrap(['set', 'foo', -5]), 'negative number'],

  // "funcs"
  [wrap('x: foo();'), wrap(['set', 'x', 'foo']), 'call no args'], // not sure whether this is ever valid (if no args, why the parens), but okay
  [wrap('x: foo(a);'), wrap(['set', 'x', ['foo', ['get', 'a']]]), 'call one arg'],
  [wrap('x:foo(a);'), wrap(['set', 'x', ['foo', ['get', 'a']]]), 'call one arg, no space (regression)'],
  [wrap('x: foo(a, b);'), wrap(['set', 'x', ['foo', ['get', 'a'], ['get', 'b']]]), 'call two args'],
  [wrap('x: foo(a, b, c);'), wrap(['set', 'x', ['foo', ['get', 'a'], ['get', 'b'], ['get', 'c']]]), 'call three args'],
  [wrap('x: foo(a b, c);'), wrap(['set', 'x', ['foo', [['get', 'a'], ['get', 'b']], ['get', 'c']]]), 'only go deeper if needed'],
  //[wrap('x: vars-func(my-var, #box[x], .foo.bar[x]);'), wrap(['set', 'x', ['vars-func', 'my-var', [['#', 'box'], ['[]', 'x']]]]), 'old test'],

  // colors
  [wrap('color: #cde;'), wrap(['set', 'color', ['hex', 'cde']]), 'hex3'],
  [wrap('color: #001;'), wrap(['set', 'color', ['hex', '001']]), 'hex3 zero padding'],
  [wrap('color: #09abcd;'), wrap(['set', 'color', ['hex', '09abcd']]), 'hex6'],
  [wrap('color: #000001;'), wrap(['set', 'color', ['hex', '000001']]), 'hex6 zero padding'],
  [wrap('color: #09abcdef;'), wrap(['set', 'color', ['hex', '09abcdef']]), 'alpha hex'],
  [wrap('color: #00000001;'), wrap(['set', 'color', ['hex', '00000001']]), 'alpha hex zero padding'],
  [wrap('color: rgb(100, 200, 300);'), wrap(['set', 'color', ['rgb', 100, 200, 300]]), 'rgb'],
  [wrap('color: rgb(10%, 20%, 30%);'), wrap(['set', 'color', ['rgb', ['%', 10], ['%', 20], ['%', 30]]]), 'rgb %'],
  [wrap('color: rgba(100, 200, 300, .34);'), wrap(['set', 'color', ['rgba', 100, 200, 300, 0.34]]), 'rgba'],
  [wrap('color: rgb(10%, 20%, 30%, .28);'), wrap(['set', 'color', ['rgb', ['%', 10], ['%', 20], ['%', 30], 0.28]]), 'rgba %'],
  [wrap('color: hsl(1, 2%, 3%);'), wrap(['set', 'color', ['hsl', 1, ['%', 2], ['%', 3]]]), 'hsl'], // without % as well?
  [wrap('color: hsla(1, 2%, 3%, .23);'), wrap(['set', 'color', ['hsla', 1, ['%', 2], ['%', 3], 0.23]]), 'hsla'],

  // shorthands
  [wrap('numbahs: 5px 3em 2.5;'), wrap(['set', 'numbahs', [['px', 5], ['em', 3], 2.5]]), 'numbers'],
  [wrap('words: hello world;'), wrap(['set', 'words', [['get', 'hello'], ['get', 'world']]]), 'idents'],
  [wrap('mix: 1px solid red;'), wrap(['set', 'mix', [['px', 1], ['get', 'solid'], ['get', 'red']]]), 'mixed, number first'],
  [wrap('mix: warp 5.3% speed;'), wrap(['set', 'mix', [['get', 'warp'], ['%', 5.3], ['get', 'speed']]]), 'mixed, ident first'],
  [wrap('multi: a, b;'), wrap(['set', 'multi', [['get', 'a'], ['get', 'b']]]), 'simple list'],
  [wrap('multi: 5em red, 3 vw blue, warp 5.3% speed;'),
    wrap(['set', 'multi', [[['em', 5], ['get', 'red']], [['vw', 3], ['get', 'blue']], [['get', 'warp'], ['%', 5.3], ['get', 'speed']]]]),
    'complex list'
  ],

  // gradients
  [wrap('background: linear-gradient(135deg, red, blue);'),
    wrap(['set', 'background', ['linear-gradient', ['deg', 135], ['get', 'red'], ['get', 'blue']]]),
    'simple linear3 mdn example'
  ],
  [wrap('background: linear-gradient(135deg, red, red 60%, blue);'),
    wrap(['set', 'background', ['linear-gradient', ['deg', 135], ['get', 'red'], [['get', 'red'], ['%', 60]], ['get', 'blue']]]),
    'complex linear4 mdn example'
  ],
  // ASK: should function-value-args be flat or in a comma command?
  [wrap('background: linear-gradient(to bottom right, red, rgba(255,0,0,0));'),
    wrap(['set', 'background', ['linear-gradient', [['get', 'to'], ['get', 'bottom'], ['get', 'right']], ['get', 'red'], ['rgba', 255, 0, 0, 0]]]),
    'repeating linear gradient (mdn)'
  ],
  [wrap('background: radial-gradient(ellipse farthest-corner at 45px 45px , #00FFFF 0%, rgba(0, 0, 255, 0) 50%, #0000FF 95%);'),
    wrap(['set', 'background', ['radial-gradient',
      [['get', 'ellipse'], ['get', 'farthest-corner'], ['get', 'at'], ['px', 45], ['px', 45]],
      [['hex', '00FFFF'], ['%', 0]],
      [['rgba', 0, 0, 255, 0], ['%', 50]],
      [['hex', '0000FF'], ['%', 95]]
    ]]),
    'radial gradient (mdn example 1)'
  ],
  [wrap('background-image: radial-gradient(ellipse farthest-corner at 470px 47px , #FFFF80 20%, rgba(204, 153, 153, 0.4) 30%, #E6E6FF 60%);'), NO_ERROR_TEST, 'radial gradient (mdn example 2)'],
  [wrap('background-image: radial-gradient(farthest-corner at 45px 45px , #FF0000 0%, #0000FF 100%);'), NO_ERROR_TEST, 'radial gradient (mdn example 2)'],
  [wrap('background-image: radial-gradient(16px at 60px 50% , #000000 0%, #000000 14px, rgba(0, 0, 0, 0.3) 18px, rgba(0, 0, 0, 0) 19px);'), NO_ERROR_TEST, 'radial gradient (mdn example 2)'],

  // transform
  [wrap('transform: translateX(10) rotateY(1deg)'), ['rule', ['tag', 'divv'], [['set', 'transform', [['translateX', 10], ['rotateY', ['deg', 1]]]]]], 'transform uses spaces'],

  // font family
  [wrap('font-family: Gill Sans Extrabold, sans-serif;'),
    wrap(['set', 'font-family', [[['get', 'Gill'], ['get', 'Sans'], ['get', 'Extrabold']], ['get', 'sans-serif']]]), // TBD
    'font family (mdn example 1)'
  ],
  [wrap('font-family: "Goudy Bookletter 1911", sans-serif;'),
    wrap(['set', 'font-family', ['Goudy Bookletter 1911', ['get', 'sans-serif']]]),
    'font family (mdn example 1)'
  ],
  [wrap('font-family: \'Goudy Bookletter 1911\', sans-serif;'),
    wrap(['set', 'font-family', ['Goudy Bookletter 1911', ['get', 'sans-serif']]]),
    'font family (mdn example 1)'
  ],

  // calc
  [wrap('foo: calc();'), wrap(['set', 'foo', 'calc']), 'no args'],
  [wrap('foo: calc(10)'), wrap(['set', 'foo', ['calc', 10]]), 'one arg'],
  [wrap('foo: calc(10 + 20)'), wrap(['set', 'foo', ['calc', ['+', 10, 20]]]), 'addition (args in a group because they are spaced as a single arg)'],
  [wrap('foo: calc(10 - 20)'), wrap(['set', 'foo', ['calc', ['-', 10, 20]]]), 'subtraction (args in a group because they are spaced as a single arg)'],
  [wrap('foo: calc(10 * 20)'), wrap(['set', 'foo', ['calc', ['*', 10, 20]]]), 'multiplication (args in a group because they are spaced as a single arg)'],
  [wrap('foo: calc(10 / 20)'), wrap(['set', 'foo', ['calc', ['/', 10, 20]]]), 'division (args in a group because they are spaced as a single arg)'],
  [wrap('foo: calc(10 + -20)'), wrap(['set', 'foo', ['calc', ['+', 10, -20]]]), 'addition with negative'],
  [wrap('foo: calc(-10 + 20)'), wrap(['set', 'foo', ['calc', ['+', -10, 20]]]), 'addition with negative'],
  [wrap('foo: calc(-10 + -20)'), wrap(['set', 'foo', ['calc', ['+', -10, -20]]]), 'addition with two negatives'],
  [wrap('foo: calc(10 + +20)'), wrap(['set', 'foo', ['calc', ['+', 10, 20]]]), 'addition with prefix'],
  [wrap('foo: calc(10 - -20)'), wrap(['set', 'foo', ['calc', ['-', 10, -20]]]), 'subtraction with negative'],
  [wrap('foo: calc(-10 - 20)'), wrap(['set', 'foo', ['calc', ['-', -10, 20]]]), 'subtraction with negative'],
  [wrap('foo: calc(-10 - -20)'), wrap(['set', 'foo', ['calc', ['-', -10, -20]]]), 'subtraction with two negatives'],
  [wrap('foo: calc(10 - +20)'), wrap(['set', 'foo', ['calc', ['-', 10, 20]]]), 'subtraction with prefix'],
  [wrap('foo: calc(10*20)'), wrap(['set', 'foo', ['calc', ['*', 10, 20]]]), 'multiplication, unspaced'],
  [wrap('foo: calc(10/20)'), wrap(['set', 'foo', ['calc', ['/', 10, 20]]]), 'division, unspaced'],
  [wrap('foo: calc(10px - +20vw)'), wrap(['set', 'foo', ['calc', ['-', ['px', 10], ['vw', 20]]]]), 'subtraction with prefix'],
  [wrap('width: calc(100%/3 - 2*1em - 2*1px);'), NO_ERROR_TEST, 'spec example 14'], // http://dev.w3.org/csswg/css-values-3/#calc-notation
  [wrap('margin: calc(1rem - 2px) calc(1rem - 1px);'), NO_ERROR_TEST, 'spec example 15'], // http://dev.w3.org/csswg/css-values-3/#calc-notation
  [wrap('font-size: calc(100vw / 40);'), NO_ERROR_TEST, 'spec example 16'], // http://dev.w3.org/csswg/css-values-3/#calc-notation
  [wrap('background-position: calc(50% + 20px) calc(50% + 20px), 50% 50%;'), NO_ERROR_TEST, 'spec example 17'], // http://dev.w3.org/csswg/css-values-3/#calc-notation
  [wrap('background-image: linear-gradient(to right, silver, white 50px, white calc(100% - 50px), silver);'), NO_ERROR_TEST, 'spec example 18'], // http://dev.w3.org/csswg/css-values-3/#calc-notation
  [wrap('width: calc(5px - 10px);'), wrap(['set', 'width', ['calc', ['-', ['px', 5], ['px', 10]]]]), 'should be equal to 0px, range test which we dont enforce anyways'],
  [wrap('width: -moz-calc((1));'), wrap(['set', 'width', ['-moz-calc', 1]])],
  [wrap('width: -moz-calc((1 * 2));'), wrap(['set', 'width', ['-moz-calc', [1, '*', 2]]])],
  [wrap('width: -moz-calc(3 / (2));'), wrap(['set', 'width', ['-moz-calc', [3, '/', 2]]])],
  [wrap('width: -moz-calc(1 + (2 + 3));'), wrap(['set', 'width', ['-moz-calc', [1, '+', [2, '+', 3]]]])],

  // unicode range
  //['u+ff?', [], 'unicode-range-token for unicode-range property'] // http://www.w3.org/TR/css-syntax-3/#typedef-unicode-range-token and https://developer.mozilla.org/en-US/docs/Web/CSS/unicode-range

  // url stuff
  // body { background: url("http://www.example.com/pinkish.gif") }
  // body { background: url(http://www.example.com/pinkish.gif) }

  // hacks
  [wrap('*zoom: 1;'), wrap(['***', ['set', 'zoom', 1]]), 'IE zoom hack'],

  ['a {\n    background: url(1) solid, #ccc solid;\n}',
    ['rule', ['tag', 'a'], [['set', 'background', [[['url', '1'], ['get', 'solid']], [['hex', 'ccc'], ['get', 'solid']]]]]],
    'regression, url with num'
  ],
  ['a {\n    background: url("a") solid, #ccc solid;\n}',
    ['rule', ['tag', 'a'], [['set', 'background', [[['url', 'a'], ['get', 'solid']], [['hex', 'ccc'], ['get', 'solid']]]]]],
    'regression, url with string, value not properly parsed'
  ],

  ['d { bakground: linear-gradient(top, right, calc(1px + 1%) of "something") }',
    ['rule', ['tag', 'd'], [['set', 'bakground', ['linear-gradient', ['get', 'top'], ['get', 'right'], [['calc', ['+', ['px', 1], ['%', 1]]], ['get', 'of'], 'something']]]]],
    'make sure strings drop their quotes'
  ],
];

var parserSimpleNumberValueTests = [];
['', '%', 'em', 'ex', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax', 'cm', 'mm', 'in', 'px', 'pt', 'pc', 'deg', 'rad', 'turn', 's', 'ms', 'Hz', 'kHz', 'dpi', 'dpcm', 'dppx'].forEach(function (type) {
  // for each type, test int, float, both with and without space between (so 4 tests per type)
  parserSimpleNumberValueTests.push(
    [[
      'div { random: 5' + type + '; }',
      'div { random: 5 ' + type + '; }',
    ],
      ['rule', ['tag', 'div'], [['set', 'random', type ? [type, 5] : 5]]],
      'integer space ' + type
    ],
    [[
      'div { random: 20.5782' + type + '; }',
      'div { random: 20.5782 ' + type + '; }',
    ],
      ['rule', ['tag', 'div'], [['set', 'random', type ? [type, 20.5782] : 20.5782]]],
      'float ' + type
    ],
    [[
      'div { x: <= 5' + type + '}',
      'div { x: <= 5 ' + type + '}',
    ],
      ['rule', ['tag', 'div'], [['<=', ['get', ['&'], 'x'], type ? [type, 5] : 5]]],
      'gss num decl ' + type
    ],
    [[
      'x <= 5' + type,
      'x <= 5 ' + type,
    ],
      ['<=', ['get', 'x'], type ? [type, 5] : 5],
      'gss rule num ' + type
    ],
    [[
      '5' + type + ' <= x',
      '5 ' + type + ' <= x',
    ],
      ['<=', type ? [type, 5] : 5, ['get', 'x']],
      'gss rule num ' + type
    ]
  );
});

var parserAtRuleTests = [
  ['@foo;', ['@', 'foo'], 'at rule with empty prelude and no body'],
  ['@foo {}', ['@', 'foo', '{', '}'], 'at rule with empty prelude and body'],
  ['@foo() {}', ['@', 'foo', '(', ')', '{', '}'], 'at rule with empty call and body'],
  ['@foo { a { b } }', ['@', 'foo', '{', 'a', '{', 'b', '}', '}'], 'nested group in at rule'],
  ['@foo { a b c { b } }', ['@', 'foo', '{', 'a', 'b', 'c', '{', 'b', '}', '}'], 'nested group in at rule'],
  ['@foo { a [ x y ] { b } f }', ['@', 'foo', '{', 'a', '[', 'x', 'y', ']', '{', 'b', '}', 'f', '}'], 'body has an attr'], // we'll probably need to revisit this case later
  ['@foo { a { x y } { b } f }', ['@', 'foo', '{', 'a', '{', 'x', 'y', '}', '{', 'b', '}', 'f', '}'], 'body are some nested groups'],
  ['@foo { a ( x y ) { b } f }', ['@', 'foo', '{', 'a', '(', 'x', 'y', ')', '{', 'b', '}', 'f', '}'], 'body has a call'],
  ['@foo { a { b } c { d } }', ['@', 'foo', '{', 'a', '{', 'b', '}', 'c', '{', 'd', '}', '}'], 'nested group in at rule'],
  ['@foo { bar:baz { b } }', ['@', 'foo', '{', 'bar', ':', 'baz', '{', 'b', '}', '}'], 'nested declaration in at rule'],
  ['@foo { a () c }', ['@', 'foo', '{', 'a', '(', ')', 'c', '}'], 'nested group in at rule'],
  ['@foo { a {} c }', ['@', 'foo', '{', 'a', '{', '}', 'c', '}'], 'nested group in at rule'],
  ['@foo { a [] c }', ['@', 'foo', '{', 'a', '[', ']', 'c', '}'], 'nested group in at rule'],

  //['@foo (min-width: 100px) or (max-width: 200px);', ['@', 'foo', ['||', ['>=', ['get', 'width'], ['px', 100]], ['<=', ['get', 'width'], ['px', 200]]]]],
  //['@foo any thing { b { a () c } }', [['tag', 'b'], [['a'], ['get', 'c']]], 'as per request'], // https://thegrid.slack.com/archives/gss/p1435684997000324

  ['@foo (min-width: 100px) or (max-width: 200px);', ['@', 'foo', '(', 'min-width', ':', '100', 'px', ')', 'or', '(', 'max-width', ':', '200', 'px', ')']],
  ['@foo any thing { b { a () c } }', ['@', 'foo', 'any', 'thing', '{', 'b', '{', 'a', '(', ')', 'c', '}', '}']],

];

var parserMultiRules = [
  ['div {} foo {}', [['rule', ['tag', 'div'], []], ['rule', ['tag', 'foo'], []]], 'two empty rules'],
  ['div {} @foo {}', [['rule', ['tag', 'div'], []], ['@', 'foo', '{', '}']], 'empty rule and empty at rule'],
  ['@div {} foo {}', [['@', 'div', '{', '}'], ['rule', ['tag', 'foo'], []]], 'empty at rule and empty rule'],
  ['@div {} @foo {}', [['@', 'div', '{', '}'], ['@', 'foo', '{', '}']], 'two empty at rules'],
];

var gssRuleTests = [
  ['a == b;', ['==', ['get', 'a'], ['get', 'b']], 'gss: =='],
  ['a = b;', ['=', ['get', 'a'], ['get', 'b']], 'gss: ='],
  ['a > b;', ['>', ['get', 'a'], ['get', 'b']], 'gss: >'],
  ['a >= b;', ['>=', ['get', 'a'], ['get', 'b']], 'gss: >='],
  ['a < b;', ['<', ['get', 'a'], ['get', 'b']], 'gss: <'],
  ['a <= b;', ['<=', ['get', 'a'], ['get', 'b']], 'gss: <='],
  ['a * b >= c;', ['>=', ['*', ['get', 'a'], ['get', 'b']], ['get', 'c']], 'gss: multiply'],
  ['a / b >= c;', ['>=', ['/', ['get', 'a'], ['get', 'b']], ['get', 'c']], 'gss: div'],
  ['a - b >= c;', ['>=', ['-', ['get', 'a'], ['get', 'b']], ['get', 'c']], 'gss: sub'],
  ['a + b >= c;', ['>=', ['+', ['get', 'a'], ['get', 'b']], ['get', 'c']], 'gss: next sibling'],

  ['a == b >= c', ['>=', ['==', ['get', 'a'], ['get', 'b']], ['get', 'c']], 'dont split =='],
  ['a >= b >= c', ['>=', ['>=', ['get', 'a'], ['get', 'b']], ['get', 'c']], 'dont split >='],
  //['a == (b >= c)', ['>=', ['==', ['get', 'a'], ['get', 'b']], ['get', 'c']], 'make sense?'],
  //['(a == b) >= c', ['>=', ['==', ['get', 'a'], ['get', 'b']], ['get', 'c']], 'make sense?'],
  ['a = b >= c', ['>=', ['=', ['get', 'a'], ['get', 'b']], ['get', 'c']], '='],
  ['a + b - c == d', ['==', ['-', ['+', ['get', 'a'], ['get', 'b']], ['get', 'c']], ['get', 'd']], 'simpler case than next'],
  ['a + b - c * d / e == f', ['==', ['/', ['*', ['-', ['+', ['get', 'a'], ['get', 'b']], ['get', 'c']], ['get', 'd']], ['get', 'e']], ['get', 'f']], 'calc ops in order of appearance'],
  ['a * b - c * d - e == f', ['==', ['-', ['*', ['-', ['*', ['get', 'a'], ['get', 'b']], ['get', 'c']], ['get', 'd']], ['get', 'e']], ['get', 'f']], 'star is not stronger than plus'],
  ['a < b > c <= d >= e', ['>=', ['<=', ['>', ['<', ['get', 'a'], ['get', 'b']], ['get', 'c']], ['get', 'd']], ['get', 'e']], 'constraint ops in order of appearance'],
  ['a < b + c', ['<', ['get', 'a'], ['+', ['get', 'b'], ['get', 'c']]], 'calc first, then constraints'],
  ['a * b < c + d < e', ['<', ['<', ['*', ['get', 'a'], ['get', 'b']], ['+', ['get', 'c'], ['get', 'd']]], ['get', 'e']], 'constraints are stronger than calc'],

  // property wrapping
  ['[foo] == x;', ['==', ['get', 'foo'], ['get', 'x']], 'lhs is wrapped prop'],
  ['foo == [x];', ['==', ['get', 'foo'], ['get', 'x']], 'rhs is wrapped prop'],
  ['[foo] == [x];', ['==', ['get', 'foo'], ['get', 'x']], 'both are wrapped props'],
  ['[a][b] == c;', ['==', ['get', ['[]', 'a'], 'b'], ['get', 'c']], 'double prop'],

  // css selectors must end with accessor (`[xxx]`)
  ['y[z] == a', ['==', ['get', ['tag', 'y'], 'z'], ['get', 'a']], 'disambiguation; plus must be calc'],
  ['x + y[z] == a', ['==', ['+', ['get', 'x'], ['get', ['tag', 'y'], 'z']], ['get', 'a']], 'disambiguation; plus must be calc'],
  ['(x + y)[z] == a', ['==', ['get', [['tag', 'x'], ['+'], ['tag', 'y']], 'z'], ['get', 'a']], 'disambiguation; plus must be combinator'],
  ['(a b)[c] == d;', ['==', ['get', [['tag', 'a'], [' '], ['tag', 'b']], 'c'], ['get', 'd']], 'use parens for spacing'],
  ['(.a .b)[c] == d;', ['==', ['get', [['.', 'a'], [' '], ['.', 'b']], 'c'], ['get', 'd']], 'dot notation'],
  ['(a .b #c)[d] == e;', ['==', ['get', [['tag', 'a'], [' '], ['.', 'b'], [' '], ['#', 'c']], 'd'], ['get', 'e']], 'dot and hash'],
  ['(.a.b)[c] == d;', ['==', ['get', [['.', 'a'], ['.', 'b']], 'c'], ['get', 'd']], 'double class'],
  ['(a,b)[c] == d;', ['==', ['get', [',', ['tag', 'a'], ['tag', 'b']], 'c'], ['get', 'd']], 'comma prop'],
  ['(a b,c)[d] == e;', ['==', ['get', [',', [['tag', 'a'], [' '], ['tag', 'b']], ['tag', 'c']], 'd'], ['get', 'e']], 'comma prop with combinator'],
  ['(a,b,c)[d] == e;', ['==', ['get', [',', ['tag', 'a'], ['tag', 'b'], ['tag', 'c']], 'd'], ['get', 'e']], 'comma prop 3 args'],
  ['(a,b,c,d)[e] == f;', ['==', ['get', [',', ['tag', 'a'], ['tag', 'b'], ['tag', 'c'], ['tag', 'd']], 'e'], ['get', 'f']], 'comma prop 4 args'],
  ['([x])[width] == 1;', ['==', ['get', ['[]', 'x'], 'width'], 1], 'attribute with value in parens'],
  ['(foo[x="bar"])[width] == 1;', ['==', ['get', [['tag', 'foo'], ['[=]', 'x', 'bar']], 'width'], 1], 'attribute with value in parens (deviating tree; equal sign no longer wrapped in squares)'],
  [[
    'a[b] == d;',
    '(a)[b] == d;',
    '(a[b]) == d;',
  ],
    ['==', ['get', ['tag', 'a'], 'b'], ['get', 'd']],
    'b is var because no other accessor follows it'
  ],
  [[
    'a[b][c] == d;',
    '(a)[b][c] == d;',
    '(a[b])[c] == d;',
    '(a[b][c]) == d;',
  ],
    ['==', ['get', [['tag', 'a'], ['[]', 'b']], 'c'], ['get', 'd']],
    'b is attr w/o value because in all cases the accessor `[c]` follows it'
  ],
  ['(a[b]+c[d])[e] == f;', ['==', ['get', [['tag', 'a'], ['[]', 'b'], ['+'], ['tag', 'c'], ['[]', 'd']], 'e'], ['get', 'f']], 'double tag with attr w/o value, wrapped'],
  ['(a[b] + c[d])[e] == f;', ['==', ['get', [['tag', 'a'], ['[]', 'b'], ['+'], ['tag', 'c'], ['[]', 'd']], 'e'], ['get', 'f']], 'double tag with attr w/o value, wrapped'],
  ['(a[b] c[d])[e] == f;', ['==', ['get', [['tag', 'a'], ['[]', 'b'], [' '], ['tag', 'c'], ['[]', 'd']], 'e'], ['get', 'f']], 'double tag with attr w/o value, wrapped'],
  ['(a[b],b)[c] == d;', ['==', ['get', [',', [['tag', 'a'], ['[]', 'b']], ['tag', 'b']], 'c'], ['get', 'd']], 'b is attr w/o value in comma'],
  [[
    '(a,b)[c][d] == e',
    '((a,b)[c])[d] == e',
  ],
    ['==', ['get', [[',', ['tag', 'a'], ['tag', 'b']], ['[]', 'c']], 'd'], ['get', 'e']],
    'mixing commas and square blocks'
  ],
  ['(a[c], b[c])[d] == e',
    ['==', ['get', [',', [['tag', 'a'], ['[]', 'c']], [['tag', 'b'], ['[]', 'c']]], 'd'], ['get', 'e']],
    'same as `(a,b)[c][d] == e` but different parse tree (same if normalized)'
  ],
  ['((a[b] + c[d])[e] + f[g]) == h',
    ['==', ['+', ['get', [['tag', 'a'], ['[]', 'b'], ['+'], ['tag', 'c'], ['[]', 'd']], 'e'], ['get', ['tag', 'f'], 'g']], ['get', 'h']],
    'now you\'re just being evil, the inner most parens contain two attrs (b and d) while e is their accessor and toplevel is calc'
  ],
  ['(.a.b c)[d] == e', ['==', ['get', [['.', 'a'], ['.', 'b'], [' '], ['tag', 'c']], 'd'], ['get', 'e']], 'atom `.a.b` with multiple parts, combinator, atom, with accessor for group (checks accessor scoping)'],

  // some tests with calc/selector ambiguity
  ['(.a.b + c[z])[d] == e', ['==', ['get', [['.', 'a'], ['.', 'b'], ['+'], ['tag', 'c'], ['[]', 'z']], 'd'], ['get', 'e']], 'calc selector ambiguity'],
  ['(.a.b + c[z=x])[d] == e', ['==', ['get', [['.', 'a'], ['.', 'b'], ['+'], ['tag', 'c'], ['[=]', 'z', 'x']], 'd'], ['get', 'e']], 'calc selector ambiguity'],
  ['(.a.b + c[z="x"])[d] == e', ['==', ['get', [['.', 'a'], ['.', 'b'], ['+'], ['tag', 'c'], ['[=]', 'z', 'x']], 'd'], ['get', 'e']], 'calc selector ambiguity'],
  ['(.a.b + c[z][d])[e] == f', ['==', ['get', [['.', 'a'], ['.', 'b'], ['+'], ['tag', 'c'], ['[]', 'z'], ['[]', 'd']], 'e'], ['get', 'f']], 'calc selector ambiguity'],
  ['(.a.b + c[z=x][d])[e] == f', ['==', ['get', [['.', 'a'], ['.', 'b'], ['+'], ['tag', 'c'], ['[=]', 'z', 'x'], ['[]', 'd']], 'e'], ['get', 'f']], 'calc selector ambiguity'],
  ['(.a.b + c[z="x"][y])[d] == f', ['==', ['get', [['.', 'a'], ['.', 'b'], ['+'], ['tag', 'c'], ['[=]', 'z', 'x'], ['[]', 'y']], 'd'], ['get', 'f']], 'calc selector ambiguity'],
  ['(a + b) == z', ['==', ['+', ['get', 'a'], ['get', 'b']], ['get', 'z']], 'calc selector ambiguity'],
  ['(a + b[c]) == z', ['==', ['+', ['get', 'a'], ['get', ['tag', 'b'], 'c']], ['get', 'z']], 'calc selector ambiguity'],
  ['a + b - c / d == foo', ['==', ['/', ['-', ['+', ['get', 'a'], ['get', 'b']], ['get', 'c']], ['get', 'd']], ['get', 'foo']], 'calc selector ambiguity'],
  ['[a] + [b] - [c] == foo', ['==', ['-', ['+', ['get', 'a'], ['get', 'b']], ['get', 'c']], ['get', 'foo']], 'calc selector ambiguity'],
  ['[a] + [b] - [c] / [d] == foo', ['==', ['/', ['-', ['+', ['get', 'a'], ['get', 'b']], ['get', 'c']], ['get', 'd']], ['get', 'foo']], 'calc selector ambiguity'],
  ['.a[x] + #b[y] == foo',
    ['==', ['+', ['get', ['.', 'a'], 'x'], ['get', ['#', 'b'], 'y']], ['get', 'foo']],
    'calc selector ambiguity'
  ],
  ['.a[x] + #b[y] - c[z] == foo',
    ['==', ['-', ['+', ['get', ['.', 'a'], 'x'], ['get', ['#', 'b'], 'y']], ['get', ['tag', 'c'], 'z']], ['get', 'foo']],
    'calc selector ambiguity'
  ],
  ['.a[x] + #b[y] - c[z] / [d] == foo',
    ['==', ['/', ['-', ['+', ['get', ['.', 'a'], 'x'], ['get', ['#', 'b'], 'y']], ['get', ['tag', 'c'], 'z']], ['get', 'd']], ['get', 'foo']],
    'calc selector ambiguity'
  ],
  ['a[x] + b[y] == c;', ['==', ['+', ['get', ['tag', 'a'], 'x'], ['get', ['tag', 'b'], 'y']], ['get', 'c']], 'calc selector ambiguity'],
  // complex mode switching and backtracking
  ['(a:foo)[x] == c;', ['==', ['get', [['tag', 'a'], [':foo']], 'x'], ['get', 'c']], 'simple pseudo'],
  ['(a:foo())[x] == c;', ['==', ['get', [['tag', 'a'], [':foo']], 'x'], ['get', 'c']], 'empty pseudo call'],
  ['(a:nth-child(5))[x] == c;',
    ['==', ['get', [['tag', 'a'], [':nth-child', 5]], 'x'], ['get', 'c']],
    'single pseudo call arg'
  ],
  ['(a:nth-child(5n+3))[x] == c;',
    ['==', ['get', [['tag', 'a'], [':nth-child', 5, 3]], 'x'], ['get', 'c']],
    'calc(css(calc))'
  ],
  ['(.b a:nth-child(5n+3))[x] == c;',
    ['==', ['get', [['.', 'b'], [' '], ['tag', 'a'], [':nth-child', 5, 3]], 'x'], ['get', 'c']],
    'calc(css(calc))'
  ],
  ['5 * (.b a:nth-child(5n+3))[x] == c;',
    ['==', ['*', 5, ['get', [['.', 'b'], [' '], ['tag', 'a'], [':nth-child', 5, 3]], 'x']], ['get', 'c']],
    'calc(css(calc))'
  ],
  ['5 * (a + b)[c] == d',
    ['==', ['*', 5, ['get', [['tag', 'a'], ['+'], ['tag', 'b']], 'c']], ['get', 'd']],
    'calc(selector)'
  ],
  ['5 * (a + b) == d',
    ['==', ['*', 5, ['+', ['get', 'a'], ['get', 'b']]], ['get', 'd']],
    'calc(calc)'
  ],
  ['5 * ((p,q) b)[x] == d',
    ['==', ['*', 5, ['get', [[',', ['tag', 'p'], ['tag', 'q']], [' '], ['tag', 'b']], 'x']], ['get', 'd']],
    'parens do not force calc mode in gss-css-selectors' // tofix: confirming the space combinator
  ],
  ['(.a[b])[c] == d',
    ['==', ['get', [['.', 'a'], ['[]', 'b']], 'c'], ['get', 'd']],
    'inner block cannot be accessor'
  ],
  ['(.a[b] + c)[d] == e',
    ['==', ['get', [['.', 'a'], ['[]', 'b'], ['+'], ['tag', 'c']], 'd'], ['get', 'e']],
    'inner block can not be accessor because paren body cannot be calc due to outside accessor'
  ],
  ['(c + .a[b])[d] == e',
    ['==', ['get', [['tag', 'c'], ['+'], ['.', 'a'], ['[]', 'b']], 'd'], ['get', 'e']],
    'inner block becomes attr after backtrack'
  ],
  ['(c + .a[b]) == e',
    ['==', ['+', ['get', 'c'], ['get', ['.', 'a'], 'b']], ['get', 'e']],
    'inner block is accessor'
  ],
  ['(a > c)[d] >= e',
    ['>=', ['get', [['tag', 'a'], ['>'], ['tag', 'c']], 'd'], ['get', 'e']],
    'child combinator, not constraint, in group'
  ],
  ['((a[attr], b[attr2]) > c)[d] == e',
    ['==', ['get', [[',', [['tag', 'a'], ['[]', 'attr']], [['tag', 'b'], ['[]', 'attr2']]], ['>'], ['tag', 'c']], 'd'], ['get', 'e']],
    'slightly complex selectors in a nested comma group'
  ],
  ['(a + b + c) == e',
    ['==', ['+', ['+', ['get', 'a'], ['get', 'b']], ['get', 'c']], ['get', 'e']],
    'simple addition chain'
  ],
  ['(a + b + c)[d] == e',
    ['==', ['get', [['tag', 'a'], ['+'], ['tag', 'b'], ['+'], ['tag', 'c']], 'd'], ['get', 'e']],
    'not addition'
  ],
  ['(a+b, c+d)[e] == f',
    ['==', ['get', [',', [['tag', 'a'], ['+'], ['tag', 'b']], [['tag', 'c'], ['+'], ['tag', 'd']]], 'e'], ['get', 'f']],
    'non-atomic css selectors inside a comma expression'
  ],
  ['(a , b)[c] == d',
    ['==', ['get', [',', ['tag', 'a'], ['tag', 'b']], 'c'], ['get', 'd']],
    'just to make sure spaces around comma works'
  ],

  ['a <= b >= c',
    ['>=', ['<=', ['get', 'a'], ['get', 'b']], ['get', 'c']],
    'make sure c wraps ab, not other way around'
  ],
  ['(a + b[c][d]) == z', ['==', ['+', ['get', 'a'], ['get', [['tag', 'b'], ['[]', 'c']], 'd']], ['get', 'z']], 'addition of var and accessor'],

  //// `(a + .b[c]) ...` before parsing next token:
  //[['tag', 'a'], ['+'], ['.', 'b'], ['[]', 'c']]
  //// `(a + .b[c]) == ...` if next token is selector end (group is calc):
  //[['+', ['get', 'a'], ['get', ['.', 'b'], 'c']]]
  //// `(a + .b[c])[d] == ...`if next token is accessor (group is selector):
  //['get', [['tag', 'a'], ['+'], ['.', 'b'], ['[]', 'c']], 'd']


  // star amibguity
  ['*[x] == y;',
    ['==', ['get', ['tag', '*'], 'x'], ['get', 'y']],
    'theoretical: gss toplevel star as tag, but made illegal to support the IE star hack'
  ],
  ['(*)[x] == y',
    ['==', ['get', ['tag', '*'], 'x'], ['get', 'y']],
    'single star in parens is same as without parens'
  ],
  // * a[x] == y; is invalid, same for reverse, spaces irrelevant
  ['(* a)[x] == y',
    ['==', ['get', [['tag', '*'], [' '], ['tag', 'a']], 'x'], ['get', 'y']],
    'any tag with a decendent a tag (deviating parse tree)'
  ],
  ['(a *)[x] == y',
    ['==', ['get', [['tag', 'a'], [' '], ['tag', '*']], 'x'], ['get', 'y']],
    'any decendent tag of an a tag'
  ],
  ['a * b[c] == d;',
    ['==', ['*', ['get', 'a'], ['get', ['tag', 'b'], 'c']], ['get', 'd']],
    'a * b, spaced, no parens'
  ],
  ['a * b*c[d] == e;',
    ['==', ['*', ['get', 'a'], ['get', [['tag', 'b'], ['tag', '*'], ['tag', 'c']], 'd']], ['get', 'e']],
    'mixing spaces and non spacing on outer stars'
  ],
  ['a*b * c[d] == e;',
    ['==', ['*', ['*', ['get', 'a'], ['get', 'b']], ['get', ['tag', 'c'], 'd']], ['get', 'e']],
    'mixing spaces and non spacing on outer stars'
  ],
  ['a * b == c*d;',
    ['==', ['*', ['get', 'a'], ['get', 'b']], ['*', ['get', 'c'], ['get', 'd']]],
    'mixing spaces and non spacing on outer stars on either side of the constraint'
  ],
  ['a*b == c * d;',
    ['==', ['*', ['get', 'a'], ['get', 'b']], ['*', ['get', 'c'], ['get', 'd']]],
    'mixing spaces and non spacing on outer stars on either side of the constraint'
  ],
  ['a*b[c] == d;',
    ['==', ['get', [['tag', 'a'], ['tag', '*'], ['tag', 'b']], 'c'], ['get', 'd']],
    'a*b, no spaces, no parens'
  ],
  ['(a * b)[x] == y',
    ['==', ['get', [['tag', 'a'], [' '], ['tag', '*'], [' '], ['tag', 'b']], 'x'], ['get', 'y']],
    'a * b, spaced, parens; not multiply but: b tag, any decendant tag, any descendant a tag'
  ],
  ['(a*b)[x] == y',
    ['==', ['get', [['tag', 'a'], ['tag', '*'], ['tag', 'b']], 'x'], ['get', 'y']],
    'a*b, no spaces, parens: still no multiplication'
  ],
  ['(a * b)*c[x] == y',
    ['==', ['get', [[['tag', 'a'], [' '], ['tag', '*'], [' '], ['tag', 'b']], ['tag', '*'], ['tag', 'c']], 'x'], ['get', 'y']],
    'this time both stars are multiplication (weird case anyways), tbd: not intuitive and star usages are exceptional anyways'
  ],
  ['(a * b) * c[x] == y',
    ['==', ['*', ['*', ['get', 'a'], ['get', 'b']], ['get', ['tag', 'c'], 'x']], ['get', 'y']],
    'outer star spacing has no effect'
  ],
  ['(a*b) * c[x] == y',
    ['==', ['*', ['*', ['get', 'a'], ['get', 'b']], ['get', ['tag', 'c'], 'x']], ['get', 'y']],
    'outer star spacing with inner star no spacing; also has no effect'
  ],
  ['c*(a*b)[x] == y',
    ['==', ['get', [['tag', 'c'], ['tag', '*'], [['tag', 'a'], ['tag', '*'], ['tag', 'b']]], 'x'], ['get', 'y']],
    'same as before but calc first, star becomes tags (tbd: should group be wrapped for css?)'
  ],
  ['c * (a*b)[x] == y',
    ['==', ['*', ['get', 'c'], ['get', [['tag', 'a'], ['tag', '*'], ['tag', 'b']], 'x']], ['get', 'y']],
    'adding spaces to outer star as before the parens does change it to multiply'
  ],
  ['c * (a * b)[x] == y',
    ['==', ['*', ['get', 'c'], ['get', [['tag', 'a'], [' '], ['tag', '*'], [' '], ['tag', 'b']], 'x']], ['get', 'y']],
    'outer star prefixed, both stars spaced, same as before'
  ],
  ['c*(a * b)[x] == y',
    ['==', ['get', [['tag', 'c'], ['tag', '*'], [['tag', 'a'], [' '], ['tag', '*'], [' '], ['tag', 'b']]], 'x'], ['get', 'y']],
    'outer star prefixed so becomes tag, only inner star spaced but is also tag'
  ],
  ['( * a)[x] == y',
    ['==', ['get', [['tag', '*'], [' '], ['tag', 'a']], 'x'], ['get', 'y']],
    'star first, space before'
  ],
  ['a * *[x] == y',
    ['==', ['*', ['get', 'a'], ['get', ['tag', '*'], 'x']], ['get', 'y']],
    'a times any tag, yeah'
  ],

  // virtuals
  // must have double quotes, must have accessors inside expressions
  // exception when parsing content? "set cant have virtuals" https://thegrid.slack.com/archives/gss/p1437060655002050
  // tofix: add more virtuals tests
  ['"foo"[x] == y', ['==', ['get', ['virtual', 'foo'], 'x'], ['get', 'y']], 'strings in calc mode are virtuals'],
  ['.bg"face" {}',
    ['rule', [['.', 'bg'], ['virtual', 'face']], []],
    'distilled'
  ],
  ['a { "face" { } }',
    ['rule', ['tag', 'a'], [['rule', ['virtual', 'face'], []]]],
    'legacy test'
  ],
  ['"face" { }',
    ['rule', ['virtual', 'face'], []],
    'legacy test'
  ],
  ['.foo"bar" {}', ['rule', [['.', 'foo'], ['virtual', 'bar']], []], 'without space combinator'],
  ['.foo "bar" {}', ['rule', [['.', 'foo'], [' '], ['virtual', 'bar']], []], 'with space combinator'],

  // context modifiers
  // tofix: add more context modifier tests
  ['&y == a', ['==', ['get', ['&'], 'y'], ['get', 'a']], 'current context modifying a var'],
  ['$y == a', ['==', ['get', ['$'], 'y'], ['get', 'a']], 'parent of current context modifying a var'],
  ['^y == a', ['==', ['get', ['^'], 'y'], ['get', 'a']], 'parent of current context modifying a var'],
  ['^^^y == a', ['==', ['get', ['^', 3], 'y'], ['get', 'a']], 'third parent of current context modifying a var'],
  ['&[y] == a', ['==', ['get', ['&'], 'y'], ['get', 'a']], 'current context on accessor'],
  ['$[y] == a', ['==', ['get', ['$'], 'y'], ['get', 'a']], 'parent of current context on accessor'],
  ['^[y] == a', ['==', ['get', ['^'], 'y'], ['get', 'a']], 'parent of current context on accessor'],
  ['^^^[y] == a', ['==', ['get', ['^', 3], 'y'], ['get', 'a']], 'third parent of current context on accessor'],
  ['(&)[y] == a', ['==', ['get', ['&'], 'y'], ['get', 'a']], 'grouped, current context on accessor'],
  ['($)[y] == a', ['==', ['get', ['$'], 'y'], ['get', 'a']], 'grouped, parent of current context on accessor'],
  ['(^)[y] == a', ['==', ['get', ['^'], 'y'], ['get', 'a']], 'grouped, parent of current context on accessor'],
  ['(^^^)[y] == a', ['==', ['get', ['^', 3], 'y'], ['get', 'a']], 'grouped, third parent of current context on accessor'],
  ['^--a == b', ['==', ['get', ['^'], '--a'], ['get', 'b']], 'double dash is part of the ident'],
  ['^--aa == b', ['==', ['get', ['^'], '--aa'], ['get', 'b']], 'double dash is part of the ident'],
  ['^^^^^^^^--my-margin-top == ^^^--my-margin-top', ['==', ['get', ['^', 8], '--my-margin-top'], ['get', ['^', 3], '--my-margin-top']], 'original test case'],

  // require/strength tests

  // signed numbers

  // func calls in gss, multiple args etc

  // AnB tests
  ['(a[x] + (4n3))', ['+', ['get', ['tag', 'a'], 'x'], ['n3', 4]], '4n3 is read as `4 n3` where `n3` becomes the unit (runtime error)'],

  // rule nesting
  ['a { b: c; }', ['rule', ['tag', 'a'], [['set', 'b', ['get', 'c']]]], 'nest'],
  ['a { b == c; }', ['rule', ['tag', 'a'], [['==', ['get', 'b'], ['get', 'c']]]], 'nest'],
  ['a { b == c; d == e; }', ['rule', ['tag', 'a'], [['==', ['get', 'b'], ['get', 'c']], ['==', ['get', 'd'], ['get', 'e']]]], 'nest double declaration (wrapping check)'],
  [[
    'a { b { c: d; }; }', // note: peg requires a semi after first nest
    'a { b { c: d; } }',
    'a { b { c: d }; }',
    'a { b { c: d } }',
  ],
    ['rule', ['tag', 'a'], [['rule', ['tag', 'b'], [['set', 'c', ['get', 'd']]]]
    ]], // modified: `get` d, dont extra wrap the ruleset for b
    'double nesting semi test'
  ],
  [[
    'a { b:hover { c: d; } }',
    'a { b:hover { c: d; }; }' // semi needed for peg
  ],
    //["rule",["tag","a"],[["rule",[["tag","b"],[":hover"]],[["set","c","d"]]]]], // changed to make the `set` do a get for `d` (TBD)
    ['rule', ['tag', 'a'], [['rule', [['tag', 'b'], [':hover']], [['set', 'c', ['get', 'd']]]]]],
    '`b:hover` as nested selector, throws off colon-as-second-token pattern check (checks hardcoded exception to get around ambiguity)'
  ],
  ['a { color: blue; b {} }', ['rule', ['tag', 'a'], [['set', 'color', ['get', 'blue']], ['rule', ['tag', 'b'], []]]], 'nest preceded by declaration'],
  ['a { b {} color: blue; }', ['rule', ['tag', 'a'], [['rule', ['tag', 'b'], []], ['set', 'color', ['get', 'blue']]]], 'nest succeeded by declaration'],
  ['a { color: blue; b {} color: blue; }', ['rule', ['tag', 'a'], [['set', 'color', ['get', 'blue']], ['rule', ['tag', 'b'], []], ['set', 'color', ['get', 'blue']]]], 'nest surrounded by declarations'],
  [[
    'a { b :<= c } d { }',
    'a { b :<= c; } d{ }', // for peg
    'a { b : <= c; }\nd { }', // peg only parses this version
  ],
    [['rule', ['tag', 'a'], [['<=', ['get', ['&'], 'b'], ['get', 'c']]]], ['rule', ['tag', 'd'], []]], // modified; remove empty wrapping
    'confirm nested rules dont accidentally consume }'
  ],
  [[
    'a { b { c == d } }',
    'a { b { c == d; } }',
    'a { b { c == d }; }',
    'a { b { c == d; }; }', // for peg
  ],
    ['rule', ['tag', 'a'], [['rule', ['tag', 'b'], [['==', ['get', 'c'], ['get', 'd']]]]]],
    'double nesting with gss rule inside'
  ],
  [[
    'a { b { c:foo()[x] == d } }',
    'a { b { c:foo()[x] == d; }; }', // for peg
  ],
    //["rule",["tag","a"],[["rule",["tag","b"],[["set","c","foo() == d"]]]]], // makes no sense
    ['rule', ['tag', 'a'], [['rule', ['tag', 'b'], [['==', ['get', [['tag', 'c'], [':foo']], 'x'], ['get', 'd']]]]]], // TOFIX: shouldnt foo become `['foo']`?
    'double nesting with gss rule inside and a red herring colon but still a rule, not declaration'
  ],
  [[
    'a { b { c:== d } }',
    'a { b { c:== d; }; }',
  ],
    ['rule', ['tag', 'a'], [['rule', ['tag', 'b'], [['==', ['get', ['&'], 'c'], ['get', 'd']]]]]],
    'double nesting with gss rule inside and a red herring colon but then a constraint op and still not a rule but a declaration'
  ],
  ['a { b { c(.foo:hover[d]) == e } }',
    ['rule', ['tag', 'a'], [['rule', ['tag', 'b'], [['==', ['c', ['get', [['.', 'foo'], [':hover']], 'd']], ['get', 'e']]]]]],
    'colon nested in SELECTOR inside gss'
  ],

  // units
  [[
    '5px == x',
    '5 px == x'
  ],
    ['==', ['px', 5], ['get', 'x']], 'simple',
    'simple'
  ],
  ['x px == y', ['==', ['px', ['get', 'x']], ['get', 'y']], 'var px'],
  ['x y == z', ['==', ['y', ['get', 'x']], ['get', 'z']], 'var var'],
  ['x y z == a', ['==', ['z', ['y', ['get', 'x']]], ['get', 'a']], 'compounded units, weird but we are not supposed to judge'],
  ['(x) y == z', ['==', ['y', ['get', 'x']], ['get', 'z']], 'value space unit, group is also just a unit'],
  ['(x y) z == a', ['==', ['z', ['y', ['get', 'x']]], ['get', 'a']], 'similar case'],
  // nested var units
  ['(10) b == c', ['==', ['b', 10], ['get', 'c']], 'value wrapped in parens'],
  [[
    'a == y + z em;',
    'a == y + (z em);',
  ],
    ['==', ['get', 'a'], ['+', ['get', 'y'], ['em', ['get', 'z']]]],
    'regression: unit should wrap the z only, the plus should wrap the rest'
  ],
  ['a == (y + z) em;',
    ['==', ['get', 'a'], ['em', ['+', ['get', 'y'], ['get', 'z']]]],
    'regression: the unit should wrap the plus'
  ],
  ['a x + b y + c z == n', ['==', ['+', ['+', ['x', ['get', 'a']], ['y', ['get', 'b']]], ['z', ['get', 'c']]], ['get', 'n']], 'plusses go left to right but units mess that up a little'],
  //['a x , b y , c z == n', [], 'sanity check for units vs comma'], // probably illegal case, comma on top level doesnt make much sense
  //['a x + b y , c z == n', [], 'mix units comma and plus'], // probably illegal case, comma on top level doesnt make much sense
  // unit suffix tests; mixing idents with funcs
  ['a b c == d', ['==', ['c', ['b', ['get', 'a']]], ['get', 'd']], 'unit suffix; mixing ident with funcs'],
  ['f() a b == c', ['==', ['b', ['a', ['f']]], ['get', 'c']], 'unit suffix; mixing ident with funcs'], // `f() a b` - `b(a(f()))`
  ['f() g() a == b', ['==', [['f'], ['a', ['g']]], ['get', 'b']], 'unit suffix; mixing ident with funcs'],
  ['f() g() h() == a', ['==', [['f'], ['g'], ['h']], ['get', 'a']], 'unit suffix; mixing ident with funcs'], //  `f() g() h()` - `[['f'], ['g'], ['h']]`
  // tofix: not sure about the validity of these cases
  ['a f() b == c', ['==', [['get', 'a'], ['b', ['f']]], ['get', 'c']], 'unit suffix; mixing ident with funcs (TBD)'],
  ['a b f() == c', ['==', [['b', ['get', 'a']], ['f']], ['get', 'c']], 'unit suffix; mixing ident with funcs'], // `a b f()` - `[['b', ['get', 'a']], ['f']]`
  ['f() a g() == b', ['==', [['a', ['f']], ['g']], ['get', 'b']], 'unit suffix; mixing ident with funcs (TBD)'],
  // ['"a" b == c', [], 'string vs identifier ambiguity edge case (TBD)'], // invalid, since virtual is a selector and it doesnt constitute a variable w/out accessor
  //['a "b" c == d', [], 'string vs identifier ambiguity edge case (TBD)'], // invalid, since virtual is a selector and it doesnt constitute a variable w/out accessor
  ['a b() == c', ['==', [['get', 'a'], ['b']], ['get', 'c']], 'flat list var func call'], // "If we support it then it should be parsed as `[['get', 'a'] ,['b']]` - flat list with variable and func call"

  /* (regarding units)
   https://thegrid.slack.com/archives/gss/p1437152296002338

   a b c` - unit of `b` and unit of `c`, basically `c(b(a))` (edited)

   yaroslaff [6:58 PM]
   `f() a b` - `b(a(f()))`

   yaroslaff [6:59 PM]
   `f() g() a` - `[['f'],  ['a', ['g']]]` (edited)

   yaroslaff [6:59 PM]
   `f() g() h()` - `[['f'], ['g'], ['h']]`

   yaroslaff [7:00 PM]
   i dont remember if we decided not to support `a b()`. If we support it then it should be parsed as `[['get', 'a'] ,['b']]` - flat list with variable and func call

   yaroslaff [7:01 PM]
   then `a f() b` is `[['get', 'a'], ['b', ['f']]` - b is unit

   yaroslaff [7:02 PM]
   `a b f()` - `[['b', ['get', 'a']], ['f']]`

   yaroslaff [7:02 PM]
   `f() a g()` - `[['a', ['f']], ['g']]` (edited)

   yaroslaff [7:03 PM]
   `a "b"` invalid, since virtual is a selector and it doesnt constitute a variable w/out accessor

   yaroslaff [7:03 PM]
   and others with virtuals

   yaroslaff [7:04 PM]
   for gss `a b c` is `c(b(a))` but `a() b() c()` is flat list which is evaluated as if it was `c(b(a()))` (edited)

   yaroslaff [7:05 PM]
   so semantics is not too far off

   yaroslaff [7:06 PM]
   so `a b() c()` is basically `b(a) c()` and is evaluated as `c(b(a))` anyway (edited)

   yaroslaff [7:07 PM]
   this flat list syntax is basically kind of Unix-y pipes

   yaroslaff [7:09 PM]
   so we look at `translateX(10deg) translateZ(10deg)` as a pipeline of two commands which output final matrix. Could be semantically thought as `10 deg translateX        10 deg translateZ` but i see absolutely no good reason to support this syntax. Just providing you some paralllels (edited)
   */


  // flat func chains
  // https://thegrid.slack.com/archives/gss/p1436976503001966
  // except https://thegrid.slack.com/archives/gss/p1436976298001959
  [[
    'foo(x) bar(y) == y',
    'foo(x)bar(y) == y',
    '(foo(x) bar(y)) == y', // for peg
    '(foo(x)bar(y)) == y', // for peg
  ],
    ['==', [['foo', ['get', 'x']], ['bar', ['get', 'y']]], ['get', 'y']],
    'explicit case from chat, also the whitespace makes no difference here'
  ],

  // flatten nested comma lists
  [[
    '(a, b, c, e)[x] == d',
    '((a, b, c), e)[x] == d',
    '(a, (b, c), e)[x] == d',
    '(a, (b, c, e))[x] == d',
    '((a, b), (c, e))[x] == d',
  ],
    ['==', ['get', [',', ['tag', 'a'], ['tag', 'b'], ['tag', 'c'], ['tag', 'e']], 'x'], ['get', 'd']],
    'comma lists should be flattened'
  ],

  // random cases
  ['200 < ::window[width] < 300', ['<', ['<', 200, ['get', [':window'], 'width']], 300], 'random range case'],
  ['a == &b;', ['==', ['get', 'a'], ['get', ['&'], 'b']], 'aaaand'],
  ['ul[height] == &intrinsic-height;', ['==', ['get', ['tag', 'ul'], 'height'], ['get', ['&'], 'intrinsic-height']], 'and'],
  ['@foo[x] == y', ['@', 'foo', '[', 'x', ']', '==', 'y']],
  ['.bg"face" {}',
    ['rule', [['.', 'bg'], ['virtual', 'face']], []],
    'distill'
  ],
  ['x { .bg"face" {} }',
    ['rule', ['tag', 'x'], [['rule', [['.', 'bg'], ['virtual', 'face']], []]]],
    'wrapped dot causing error?'
  ],
  ['a { b: = 10 }', ['rule', ['tag', 'a'], [['=', ['get', ['&'], 'b'], 10]]], 'gss in decl value'],


  // weird extra wrapping case in `(a, b){}`, b would get extra group
  ['("fling") { }', ['rule', ['virtual', 'fling'], []], 'extra wrapping'],
  ['(a b) { }', ['rule', [['tag', 'a'], [' '], ['tag', 'b']], []], 'extra wrapping'],
  ['(a "fling") { }', ['rule', [['tag', 'a'], [' '], ['virtual', 'fling']], []], 'extra wrapping'],
  ['(::this b) { }', ['rule', [['&'], [' '], ['tag', 'b']], []], 'extra wrapping'],
  ['(::this "fling") { }', ['rule', [['&'], [' '], ['virtual', 'fling']], []], 'extra wrapping'],
  ['((::this "fling")) { }', ['rule', [['&'], [' '], ['virtual', 'fling']], []], 'extra wrapping'],
  [[
    'a, b { }',
    '(a, b) { }',
    '(a, (b)) { }',
  ],
    ['rule', [',', ['tag', 'a'], ['tag', 'b']], []],
    'extra wrapping'
  ],
  ['(a, (::this "fling")) { }', ['rule', [',', ['tag', 'a'], [['&'], [' '], ['virtual', 'fling']]], []], 'extra wrapping'],
  ['((::this), (::scope .box), (::this .post), (::scope), (::this "fling")) { }',
    ['rule', [',', ['&'], [[':scope'], [' '], ['.', 'box']], [['&'], [' '], ['.', 'post']], [':scope'], [['&'], [' '], ['virtual', 'fling']]], []],
    'extra wrapping'
  ],

  ['@if [x] >= 100 { }', ['@', 'if', '[', 'x', ']', '>=', '100', '{', '}'], '@if simple'],
  [[
    'foo { @if [x] >= 100 { } }',
    'foo { @if [x] >= 100 { }; }', // for peg
  ],
    ['rule', ['tag', 'foo'], [['@', 'if', '[', 'x', ']', '>=', '100', '{', '}']]], '@if nested'
  ],

  // some nested call cases
  ['outer(mid(inner()));', ['outer', ['mid', ['inner']]], 'legacy test'],
  ['a()', ['a'], 'a call'],
  ['a(b()); foo(#bar);', [['a', ['b']], ['foo', ['#', 'bar']]], 'make sure both cases get proper wrapping'],
  ['a(b())', ['a', ['b']], 'a call wraps b call'],
  ['a(b() c())', ['a', [['b'], ['c']]], 'a call wraps b and c call'],
  ['a(1)', ['a', 1], 'call 1'],
  ['a(b(1))', ['a', ['b', 1]], 'nested call 1'],
  ['a(b(),c())', ['a', ['b'], ['c']], 'comma nested call'],
  ['outer(inner(1),inner(2),inner(3));', ['outer', ['inner', 1], ['inner', 2], ['inner', 3]], 'regression case'],
  ['vars(foo, bar);', ['vars', ['get', 'foo'], ['get', 'bar']], 'func two var args'],
  ['vars(#foo, #bar);', ['vars', ['#', 'foo'], ['#', 'bar']], 'func two selector args'],
  ['vars(foo, #bar);', ['vars', ['get', 'foo'], ['#', 'bar']], 'func two args mixed'],
  ['vars(#foo, bar);', ['vars', ['#', 'foo'], ['get', 'bar']], 'func two args mixed reversed'],

  // regressions
  [wrap('x: >  100;'), wrap(['>', ['get', ['&'], 'x'], 100]), 'regression; was not wrapping > as a constraint'],
  ['a == c;', ['==', ['get', 'a'], ['get', 'c']], 'regression; a should be wrapped in get but wasnt'],
  ['a * b == c;', ['==', ['*', ['get', 'a'], ['get', 'b']], ['get', 'c']], 'regression; a should be wrapped in get but wasnt'],
  ['grid-height * #box2[width]<= 2>= 3< 4>= 5;', ['>=', ['<', ['>=', ['<=', ['*', ['get', 'grid-height'], ['get', ['#', 'box2'], 'width']], 2], 3], 4], 5], 'regression; original test case'],
  [wrap('x: =  100;'),
    ['rule', ['tag', 'divv'], [['=', ['get', ['&'], 'x'], 100]]],
    'regression: dunno'
  ],
  [wrap('x: =  100; a:b;'),
    ['rule', ['tag', 'divv'], [['=', ['get', ['&'], 'x'], 100], ['set', 'a', ['get', 'b']]]], // modified: get b
    'regression: dunno'
  ],
  [wrap('x: =  100;x: <= 100;        x: <  100;        x: >= 100;    x: >  100;'),
    ['rule', ['tag', 'divv'], [['=', ['get', ['&'], 'x'], 100], ['<=', ['get', ['&'], 'x'], 100], ['<', ['get', ['&'], 'x'], 100], ['>=', ['get', ['&'], 'x'], 100], ['>', ['get', ['&'], 'x'], 100]]],
    'regression: dunno'
  ],
  [wrap('x: == 100;x: =  100;x: <= 100;        x: <  100;        x: >= 100;    x: >  100;'),
    ['rule', ['tag', 'divv'], [['==', ['get', ['&'], 'x'], 100], ['=', ['get', ['&'], 'x'], 100], ['<=', ['get', ['&'], 'x'], 100], ['<', ['get', ['&'], 'x'], 100], ['>=', ['get', ['&'], 'x'], 100], ['>', ['get', ['&'], 'x'], 100]]],
    'regression: dunno'
  ],
  ['#avatar {height: 160 !require;}',
    ['rule', ['#', 'avatar'], [['set', 'height', [160, '!', 'require']]]],
    'require becoming a var'
  ],
  [
    '#avatar {height: == 160 !require;}',
    ['rule', ['#', 'avatar'], [['==', ['get', ['&'], 'height'], 160, 'require']]],
    'require disappearing'
  ],
  ['#avatar[height] == 160 !require;',
    ['==', ['get', ['#', 'avatar'], 'height'], 160, 'require'],
    'require different'
  ],

  // number case
  ['- 1', -1, 'NUMBER with dash and space'],
  ['+ 1', 1, 'NUMBER with plus and space'],
  ['5px20', ['px20', 5], 'NUMBER no space NUMBER, the `px20` is an identifier and becomes a type like `px` is in 5px'],

  // gss decl top level
  ['x: == y;', ['==', ['get', ['&'], 'x'], ['get', 'y']], 'top level gss declaration'],
  ['x: <= 5 + 5;', ['<=', ['get', ['&'], 'x'], ['+', 5, 5]], 'top level gss decl with calc'],
  ['x:previous[left] == 111;',
    ['==', ['get', [['tag', 'x'], [':previous']], 'left'], 111],
    'legacy; modified ambiguation case'
  ],
  ['x:next.selected[width] == &:previous.selected[width];',
    ['==', ['get', [['tag', 'x'], [':next'], ['.', 'selected']], 'width'], ['get', [['&'], [':previous'], ['.', 'selected']], 'width']],
    'legacy; modified ambiguation case'
  ],

  // css declarations in top level
  ['color: red;', ['set', 'color', ['get', 'red']], 'css decl in top level without selector'],
];
var gssPropertyTests = [
  ['div { foo: == bar; }',
    ['rule', ['tag', 'div'], [['==', ['get', ['&'], 'foo'], ['get', 'bar']]]],
    'simple gss property case'
  ],


  [wrap('min-width: 1000px'),
    wrap(['>=', ['get', 'width'], ['px', 1000]]),
    'as per request as `min-width` -> `width >= 1000px`'
  ],
  [wrap('max-width: 1000px'),
    wrap(['<=', ['get', 'width'], ['px', 1000]]),
    'as per request as `width <= 1000px`'
  ],
  [wrap('min-height: 1000px'),
    wrap(['>=', ['get', 'height'], ['px', 1000]]),
    'as per request as `width >= 1000px`'
  ],
  [wrap('max-height: 1000px'),
    wrap(['<=', ['get', 'height'], ['px', 1000]]),
    'as per request as `width <= 1000px`'
  ],
  ['@foo (min-width: 100px) or (max-width: 200px);',
    //['@', 'foo', ['||', ['>=', ['get', 'width'], ['px', 100]], ['<=', ['get', 'width'], ['px', 200]]]],
    ['@', 'foo', '(', 'min-width', ':', '100', 'px', ')', 'or', '(', 'max-width', ':', '200', 'px', ')'],
    'as requested'
  ],

  // https://thegrid.slack.com/archives/gss/p1440116810000475
  // https://thegrid.slack.com/archives/gss/p1440116833000476
  ['a { abc: calc(a / 1); }',
    //['rule',['tag','a'],[['set','abc',['calc',[['get','a'],'/',1]]]]],
    ['rule', ['tag', 'a'], [['set', 'abc', ['calc', ['/', ['get', 'a'], 1]]]]],
    'calc is gss'
  ],
  ['x:== calc(15n+23)',
    ['==', ['get', ['&'], 'x'], ['calc', ['+', ['n', 15], 23]]],
    'check anb in gss calc context'
  ],
  ['x:== calc(x/y*z)',
    ['==', ['get', ['&'], 'x'], ['calc', ['*', ['/', ['get', 'x'], ['get', 'y']], ['get', 'z']]]],
    'check anb in gss calc context'
  ],
  ['x: calc(x/y*z)',
    ['set', 'x', ['calc', ['*', ['/', ['get', 'x'], ['get', 'y']], ['get', 'z']]]],
    'check anb in css calc context'
  ],
  ['x:== 100% - 50px',
    ['==', ['get', ['&'], 'x'], ['-', ['%', 100], ['px', 50]]],
    'regression: gss would not parse % as a value'
  ],
  ['x:== 100% + 50px',
    ['==', ['get', ['&'], 'x'], ['+', ['%', 100], ['px', 50]]],
    'regression: gss would not parse % as a value'
  ],
  ['x:== 100%-50px',
    ['==', ['get', ['&'], 'x'], ['-', ['%', 100], ['px', 50]]],
    'regression: gss would not parse % as a value'
  ],

  // todo: i cant find a reference to this request and i dont know what it would mean. my bad?
  //[val('@foo[x]'), val(['get', ['@', 'foo'], 'x']), 'as requested'],
  //[val(':foo[x]'), val(['get', ['@', 'foo'], 'x']), 'as requested'],
  //[val('@foo(x)'), val(['@', 'foo', ['get', 'x']]), 'as requested'],
];

var ccssOldTests = [
  // these were imported as is, sans newlines.
  // distilled are smaller cases to reduce a certain case that follows
  // if input/output is modified is will be clarified in a comment
  ['foo == var;', ['==', ['get', 'foo'], ['get', 'var']], 'legacy test'],
  ['10 == 2 <= 3 < 4 >= 5', ['>=', ['<', ['<=', ['==', 10, 2], 3], 4], 5], 'legacy test'], // modified
  ['((((#box1)[width]) + (("area")[width]))) == ((((#box2)[width]) + ((::window)[width])));',
    ['==', ['+', ['get', ['#', 'box1'], 'width'], ['get', ['virtual', 'area'], 'width']], ['+', ['get', ['#', 'box2'], 'width'], ['get', [':window'], 'width']]], // modified: single colon
    'legacy test'
  ],
  //['4 == 5 == 6 !strong10', NO_ERROR_TEST, 'legacy test'], //deprecated
  ['4 >= 5 >= 6 !strong10', ['>=', ['>=', 4, 5], 6, 'strong10'], 'legacy test'], //modified
  ['div[width] == 100 !strong', ['==', ['get', ['tag', 'div'], 'width'], 100, 'strong']],
  //['4 == 5 == 6 !my-custom-strength99;4 == 5 == 6 !My-CUSTOM-strengtH99;', NO_ERROR_TEST, 'legacy test'], //deprecated
  ['4 >= 5 >= 6 !my-custom-strength99;4 >= 5 >= 6 !My-CUSTOM-strengtH99;',
    [['>=', ['>=', 4, 5], 6, 'my-custom-strength99'], ['>=', ['>=', 4, 5], 6, 'My-CUSTOM-strengtH99']], //modified
    'legacy test'
  ],
  ['&[width] == a', ['==', ['get', ['&'], 'width'], ['get', 'a']], 'distilled'],
  ['&(.box)[width] == a', ['==', ['get', [['&'], ['.', 'box']], 'width'], ['get', 'a']], 'distilled'], // modified (removed extra wrapping)
  ['a == ::parent(.thing)[width]', ['==', ['get', 'a'], ['get', [':parent', ['.', 'thing']], 'width']], 'legacy test'], // modified: (removed extra wrapping, removed extra colon)
  ['&(.box)[width] == ::parent(.thing)[width]', ['==', ['get', [['&'], ['.', 'box']], 'width'], ['get', [':parent', ['.', 'thing']], 'width']], 'legacy test'], // modified (removed extra wrapping, removed extra colon)
  ['button.big(.text)[width] == 100', ['==', ['get', [['tag', 'button'], ['.', 'big'], ['.', 'text']], 'width'], 100], 'legacy test'],
  ['"Zone"[width] == 100;', ['==', ['get', ['virtual', 'Zone'], 'width'], 100], 'legacy test'],
  ['"A"[left] == "1"[top];', ['==', ['get', ['virtual', 'A'], 'left'], ['get', ['virtual', '1'], 'top']], 'legacy test'], // modified (x/y, top/left)
  ['(html #main .boxes)[width] == 100', ['==', ['get', [['tag', 'html'], [' '], ['#', 'main'], [' '], ['.', 'boxes']], 'width'], 100], 'legacy test'],
  [':empty()[width] == 100', ['==', ['get', [':empty'], 'width'], 100], 'distilled'],
  [':string(\'hello\')[width] == 100', ['==', ['get', [':string', 'hello'], 'width'], 100], 'distilled'], // modified: string is now a virtual
  [':sel(.thing.other:sel(.inner)):num(1401):string(\'hello\'):empty()[width] == 100',
    ['==', ['get', [[':sel', [['.', 'thing'], ['.', 'other'], [':sel', ['.', 'inner']]]], [':num', 1401], [':string', 'hello'], [':empty']], 'width'], 100], // modified: string is now a virtual
    'legacy test'
  ],
  ['(* #main:not(.disabled) .boxes[data-target])[width] == 100', ['==', ['get', [['tag', '*'], [' '], ['#', 'main'], [':not', ['.', 'disabled']], [' '], ['.', 'boxes'], ['[]', 'data-target']], 'width'], 100], 'legacy test'],
  ['(a ! b)[c] == 100', ['==', ['get', [['tag', 'a'], ['!'], ['tag', 'b']], 'c'], 100], 'distilled'],
  ['(header !> h2.gizoogle ! section div:get(\'parentNode\'))[target-size] == 100',
    ['==', ['get', [['tag', 'header'], ['!>'], ['tag', 'h2'], ['.', 'gizoogle'], ['!'], ['tag', 'section'], [' '], ['tag', 'div'], [':get', 'parentNode']], 'target-size'], 100], // modified: string is now a virtual
    'legacy test'
  ],
  ['(&.featured)[width] == 100;', ['==', ['get', [['&'], ['.', 'featured']], 'width'], 100], 'legacy test'],
  ['(&"column2")[width] == 100;&"column2"[width]  == 100;',
    [
      ['==', ['get', [['&'], ['virtual', 'column2']], 'width'], 100],
      ['==', ['get', [['&'], ['virtual', 'column2']], 'width'], 100]
    ],
    'legacy test'
  ],
  ['(&:next)[left] == 666;', ['==', ['get', [['&'], [':next']], 'left'], 666], 'legacy test'], // modified: x->left
  ['&:previous[left] == 111;', ['==', ['get', [['&'], [':previous']], 'left'], 111], 'legacy test'], // modified: x->left
  ['&:next.selected[width] == &:previous.selected[width];', ['==', ['get', [['&'], [':next'], ['.', 'selected']], 'width'], ['get', [['&'], [':previous'], ['.', 'selected']], 'width']], 'legacy test'],
  ['a == ([foo!="bar"])[x];', ['==', ['get', 'a'], ['get', ['[!=]', 'foo', 'bar'], 'x']], 'distilled'],
  ['([foo~="bar"])[x] == ([foo!="bar"])[x];',
    ['==', ['get', ['[~=]', 'foo', 'bar'], 'x'], ['get', ['[!=]', 'foo', 'bar'], 'x']],
    'distilled'
  ],
  ['([foo~="bar"])[x] == ([foo!="bar"])[x];([foo$="bar"])[x] == ([foo*="bar"])[x];([foo ^= "bar"])[x] == ([foo  = "bar"])[x];',
    [['==', ['get', ['[~=]', 'foo', 'bar'], 'x'], ['get', ['[!=]', 'foo', 'bar'], 'x']],
      ['==', ['get', ['[$=]', 'foo', 'bar'], 'x'], ['get', ['[*=]', 'foo', 'bar'], 'x']],
      ['==', ['get', ['[^=]', 'foo', 'bar'], 'x'], ['get', ['[=]', 'foo', 'bar'], 'x']]]
    ,
    'legacy test'
  ],
  ['(::parent[disabled] ~ li:first)[width] == 100', ['==', ['get', [[':parent'], ['[]', 'disabled'], ['~'], ['tag', 'li'], [':first']], 'width'], 100], 'legacy test'], // modified: removed a colon
  ['((#a, #b).c, (#x, #y).z)[a-z] == 0;', ['==', ['get', [',', [[',', ['#', 'a'], ['#', 'b']], ['.', 'c']], [[',', ['#', 'x'], ['#', 'y']], ['.', 'z']]], 'a-z'], 0], 'legacy test'],
  [wrap('            y: 100px;'), wrap(['set', 'y', ['px', 100]]), 'legacy test'], // modified: split 100px
  [wrap('            x  :<= &[y];            y  : 100px;            z  :>= &[y];'),
    wrap([
      ['<=', ['get', ['&'], 'x'], ['get', ['&'], 'y']],
      ['set', 'y', ['px', 100]], // modified: split px
      ['>=', ['get', ['&'], 'z'], ['get', ['&'], 'y']]
    ], MULTI_BODY),
    'legacy test'
  ],
  ['          #box.class {            color: blue;           x: == 100;          }', ['rule', [['#', 'box'], ['.', 'class']], [['set', 'color', ['get', 'blue']], ['==', ['get', ['&'], 'x'], 100]]], 'legacy test'],
  ['          .class.foo, .class.bar {            color: blue;          }', ['rule', [',', [['.', 'class'], ['.', 'foo']], [['.', 'class'], ['.', 'bar']]], [['set', 'color', ['get', 'blue']]]], 'legacy test'], // modified: remove empty wrap, made blue a getter
  ['          article.featured > img {            color: black;            .bg"face" {              &[x] == [y];            }            color: black;         }',
    ['rule', [['tag', 'article'], ['.', 'featured'], ['>'], ['tag', 'img']], [['set', 'color', ['get', 'black']], ['rule', [['.', 'bg'], ['virtual', 'face']], [['==', ['get', ['&'], 'x'], ['get', 'y']]]], ['set', 'color', ['get', 'black']]]],
    'legacy test'
  ],
  ['        @my-custom-directive blah blah blah {                color: blue;                }',
    ['@', 'my-custom-directive', 'blah', 'blah', 'blah', '{', 'color', ':', 'blue', ';', '}'],
    'legacy test'
  ],
  ['        @my-custom-directive blah blah blah {                @my-other-directive blah... {                }                }',
    ['@', 'my-custom-directive', 'blah', 'blah', 'blah', '{', '@', 'my-other-directive', 'blah', '...', '{', '}', '}'],
    'legacy test'
  ],
  ['        @my-custom-directive blah blah blah;        ',
    ['@', 'my-custom-directive', 'blah', 'blah', 'blah'],
    'legacy test'
  ],
  ['        @if [x] >= 100 {                font-family: awesome;                }',
    ['@', 'if', '[', 'x', ']', '>=', '100', '{', 'font-family', ':', 'awesome', ';', '}'],
    'legacy test'
  ],
  ['        @if #box[right] == #box2[x] {}',
    ['@', 'if', '#box', '[', 'right', ']', '==', '#box2', '[', 'x', ']', '{', '}'],
    'legacy test'
  ],
  ['        @if 2 * [right] == [x] + 100 {}',
    ['@', 'if', '2', '*', '[', 'right', ']', '==', '[', 'x', ']', '+', '100', '{', '}'],
    'legacy test'
  ],
  ['        @if (#box[right] != #box2[x]) AND (#box[width] <= #box2[width]) {}',
    ['@', 'if', '(', '#box', '[', 'right', ']', '!', '=', '#box2', '[', 'x', ']', ')', 'AND', '(', '#box', '[', 'width', ']', '<=', '#box2', '[', 'width', ']', ')', '{', '}'],
    'legacy test'
  ],
  [
    '            @if     (#box[right] != #box2[x]) and (#box[width] <= #box2[width] or [x] == 100)' +
    ' {            }            @else   (#box[right] != #box2[x]) and (#box[width] <= #box2[width]' +
    ' or [x] == 100) {            }            @else   (#box[right] != #box2[x]) and (#box[width] ' +
    '<= #box2[width] or [x] == 100) {            }            @else {            }            @if ' +
    '    (#box[right] != #box2[x]) and (#box[width] <= #box2[width] or [x] == 100) {              ' +
    '@if   (#box[right] != #box2[x]) and (#box[width] <= #box2[width] or [x] == 100) {            ' +
    '    @if (#box[right] != #box2[x]) and (#box[width] <= #box2[width] or [x] == 100) {          ' +
    '      }                @else {                }              }              @else {          ' +
    '    }            }            @else {}',
    [
      ['@', 'if', '(', '#box', '[', 'right', ']', '!', '=', '#box2', '[', 'x', ']', ')', 'and', '(', '#box', '[', 'width',
        ']', '<=', '#box2', '[', 'width', ']', 'or', '[', 'x', ']', '==', '100', ')', '{', '}'], ['@', 'else', '(', '#box',
      '[', 'right', ']', '!', '=', '#box2', '[', 'x', ']', ')', 'and', '(', '#box', '[', 'width', ']', '<=', '#box2',
      '[', 'width', ']', 'or', '[', 'x', ']', '==', '100', ')', '{', '}'], ['@', 'else', '(', '#box', '[', 'right', ']',
      '!', '=', '#box2', '[', 'x', ']', ')', 'and', '(', '#box', '[', 'width', ']', '<=', '#box2', '[', 'width', ']', 'or',
      '[', 'x', ']', '==', '100', ')', '{', '}'], ['@', 'else', '{', '}'], ['@', 'if', '(', '#box', '[', 'right', ']', '!',
      '=', '#box2', '[', 'x', ']', ')', 'and', '(', '#box', '[', 'width', ']', '<=', '#box2', '[', 'width', ']', 'or',
      '[', 'x', ']', '==', '100', ')', '{', '@', 'if', '(', '#box', '[', 'right', ']', '!', '=', '#box2', '[', 'x', ']', ')',
      'and', '(', '#box', '[', 'width', ']', '<=', '#box2', '[', 'width', ']', 'or', '[', 'x', ']', '==', '100', ')', '{',
      '@', 'if', '(', '#box', '[', 'right', ']', '!', '=', '#box2', '[', 'x', ']', ')', 'and', '(', '#box', '[', 'width',
      ']', '<=', '#box2', '[', 'width', ']', 'or', '[', 'x', ']', '==', '100', ')', '{', '}', '@', 'else', '{', '}', '}',
      '@', 'else', '{', '}', '}'], ['@', 'else', '{', '}']
    ],
    'legacy test'
  ],
  ['     @if [font-family] == \'awesome-nueu\' {            z: == 100;          }          @else {            z: == 1000;          }',
    [['@', 'if', '[', 'font-family', ']', '==', 'awesome-nueu', '{', 'z', ':', '==', '100', ';', '}'], ['@', 'else', '{', 'z', ':', '==', '1000', ';', '}']],
    'legacy test'
  ],
  ['            @-gss-stay #box[width], [grid-height];',
    ['@', '-gss-stay', '#box', '[', 'width', ']', ',', '[', 'grid-height', ']'],
    'legacy test'
  ],
  ['            @stay #box[width], [grid-height];',
    ['@', 'stay', '#box', '[', 'width', ']', ',', '[', 'grid-height', ']'],
    'legacy test'
  ],
  ['          #b[left] == [left];          [left-col] == [col-left];',
    [
      ['==', ['get', ['#', 'b'], 'left'], ['get', 'left']], // modified: x -> left
      ['==', ['get', 'left-col'], ['get', 'col-left']]
    ],
    'legacy test'
  ],
  ['          #b[top] == [top];', ['==', ['get', ['#', 'b'], 'top'], ['get', 'top']], 'legacy test'], // modified: y->top
  ['          [right] == ::window[right];', ['==', ['get', 'right'], ['get', [':window'], 'right']], 'legacy test'], // modified: width->right, remove a colon
  ['          [left] == ::window[left];', ['==', ['get', 'left'], ['get', [':window'], 'left']], 'legacy test'], // modified: x->left, remove a colon
  ['          [top] == ::window[top];', ['==', ['get', 'top'], ['get', [':window'], 'top']], 'legacy test'], // modified: y->top
  ['          [bottom] == ::window[bottom];', ['==', ['get', 'bottom'], ['get', [':window'], 'bottom']], 'legacy test'], // modified: height->bottom, remove a colon
  ['          #b[cx] == [cx];', ['==', ['get', ['#', 'b'], 'cx'], ['get', 'cx']], 'legacy test'], // modified: center-x -> cx
  ['          #b[cy] == [cy];', ['==', ['get', ['#', 'b'], 'cy'], ['get', 'cy']], 'legacy test'], // modified: center-y -> cy
  [[
    '          [left] == 0.4;',
    '          [left] == +0.4;',
    '          [left] == +.4; ',
  ],
    ['==', ['get', 'left'], 0.4],
    'legacy test'
  ],
  ['          [left] == .4;           [left] == .004;', [['==', ['get', 'left'], 0.4], ['==', ['get', 'left'], 0.004]], 'legacy test'],
  [[
    '          [left] == 0 - 1;',
    '          [left] == (0 - 1); ',
    '          [left] == 0-1;'
  ],
    ['==', ['get', 'left'], ['-', 0, 1]],
    'legacy test',
  ],
  ['          [left] == -1; ', ['==', ['get', 'left'], -1], 'legacy test'],
  [[
    '          [left] == -0.4;',
    '          [left] == -.4;',
  ],
    ['==', ['get', 'left'], -0.4],
    'legacy test'
  ],
  [[
    '          [left] == 0 + 1;',
    '          [left] == (0 + 1);',
    '          [left] == 0+1; ',
  ],
    ['==', ['get', 'left'], ['+', 0, 1]],
    'legacy test'
  ],
  ['          [left] == +1; ', ['==', ['get', 'left'], 1], 'legacy test'],
  ['            -[x] == -[y]; ', ['==', ['-', 0, ['get', 'x']], ['-', 0, ['get', 'y']]], 'legacy test'],
  ['1 -[x] == a;', ['==', ['-', 1, ['get', 'x']], ['get', 'a']], 'distilled'],
  ['1 - -[x] == a;', ['==', ['-', 1, ['-', 0, ['get', 'x']]], ['get', 'a']], 'distilled'],
  ['-1 -[x] == a;', ['==', ['-', -1, ['get', 'x']], ['get', 'a']], 'distilled'],
  ['-1 - -[x] == a;', ['==', ['-', -1, ['-', 0, ['get', 'x']]], ['get', 'a']], 'distilled'],
  ['            -1 - -[x] == -[y] - -1;', ['==', ['-', -1, ['-', 0, ['get', 'x']]], ['-', ['-', 0, ['get', 'y']], -1]], 'legacy test'],
  ['            -1 + -[x] == -[y] - -[x];', ['==', ['+', -1, ['-', 0, ['get', 'x']]], ['-', ['-', 0, ['get', 'y']], ['-', 0, ['get', 'x']]]], 'legacy test'],
  ['-1px == a', ['==', ['px', -1], ['get', 'a']], 'distilled'],
  ['            10px == 0.4px;            -.01px == .01px;', [['==', ['px', 10], ['px', 0.4]], ['==', ['px', -0.01], ['px', 0.01]]], 'legacy test'],
  ['            10em == 0.4em;            -.01em == .01em;', [['==', ['em', 10], ['em', 0.4]], ['==', ['em', -0.01], ['em', 0.01]]], 'legacy test'],
  ['            10% == 0.4%;            -.01% == .01%;', [['==', ['%', 10], ['%', 0.4]], ['==', ['%', -0.01], ['%', 0.01]]], 'legacy test'],
  ['            10my-md == 0.4my-md;            -.01my-md == .01my-md;', [['==', ['my-md', 10], ['my-md', 0.4]], ['==', ['my-md', -0.01], ['my-md', 0.01]]], 'legacy test'],
  ['            x px == y em;', ['==', ['px', ['get', 'x']], ['em', ['get', 'y']]], 'legacy test'],
  [[
    '[md-width] == ([width] * 2 - [gap] * 2) / 4 + 10 !require; ',
    'md-width   == ( width * 2 - gap * 2 ) / 4 + 10 !require; ',
  ],
    //["==",["get","md-width"],["+",["/",["-",["*",["get","width"],2],["*",["get","gap"],2]],4],10],"require"],
    ['==', ['get', 'md-width'], ['+', ['/', ['*', ['-', ['*', ['get', 'width'], 2], ['get', 'gap']], 2], 4], 10], 'require'], // modified: star is no longer stronger than plus or min
    'legacy test'
  ],
  [[ // modified: == no longer allowed as second or later op, changed to >=
    '[grid-height] * #box2[width] <= 2 >= 3 < 4 >= 5 ',
    'grid-height * #box2[width]<= 2>= 3< 4>= 5;',
  ],
    ['>=', ['<', ['>=', ['<=', ['*', ['get', 'grid-height'], ['get', ['#', 'box2'], 'width']], 2], 3], 4], 5], // modified: dont split on constraints
    'legacy test'
  ],
  [[
    'divd { prop: empty-func(); }',
    'divd { prop: empty-func( ); }',
  ],
    ['rule', ['tag', 'divd'], [['set', 'prop', 'empty-func']]], // modified: no empty wrap
    'legacy test'
  ],
  ['my-spring(1);', ['my-spring', 1], 'legacy test'],
  ['x == my-spring(1);', ['==', ['get', 'x'], ['my-spring', 1]], 'legacy test'],
  ['x == my-spring(1) + my-func(y);', ['==', ['get', 'x'], ['+', ['my-spring', 1], ['my-func', ['get', 'y']]]], 'legacy test'],
  [wrap('x := my-spring(1 + 2) + my-func(y);'), wrap(['=', ['get', ['&'], 'x'], ['+', ['my-spring', ['+', 1, 2]], ['my-func', ['get', 'y']]]]), 'legacy test'],
  ['x = a(#box[width]) b(1);',
    ['=', ['get', 'x'], [['a', ['get', ['#', 'box'], 'width']], ['b', 1]]],
    'legacy test'
  ],
  [[
    'x==my-func(1) !strong90;',
    'x==my-func(1)!strong90;',
  ],
    ['==', ['get', 'x'], ['my-func', 1], 'strong90'], // modified: no split for strength
    'legacy test'
  ],
  [[
    'x==my-func(1) my-other(1) !strong90;',
    'x==my-func(1)my-other(1)!strong90;',
  ],
    ['==', ['get', 'x'], [['my-func', 1], ['my-other', 1]], 'strong90'],
    'legacy test'
  ],
  [[
    '&[width] == ::parent[width]',
    '&width == ::parent[width]',
  ],
    ['==', ['get', ['&'], 'width'], ['get', [':parent'], 'width']], // modified: single colon
    'legacy test'
  ],
  [[
    '    $width == $y',
    '    $[width] == ($)[y]',
  ],
    ['==', ['get', ['$'], 'width'], ['get', ['$'], 'y']],
    'legacy test'
  ],
  [[
    '^width == ^y',
    '^[width] == (^)[y]',
  ],
    ['==', ['get', ['^'], 'width'], ['get', ['^'], 'y']],
    'legacy test'
  ],
  [[
    '^^margin-top == ^margin-top - margin-top',
    '^^[margin-top] == ^[margin-top] - margin-top',
    '( ^^ )[margin-top] == ( ^ )[margin-top] - [margin-top]',
  ],
    ['==', ['get', ['^', 2], 'margin-top'], ['-', ['get', ['^'], 'margin-top'], ['get', 'margin-top']]],
    'legacy test'
  ],
  ['^^^^^^^^--my-margin-top == ^^^--my-margin-top',
    ['==', ['get', ['^', 8], '--my-margin-top'], ['get', ['^', 3], '--my-margin-top']],
    'legacy test'
  ],
  ['^^^^^^^^[-my-margin-top] == ^^^[-my-margin-top]',
    ['==', ['get', ['^', 8], '-my-margin-top'], ['get', ['^', 3], '-my-margin-top']],
    'similar to other caret test but now var is wrapped in a square block'
  ],
  ['^[left] + [base] == &[left]', ['==', ['+', ['get', ['^'], 'left'], ['get', 'base']], ['get', ['&'], 'left']], 'legacy test'], // modified: x -> left
  ['"box"[right] == "box2"[left];', ['==', ['get', ['virtual', 'box'], 'right'], ['get', ['virtual', 'box2'], 'left']], 'legacy test'],
  [[
    '"col1...5"[x] == 0;',
    '("col1","col2","col3","col4","col5")[x] == 0;',
  ],
    ['==', ['get', [',', ['virtual', 'col1'], ['virtual', 'col2'], ['virtual', 'col3'], ['virtual', 'col4'], ['virtual', 'col5']], 'x'], 0],
    'legacy test'
  ],
  [[
    '"col-1...4"[x] == 0;',
    '("col-1","col-2","col-3","col-4")[x] == 0;',
    '("col-1","col-2...3","col-4")[x] == 0;',
    '("col-1...2","col-3...3","col-4...4")[x] == 0;',
  ],
    ['==', ['get', [',', ['virtual', 'col-1'], ['virtual', 'col-2'], ['virtual', 'col-3'], ['virtual', 'col-4']], 'x'], 0],
    'legacy test'
  ],
  [[
    '"col1...5" { x: == 0; }',
    '"col1...1","col2...2","col3...3","col4...4","col5...5" { &[x] == 0; }',
    '"col1","col2","col3","col4","col5" { &[x] == 0; }',
    '"col1","col2...4","col5" { &[x] == 0; }',
    '"col1...3","col4...5" { &[x] == 0; }',
  ],
    ['rule', [',', ['virtual', 'col1'], ['virtual', 'col2'], ['virtual', 'col3'], ['virtual', 'col4'], ['virtual', 'col5']], [['==', ['get', ['&'], 'x'], 0]]],
    'legacy test'
  ],
  ['"zone-1-1...3"[x] == 0', ['==', ['get', [',', ['virtual', 'zone-1-1'], ['virtual', 'zone-1-2'], ['virtual', 'zone-1-3']], 'x'], 0], 'legacy test'],
  //['"zone-1...3-1...3"[x] == 0', ["==", ["get", [",", ["virtual", "zone-1-1"], ["virtual", "zone-1-2"], ["virtual", "zone-1-3"], ["virtual", "zone-2-1"], ["virtual", "zone-2-2"], ["virtual", "zone-2-3"], ["virtual", "zone-3-1"], ["virtual", "zone-3-2"], ["virtual", "zone-3-3"]], "x"], 0], 'legacy test'],
  ['"zone-1...3-2"[x] == 0', ['==', ['get', [',', ['virtual', 'zone-1-2'], ['virtual', 'zone-2-2'], ['virtual', 'zone-3-2']], 'x'], 0], 'legacy test'],
  ['#box-2...6[x] == 0', ['==', ['get', [',', ['#', 'box-2'], ['#', 'box-3'], ['#', 'box-4'], ['#', 'box-5'], ['#', 'box-6']], 'x'], 0], 'legacy test'],
  //['#cell-x1...2-y1...2-z1...2[z] == 0', ["==", ["get", [",", ["#", "cell-x1-y1-z1"], ["#", "cell-x1-y1-z2"], ["#", "cell-x1-y2-z1"], ["#", "cell-x1-y2-z2"], ["#", "cell-x2-y1-z1"], ["#", "cell-x2-y1-z2"], ["#", "cell-x2-y2-z1"], ["#", "cell-x2-y2-z2"]], "z"], 0], 'legacy test'],
  [[
    // modified: changed .featured into #features because `2.` is illegal
    '.btn0...2#featured[x]                <= 0',
    '((.btn0, .btn1, .btn2)#featured)[x]  <= 0',
  ],
    ['<=', ['get', [[',', ['.', 'btn0'], ['.', 'btn1'], ['.', 'btn2']], ['#', 'featured']], 'x'], 0],
    'legacy test'
  ],
  ['.parent.btn0...2#featured[x] <= 0', // modified: changed .featured into #features because `2.` is illegal
    ['<=', ['get', [['.', 'parent'], [',', ['.', 'btn0'], ['.', 'btn1'], ['.', 'btn2']], ['#', 'featured']], 'x'], 0],
    'legacy test'
  ],
  ['$.btn0...2[x] <= 0', ['<=', ['get', [['$'], [',', ['.', 'btn0'], ['.', 'btn1'], ['.', 'btn2']]], 'x'], 0], 'legacy test'],
  ['$"zone-1...3-2"[x] == 0', ['==', ['get', [['$'], [',', ['virtual', 'zone-1-2'], ['virtual', 'zone-2-2'], ['virtual', 'zone-3-2']]], 'x'], 0], 'legacy test'],
  [[
    '"col1...3":first[x] == 0',
    '(("col1", "col2", "col3"):first)[x] == 0',
  ],
    ['==', ['get', [[',', ['virtual', 'col1'], ['virtual', 'col2'], ['virtual', 'col3']], [':first']], 'x'], 0],
    'legacy test'
  ],
  [[
    '"col1...3":last[x] == 0',
    '(("col1", "col2", "col3"):last)[x] == 0',
  ],
    ['==', ['get', [[',', ['virtual', 'col1'], ['virtual', 'col2'], ['virtual', 'col3']], [':last']], 'x'], 0],
    'legacy test'
  ],
  [[
    '(&"grid", .that"grid" , .box ,.thing)[width] == 100',
    '(&"grid"        ,.that"grid" ,.box,.thing)[width] == 100',
  ],
    ['==', ['get', [',', [['&'], ['virtual', 'grid']], [['.', 'that'], ['virtual', 'grid']], ['.', 'box'], ['.', 'thing']], 'width'], 100],
    'legacy test'
  ],
  [[
    wrap('x: == 100;x: =  100;x: <= 100;        x: <  100;        x: >= 100;    x: >  100;'),
    wrap('    x :== 100;    x :=  100;    x :<= 100;            x :<  100;            x :>= 100;            x :>  100;'),
  ],
    ['rule', ['tag', 'divv'], [['==', ['get', ['&'], 'x'], 100], ['=', ['get', ['&'], 'x'], 100], ['<=', ['get', ['&'], 'x'], 100], ['<', ['get', ['&'], 'x'], 100], ['>=', ['get', ['&'], 'x'], 100], ['>', ['get', ['&'], 'x'], 100]]],
    'legacy test'
  ],

  [[
    // modified: == to >=
    '       [grid-height] * #box2[width] <= 2 >= 3 < 4 >= 5 ',
    'grid-height * #box2[width]<= 2>= 3< 4>= 5;',
  ],
    ['>=', ['<', ['>=', ['<=', ['*', ['get', 'grid-height'], ['get', ['#', 'box2'], 'width']], 2], 3], 4], 5],
    'legacy test'
  ],
  [[
    val('number-func(10.22);'),
    val('  number-func(  10.22  )  ;'),
  ],
    val(['number-func', 10.22]),
    'legacy test'
  ],
  [[
    '        string-func(\'hello\');',
    '  string-func(  \'hello\'  )  ;',
  ],
    ['string-func', 'hello'],
    'legacy test'
  ],
  ['math-func(10 + x * 2);', ['math-func', ['*', ['+', 10, ['get', 'x']], 2]], 'legacy test'],
  ['selector-func(#foo.bar);', ['selector-func', [['#', 'foo'], ['.', 'bar']]], 'legacy test'],
  ['var-func(my-var);', ['var-func', ['get', 'my-var']], 'legacy test'], // changed: now a tag
  ['vars-func(my-var, #box[x], .foo.bar[x]);', ['vars-func', ['get', 'my-var'], ['get', ['#', 'box'], 'x'], ['get', [['.', 'foo'], ['.', 'bar']], 'x']], 'legacy test'],
  [[
    'outer(mid(inner()));',
    '            outer(                    mid(                            inner(                           )                    )            )',
  ],
    ['outer', ['mid', ['inner']]],
    'legacy test'
  ],
  [[
    'outer(inner(1),inner(2),inner(3));',
    '            outer(                    inner( 1 ),                    inner( 2 ),                    inner( 3 )            )',
  ],
    ['outer', ['inner', 1], ['inner', 2], ['inner', 3]],
    'legacy test'
  ],
  [[
    'dance(step(1) step(2) step(3)) jump(4);',
    '            dance(                    step(1)            step(2)            step(3))jump(4);',
    'dance(step(1) step(2) step(3))jump(4);',
  ],
    [['dance', [['step', 1], ['step', 2], ['step', 3]]], ['jump', 4]],
    'legacy test'
  ],
  [[
    'my-func(1) !strong90;',
    'my-func(1)!strong90;',
  ],
    ['my-func', 1, 'strong90'],
    'legacy test'
  ],
  [[
    'my-func(1) my-other(1) !strong90;',
    'my-func(1)my-other(1)!strong90;',
  ],
    [['my-func', 1], ['my-other', 1], 'strong90'],
    'legacy test'
  ],
  [[
    '&[width] == ::parent[width]',
    '&width == ::parent[width]',
  ],
    ['==', ['get', ['&'], 'width'], ['get', [':parent'], 'width']],
    'legacy test'
  ],
  [[
    '^width == ^y',
    '^[width] == (^)[y]',
  ],
    ['==', ['get', ['^'], 'width'], ['get', ['^'], 'y']],
    'legacy test'
  ],
  [[
    '^^margin-top == ^margin-top - margin-top',
    '^^[margin-top] == ^[margin-top] - margin-top',
    '( ^^ )[margin-top] == ( ^ )[margin-top] - [margin-top]',
  ],
    ['==', ['get', ['^', 2], 'margin-top'], ['-', ['get', ['^'], 'margin-top'], ['get', 'margin-top']]],
    'legacy test'
  ],
  [[
    '"col1...5"[x] == 0;',
    '("col1","col2","col3","col4","col5")[x] == 0;',
  ],
    ['==', ['get', [',', ['virtual', 'col1'], ['virtual', 'col2'], ['virtual', 'col3'], ['virtual', 'col4'], ['virtual', 'col5']], 'x'], 0],
    'legacy test'
  ],
  [[
    '            article.featured > img {            }',
    '        article.featured > img        {                }',
    '        article.featured > img{}',
    'article.featured > img{}',
    'article.featured     >    img       {}   ',
  ],
    ['rule', [['tag', 'article'], ['.', 'featured'], ['>'], ['tag', 'img']], []],
    'legacy test'
  ],
  [[
    '        ::this, ::scope .box, ::this .post, ::scope, ::this "fling" {                }',
    '        (::this), (::scope .box), (::this .post), (::scope), (::this "fling") {                }',
    '        ((::this), (::scope .box), (::this .post), (::scope), (::this "fling")) {                }',
  ],
    ['rule', [',', ['&'], [[':scope'], [' '], ['.', 'box']], [['&'], [' '], ['.', 'post']], [':scope'], [['&'], [' '], ['virtual', 'fling']]], []],
    'legacy test'
  ],
  [[
    '        @if [x] != 20 && [y] == 200 {                }        @else {                }',
    '@if[x]!=20&&[y]==200{}@else{}',
  ],
    [['@', 'if', '[', 'x', ']', '!', '=', '20', '&', '&', '[', 'y', ']', '==', '200', '{', '}'], ['@', 'else', '{', '}']],
    'legacy test'
  ],
  [[
    '        @if [x]        {                font-family: awesome;                font-family: awesomer;' +
    '                }        @else        {                font-family: lame;                font-family: lamer; ' +
    '               }',
    '@if[x]{font-family:awesome;font-family:awesomer;}@else{font-family:lame;font-family:lamer;}',
  ],
    [['@', 'if', '[', 'x', ']', '{', 'font-family', ':', 'awesome', ';', 'font-family', ':', 'awesomer', ';', '}'], ['@', 'else', '{', 'font-family', ':', 'lame', ';', 'font-family', ':', 'lamer', ';', '}']],
    'legacy test'
  ],
  ['        @if [x] {                font-family: awesome;                }        @else [y] {                ' +
  'font-family: awesomer;                }        @else [z] {                font-family: awesomest;                }',
    [['@', 'if', '[', 'x', ']', '{', 'font-family', ':', 'awesome', ';', '}'], ['@', 'else', '[', 'y', ']', '{', 'font-family', ':', 'awesomer', ';', '}'], ['@', 'else', '[', 'z', ']', '{', 'font-family', ':', 'awesomest', ';', '}']],
    'legacy case'],
  [
    '        .outie {                @if [x] > [xx] {                font-family: awesome;                .innie ' +
    '{                color:blue;                }                }                @else [y] {                font' +
    '-family: awesomer;                .innie {                color:red;                }                }       ' +
    '         @else [z] {                font-family: awesomest;                .innie {                color:pink' +
    ';                }                }                }',
    //["rule",[".","outie"],["ERROR",["rule",[["tag","if"],[" "],["[]","x"],[">"],["[]","xx"]],[["set","font-family",
    //  ["get","awesome"]],"ERROR",["rule",["tag","innie"],["set","color",["get","blue"]]]]],"ERROR",["rule",[["tag",
    //  "else"],[" "],["[]","y"]],[["set","font-family",["get","awesomer"]],"ERROR",["rule",["tag","innie"],["set",
    //  "color",["get","red"]]]]],"ERROR",["rule",[["tag","else"],[" "],["[]","z"]],[["set","font-family",["get",
    //  "awesomest"]],"ERROR",["rule",["tag","innie"],["set","color",["get","pink"]]]]]]],
    // changed: pass on @rule as tokens, unprocessed
    ['rule', ['.', 'outie'], [['@', 'if', '[', 'x', ']', '>', '[', 'xx', ']', '{', 'font-family', ':', 'awesome', ';', '.', 'innie',
      '{', 'color', ':', 'blue', ';', '}', '}'], ['@', 'else', '[', 'y', ']', '{', 'font-family', ':', 'awesomer', ';', '.', 'innie',
      '{', 'color', ':', 'red', ';', '}', '}'], ['@', 'else', '[', 'z', ']', '{', 'font-family', ':', 'awesomest', ';', '.', 'innie',
      '{', 'color', ':', 'pink', ';', '}', '}']]],
    'legacy test'
  ],
  [[
    '        @if [x] {                @if [x] {                @if [x] {                }                @else {' +
    '                }                }                @else {                }                }        @else { ' +
    '               @if [x] {                }                @else {                }                }',
    '@if [x] { @if [x] { @if [x] { } @else {} }@else {}}@else {@if [x] {  }    @else {  }}',
  ],
    NO_ERROR_TEST,
    'legacy test'
  ],
  [[
    '                x px == y    + z em;                x px == y vw + z em;',
    '                x  px == y         +   z   em;                x  px == y     vw  +   z   em;',
    '                (x)   px == (y       )  +   (z   )em;                ( x )  px == (y     vw)  +   (z   )em;',
  ],
    [['==', ['px', ['get', 'x']], ['+', ['get', 'y'], ['em', ['get', 'z']]]], ['==', ['px', ['get', 'x']], ['+', ['vw', ['get', 'y']], ['em', ['get', 'z']]]]],
    'legacy test'
  ],
  [[
    '                shoe uk-foot-size == hand in + head ft * arm meter;',
    '                shoe uk-foot-size == (hand in + head ft) * arm meter;',
  ],
    ['==', ['uk-foot-size', ['get', 'shoe']], ['*', ['+', ['in', ['get', 'hand']], ['ft', ['get', 'head']]], ['meter', ['get', 'arm']]]], // modified: due to different op precedence
    'legacy test'
  ],
  ['                shoe uk-foot-size == hand in + (head ft * arm meter);',
    ['==', ['uk-foot-size', ['get', 'shoe']], ['+', ['in', ['get', 'hand']], ['*', ['ft', ['get', 'head']], ['meter', ['get', 'arm']]]]],
    'legacy test'
  ],
  ['                shoe uk-foot-size == ((hand in + head) ft * arm) meter;',
    ['==', ['uk-foot-size', ['get', 'shoe']], ['meter', ['*', ['ft', ['+', ['in', ['get', 'hand']], ['get', 'head']]], ['get', 'arm']]]],
    'legacy test'
  ],
  ['        ::scope[width] >= ::this[width] <= ::document[width] > ::viewport[width] < ::window[height]', // modified: == no longer allowed that often
    ['<', ['>', ['<=', ['>=', ['get', [':scope'], 'width'], ['get', ['&'], 'width']], ['get', [':document'], 'width']], ['get', [':viewport'], 'width']], ['get', [':window'], 'height']],
    'legacy test'
  ],
  [[
    '    &width == &x <= &y', // modified: == -> <=
    //'            ::[width] == ::this[x] <= &[y]', // modified: == -> <=
    '&[width] == (::this)[x] <= (&)[y]', // modified: (::) -> & https://thegrid.slack.com/archives/gss/p1437063265002201
  ],
    // "& was :: before aka ::this" "just legacy"  https://thegrid.slack.com/archives/gss/p1437062601002168
    ['<=', ['==', ['get', ['&'], 'width'], ['get', ['&'], 'x']], ['get', ['&'], 'y']], // modified: different order
    'legacy test'
  ],
  [[
    '$width == $y',
    '    $[width] == ($)[y]',
  ],
    ['==', ['get', ['$'], 'width'], ['get', ['$'], 'y']],
    'legacy test'
  ],
  ['"zone-1-1...3"[x] == 0',
    ['==', ['get', [',', ['virtual', 'zone-1-1'], ['virtual', 'zone-1-2'], ['virtual', 'zone-1-3']], 'x'], 0],
    'legacy test'
  ],
  ['.box-2...6[x] == 0',
    ['==', ['get', [',', ['.', 'box-2'], ['.', 'box-3'], ['.', 'box-4'], ['.', 'box-5'], ['.', 'box-6']], 'x'], 0],
    'legacy splats a class'
  ],
  ['box-2...6[x] == 0',
    ['==', ['get', [',', ['tag', 'box-2'], ['tag', 'box-3'], ['tag', 'box-4'], ['tag', 'box-5'], ['tag', 'box-6']], 'x'], 0],
    'legacy splats a tag'
  ],

  // due to minor devations i've pulled the kitchen sink tests apart in smaller chunks below
  //['/* vars */\n[gap] == 20 !require;\n[flex-gap] >= [gap] * 2 !require;\n[radius] == 10 !require;\n[outer-radius] == [radius] * 2 !require;\n\n/* elements */\n#profile-card {\nwidth: == ::window[width] - 480;\nheight: == ::window[height] - 480;\ncenter-x: == ::window[center-x];\ncenter-y: == ::window[center-y];\nborder-radius: == [outer-radius];\n}\n\n#avatar {\nheight: == 160 !require;\nwidth: == ::[height];\nborder-radius: == ::[height] / 2;\n}\n\n#name {\nheight: == ::[intrinsic-height] !require;\nwidth: == ::[intrinsic-width] !require;\n}\n\n#cover {\nborder-radius: == [radius];\n}\n\nbutton {\nwidth: == ::[intrinsic-width] !require;\nheight: == ::[intrinsic-height] !require;\npadding: == [gap];\npadding-top: == [gap] / 2;\npadding-bottom: == [gap] / 2;\nborder-radius: == [radius];\n}\n\n@h |~-~(#name)~-~| in(#cover) gap([gap]*2) !strong;\n\n/* landscape profile-card */\n@if #profile-card[width] >= #profile-card[height] {\n\n@v |\n    -\n    (#avatar)\n    -\n    (#name)\n    -\n   |\n  in(#cover)\n  gap([gap]) outer-gap([flex-gap]) {\n    center-x: == #cover[center-x];\n}\n\n@h |-10-(#cover)-10-|\n  in(#profile-card);\n\n@v |\n    -10-\n    (#cover)\n    -\n    (#follow)\n    -\n   |\n  in(#profile-card)\n  gap([gap]);\n\n#follow[center-x] == #profile-card[center-x];\n\n@h |-(#message)~-~(#follow)~-~(#following)-(#followers)-|\n  in(#profile-card)\n  gap([gap])\n  !strong {\n    &[top] == &:next[top];\n  }\n}\n\n/* portrait profile-card */\n@else {\n@v |\n    -\n    (#avatar)\n    -\n    (#name)\n    -\n    (#follow)\n    -\n    (#message)\n    -\n    (#following)\n    -\n    (#followers)\n    -\n   |\n  in(#cover)\n  gap([gap])\n  outer-gap([flex-gap]) {\n    center-x: == #profile-card[center-x];\n}\n\n@h |-10-(#cover)-10-| in(#profile-card);\n@v |-10-(#cover)-10-| in(#profile-card);\n}',
  //  [
  //    ["==",["get","gap"],20,"require"],
  //      [">=",["get","flex-gap"],["*",["get","gap"],2],"require"],
  //      ["==",["get","radius"],10,"require"],
  //      ["==",["get","outer-radius"],["*",["get","radius"],2],"require"],
  //      ["rule",["#","profile-card"],[["==",["get",["&"],"width"],["-",["get",["::window"],"width"],480]],["==",["get",["&"],"height"],["-",["get",["::window"],"height"],480]],["==",["get",["&"],"center-x"],["get",["::window"],"center-x"]],["==",["get",["&"],"center-y"],["get",["::window"],"center-y"]],["==",["get",["&"],"border-radius"],["get",["^"],"outer-radius"]]]],
  //      ["rule",["#","avatar"],[["==",["get",["&"],"height"],160,"require"],["==",["get",["&"],"width"],["get",["&"],"height"]],["==",["get",["&"],"border-radius"],["/",["get",["&"],"height"],2]]]],
  //      ["rule",["#","name"],[["==",["get",["&"],"height"],["get",["&"],"intrinsic-height"],"require"],["==",["get",["&"],"width"],["get",["&"],"intrinsic-width"],"require"]]],
  //      ["rule",["#","cover"],[["==",["get",["&"],"border-radius"],["get",["^"],"radius"]]]],
  //      ["rule",["tag","button"],[["==",["get",["&"],"width"],["get",["&"],"intrinsic-width"],"require"],["==",["get",["&"],"height"],["get",["&"],"intrinsic-height"],"require"],["==",["get",["&"],"padding"],["get",["^"],"gap"]],["==",["get",["&"],"padding-top"],["/",["get",["^"],"gap"],2]],["==",["get",["&"],"padding-bottom"],["/",["get",["^"],"gap"],2]],["==",["get",["&"],"border-radius"],["get",["^"],"radius"]]]],
  //      ["<=",["+",["get",["#","cover"],"x"],["*",["get","gap"],2]],["get",["#","name"],"x"],"strong"],
  //      ["<=",["+",["get",["#","name"],"right"],["*",["get","gap"],2]],["get",["#","cover"],"right"],"strong"],
  //      ["if",[">=",["get",["#","profile-card"],"width"],["get",["#","profile-card"],"height"]],[["==",["+",["get",["#","cover"],"y"],["get","flex-gap"]],["get",["#","avatar"],"y"]],["==",["+",["get",["#","avatar"],"bottom"],["get","gap"]],["get",["#","name"],"y"]],["==",["+",["get",["#","name"],"bottom"],["get","flex-gap"]],["get",["#","cover"],"bottom"]],["rule",[",",["#","avatar"],["#","name"]],[["==",["get",["&"],"center-x"],["get",["#","cover"],"center-x"]]]],["==",["+",["get",["#","profile-card"],"x"],10],["get",["#","cover"],"x"]],["==",["+",["get",["#","cover"],"right"],10],["get",["#","profile-card"],"right"]],["==",["+",["get",["#","profile-card"],"y"],10],["get",["#","cover"],"y"]],["==",["+",["get",["#","cover"],"bottom"],["get","gap"]],["get",["#","follow"],"y"]],["==",["+",["get",["#","follow"],"bottom"],["get","gap"]],["get",["#","profile-card"],"bottom"]],["==",["get",["#","follow"],"center-x"],["get",["#","profile-card"],"center-x"]],["==",["+",["get",["#","profile-card"],"x"],["get","gap"]],["get",["#","message"],"x"],"strong"],["<=",["+",["get",["#","message"],"right"],["get","gap"]],["get",["#","follow"],"x"],"strong"],["<=",["+",["get",["#","follow"],"right"],["get","gap"]],["get",["#","following"],"x"],"strong"],["==",["+",["get",["#","following"],"right"],["get","gap"]],["get",["#","followers"],"x"],"strong"],["==",["+",["get",["#","followers"],"right"],["get","gap"]],["get",["#","profile-card"],"right"],"strong"],["rule",[",",["#","message"],["#","follow"],["#","following"],["#","followers"]],[["==",["get",["&"],"y"],["get",[["&"],[":next"]],"y"]]]]],[true,[["==",["+",["get",["#","cover"],"y"],["get","flex-gap"]],["get",["#","avatar"],"y"]],["==",["+",["get",["#","avatar"],"bottom"],["get","gap"]],["get",["#","name"],"y"]],["==",["+",["get",["#","name"],"bottom"],["get","gap"]],["get",["#","follow"],"y"]],["==",["+",["get",["#","follow"],"bottom"],["get","gap"]],["get",["#","message"],"y"]],["==",["+",["get",["#","message"],"bottom"],["get","gap"]],["get",["#","following"],"y"]],["==",["+",["get",["#","following"],"bottom"],["get","gap"]],["get",["#","followers"],"y"]],["==",["+",["get",["#","followers"],"bottom"],["get","flex-gap"]],["get",["#","cover"],"bottom"]],["rule",[",",["#","avatar"],["#","name"],["#","follow"],["#","message"],["#","following"],["#","followers"]],[["==",["get",["&"],"center-x"],["get",["#","profile-card"],"center-x"]]]],["==",["+",["get",["#","profile-card"],"x"],10],["get",["#","cover"],"x"]],["==",["+",["get",["#","cover"],"right"],10],["get",["#","profile-card"],"right"]],["==",["+",["get",["#","profile-card"],"y"],10],["get",["#","cover"],"y"]],["==",["+",["get",["#","cover"],"bottom"],10],["get",["#","profile-card"],"bottom"]]]]],
  //
  //  ],
  //  'legacy tests; kitchen sink tests'
  //],

  // kitchen sink tests torn apart
  ['[gap] == 20 !require; [flex-gap] >= [gap] * 2 !require; [radius] == 10 !require; [outer-radius] == [radius] * 2 !require;',
    [['==', ['get', 'gap'], 20, 'require'], ['>=', ['get', 'flex-gap'], ['*', ['get', 'gap'], 2], 'require'], ['==', ['get', 'radius'], 10, 'require'], ['==', ['get', 'outer-radius'], ['*', ['get', 'radius'], 2], 'require']],
    'kitchen sink tests; vars'
  ],
  ['#profile-card {width: == ::window[width] - 480;height: == ::window[height] - 480;center-x: == ::window[center-x];center-y: == ::window[center-y];border-radius: == [outer-radius];}',
    ['rule', ['#', 'profile-card'], [['==', ['get', ['&'], 'width'], ['-', ['get', [':window'], 'width'], 480]], ['==', ['get', ['&'], 'height'], ['-', ['get', [':window'], 'height'], 480]], ['==',
      ['get', ['&'], 'center-x'], ['get', [':window'], 'center-x']], ['==', ['get', ['&'], 'center-y'], ['get', [':window'], 'center-y']], ['==', ['get', ['&'], 'border-radius'], ['get', 'outer-radius']]]],
    'kitchen sink tests; elements'
  ],
  ['#avatar {height: == 160 !require;width: == &[height];border-radius: == &[height] / 2;}',
    ['rule', ['#', 'avatar'], [['==', ['get', ['&'], 'height'], 160, 'require'], ['==', ['get', ['&'], 'width'], ['get', ['&'], 'height']], ['==', ['get', ['&'], 'border-radius'], ['/', ['get', ['&'], 'height'], 2]]]],
    'kitchen sink tests; avatar'
  ],
  ['#name {height: == &[intrinsic-height] !require;width: == &[intrinsic-width] !require;}',
    ['rule', ['#', 'name'], [['==', ['get', ['&'], 'height'], ['get', ['&'], 'intrinsic-height', 'require']], ['==', ['get', ['&'], 'width'], ['get', ['&'], 'intrinsic-width', 'require']]]],
    'kitchen sink test; name'
  ],
  ['#cover {border-radius: == [radius];}',
    ['rule', ['#', 'cover'], [['==', ['get', ['&'], 'border-radius'], ['get', 'radius']]]],
    'kitchen sink test; cover'
  ],
  ['button {width: == &[intrinsic-width] !require;height: == &[intrinsic-height] !require;padding: == [gap];padding-top: == [gap] / 2;padding-bottom: == [gap] / 2;border-radius: == [radius];}',
    ['rule', ['tag', 'button'], [['==', ['get', ['&'], 'width'], ['get', ['&'], 'intrinsic-width', 'require']], ['==', ['get', ['&'], 'height'], ['get', ['&'], 'intrinsic-height', 'require']], ['==', ['get', ['&'], 'padding'], ['get', 'gap']], ['==', ['get', ['&'], 'padding-top'], ['/', ['get', 'gap'], 2]], ['==', ['get', ['&'], 'padding-bottom'], ['/', ['get', 'gap'], 2]], ['==', ['get', ['&'], 'border-radius'], ['get', 'radius']]]],
    'kitchen sink test; button'
  ],
  ['@h |~-~(#name)~-~| in(#cover) gap([gap]*2) !strong;',
    //[["<=",["+",["get",["#","cover"],"x"],["*",["get","gap"],2]],["get",["#","name"],"x"],"strong"],["<=",["+",["get",["#","name"],"right"],["*",["get","gap"],2]],["get",["#","cover"],"right"],"strong"]],
    ['@', 'h', '|', '~', '-', '~', '(', '#name', ')', '~', '-', '~', '|', 'in', '(', '#cover', ')', 'gap', '(', '[', 'gap', ']', '*', '2', ')', '!', 'strong'],
    'kitchen sink test; @h'
  ],
  ['@if #profile-card[width] >= #profile-card[height] {@v | -(#avatar)-(#name)- | in(#cover)gap([gap]) outer-gap([flex-gap]) {center-x: == #cover[center-x];}@h |-10-(#cover)-10-| in(#profile-card);@v | -10- (#cover)-(#follow)- | in(#profile-card)gap([gap]);#follow[center-x] == #profile-card[center-x];@h |-(#message)~-~(#follow)~-~(#following)-(#followers)-| in(#profile-card)gap([gap])!strong {&[top] == &:next[top];}}/* portrait profile-card */@else {@v | -(#avatar)-(#name)-(#follow)-(#message)-(#following)-(#followers)- | in(#cover)gap([gap])outer-gap([flex-gap]) {center-x: == #profile-card[center-x];}@h |-10-(#cover)-10-| in(#profile-card);@v |-10-(#cover)-10-| in(#profile-card);}',
    [['@', 'if', '#profile-card', '[', 'width', ']', '>=', '#profile-card', '[', 'height', ']', '{', '@', 'v', '|', '-', '(', '#avatar', ')', '-', '(', '#name', ')', '-', '|', 'in', '(', '#cover', ')', 'gap', '(', '[', 'gap', ']', ')', 'outer-gap', '(', '[', 'flex-gap', ']', ')', '{', 'center-x', ':', '==', '#cover', '[', 'center-x', ']', ';', '}', '@', 'h', '|', '-', '10', '-', '(', '#cover', ')', '-', '10', '-', '|', 'in', '(', '#profile-card', ')', ';', '@', 'v', '|', '-', '10', '-', '(', '#cover', ')', '-', '(', '#follow', ')', '-', '|', 'in', '(', '#profile-card', ')', 'gap', '(', '[', 'gap', ']', ')', ';', '#follow', '[', 'center-x', ']', '==', '#profile-card', '[', 'center-x', ']', ';', '@', 'h', '|', '-', '(', '#message', ')', '~', '-', '~', '(', '#follow', ')', '~', '-', '~', '(', '#following', ')', '-', '(', '#followers', ')', '-', '|', 'in', '(', '#profile-card', ')', 'gap', '(', '[', 'gap', ']', ')', '!', 'strong', '{', '&', '[', 'top', ']', '==', '&', ':', 'next', '[', 'top', ']', ';', '}', '}'], ['@', 'else', '{', '@', 'v', '|', '-', '(', '#avatar', ')', '-', '(', '#name', ')', '-', '(', '#follow', ')', '-', '(', '#message', ')', '-', '(', '#following', ')', '-', '(', '#followers', ')', '-', '|', 'in', '(', '#cover', ')', 'gap', '(', '[', 'gap', ']', ')', 'outer-gap', '(', '[', 'flex-gap', ']', ')', '{', 'center-x', ':', '==', '#profile-card', '[', 'center-x', ']', ';', '}', '@', 'h', '|', '-', '10', '-', '(', '#cover', ')', '-', '10', '-', '|', 'in', '(', '#profile-card', ')', ';', '@', 'v', '|', '-', '10', '-', '(', '#cover', ')', '-', '10', '-', '|', 'in', '(', '#profile-card', ')', ';', '}']],
    'kitchen sink test; the last one'
  ],

  ['^^^^^^^^[--my-margin-top] == ^^^[--my-margin-top]',
    ['==', ['get', ['^', 8], '--my-margin-top'], ['get', ['^', 3], '--my-margin-top']],
    ''
  ],
];

var colRowTests = [
  // for each case: [<input>, <needle-token-value>, <expected-col>, <expected-row>, desc]

  ['a', 'a', 0, 0, 'trivial start case'],
  ['a b c d', 'd', 6, 0, 'trivial case'],

  ['a\x0Db', 'b', 0, 1, 'CR newline case'],
  ['a\x0Ab', 'b', 0, 1, 'LF newline case'],
  ['a\x0Cb', 'b', 0, 1, 'FF newline case'],
  ['a\x0D\x0Ab', 'b', 0, 1, 'CRLF newline edge case'],

  ['a\n\n\n\nb', 'b', 0, 4, 'newlines case'],

  ['"frequently\\\x0Dbar" c', 'c', 5, 1, 'CR newline dstring case'],
  ['"frequently\\\x0Abar" c', 'c', 5, 1, 'LF newline dstring case'],
  ['"frequently\\\x0Cbar" c', 'c', 5, 1, 'FF newline dstring case'],
  ['"frequently\\\x0D\x0Abar" c', 'c', 5, 1, 'escaped CRLF cause one line'],
  ['"frequently\\\x0D\\\x0Abar" c', 'c', 5, 2, 'escaped CR and LF cause two lines'],

  ['\'frequently\\\x0Dbar\' c', 'c', 5, 1, 'CR newline sstring case'],
  ['\'frequently\\\x0Abar\' c', 'c', 5, 1, 'LF newline sstring case'],
  ['\'frequently\\\x0Cbar\' c', 'c', 5, 1, 'FF newline sstring case'],
  ['\'frequently\\\x0D\x0Abar\' c', 'c', 5, 1, 'escaped CRLF cause one line'],
  ['\'frequently\\\x0D\\\x0Abar\' c', 'c', 5, 2, 'escaped CR and LF cause two lines'],

  ['a/* \x0D */b', 'b', 3, 1, 'CR comment case'],
  ['a/* \x0A */b', 'b', 3, 1, 'LF comment case'],
  ['a/* \x0C */b', 'b', 3, 1, 'FF comment case'],
  ['a/* \x0D\x0A */b', 'b', 3, 1, 'CRLF comment edge case'],
  ['a/* \n\n\n\n */b', 'b', 3, 4, 'comment newlines case'],

  // fuzzed regressions
  ['/* "\' */ WALDO', 'WALDO', 9, 0, 'base case'],
  ['x\nx[]x};x\ a"xx[x;*;\n-;+x*\nxx\n/* "\' */ WALDO', 'WALDO', 9, 4],
  ['xx[x;*;\n-;+x*\nxx\n/* "\' */ WALDO', 'WALDO', 9, 3],
  ['x*\nxx\n/* "\' */ WALDO', 'WALDO', 9, 2],
  ['*;\n-;+x*\nxx\n/* "\' */ WALDO', 'WALDO', 9, 3],
  ['"\n/* "\' */ WALDO', 'WALDO', 9, 1, 'newline in string'],
  ['"\r\n/* "\' */ WALDO', 'WALDO', 9, 1, 'crlf in string'],
  ['\n/* "\' */ WALDO', 'WALDO', 9, 1],
  ['a :x"	xxx\'*}xx:xa])\:*xxaxx /* " */ WALDO', 'WALDO', 35, 0],
  ['}\nxxx\n]}\nx	({"\\n]\ {x( \;x[{x\n /*"/*\'*/ WALDO', 'WALDO', 10, 4],
  [':]x\r}a"\n")x	+\r[["{\fx\'[)xx:+{x\n /*"/*\'*/ WALDO', 'WALDO', 10, 5],
  ['}\f-\rx)x;)" x\\\n}+x(*xx\fx}x"((aa /*"/*\'*/ WALDO', 'WALDO', 18, 4],
  ['"\\\nx\fWALDO', 'WALDO', 0, 2, 'bad string with escaped newline and unescaped newline skips one'],
  ['"\\\nx"WALDO', 'WALDO', 2, 1, 'string with newline continuation'],
  ['"\nx\fWALDO', 'WALDO', 0, 2],
  ['\\)^).a))$+a~x "-*x\'."}}[]+x\n]"', '', 2, 1],
  ['xx [- ]([\'$~\f\\;#^x.{\' #$x^{(.', '', 16, 1],
  ['"]', '', 2, 0],
  [' "]', '', 3, 0],
  [')x "]', '', 5, 0],
  ['$\\*)x "]', '', 8, 0],
  ['{ xxa\\', '', 6, 0],
  ['x\\', '', 2, 0],
  ['\\*', '', 2, 0],
  ['"\\', '', 2, 0],
  ['[url(\n#$$+)	x	.$+.["', '', 14, 1],
  ['url(\nx)', '', 2, 1],
  ['url(x\n)', '', 1, 1],
  ['url(\nx\n)', '', 1, 2],
  ['url(\n"x")', '', 4, 1],
  ['url("x"\n)', '', 1, 1],
  ['url(\n"x"\n)', '', 1, 2],
  ['url(\n\'x\')', '', 4, 1],
  ['url(\'x\'\n)', '', 1, 1],
  ['url(\n\'x\'\n)', '', 1, 2],
  ['*\n\'{\f\r# x', '', 3, 3],
  ['+\n\furl(a\\[]', '', 8, 2],
  ['url(\\\nb)'],
  ['url(\nb)'],
  ['~url(#\n'],
  ['url("\f\f\f'],
  ['url(\n\f'],
  ['url(\n\n\f{$)['],
  ['url("\\x'],
  ['url("\\'],
  ['url("\f'],
  ['url(\'\\\r'],
  ['url("\\x\f'],
  ['url("\\x\\'],
  ['url("\\x\\\f'],
  ['url("\\\\'],
];

var parserFuzzerRegressions = [
  // these are invalid cases. but they shouldnt trip the browser. we dont care about their output (so true)
  ['xx}}]', NO_THROW_TEST, 'dont throw on fuzzer test'],
  ['a);--\\\n;	\\\\x', NO_THROW_TEST, 'dont throw on fuzzer test'],

  ['{ ^:*..$~\f#a', NO_THROW_TEST, 'dont throw on fuzzer test'],
  ['[a#	x^.x{.:', NO_THROW_TEST, 'dont throw on fuzzer test'],

  ['\'\\;.\f(\r#}+ \fxx.:*;)}-	*([}x ', NO_THROW_TEST],

  ['\r$}(	;..x\f\\.*\fx##&quot;{aurl(', NO_THROW_TEST],
  ['.&quot;x)\f\\\'x\'\r#*}:-&quot;{\\', NO_THROW_TEST],
  ['{:	.#x#;.{~;#::.', NO_THROW_TEST],
  ['\\;)-^-:[-}}\'\fx[\n~', NO_THROW_TEST],
  ['~url(x}.#\n', NO_THROW_TEST],
  ['\\\r*.ax::{$+', NO_THROW_TEST],
  [':\r\'\'. ^\furl((:a}.\n\')url("^\f\f\f::', NO_THROW_TEST],
];

var gracefulErrorTests = [
  // these should check whether the css parser properly skips to the next declaration or rule when a parse error occurs
  // they also check for the proper error to be thrown and are serve as red flags for when their error changes
  // ideally there would be at least one test case for every possible error in this group

  // when a css declaration fails, simple
  ['foo { a: b; c` }',
    ['rule', ['tag', 'foo'], [['set', 'a', ['get', 'b']], ['LEXER_ERROR[E_UNKNOWN_CHAR]']]],
    'bad declaration at end'
  ],
  ['foo { c`; a: b; }',
    ['rule', ['tag', 'foo'], [['LEXER_ERROR[E_UNKNOWN_CHAR]'], ['set', 'a', ['get', 'b']]]],
    'bad declaration at start'
  ],
  ['foo { a: b; c`; d: e; }',
    ['rule', ['tag', 'foo'], [['set', 'a', ['get', 'b']], ['LEXER_ERROR[E_UNKNOWN_CHAR]'], ['set', 'd', ['get', 'e']]]],
    'bad declaration in middle'
  ],


  ['foo { a: b; c`ignore: me; d: e; }',
    ['rule', ['tag', 'foo'], [['set', 'a', ['get', 'b']], ['LEXER_ERROR[E_UNKNOWN_CHAR]'], ['set', 'd', ['get', 'e']]]],
    'should discard entire middle declaration'
  ],
  ['foo { a: b; c$ignore: me; d: e; }',
    ['rule', ['tag', 'foo'], [['set', 'a', ['get', 'b']], ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], ['set', 'd', ['get', 'e']]]],
    'should discard entire middle declaration'
  ],
  ['foo { a: b; c^ignore: me; d: e; }',
    ['rule', ['tag', 'foo'], [['set', 'a', ['get', 'b']], ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], ['set', 'd', ['get', 'e']]]],
    'should discard entire middle declaration'
  ],
  ['foo { a: b; c%ignore: 20; d: e; }',
    ['rule', ['tag', 'foo'], [['set', 'a', ['get', 'b']], ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], ['set', 'd', ['get', 'e']]]],
    'should discard entire middle declaration'
  ],
  ['foo { a: b; c: )fail; d: e; }',
    ['rule', ['tag', 'foo'], [['set', 'a', ['get', 'b']], ['PARSER_ERROR[E_STATE_DECL_STOP]'], ['set', 'd', ['get', 'e']]]],
    'closing paren oops'
  ],
  ['foo { a: b; c: /*fail; d: e; }',
    ['rule', ['tag', 'foo'], [['set', 'a', ['get', 'b']], ['LEXER_ERROR[E_UNCLOSED_COMMENT]']]],
    'unclosed comment'
  ],

  ['10 <= 2 == 3 < 4 == 5',
    ['==', ['<', ['==', ['<=', 10, 2], 3], 4], 5],
    'chaining numbers, maybe should throw error?'
  ],

  ['a !> b == c;', ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], 'gss: !>'],
  ['a !~ b == c;', ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], 'gss: !~'],
  ['a !+ b == c;', ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], 'gss: !+'],
  ['a ++ b >= c;', ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], 'gss: all direct siblings'],
  ['a ~ b >= c;', ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], 'gss: all succeeding siblings'],
  ['a ~~ b >= c;', ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], 'gss all siblings'],

  ['a[b][c], b[c][d] == e', ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], 'toplevel comma is illegal'],
  ['.a.b c[d] == e', ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], '(toplevel space is illegal if parts can not be parsed as values)'],
  ['.a + b - c / d == foo', ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], 'class in calc mode'],

  ['(a,b) c == d', ['GSS_ERROR[E_GROUP_MISSING_OPEN]'], 'comma vars wrapped in parens with one unit is invalid?'],

  ['foo:bar == d', ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], 'error, `foo:bar` is always a selector, not a value. vars cannot have selectors applied'],
  ['*foo:bar == d', ['PARSER_ERROR[E_STAR_HACK_NO_GSS]'], 'star hack should never have gss artifacts (because so legacy)'],

  // tofix: add invalid virtual cases with single quotes

  ['[foo=15] {}', ['PARSER_ERROR[E_EXPECTING_ATTR_STRING_OR_IDENT]'], 'number as css attr value'],
  ['[foo=] {}', ['PARSER_ERROR[E_EXPECTING_ATTR_STRING_OR_IDENT]'], 'missing rhs of css attr assign'],
  ['[foo= {}]', [['PARSER_ERROR[E_EXPECTING_ATTR_STRING_OR_IDENT]'], ['PARSER_ERROR[E_UNKNOWN_SELECTOR_PUNC]']]],
  ['[foo=a b] {}', ['PARSER_ERROR[E_EXPECTING_ATTR_END]'], 'unquoted space in css attr value'],
  ['[foo="a"b] {}', ['PARSER_ERROR[E_EXPECTING_ATTR_END]'], 'nonstop token after css attr string value'],
  ['[foo="a" b] {}', ['PARSER_ERROR[E_EXPECTING_ATTR_END]'], 'nonstop token after css attr string value with space'],
  ['[b=+-a]', ['GSS_ERROR[E_INVALID_TOKEN_IN_ACC]'], 'css attr without body'],
  ['[b=+-a] {}', ['PARSER_ERROR[E_EXPECTING_ATTR_STRING_OR_IDENT]'], 'css attr with body and double dashed ident, becomes negative `-a`'],
  /* invalid: (according to mdn: https://developer.mozilla.org/en-US/docs/Web/CSS/font-family )
   div { font-family: Goudy Bookletter 1911, sans-serif; }', ['rule', ['tag', 'div'], []], 'element selector'],
   div { font-family: Red/Black, sans-serif; }', ['rule', ['tag', 'div'], []], 'element selector'],
   div { font-family: "Lucida" Grande, sans-serif; }', ['rule', ['tag', 'div'], []], 'element selector'],
   div { font-family: Ahem!, sans-serif; }', ['rule', ['tag', 'div'], []], 'element selector'],
   div { font-family: test@foo, sans-serif; }', ['rule', ['tag', 'div'], []], 'element selector'],
   div { font-family: #POUND, sans-serif; }', ['rule', ['tag', 'div'], []], 'element selector'],
   div { font-family: Hawaii 5-0, sans-serif; }', ['rule', ['tag', 'div'], []], 'element selector'],
   */
  /* invalid colors (from mdn)
   rgb(255, 0, 51.2)  ERROR! Don't use fractions, use integers
   rgb(100%, 0, 20%) ERROR! Don't mix up integer and percentage notation
   hsl/hsl with wrong % combos
   */

  // no space between hash and ident
  [wrap('color: # cde;'), wrap(['LEXER_ERROR[E_HASH_WITHOUT_IDENTIFIER]']), 'hex3'],
  [wrap('color: # 09abcd;'), wrap(['LEXER_ERROR[E_HASH_WITHOUT_IDENTIFIER]']), 'hex6'],
  [wrap('color: # 09abcdef;'), wrap(['LEXER_ERROR[E_HASH_WITHOUT_IDENTIFIER]']), 'alpha hex'],

  // lots of identifier tests due to opt-in (hex)

  // - and + as prefix but with whitespace (are not prefix)

  // calc() tests. +- must be space wrapped etc

  // illegal An+B variations
  ['li:nth-child(-2n+-5) {}', ['PARSER_ERROR[E_ANB_ONLY_ONE_OP_VALID_AFTER_N]'], 'an+b'],
  ['li:nth-child(-2n++5) {}', ['PARSER_ERROR[E_ANB_ONLY_ONE_OP_VALID_AFTER_N]'], 'an+b'],
  ['li:nth-child(8n--3) {}', ['PARSER_ERROR[E_ANB_ONLY_ONE_OP_VALID_AFTER_N]'], 'an-b'],
  ['li:nth-child(8n-+3) {}', ['PARSER_ERROR[E_ANB_ONLY_ONE_OP_VALID_AFTER_N]'], 'an-b'],
  ['li:nth-child(0n+-3) {}', ['PARSER_ERROR[E_ANB_ONLY_ONE_OP_VALID_AFTER_N]'], 'an-b'],
  ['li:nth-child(0n++3) {}', ['PARSER_ERROR[E_ANB_ONLY_ONE_OP_VALID_AFTER_N]'], 'an-b'],

  ['$foo {}', ['PARSER_ERROR[E_UNKNOWN_SELECTOR_PUNC]'], '$ is not a valid ident start'],
  ['-$foo', ['GSS_ERROR[E_UNEXPECTED_EOF]'], '$ with - is not a valid ident start'],
  ['0foo', ['foo', 0], 'number with unit (0px, 0 foo)'],
  ['-0foo', ['foo', 0], 'neg number with unit (0px, 0 foo)'],
  ['1foo', ['foo', 1], 'number with unit (0px, 0 foo)'],
  ['-1foo', ['foo', -1], 'neg number with unit (0px, 0 foo)'],
  ['2foo', ['foo', 2], 'number with unit (0px, 0 foo)'],
  ['-2foo', ['foo', -2], 'neg number with unit (0px, 0 foo)'],
  ['3foo', ['foo', 3], 'number with unit (0px, 0 foo)'],
  ['-3foo', ['foo', -3], 'neg number with unit (0px, 0 foo)'],
  ['4foo', ['foo', 4], 'number with unit (0px, 0 foo)'],
  ['-4foo', ['foo', -4], 'neg number with unit (0px, 0 foo)'],
  ['5foo', ['foo', 5], 'number with unit (0px, 0 foo)'],
  ['-5foo', ['foo', -5], 'neg number with unit (0px, 0 foo)'],
  ['6foo', ['foo', 6], 'number with unit (0px, 0 foo)'],
  ['-6foo', ['foo', -6], 'neg number with unit (0px, 0 foo)'],
  ['7foo', ['foo', 7], 'number with unit (0px, 0 foo)'],
  ['-7foo', ['foo', -7], 'neg number with unit (0px, 0 foo)'],
  ['8foo', ['foo', 8], 'number with unit (0px, 0 foo)'],
  ['-8foo', ['foo', -8], 'neg number with unit (0px, 0 foo)'],
  ['9foo', ['foo', 9], 'number with unit (0px, 0 foo)'],
  ['-9foo', ['foo', -9], 'neg number with unit (0px, 0 foo)'],
  ['\\\nfoo', ['LEXER_ERROR[E_CANNOT_ESCAPE_NEWLINE_HERE]'], 'escapes cannot escape newlines'],
  ['\\\rfoo', ['LEXER_ERROR[E_CANNOT_ESCAPE_NEWLINE_HERE]'], 'escapes cannot escape newlines'],
  ['\\\ffoo', ['LEXER_ERROR[E_CANNOT_ESCAPE_NEWLINE_HERE]'], 'escapes cannot escape newlines'],
  ['\\\r\nfoo', ['LEXER_ERROR[E_CANNOT_ESCAPE_NEWLINE_HERE]'], 'well whatever bad escapes newlines boom'],
  ['\\\n\rfoo', ['LEXER_ERROR[E_CANNOT_ESCAPE_NEWLINE_HERE]'], 'well whatever bad escapes newlines boom'],
  ['- {}', ['PARSER_ERROR[E_UNKNOWN_SELECTOR_TOKEN_TYPE]'], 'not a valid IDENT on its own'],
  ['"fo\nbar"', ['LEXER_ERROR[E_UNESCAPED_NEWLINE_IN_STRING]'], 'unescaped newline in string'],
  ['"fo\rbar"', ['LEXER_ERROR[E_UNESCAPED_NEWLINE_IN_STRING]'], 'unescaped newline in string'],
  ['"fo\fbar"', ['LEXER_ERROR[E_UNESCAPED_NEWLINE_IN_STRING]'], 'unescaped newline in string'],
  ['"fo\r\nbar"', ['LEXER_ERROR[E_UNESCAPED_NEWLINE_IN_STRING]'], 'unescaped newline in string'],
  ['"fo\n\rbar"', ['LEXER_ERROR[E_UNESCAPED_NEWLINE_IN_STRING]'], 'unescaped newline in string'],
  ['10.', ['LEXER_ERROR[E_NUMBER_WITH_DOT_MUST_HAVE_DECIMAL]'], 'NUMBER may not end with dot'],
  ['#', ['LEXER_ERROR[E_HASH_WITHOUT_IDENTIFIER]'], 'HASH must have identifier too'],
  ['5%20', ['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]'], 'NUMBER no space NUMBER'],

  // turns out non-ascii starts at 0x80, oh well.
  [1, '\x7foo', 'IDENT (first non-ascii start)'],
  [1, 'a\x7foo', 'IDENT (second non-ascii start)'],
  [1, '-\x7foo', 'IDENT (first non-ascii start)'],
  [1, '\\x7foo', 'IDENT (escaped 127, is ok)'],
  [1, 'a\\x7foo', 'IDENT (escaped 127, is ok)'],
  [1, '-\\x7foo', 'IDENT (escaped 127, is ok)'],
  [1, 'a-\x7foo', 'IDENT (non-ascii content)'],
  [1, '"f\x7foo"', '127 in STRING'],
  [1, '#\x7ffoo', 'HASH identifier can have 127'],

  ['dance(< 1, >= 1) jump(== 2) fall(+ 3, * 3, - my-func(1), / my-var);',
    //[["dance",["<",1],[">=",1]],["jump",["==",2]],["fall",["+",3],["*",3],["-",["my-func",1]],["/",["get","my-var"]]]],
    ['GSS_ERROR[E_UNEXPECTED_ATOM]'], // this syntax has been deprecated
    'legacy test'
  ],

  ['div { *\\x:=', ['rule', ['tag', 'div'], [['PARSER_ERROR[E_UNEXPECTED_GSS_TOKEN_IN_CSS_VALUE]']]], 'missing gss decl value rhs'],

  ['"foo" == 10;', [], 'virtuals must have an accessor'],
  ['x + "foo" == 10;', [], 'virtuals must have an accessor'],
  ['x + "foo" == 10;', [], 'virtuals must have an accessor'],

  ['a/* crap */b {}',
    ['PARSER_ERROR[A_IDENT_WITHOUT_COMBINATOR]'],
    'comment does not count as whitespace (doesnt even make sense)'
  ],

  ['abc { color: background: #abc }',
    ['rule', ['tag', 'abc'], [['PARSER_ERROR[E_COLON_INVALID_IN_DECL_VALUE]']]],
    'second colon is illegal'
  ],
  [
    wrap('background-image: background-image: radial-gradient(16px at 60px 50% , #000000 0%, #000000 14px, rgba(0, 0, 0, 0.3) 18px, rgba(0, 0, 0, 0) 19px);'),
    ['rule', ['tag', 'divv'], [['PARSER_ERROR[E_COLON_INVALID_IN_DECL_VALUE]']]],
    'second colon is illegal'
  ],

  [[
    'a { b { c:foo() == d } }',
    'a { b { c:foo() == d; }; }', // for peg
  ],
    ['rule', ['tag', 'a'], [['rule', ['tag', 'b'], [['GSS_ERROR[E_GSS_UNEXPECTED_TOKEN]']]]]], // foo() is not a value...
    'double nesting with gss rule inside and a red herring colon but still a rule, not declaration'
  ],
];

var parserTestsOk = [].concat(
  parserSimpleSelectorTests,
  parserSimpleDeclarationTests,
  parserSimpleNumberValueTests,
  parserAtRuleTests,
  parserMultiRules,
  gssRuleTests,
  gssPropertyTests,
  ccssOldTests,
  parserFuzzerRegressions
);

function wrap(body, multi) {
  if (typeof body === 'string') return 'divv { ' + body + ' }';
  return ['rule', ['tag', 'divv'], multi || !body.length ? body : [body]];
}
function val(value) {
  if (typeof value === 'string') return 'divd { prop: ' + value + ' }';
  return ['rule', ['tag', 'divd'], [['set', 'prop', value]]];
}
