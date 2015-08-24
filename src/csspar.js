// http://www.w3.org/TR/CSS21/syndata.html
// http://www.w3.org/TR/css-syntax-3/
// http://dev.w3.org/csswg/css-syntax-3/
// http://www.w3.org/TR/css3-fonts/
// http://dev.w3.org/csswg/selectors-4/

//BUILD_REMOVE_BEGIN
// these lines can be dropped in the build because all debug logging is stripped as well
var VERBOSE; // when false, suppresses logging
var LOG = function(){ if (VERBOSE) console.log.apply(console, arguments); };
var WARN = function(){ if (VERBOSE) console.warn.apply(console, arguments); };
var ERROR = function(){ if (VERBOSE) console.error.apply(console, arguments); };
//BUILD_REMOVE_END

function CSSPar(input) {
  var _nextFromLexer = CSSTok(input);

  function nextFromLexer() {
    var t = _nextFromLexer();

    if (t.type === TOKEN_ERROR) {
      $current = t;
      throw 'LEXER_ERROR['+t.error+']';
    }

    return t;
  }

  var TOKEN_NONE = 0;
  var TOKEN_INCLUDES = 1;
  var TOKEN_DASHMATCH = 2;
  var TOKEN_PREFIXMATCH = 3;
  var TOKEN_SUFFIXMATCH = 4;
  var TOKEN_SUBSTRINGMATCH = 5;
  var TOKEN_IDENT = 6;
  var TOKEN_STRING = 7;
  var TOKEN_FUNCTION = 8;
  var TOKEN_NUMBER = 9;
  var TOKEN_HASH = 10;
  var TOKEN_PLUS = 11;
  var TOKEN_GREATER = 12;
  var TOKEN_COMMA = 13;
  var TOKEN_TILDE = 14;
  var TOKEN_COLON = 15;
  var TOKEN_AT = 16;
  var TOKEN_INVALID = 17;
  var TOKEN_PERCENTAGE = 18;
  var TOKEN_DASH = 19;
  var TOKEN_CDO = 20;
  var TOKEN_CDC = 21;
  var TOKEN_WHITESPACE = 22;
  var TOKEN_EOF = 23;
  var TOKEN_ERROR = 24;
  var TOKEN_COMMENT = 25;
  var TOKEN_NEWLINE = 27;
  var TOKEN_DOT = 28;
  var TOKEN_PUNCTUATOR = 29;
  var TOKEN_URL = 30;
  var TOKEN_BAD_URL = 31;

  var CONSUMED_PREFIX = true;
  var NO_PREFIX = false;
  var FOR_PSEUDO = true;
  var DECL_INSIDE_BODY = false;
  var TOP_LEVEL_DECL = true;
  var CONSUME_CURRENT_TOO = true;

  var $atSkip = ['v', 'h', 'if'];

  // init

  // a stack to push tokens while scanning forward to determine gss vs css
  // as long as `cached` has items, use the first one rather than calling nextFromLexer()
  var $cached = [];
  // the current token being evaluated (the "next" token, kinda).
  // init on first rule parse (because of throw trapping)
  var $current = undefined;
  // debugging? the token stream.
  var $allTokens = CSSPar['allTokens'] = [];

  function consume() {
    var was = $current;
    ERROR('>consume', $current._, $current.value);
    if ($cached.length) {
      $current = $cached.shift();
    } else {
      $current = nextFromLexer();
      $allTokens.push($current);
    }

    return was;
  }
  function consumeAndSuppressErrors() {
    ERROR('>seek', $current._, $current.value);
    if ($cached.length) {
      $current = $cached.shift();
    } else {
      try {
        $current = nextFromLexer();
      } catch(e) {
        LOG('suppressed from lexer: ', e);
      }
      $allTokens.push($current);
    }
  }
  function initCurrent() {
    $current = nextFromLexer();
    $allTokens.push($current);
  }
  function peek() {
    var t = _nextFromLexer();
    LOG('PEEK', t);
    $allTokens.push(t);
    $cached.push(t);
    return t;
  }

  function parseRules() {
    LOG('parseRules', $current);
    var group = [];

    do {
      group.push(parseRule());
    } while ($current.type !== TOKEN_EOF);

    if (group.length === 1) return group[0];
    return group;
  }
  function parseRule() {
    LOG('parseRule', $current);
    try {
      return parseRuleUnsafe();
    } catch (e) {
      return parseErrorRule(e);
    }
  }
  function parseRuleUnsafe() {
    if (!$current) $current = nextFromLexer(); // should only happen once, at start of parsing
    LOG('parseRuleUnsafe', $current);
    switch ($current.type) {
      case TOKEN_AT:
        return parseAtRule();
      default:
        return parseCssOrGssRule();
    }
  }
  function parseErrorRule(e) {
    LOG('parseErrorRule', e);
    // if e === LEXER, lexer threw up and current should be the error token
    // if e === PARSER, there was an anticipated parse error
    // otherwise we dont know whats up...

    // whatever the cause, proceed to parse tokens until the end of a rule is found
    // that should be the first `}`, `;`, or EOF token

    // return an array with 'ERROR' and all tokens, flat

    if (typeof e !== 'string') e = 'UNKNOWN_ERROR';

    while ($current) {
      if ($current.type !== TOKEN_ERROR) {
        if ($current.value === ';' || $current.value === '}') {
          consumeAndSuppressErrors(); // remove the closing token as well
          break;
        }
        if ($current.type === TOKEN_EOF) break;
      }
      consumeAndSuppressErrors();
    }

    ERROR('CSSPar error');
    return [e];
  }
  function parseCssOrGssRule() {
    LOG('parseCssOrGssRule', $current);
    // "not an At rule", so a css or gss rule
    // scan forward to determine which type of rule to parse, then parse it
    // for gss we parse right-to-left so we'll need scan to the `;` anyways
    if ($cached.length) {
      // this happens for nested rules... or it may indicate somethings a bit wonky :/
      // unknown state so clear the cache, consume a token, continue parsing.
      $cached.length = 0;
      return error('A_CACHE_SHOULD_BE_EMPTY', CONSUME_CURRENT_TOO);
    }

    return parseDeclOrCssOrGssRule(TOP_LEVEL_DECL);
  }
  function parseDeclOrCssOrGssRule(declMode) {
    LOG('parseDeclOrCssOrGssRule', declMode, $cached.length);
    // this function can be called at the start of a top
    // level rule or at the start of a nested rule

    var stopToken = seekRuleOrDeclarationStop();
    LOG('stop token =', stopToken);

    if ($cached.length && $cached[$cached.length-1] !== stopToken) {
      LOG($cached.length);
      LOG($cached);
      LOG(stopToken);
      return error('A_STOP_SHOULD_BE_IN_CACHE_LIST');
    }

    // css rule is quite simple and irrefutable
    if (stopToken.value === '{') {
      LOG('css rule, because {');
      return parseCssRule();
    }

    if (stopToken.value === '{') {
      LOG('css rule because stop is {');
      return parseCssRule();
    }

    // note: first token is `$current`, so first token in cache is "next token"
    if ($current.type === TOKEN_IDENT && $cached.length && $cached[0].type === TOKEN_COLON) {
      if (declMode === TOP_LEVEL_DECL) {
        // only parse as gss if token after colon is a constraint op...
        if ($cached[1] && isConstraintOp($cached[1].value)) {
          LOG('gss decl because second token is colon and we are at top rule level');
          return parseGssTopDecl();
        }
      }
      if (declMode === DECL_INSIDE_BODY) {
        LOG('css decl because second token is colon and we are inside a body');
        return parseDeclaration();
      }

      if (declMode !== TOP_LEVEL_DECL) return error('E_MISSING_DECL_MODE');
    }

    if (stopToken === $current) {
      // unexpected input. consume as error block and move on.
      WARN('stop token is current token. Invalid input?', $current);
      return error('E_UNKNOWN_DECL_START', CONSUME_CURRENT_TOO);
    }

    // natural or explicit declaration stops (semi, closing curly, eof) are inconclusive

    if (stopToken.value === ';' || stopToken.value === '}' || (stopToken.type === TOKEN_EOF && $cached.length > 1)) {
      LOG('gss rule, because %o or EOF', stopToken.value);
      return parseGssRule();
    }

    LOG('css rule because not gss rule');
    return parseCssRule();
    //if (stopToken.type !== TOKEN_EOF) return error('E_UNKNOWN_DECL_STATE', CONSUME_CURRENT_TOO);

    //// should skip to first next end of declaration... (basically ditch the cache)
    //error('E_UNEXPECTED_DECL_START', CONSUME_CURRENT_TOO);
  }
  function parseGssRule() {
    LOG('parseGssRule', $current);
    $cached.unshift($current);
    var curly = undefined; // if a closing curly caused seeking to stop, pop it and set it as current when resuming. its not part of the gss but goes after it. fugly hack :(
    if ($cached[$cached.length-1].value === '}') {
      curly = $cached.pop();
    }

    if (!$cached || !$cached.length) error('E_CACHE_VALIDATED_CANNOT_BE_EMPTY'); // TOFIX: what if above pushes/pops a `}` onto empty cache?
    var gssRuleTokens = $cached;
    $cached = [];

    try {
      var tree = GSSPar(gssRuleTokens, input);
    } catch (e) {
      ERROR('GSSPar threw error', e);
      if (curly) $current = curly;
      else initCurrent();
      return [e];
    }
    // note: the !require encoding is fine as is, except we need to drop the !
    if (tree.length && tree[tree.length-1] === '!') tree.pop(); // drop the !
    if (curly) $current = curly;
    else initCurrent();
    return tree;
  }
  function parseGssTopDecl() {
    LOG('parseGssTopDecl', $current);
    if (!$cached[0]) return error('A_CACHE_MISSING_COLON_SHOULD_BE_VALIDATED');
    if ($cached[0].type !== TOKEN_COLON) return error('A_CACHE_MISSING_COLON_SHOULD_BE_VALIDATED');
    $cached.shift(); // drop the colon

    var name = $current.value;

    if (!$cached[0]) return error('E_GSS_TOP_DECL_MISSING_VALUE');
    $current = $cached.shift(); // parseGssValue expects $current to be the op

    return parseGssValue(name);
  }
  function seekRuleOrDeclarationStop() {
    LOG('seekRuleOrDeclarationStop', $current);

    var p = $current;
    var lastError = undefined;
    if ($current.type === TOKEN_ERROR) lastError = $current;
    while (LOG('seeking', p), p.type !== TOKEN_EOF) {
      if (p.type === TOKEN_PUNCTUATOR) {
        if (p.value === ';') break;
        if (p.value === '}') break;
        if (p.value === '{') break;
      }
      p = peek();
      if (p.type === TOKEN_ERROR) lastError = p;
    }
    LOG('stopped at:', p);
    if (lastError) {
      WARN('LEXER ERROR', lastError.error);
      throw 'LEXER_ERROR['+lastError.error+']';
    }
    return p;
  }

  function parseCssRule() {
    LOG('parseCssRule', $current);
    // parse selectors, at least one, delimited by combinators, commas, and the body
    // parse a body with any number of declarations

    return ['rule', parseCssSelectors(), parseDeclarations()];
  }
  function parseCssSelectors() {
    var part = parseCssSelector();

    if ($current.type !== TOKEN_COMMA) return part;

    if (part[0] === ',') {
      part.unshift(); // remove the comma
      return _parseCssSelectors(part);
    }

    return _parseCssSelectors([',', part]);
  }
  function _parseCssSelectors(selectors) {
    var last = null;
    while ($current.type === TOKEN_COMMA) {
      if (last === $current) return error('A_SHOULD_HAVE_PARSED_SOMETHING');
      last = $current;
      consume(); // comma
      var rhs = parseCssSelector();
      if (rhs.length === 1 && rhs[0] instanceof Array) rhs = rhs[0];
      if (rhs[0] === ',') {
        rhs.shift(); // comma
        while (rhs.length) selectors.push(rhs.shift());
      } else {
        selectors.push(rhs);
      }
    }
    return selectors;
  }
  function parseCssSelector(group, pseudo) {
    if (!group) group = [];
    var start = true;
    var lastWasCombinator = false;
    var now = undefined;
    while (now !== $current) {
      now = $current;
      switch (now.type) {
        case TOKEN_PUNCTUATOR:
          switch (now.value) {
            case '{': // body, end of rule preamble
              if (!group.length) return error('E_EMPTY_SELECTOR');
              return group.length > 1 ? group : group[0]; // delimits the selector (consumed by caller)
            case '*':
              if (!start && !lastWasCombinator && now.pbws) group.push([' ']);
              group.push(parseSelectorValue(NO_PREFIX));
              break;
            case '[': // attr
              consume();
              if (!start && !lastWasCombinator && now.pbws) group.push([' ']);
              group.push(parseAttribute());
              break;
            case ')': // inside pseudo call or regular () group
              return group;
            case '(':
              parseGroup(group);
              break;

              //group.push([now.value], parseSelectorValue(NO_PREFIX));
            default:
              return error('E_UNKNOWN_SELECTOR_PUNC');
          }
          break;
        case TOKEN_COMMA:
          if (!group.length) return error('E_EMPTY_SELECTOR');
          return group.length > 1 ? group : group[0]; // comma delimits a selector (consumed by caller)
        case TOKEN_COLON:
          if (!start && !lastWasCombinator && now.pbws) group.push([' ']);
          group.push(parsePseudo());
          break;
        case TOKEN_GREATER:
        case TOKEN_PLUS:
        case TOKEN_TILDE:
          consume(); // the combinator
          group.push([now.value]);
          lastWasCombinator = true;
          break;
        case TOKEN_IDENT:
          // pretty sure there should always be a space before a second identifier
          if (!start && !lastWasCombinator && !now.pbws) return error('A_IDENT_WITHOUT_COMBINATOR');// Expected combinator to precede a regular identifier as non-first selector condition
          // fall-through
        case TOKEN_DOT:
        case TOKEN_HASH:
          if (!start && !lastWasCombinator && now.pbws) group.push([' ']);
          group.push(parseSelectorValue(NO_PREFIX)); // dot, hash, identifier (!)
          break;
        case TOKEN_EOF:
          if (!group.length) return error('E_EMPTY_SELECTOR');
          return group.length > 1 ? group : group[0]; // delimits the selector (consumed by caller)
        case TOKEN_NUMBER:
          consume();
          if (!pseudo) return error('E_NUMBER_IN_SELECTOR');
          group.push(parseFloat(now.value));
          return group.length > 1 ? group : group[0]; // delimits the selector (consumed by caller)
        case TOKEN_STRING: // gss extension
          // double quotes are virtuals. single quotes are strings
          if ($current.value[0] === '"') {
            if (!start && !lastWasCombinator && now.pbws) group.push([' ']);
            var value = consume().value.slice(1, -1);
            if (value.indexOf('...') > 0) {
              // find range, extrapolate values. expensive regex. but it's an edge case so w/e
              var list = [];
              value.replace(/([\s\S]*)(\d+)\.\.\.(\d+)([\s\S]*)/g, function(match, prefix, left, right, suffix){
                var from = parseFloat(left);
                var to = parseFloat(right);
                if (from >= 0 && to <= Infinity) {
                  for (var i=from; i<=to; ++i) {
                    list.push(['virtual', prefix + i + suffix]);
                  }
                }
              });
              // if only no value, it's probably not a range? just include as is... (edge case, maybe not?)
              if (!list.length) {
                group.push(['virtual', value]);
              } else {
                // include range as a comma list
                list.unshift(',');
                group.push(list);
              }
            } else {
              group.push(['virtual', value]);
            }
          } else {
            group.push(consume().value.slice(1, -1));
          }
          break;

        default:
          return error('E_UNKNOWN_SELECTOR_TOKEN_TYPE');
      }
      start = false;
    }

    return error('E_UNKNOWN_SELECTOR_TOKEN_TYPE');
  }
  function parseSelectorValue(_alreadyPrefixed) {
    var now = $current;
    consume(); // all branches will consume anyways
    switch (now.type) {
      case TOKEN_DOT:
        if (_alreadyPrefixed) return error('E_DOT_AFTER_PREFIX');
        return ['.', parseSelectorValue(CONSUMED_PREFIX)];
      case TOKEN_HASH:
        if (_alreadyPrefixed) return error('E_DOT_AFTER_PREFIX');
        return ['#', now.value.slice(1)];
      case TOKEN_IDENT:
        if (_alreadyPrefixed) return now.value;
        return ['tag', now.value];
      case TOKEN_PUNCTUATOR:
        if (_alreadyPrefixed) return error('E_ANOTHER_PUNC_AFTER_PREFIX');
        switch (now.value) {
          case '*':
            if (_alreadyPrefixed) return '*';
            return ['tag', '*'];
          case '[':
            return parseAttribute();
          default:
            return error('A_UNEXPECTED_PUNC_AS_SELECTOR_VALUE');
        }
        break;
    }
    return error('E_UNKNOWN_SELECTOR_VALUE_TOKEN');
  }
  function parseGroup(group) {
    consume(); // (
    var parented = parseCssSelectors();
    group.push(parented.length === 1 ? parented[0] : parented);
    if ($current.value !== ')') return error('E_GROUP_END_EXPECTED');
    consume(); // )
  }
  function parsePseudo() {
    consume(); // :
    var dbl = $current.type === TOKEN_COLON;
    if (dbl) consume(); // skip the second colon
    if ($current.type !== TOKEN_IDENT) return error('E_PSEUDO_NO_IDENT_AFTER_COLON');
    var ident = consume().value;
    // alias `this` to `&`, otherwise always normalize to one colon, even if there were two
    var arr = (dbl && ident === 'this') ? ['&'] : [':' + ident];
    if ($current.value === '(') {
      // parse parens, call arguments
      consume(); // (

      parseSelectorStart(arr);

      if ($current.value !== ')') return error('E_PSEUDO_EXPECTED_END');
      consume(); // )
    }

    return arr;
  }
  function parseSelectorStart(group) {
    // odd => <2, 1>
    // even => <2, 0>
    // n => <1, 0>
    // +n => <1, 0>
    // -n => <-1, 0>
    // An+B => <A, B>
    // -An+B => <-A, B>
    // +An+B => <A, B>
    // n+B => <A, B>
    // -n+B => <-1, B>
    // +n+B => <1, B>
    // An-B => <A, -B>
    // -An-B => <-A, -B>
    // +An-B => <A, -B>
    // n-B => <1, -B>
    // +n-B => <1, -B>
    // -n-B => <-1, -B>
    // An => <A, 0>
    // +An => <A, 0>
    // -An => <-A, 0>
    // B => <0, B>
    // +B => <0, B>
    // -B => <0, -B>
    // the `+n` may not have whitespace
    // the n must be followed by a signed or unsigned number or neither. double or trailing ops are not allowed.

    var neg = false;
    if ($current.type === TOKEN_PLUS) consume(); // skip leading plus. it's dead code.
    else if ($current.type === TOKEN_DASH) { neg = true; consume(); } // store negative. we may need it

    // cases left (A may be -A):
    // odd => <2, 1>
    // even => <2, 0>
    // n => <1, 0> (ignored, becomes ['-', 'n'])
    // An+B => <A, B>
    // n+B => <A, B>
    // An-B => <A, -B>
    // n-B => <1, -B>
    // An => <A, 0>
    // B => <0, B>

    // okay we expect either: a number, `n`, or we bail on An+B parsing

    var A = undefined;
    if ($current.type === TOKEN_NUMBER) {
      A = parseFloat(consume().value);
      if (neg) {
        neg = false;
        A = -A;
      }
    }

    // cases left (A may be -A):
    // odd => <2, 1>
    // even => <2, 0>
    // n => <1, 0> (ignored, becomes ['-', 'n'])
    // n+B => <A, B>
    // n-B => <A, -B>
    // B => <0, B>

    // we'll need this to check whether we parsed any number for A at all
    var hasExplicitA = A !== undefined;

    // A is optional, if so the `n` means 1
    // if this does not turn out to be AnB, A is ignored
    if (!hasExplicitA) { // because 0n really means A=0
      A = 1;
    }
    if (neg) {
      neg = false;
      A = -A;
    }

    // anb? in that case we must have `n` now:
    if ($current.type === TOKEN_IDENT && $current.value === 'n') {
      consume(); // n

      // parsing for B at this point

      // a succeeding number is optional at this point
      if ($current.type === TOKEN_PLUS) {
        neg = false;
        consume(); // +
        if ($current.type === TOKEN_PLUS || $current.type === TOKEN_DASH) return error('E_ANB_ONLY_ONE_OP_VALID_AFTER_N');
      } else if ($current.type === TOKEN_DASH) {
        neg = true;
        consume(); // -
        if ($current.type === TOKEN_PLUS || $current.type === TOKEN_DASH) return error('E_ANB_ONLY_ONE_OP_VALID_AFTER_N');
      } else if ($current.type !== TOKEN_NUMBER) {
        if ($current.value === '++') return error('E_ANB_ONLY_ONE_OP_VALID_AFTER_N');
        if (hasExplicitA) return group.push(['anb', A, 0]); // no number trailing

        // only parsed an `n`, ignore the A, dont push as `anb`
        // note: there was no A so A will be 1 or -1
        if (A === -1) group.push(['-', 'n']);
        else group.push('n');
        return;
      }

      if ($current.type !== TOKEN_NUMBER) return error('E_ANB_MISSING_NUM_AFTER');

      var B = parseFloat(consume().value);
      if (neg) B = -B;

      return group.push(['anb', A, B]);
    }
    if ($current.type === TOKEN_IDENT && $current.value[0] === 'n' && $current.value[1] === '-') {
      // edge cases. since css idents can contain dashes, the `an-b` case will parse the `n-b` part as a single identifier.
      // validate some forms we recognise here (slow path due to regexes)
      if ($current.value === 'n-') { // only okay if next token is number (wont be joined due to whitespace)
        consume(); // n-
        if ($current.type === TOKEN_PLUS || $current.type === TOKEN_DASH) return error('E_ANB_ONLY_ONE_OP_VALID_AFTER_N');
        if ($current.type !== TOKEN_NUMBER) return error('E_ANB_MISSING_NUM_AFTER');

        // note: B is negated!
        return group.push(['anb', A, -parseFloat(consume().value)]);
      }

      if ($current.value[2] === '-') return error('E_ANB_ONLY_ONE_OP_VALID_AFTER_N');

      var match = $current.match(/^n\-(\d+)$/);
      if (match) {
        consume(); // n-N+

        // note: B is negated! match contains the digits
        return group.push(['anb', A, -parseFloat(match[1])]);
      }


      // ident starts with `n-` and doesnt have a number;
      return error('E_ANB_MISSING_NUM_AFTER');
    }

    // not anb. if we just parsed a + or - and a number; return them
    if (hasExplicitA) return group.push(neg ? -A : A);
    if (neg) return error('E_UNEXPECTED_DASH');

    // maybe two tokens?
    if ($current.value === 'even') {
      consume(); // even
      return group.push(['anb', 2, 0]);
    }
    if ($current.value === 'odd') {
      consume(); // odd
      return group.push(['anb', 2, 1]);
    }

    // not AnB
    parseCssSelector(group, FOR_PSEUDO);
  }
  function parseAttribute() {
    // this one is a bit weird. the stuff we've collected in `group` so far will be
    // used as the argument to `get` for the attr. the result of this call to parseSelector
    // will be the `get` stuff, and will be returned

    // [foo]
    // [foo]
    // [foo="bar"]
    // [foo~="bar"]
    // [foo^="bar"]
    // [foo$="bar"]
    // [foo*="bar"]
    // [foo|="en"]

    if ($current.type !== TOKEN_IDENT) return error('E_ATTR_START_IDENT');

    var name = consume();

    var op = $current.value;
    switch (op) {
      case '=':
      case '~=':
      case '^=':
      case '$=':
      case '*=':
      case '|=':
        consume(); // op
        if ($current.type !== TOKEN_STRING && $current.type !== TOKEN_IDENT) return error('E_EXPECTING_ATTR_STRING_OR_IDENT');
        var rhs = consume();
        if ($current.value !== ']') return error('E_EXPECTING_ATTR_END');
        consume(); // ]
        return [op, name.value, rhs.type === TOKEN_IDENT ? rhs.value : rhs.value.slice(1, -1)];
    }

    if ($current.value !== ']') return error('E_EXPECTING_ATTR_END');
    consume();
    return ['[]', name.value];
  }

  function parseDeclarations() {
    LOG('parseDeclarations', $current);
    var group = [];
    if ($current.value !== '{') return error('E_CSS_RULE_MISSING_BODY');
    consume(); // {

    var lastCurrent = undefined;
    while ($current.value !== '}' && $current.type !== TOKEN_EOF && $current !== lastCurrent) {
      lastCurrent = $current; // make sure something got consumed. pretty useless to run this again otherwise.
      var d = parseDeclarationOrNestedRule();
      // d may be empty, like stand-alone semi's
      if (d) group.push(d);
    }

    if ($current.type !== TOKEN_EOF) {
      if ($current.value !== '}') return error('E_EXPECTING_DECLARATION_END');
      consume(); // }
    }

    // note: dont do the unwrapping here. the outer-most list of declarations should always be a list of them
    return group;
  }
  function parseDeclarationOrNestedRule() {
    LOG('parseDeclarationOrNestedRule', $current);
    try {
      return parseDeclarationOrNestedRuleUnsafe();
    } catch (e) {
      return parseErrorDeclarationOrNestedRule(e);
    }
  }
  function parseErrorDeclarationOrNestedRule(e) {
    LOG('parseErrorDeclarationOrNestedRule', $current);
    if (typeof e !== 'string') e = 'UNKNOWN_ERROR';

    // there are probably cases where errors leave the cache filled which can cause assertion errors down the line

    while ($current) {
      if ($current.type !== TOKEN_ERROR) {
        if ($current.value === ';' || $current.value === '}') break;
        if ($current.type === TOKEN_EOF) break;
      }
      consume();
    }

    ERROR('CSSPar error');
    return [e];
  }
  function parseDeclarationOrNestedRuleUnsafe() {
    LOG('parseDeclarationOrNestedRuleUnsafe', $current);

    if ($current.type === TOKEN_IDENT) return parseDeclOrCssOrGssRule(DECL_INSIDE_BODY);

    // strings are virtuals (gss custom), so a nested (gss) rule
    // dot (class) and hash indicate nested rule
    if ($current.type === TOKEN_STRING || $current.type === TOKEN_DOT || $current.type === TOKEN_HASH) {
      return parseDeclOrCssOrGssRule(DECL_INSIDE_BODY);
    }

    switch ($current.value) {
      case '@':
        return parseAtRule();

      case '*':
        // *zoom is an old IE hack
        consume(); // *
        // always a declaration, not a rule
        return ['***', parseDeclaration()];

      case ';':
        LOG('empty declaration is ignored');
        // well a semi is just an empty rule, so skip that
        consume(); // ;
        return;

      // $^& are custom gss tag atoms
      case '&':
      case '$':
      case '^':
        return parseDeclOrCssOrGssRule(DECL_INSIDE_BODY);
    }

    return error('E_DECL_UNKNOWN_NON_IDENT_START', CONSUME_CURRENT_TOO);
  }
  function parseDeclaration() {
    LOG('parseDeclaration', $current);

    // next two tokens should be validated to be IDENT and COLON now
    if ($current.type !== TOKEN_IDENT) return error('E_MUST_BE_IDENT');

    var prop = consume().value;
    if ($current.type !== TOKEN_COLON) return error('E_MUST_BE_COLON');
    consume(); // :
    LOG('SET', prop, ':', $current.value);

    // gss values dont return `set`s
    if (isConstraintOp($current.value)) {
      return parseGssValue(prop);
    }

    var value = parseDeclarationValue(null, '');

    if ($current.value === ';') consume();
    else if ($current.value !== '}' && $current.type !== TOKEN_EOF) return error('E_STATE_DECL_STOP');

    // hacks: parse min/max-width/height as ccss equivalents
    if (prop === 'min-width') return ['>=', ['get', 'width'], value];
    if (prop === 'max-width') return ['<=', ['get', 'width'], value];
    if (prop === 'min-height') return ['>=', ['get', 'height'], value];
    if (prop === 'max-height') return ['<=', ['get', 'height'], value];

    // assert: current cannot be error nor have a child that is an error token
    return ['set', prop, value];
  }
  function parseDeclarationValue(commas, funcName) {
    LOG('parseDeclarationValue', $current);
    var group = [];
    if (!commas) commas = [];
    while ($current.value !== ';' && $current.value !== '}' && $current.value !== ')' && $current.type !== TOKEN_EOF) {
      var invertFlag = 1;
      var now = $current;
      switch ($current.type) {
        case TOKEN_COMMA:
          commas.push(group.length === 1 ? group[0] : group);
          group = [];
          consume(); // comma
          break;

        case TOKEN_DASH:
          invertFlag = -1;
        // fall-through
        case TOKEN_PLUS:
          var op = $current;
          consume(); // + or -

          if ($current.type !== TOKEN_NUMBER) {
            if ($current.value === '(') {
              consume();
              // calc syntax
              group.push(op.value, parseDeclarationValue(null, funcName));
              if (consume().value !== ')') return error('E_PSEUDO_EXPECTED_END');
              break;
            }
            group.push(now.value);
            break;
          } else if ($current.pbws) {
            group.push(now.value);
            break;
          }
        // fall-through
        case TOKEN_NUMBER:
          var value = parseFloat(consume().value);
          if ($current.type === TOKEN_IDENT || $current.type === TOKEN_PERCENTAGE) {
            // http://www.w3.org/TR/css3-values/
            switch ($current.value) {
              // http://www.w3.org/TR/css3-values/ 8.1.1
              case '%':
              case 'em':
              case 'ex':
              case 'ch':
              case 'rem':
              case 'vw':
              case 'vh':
              case 'vmin':
              case 'vmax':
              case 'cm':
              case 'mm':
              case 'in':
              case 'px':
              case 'pt':
              case 'pc':
              case 'deg':
              case 'rad':
              case 'turn':
              case 's':
              case 'ms':
              case 'Hz':
              case 'kHz':
              case 'dpi':
              case 'dpcm':
              case 'dppx':
                // we could apply clamps here but i think they also/mainly depend on the property
                value = [consume().value, value * invertFlag];
                break;
              default:
                value *= invertFlag;
            }
          } else {
            value *= invertFlag;
          }
          group.push(value);
          break;

        case TOKEN_PUNCTUATOR:
          if ($current.value === '(') {
            consume(); // (
            // calc syntax
            group.push(parseDeclarationValue(null, funcName));
            if (consume().value !== ')') return error('E_PSEUDO_EXPECTED_END');
          } else {
            var val = consume().value;
            group.push(val);
            if (val === '!') group.push(consume().value);
          }
          break;

        case TOKEN_HASH:
          group.push(['hex', $current.value.slice(1)]);
          consume(); // #xxxx
          break;

        case TOKEN_IDENT:
          var name = consume().value;
          if ($current.value === '(') {
            // may have to revise this part
            group.push(parseArguments(name));
          } else {
            group.push(['get', name]);
            // dont get, this is a css value
            //group.push(name);
          }
          break;

        case TOKEN_URL:
        case TOKEN_BAD_URL: // treat the same... I guess
          // url tokens are guaranteed to have a `url(...)` pattern (may need to trim the arg...?)
          // however, the lexer will preprocess them and put the trimmed arg in a special token prop
          group.push(['url', consume().url]);
          break;


        case TOKEN_STRING:
          // drop the quotes
          group.push(consume().value.slice(1, -1));
          break;

        case TOKEN_COLON:
          // pretty sure this is always illegal
          return error('E_COLON_INVALID_IN_DECL_VALUE');

        default:
          group.push(consume().value);
      }
    }
    commas.push(group.length === 1 ? group[0] : group);

    return commas.length === 1 ? commas[0] : commas;
  }
  function parseArguments(funcName) {
    consume(); // (
    if ($current.value === ')') {
      consume(); // )
      return funcName;
    }

    var group = [funcName];
    parseDeclarationValue(group, funcName);
    while ($current.type === TOKEN_COMMA) {
      parseDeclarationValue(group, funcName);
    }

    if ($current.value !== ')') return error('E_FUNC_ARGS_COMMA_OR_END');
    consume();
    return group;
  }
  function parseGssValue(propertyName) {
    LOG('parseGssValue for %o', propertyName, $current);
    // cache should already be primed with remainder of this `value`
    // pass them on to GssPar
    // current will be the op, we dont pass that to GssPar either
    // after GssPar, combine them manually here.

    var op = $current.value; // dont consume...

    if (!$cached.length) return error('E_EXPECTED_GSS_VALUE_NOT_EOF');

    // the last one (p now) is not necessarily part
    // of GSS so just drop it and set to current
    $current = $cached.pop(); // eof, ;, or }

    // cached will NOT contain `current`, which is good
    var tree = GSSPar($cached, '<suppressed>');

    if ($current.value === ';') consume(); // skip semi's but keep eof and }

    // GssPar will encode `!require` data as a trailing pair `[..., require, !]`
    if (tree.length && tree[tree.length-1] === '!') {
      // if 3, it was actually a single item, so flatten it
      if (tree.length === 3) return [op, ['get', ['&'], propertyName], tree[0], tree[1]];
      tree.pop(); // just drop the !
      return [op, ['get', ['&'], propertyName], tree];
    }
    return [op, ['get', ['&'], propertyName], tree];
  }

  function parseAtRule() {
    LOG('parseAtRule', $current);
    // at rules must have an identifier name of at least three characters
    // at rule: `@` identifier3 componentvalue* [{}block | `;` | EOF]
    // componentvalue: [token | {}block | ()block | []block | functionblock]
    // functionblock: ident`(` componentvalue `)`
    // preservedtoken: any token specced in the lexer except for function and { [ (

    // so:
    // @foo name 15 name {}
    // @foo name name name ;
    // @foo name name name EOF
    // @foo name name name { ... }

    consume(); // @

    if ($current.type !== TOKEN_IDENT) return error('E_EXPECT_AT_NAME');

    var name = consume().value;
    var group = [name];
    //if ($atSkip.indexOf(name) < 0)
      group.unshift('@');

    while ($current.type !== TOKEN_EOF) {
      switch ($current.value) {
        case ';':
          consume(); // ;
          return group; // ; is an at-rule-stop
        case '{':
          parseComponentValue(group, '}');
          return group; // block is an at-rule-stop
        case '(':
          parseComponentValue(group, ')');
          break;
        case '[':
          parseComponentValue(group, ']');
          break;
        default:
          group.push(consume().value);
      }
    }

    return group;
  }
  function parseComponentValue(group, parentStop) {
    // preserved token (any except functions and `{` `(` `[` )
    // {} () [] block
    // function block

    group.push(consume().value); // { ( [

    while ($current.type !== TOKEN_EOF && $current.value !== parentStop) {
      switch ($current.value) {
        case '(':
          parseComponentValue(group, ')');
          break;
        case '[':
          parseComponentValue(group, ']');
          break;
        case '{':
          parseComponentValue(group, '}');
          break;
        default:
          group.push(consume().value);
      }
    }

    if ($current.value !== parentStop) return error('E_EXPECTED_GROUP_END');

    group.push(consume().value); // } ) ]
    return group;
  }

  function isConstraintOp(op) {
    LOG('isConstraintOp', op);
    switch (op) {
      case '==':
      case '=':
      case '>':
      case '>=':
      case '<':
      case '<=':
        return LOG('yes'),true;
    }
    return LOG('no'),false;
  }

  function error(msg, consumeCurrent) {
    ERROR('Error:', msg);
    WARN('Context (error at ##): %o', input.slice(Math.max(0, $current.offset - 50), $current.offset) + '##' + input.slice(Math.max(0, $current.offset), $current.offset + 50));

    if (consumeCurrent) _nextFromLexer();

    throw 'PARSER_ERROR['+msg+']';
  }

  //BUILD_REMOVE_BEGIN
  function warn(msg) {
    WARN.apply(console, [].concat.apply(['Warning:'], arguments));
    LOG(new Error().stack);
    WARN('Context (lexer at ##): %o', input.slice(Math.max(0, $current.offset - 50), $current.offset) + '##' + input.slice(Math.max(0, $current.offset), $current.offset + 50));
  }
  //BUILD_REMOVE_END

  return parseRules();
}