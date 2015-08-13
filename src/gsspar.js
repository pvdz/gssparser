// THIS PARSES INPUT TOKENS RIGHT TO LEFT! consider yourself warned.

//BUILD_REMOVE_BEGIN
// these lines can be dropped in the build because all debug logging is stripped as well
var VERBOSE; // log stuff?
var LOG = function(){ if (VERBOSE) console.log.apply(console, arguments); };
var WARN = function(){ if (VERBOSE) console.warn.apply(console, arguments); };
var ERROR = function(){ if (VERBOSE) console.error.apply(console, arguments); };
//BUILD_REMOVE_END

// note: first call updates window.GSSPar with the actual parser (see bottom of file)
// the reason is that this func is called many times in one parse and prevents caching over and over
function GSSPar(_gssTokens, _input) {
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

  var OPTIONAL = true;
  var MANDATORY = false;
  var CHECK_CURRENT_VALUE_ONLY = true;
  var CHECK_WHITE_FIRST = false;

  var $input;
  var $gssTokens;
  var $current; // to be init by exposed func
  var $whitespaceAfterCurrent = false;

  function consume() {
    ERROR('consumed:', $current && $current._, $current && $current.value);
    var was = $current;
    $whitespaceAfterCurrent = $current && $current.pbws; // since we must parse right to left, we handle this here...
    $current = $gssTokens.pop(); // gss parser goes right to left (!), undefined means eof so no checks here
    return was;
  }
  function parseRule() {
    // this func is only called once per gssparse, so
    // we can check for `!strong` stuff early
    // first we have to sanitize trailing tokens a little :/
    var requireIdent = '';
    if ($current && $current.type === TOKEN_EOF) consume();
    if ($current && $current.value === ';') consume();
    if ($gssTokens.length >= 1 && $current.type === TOKEN_IDENT && $gssTokens[$gssTokens.length-1].value === '!') {
      requireIdent = consume().value;
      consume(); // !
    }

    // we start at lastToken, which should be $gssTokens[$gssTokens.length-1]

    // because context markers are at the _end_ of a gss preamble, we parse
    // it from right to left. the marker is the "accessor", which looks like
    // a css attribute, but always in the form `[IDENT]`, so never an op or value.

    // if an accessor was found, put ourselves in SELECTOR mode. otherwise CALC mode
    // otherwise, and therefor by default, we are in CALC mode. we currently never
    // switch from SELECTOR mode back to calc mode until end of the "qualifier"
    // a qualifier is the atomic part of a selector that applies to one tag; in `a[x] + b[y] + .c.d[z]`
    // `a` and `b` and `.c.d` are all qualifiers. Note that `.c.d` consists of two nuclei; `.c` and `.d`.
    // note that these modes have their own parsers, with mode prefixed to their name.

    var tree = calc_parseRule();

    if ($current) return error('E_GSS_UNEXPECTED_TOKEN');
    if (tree === null || tree === undefined) return error('E_EMPTY_TREE');

    if (requireIdent) {
      // hack. this value may need to be flattened (x:==y !z) but
      // we still need to return it as one. So instead we'll add
      // the important and `!` to the array here and callers of GssPar
      // should be aware that if the result ends with !, the last
      // two elements are !require related as per result count.

      if (!tree.push) tree = [tree, requireIdent, '!'];
      else tree.push(requireIdent, '!');
    }
    LOG('GSS end: %o -> %o', $input, JSON.stringify(tree), requireIdent);

    return tree;
  }

  function calc_parseRule() {
    LOG('calc_parseRule', $current);
    // note: preceding token validation after parse completes is up to caller (EOF, group start, etc)

    var rhs = calc_parseBetweenConstraintOps(OPTIONAL);
    if (isConstraintOp()) {
      WARN('constraint:', $current.value);
      rhs = [consume().value, calc_parseRule(), rhs];
    }
    return rhs;
  }

  function calc_parseBetweenConstraintOps(maybe) {
    LOG('calc_parseBetweenConstraintOps', !!maybe, $current);
    if (!$current || calc_isOp() || isConstraintOp()) {
      if (!maybe) {
        LOG($current);
        error('E_PART_CANNOT_BE_EMPTY');
      }
      return;
    }

    var rhs = calc_parseBetweenOps();
    if (calc_isOp()) {
      var op = consume().value; // an op (we just verified that)
      if (op === '+' || op === '-') {
        LOG('min or plus, checking unary state');
        if (!calc_isAtomEnd()) {
          LOG('consuming op as unary');

          // ignore +, it doesnt change anything. but
          // negative should invert the rhs operand
          if (op === '-') {
            if (typeof rhs === 'number') {
              LOG('inverting number');
              rhs = -rhs;
            } else if (rhs instanceof Array && rhs.length === 2 && typeof rhs[1] === 'number') {
              // number + unit wrap. I hope.
              LOG('inverting number with unit suffix');
              rhs[1] = -rhs[1];
            } else {
              LOG('wrapping rhs in 0-rhs');
              rhs = ['-', 0, rhs];
            }
          }

          // check if the new left side is still an op

          if (!calc_isOp()) return LOG('new left side not calc op'),rhs;
          LOG('new left side also a calc op', $current);

          // note that we dont support nested unaries so this cant be one anymore
          op = consume().value; // some calc op
        } else {
          LOG('not unary');
        }
      }

      return [op, calc_parseBetweenConstraintOps(MANDATORY), rhs];
    }
    return rhs;
  }
  function calc_parseBetweenOps() {
    LOG('calc_parseBetweenOps', $current);

    var rhs = calc_parseValueUnitFlat();
    if (calc_isOp()) {
      return [consume().value, calc_parseBetweenOps(), rhs];
    }

    return rhs;
  }
  function calc_parseValueUnitFlat() {
    LOG('calc_parseValueUnitFlat', $current);
    // 25 px
    // <value> <unit>
    // any side may be replaced by an ident, func, accessor, or group (CALC)
    // <value> may also be a number (*shocking*)
    // parsed into flat list, recursively, left-to-right reversed (a b c -> [c,[b,a]])
    // the unit becomes the "function name"

    var rhs = calc_parseAtom();
    var isRhsSimpleUnit = typeof rhs === 'string' || (rhs instanceof Array && rhs.length === 1 && rhs[0] === '%');
    var isLhsUnit = isRhsSimpleUnit && calc_isValidUnitLhs();
    LOG('rhs ident or \%\? %o, lhs valid unit value too? %o', isRhsSimpleUnit, isLhsUnit);
    if (isLhsUnit) return [rhs, calc_parseValueUnitFlat()];

    var list = [rhs];
    while (LOG('loop calc_parseValueUnitFlat', $current), calc_isValidUnitLhs()) {
      var lhs = calc_parseAtom();
      list.unshift(lhs);
      rhs = lhs;
    }

    //while ($whitespaceAfterCurrent && calc_isAtomEnd()) {
    //  group.unshift(calc_parseBetweenOps());
    //}

    return list.length === 1 ? list[0] : list;
  }
  function calc_parseAtom() {
    LOG('calc_parseAtom:', $current);
    // an atom is basically any nuclei in succession without combinators nor constraints
    // nuclei parts can be: element, class, id, attr, accessor, pseudo's, numbers, strings
    // combinators are space, plus, etc. regular css combinators.
    // constraint ops are `==`, `>=` etc.
    // certain things are only disambiguated by the current mode; `>` `+` etc

    // keep in mind we are parsing RIGHT TO LEFT (!)

    if (!$current) {
      error('E_UNEXPECTED_EOF');
    }

    switch ($current.type) {
      case TOKEN_PUNCTUATOR:
        switch ($current.value) {
          case ']':
            return calc_parseAccessor();
          case ')':
            return calc_parseGroupOrCall();
          case '^':
          case '&':
          case '$':
            // can prefix variables in CALC mode
            return error('E_SPECIAL_TAG_SYMBOL_NOT_VALUE');
            //return [consume().value];
          case '[':
          // fall-through
          default:
            if (isConstraintOp() || calc_isOp()) return;
            return error('E_PUNC_NOT_CALC_ATOM');
        }
        break;
      case TOKEN_PLUS:
      case TOKEN_DASH:
        return error('E_EXPECTED_ATOM_FOUND_COMBINATOR');
      case TOKEN_IDENT:
        return calc_parseIdent();
      case TOKEN_PERCENTAGE:
        return calc_parsePercentage();
      case TOKEN_NUMBER:
        return calc_parseNumber();
      case TOKEN_STRING:
        // cannot be virtual, regardless
        return consume().value.slice(1, -1);
      case TOKEN_HASH: // will be joined as one token due to css lexer edge case reasons
        return calc_parseHash();
    }

    return error('E_UNEXPECTED_ATOM');
  }
  function selector_parseBetweenCommas(group) {
    LOG('selector_parseBetweenCommas', $current);

    // since everything will unshift, we will add the comma afterwards
    var list = [];
    var sub = [];
    selector_parseBetweenConstraintOps(sub);
    if (sub.length === 1) sub = sub[0];
    if (sub[0] === ',') {
      list = sub;
      sub.shift(); // remove the comma, for now.
    } // merge comma lists
    else list.push(sub);

    while (LOG('loop selector_parseBetweenCommas', $current), $current && $current.type === TOKEN_COMMA) {
      consume(); // ,
      if (!$current) return error('E_MISSING_COMMA_LHS');

      sub = [];
      selector_parseBetweenConstraintOps(sub);
      if (sub.length === 1) sub = sub[0];
      if (sub[0] === ',') {
        // move contents of sub, in sub-order to the start of list
        while (sub.length > 1) list.unshift(sub.pop());
      } else {
        list.unshift(sub);
      }
    }

    if (list.length === 1) {
      group.unshift(list[0]);
    } else {
      list.unshift(',');
      group.unshift(list);
    }
  }
  function selector_parseBetweenConstraintOps(group) {
    LOG('selector_parseBetweenConstraintOps', $current);
    if (!$current || selector_isCombinator(CHECK_CURRENT_VALUE_ONLY) || isConstraintOp()) return;

    selector_parseBetweenOps(group);
    var protect = 100;
    while (LOG('loop selector_parseBetweenConstraintOps', $current),--protect>0) {
      // first validate if the current token is actually a combinator
      // if not, it may be a space. otherwise return
      if (selector_isCombinator(CHECK_CURRENT_VALUE_ONLY)) {
        group.unshift([consume().value]);
      } else if ($whitespaceAfterCurrent && selector_isAtomEnd()) {
        group.unshift([' ']);
        $whitespaceAfterCurrent = false; // prevent double adds...
      } else {
        return;
      }

      LOG('inside selector loop; lhs=', $current, 'combinator=', group[group.length-1]);
      selector_parseBetweenOps(group);
    }
    if (protect <= 0) return error('E_LOOP_GUARD');
  }
  function selector_parseBetweenOps(group) {
    LOG('selector_parseBetweenOps', $current);

    selector_parseAtom(group);
    var protect = 10000;
    while (LOG('loop selector_parseBetweenOps', $current), selector_isValidSelectorLhs() && --protect >= 0) {
      selector_parseAtom(group);
    }
    if (protect <= 0) {
      error('E_LOOP_GUARD');
    }
  }
  function selector_parseAtom(group) {
    LOG('selector_parseAtom:', $current);
    // an atom is basically any nuclei in succession without combinators nor constraints
    // nuclei parts can be: element, class, id, attr, accessor, pseudo's, numbers, strings
    // combinators are space, plus, etc. regular css combinators.
    // constraint ops are `==`, `>=` etc.
    // certain things are only disambiguated by the current mode; `>` `+` etc

    // keep in mind we are parsing RIGHT TO LEFT (!)

    switch ($current.type) {
      case TOKEN_PUNCTUATOR:
        switch ($current.value) {
          case ']':
            return selector_parseAttribute(group);
          case ')':
            return selector_parseGroupOrCall(group);
          case '*':
            return group.unshift(['tag', consume().value]);
          case '^':
            return selector_parseCaret(group);
          case '&':
          case '$':
            return group.unshift([consume().value]);
          default:
            if (isConstraintOp() || selector_isCombinator(CHECK_WHITE_FIRST)) return;
            return error('E_PUNC_NOT_SELECTOR_ATOM');
        }
        break;
      case TOKEN_PLUS:
      case TOKEN_DASH:
        return error('E_PUNC_NOT_AN_ATOM');
      case TOKEN_IDENT:
        return selector_parseIdent(group);
      case TOKEN_HASH: // will be joined as one token due to css lexer edge case reasons
        return selector_parseHash(group);
      case TOKEN_COMMA:
        return; // consumed elsewhere
      case TOKEN_NUMBER:
        return selector_parseNumber(group);
      case TOKEN_STRING:
        // double quotes are virtuals. single quotes are strings

        if ($current.value[0] === '"') {
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
            if (!list.length) return group.unshift(['virtual', value]);
            // include range as a comma list
            list.unshift(',');
            return group.unshift(list);
          }

          return group.unshift(['virtual', value]);
        }
        // regular string whatever
        return group.unshift(consume().value.slice(1, -1));
    }

    return error('E_UNKNOWN_STATE');
  }

  function calc_parseAccessor() {
    consume(); // ]
    LOG('calc_parseAccessor', $current);

    if (!$current) return error('E_MISSING_SQUARE_GROUP_CONTENT');
    if ($current.type !== TOKEN_IDENT) {
      // in calc mode, only accessor is allowed (`[` IDENT `]`)
      return error('E_NUM_STR_IN_ACC');
    }

    var ident = consume().value;

    if (!$current) return error('E_MISSING_ATTR_OPEN');
    if ($current.value !== '[') {
      // we are in CALC mode and the IDENT was not preceded by `[`
      // this is an error because it may not (yet) be an ATTR due
      // to the mode being CALC (makes no sense there), so;
      return error('E_INVALID_TOKEN_IN_ACC');
    }

    consume(); // [

    var result = ['get', ident];

    // yes, acccessor
    if (calc_isAccessorLhs()) {
      var atom = [];
      LOG('parsing optional quantifier');
      selector_parseBetweenOps(atom);
      if (atom.length === 1) atom = atom[0];
      if (atom.length) result = ['get', atom, ident];
    }

    if (calc_isUnaryOp()) {
      var op = consume().value;
      LOG('unary op is %o', op);
      if (op === '-') {
        result = ['-', 0, result];
        LOG('negating result...', result);
      }
    }

    return result;
  }
  function calc_parseIdent() {
    LOG('calc_parseIdent', $current);
    // an ident can be preceded by dot. not
    // hash (because that'd be a single token)

    var ident = consume().value;
    if (!$current) return ['get', ident];

    var atom = ident;
    var unaryMultiplier = 0; // if 0, no unary. -1 means negative, 1 means positive

    if (calc_isUnaryOp()) {
      LOG('consuming op as unary');
      var op = consume().value; // + or -

      // ignore +, it doesnt change anything. but
      // negative should invert the rhs operand
      if (op === '-') {
        LOG('wrapping ident in [0 - ident]');
        unaryMultiplier = -1;
      } else {
        unaryMultiplier = 1;
      }
    }

    LOG('checking left side of this ident', $current);
    if ($current && $current.type === TOKEN_PUNCTUATOR && ($current.value === '&' || $current.value === '$')) {
      // special case: vars in calc mode can be prefixed with one context modifier
      atom = ['get', [consume().value], atom];
    } else if ($current && $current.type === TOKEN_PUNCTUATOR && $current.value === '^') {
      // special case: this context modifier can repeat and repeats should be grouped together
      var count = 1;
      while (consume() && $current && $current.value === '^') ++count;

      if (count > 1) {
        atom = ['get', ['^', count], atom];
      } else {
        atom = ['get', ['^'], atom];
      }
    } else if (!unaryMultiplier && $current && $current.type === TOKEN_NUMBER) {
      LOG('is number with unit suffix');
      //  return [atom, parseFloat(consume().value) * (isNegative ? -1 : 1)];

      // this ident is going to be the unit. dont wrap it in a get. leave atom as is.
    } else if (!unaryMultiplier && $current && $current.value === ')') {
      LOG('is group/func-call with unit suffix, consuming group now');
      // this ident is going to be the unit. dont wrap it in a get. leave atom as is.

      atom = [atom, calc_parseGroupOrCall()];

    } else if (!unaryMultiplier && $current && $current.type === TOKEN_IDENT) {
      LOG('is var with unit suffix, consuming ident now');
      // this ident is going to be the unit
      atom = [atom, calc_parseIdent()];
    } else {
      atom = ['get', atom];
    }

    if (unaryMultiplier < 0) atom = ['-', 0, atom];

    return atom;
  }
  function calc_parsePercentage() {
    var op = consume().value;
    if ($current.type !== TOKEN_NUMBER) return error('E_PERCENTAGE_WITHOUT_NUMBER');
    // a higher parsing function will combine them (easier with complex unary cases)
    return op;
  }
  function calc_parseNumber() {
    LOG('calc_parseNumber', $current);
    var num = parseFloat(consume().value);

    if (calc_isUnaryOp()) {
      LOG('consuming op as unary');
      var op = consume().value; // + or -

      // ignore +, it doesnt change anything. but
      // negative should invert the rhs operand
      if (op === '-') {
        LOG('negating');
        num = -num;
      }
      // note that we dont support nested unaries so this cant be one anymore
    }

    return num;
  }
  function calc_parseHash() {
    LOG('calc_parseHash', $current);
    return error('E_ID_IN_CALC');
  }
  function calc_parseGroupOrCall() {
    consume(); // )
    LOG('calc_parseGroupOrCall', $current);

    if (calc_isGroupIdentPrefixed()) {
      return calc_parseFunc();
    }

    // a regular group in calc mode should contain a calc rule
    return calc_parseGroupNoIdent();
  }
  function calc_parseFunc() {
    // a func may have no arguments, or a mixed comma list of gss and selector args
    LOG('calc_parseFunc', $current);

    if (!$current) return error('E_MISSING_GROUP_OPEN');
    if ($current.value === '(') {
      LOG('func has no args...');
      consume(); // (
      // funcs without args are reflected as `['foo']`
      return [consume().value];
    }

    // keep parsing between commas. for each such value first determine
    // the calc or selector mode of that part. then parse accordingly.

    var group = [];

    do {
      if ($current.value === ',') return error('E_DOUBLE_COMMA');
      calc_parseFuncArg(group);
    } while (LOG('loop calc_parseFunc'), $current && $current.value === ',' && consume()); // consume the comma

    if (!$current) return error('E_UNEXPECTED_BOF_AFTER_VERIFY');
    if (consume().value !== '(') return error('E_GROUP_MISSING_OPEN_WEIRD'); // i dont think this can happen if the prefix check passes

    LOG('func args parsed, parsing func ident now', $current);

    if (!$current) return error('E_UNEXPECTED_BOF_AFTER_VERIFY');
    if ($current.type !== TOKEN_IDENT) return error('E_EXPECTED_PROMISED_IDENT'); // shouldnt happen? calc_isGroupIdentPrefixed verified this already

    LOG('parsed group is actually func call; name: %o, group: %o', $current.value, group);

    if (group[0] === ',') {
      // func args are flat
      group[0] = consume().value;
      return group;
    }

    if (group.length === 0) {
      // empty args just returns a group with the func name
      group[0] = consume().value;
      return group;
    }

    // put func name at the start
    group.unshift(consume().value);
    return group;
  }
  function calc_parseFuncArg(group) {
    LOG('calc_parseFuncArg', $current);

    if (calc_isSimpleGss()) {
      group.unshift(calc_parseRule());
    } else {
      var g = [];
      selector_parseBetweenConstraintOps(g);

      if (g.length === 1) g = g[0];
      group.unshift(g);
    }
  }
  function calc_parseGroupNoIdent() {
    var group = calc_parseRule();

    if (!$current) return error('E_UNEXPECTED_BOF_FOR_GROUP_START');
    if ($current.value !== '(') return error('E_GROUP_MISSING_OPEN');
    consume(); // (

    if ($current && $current.type === TOKEN_IDENT) return error('E_SHOULD_NOT_BE_FUNC');

    return group;
  }
  function selector_parseAttribute(group) {
    consume(); // ]
    LOG('selector_parseAttribute', $current);

    if (!$current || ($current.type !== TOKEN_IDENT && $current.type !== TOKEN_STRING && $current.type !== TOKEN_NUMBER)) {
      return error('E_ATTR_BAD_RHS');
    }

    var rhs = consume().value;

    if (!$current) {
      return error('E_MISSING_GROUP_START');
    }

    if ($current.value === '[') {
      group.unshift(['[]', rhs]);
    } else if (selector_isAttrOp()) {

      // validated rhs as something that must have a lhs
      // mode implicitly has to be SELECTOR

      var op = consume().value;
      if (op === '=' && $current.value === '!') op = consume().value + op; // != also valid attr op in gss

      if ($current.type !== TOKEN_IDENT) return error('E_ATTR_BAD_LHS');
      group.unshift(['['+op+']', consume().value, rhs]);
    } else {
      return error('E_ATTR_MISSING_OPEN_OR_OP');
    }

    consume(); // [
  }
  function selector_parseIdent(group) {
    LOG('selector_parseIdent', $current);
    // an ident can be preceded by dot. not
    // hash (because that'd be a single token)
    // if mode is SELECTOR, group should be passed on

    var ident = consume().value;

    return _selector_parseIdent(group, ident);
  }
  function _selector_parseIdent(group, ident) {
    // parse ident, getting the ident in a param

    // dot is always class, only in SELECTOR mode
    if ($current && $current.type === TOKEN_DOT) {
      group.unshift([consume().value, ident]);
    } else if ($current && $current.type === TOKEN_PUNCTUATOR && ($current.value === '&' || $current.value === '$')) {
      // special (custom) context modifiers
      group.unshift(['get', [consume().value], ident]);
    } else if ($current && $current.type === TOKEN_PUNCTUATOR && $current.value === '^') {
      // special case: this context modifier can repeat and repeats should be grouped together
      var count = 1;
      while (consume() && $current && $current.value === '^') ++count;
      if (count > 1) {
        group.unshift(['get', ['^', count], ident]);
      } else {
        group.unshift(['get', ['^'], ident]);
      }
    } else if ($current && $current.type === TOKEN_COLON) {
      consume(); // :
      var dbl = $current && $current.type === TOKEN_COLON;
      if (dbl) consume();

      // alias `::this` to `&`
      if (dbl && ident === 'this') {
        LOG('converted ::this to &');
        ident = '&';
      } else {
        ident = ':' + ident;
      }

      group.unshift([ident]);
    } else {
      group.unshift(['tag', ident]);
    }
  }
  function selector_parseHash(group) {
    LOG('selector_parseHash', $current);
    group.unshift(['#', consume().value.slice(1)]);
  }
  function selector_parseNumber(group) {
    LOG('selector_parseNumber', $current);
    // in selectors, numbers are only valid as part of splats or inside AnB in css calc(anb) values
    // this means we have a fair bit of lookahead to do when we find a number

    var num = parseFloat(consume().value); // (unsigned) number

    var op = $current.value; // + - ... or return now

    // rationale;
    // - if op is +, this can still be an+b or splat
    // - if op is -, this can still be an+b or splat and num is negative (only) if splat
    // - if op is ..., this is a splat.
    // - else return now. this is an+b with a=1 and b=num and op=+.

    if (op === '+' || op === '-') { // signed number for splat or the B for AnB
      consume(); // - +
      return selector_parseNumberLeft(group, num, op);
    }
    if (op === '...') { // num is rhs for a splat
      consume(); // ...
      return selector_parseSplatLeft(group, num);
    }

    if (op === 'n') {
      consume(); // n
      // note: we pass on + because that's implied when sign is omitted
      return selector_parseAnB(group, num);
    }

    // dont consume
    group.unshift(['anb', 0, num]);
  }
  function selector_parseNumberLeft(group, B, rop) {
    LOG('selector_parseNumberLeft', $current, B, rop);
    // parse the lhs remainder of a number. we now need
    // to determine whether it'll be AnB or splat
    // note: An+B / An-B only allows one op there, which is `rop`

    // in any case here, if rop is -, num becomes negative
    if (rop === '-') B = -B;

    if (!$current) return error('E_UNKNOWN_NUMBER_BOF_ERROR');

    // current may only be ... or n, otherwise we return now.
    var lop = $current.value;
    if (lop === '...') {
      consume(); // ...
      return selector_parseSplatLeft(group, B);
    }

    return error('E_ANB_INVALID_IN_GSS_Q'); // is there a valid case for this?

    /*
    if (lop === 'n') {
      consume(); // n
      return selector_parseAnB(group, B);
    }

    // FIX: if uncommented, this should have some error checks to make sure the lhs now is valid...

    // dont consume
    group.unshift(['anb', 0, B]);
    */
  }
  function selector_parseAnB(group, B) {
    LOG('selector_parseAnB', $current, B);
    // we just parsed `n`, current must be a number, else A=1 and current _may_ be a sign for A.

    // all valid An+B cases are as follows:
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

    // and we have parsed the n+B or n-B part so these are the cases we may encounter still (starting at the `n` lhs):
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

    // current must be number, -, +, or we return now
    var A = 1; // in case current is not a number, A becomes 1 (because we have already parsed `n`!)
    if ($current.type === TOKEN_NUMBER) A = parseFloat(consume().value);

    // A can be prefixed
    // TOFIX: enforce whitespace restrictions for the `+n` and `-n` cases
    if ($current.value === '+') consume(); // positive sign is implied anyways
    else if ($current.value === '-') {
      consume(); // -
      A = -A;
    }

    group.unshift(['anb', A, B]);
  }
  function selector_parseSplatLeft(group, B) {
    LOG('selector_parseSplatLeft', $current, B);

    // note: we dont support multi-tiered splats; multiple splats in the same ident: https://thegrid.slack.com/archives/gss/p1438697084000381

    // we parsed `...B`, the lhs should be ident, class, hash
    // (class will be two tokens, so that's caught in the ident check)
    if ($current.type !== TOKEN_IDENT && $current.type !== TOKEN_HASH) return error('E_SPLAT_INVALID_LHS');

    var value = $current.value;
    var PREFIX_GROUP = 1;
    var NUM_GROUP = 2;
    // now the LHS must trail with a number. ugh. this is an edge case; use a slow regex
    // note: this value cannot be negative... (there was an explicit test case)
    // confirmed: https://thegrid.slack.com/archives/gss/p1438696421000364
    // confirmed: https://thegrid.slack.com/archives/gss/p1438696429000365
    var match = value.match(/(.*?)(\d+)$/);
    if (!match) return error('E_SPLAT_LHS_NAN');

    var type = consume().type; // hash or ident, value already stored above
    var ident = match[PREFIX_GROUP];
    if (type === TOKEN_HASH) ident = ident.slice(1); // remove the hash
    var A = parseInt(match[NUM_GROUP], 10);
    B = Math.abs(B);

    var list = [','];
    for (var i=A; i<=B; ++i) {
      if (type === TOKEN_HASH) list.push(['#', ident+i]);
      else if ($current && $current.value === '.') list.push(['.', ident+i]);
      else list.push(['tag', ident+i]);
    }

    if (type !== TOKEN_HASH && $current && $current.value === '.') consume(); // dot of a class

    group.unshift(list);
  }
  function selector_parseGroupOrCall(group) {
    var start = group.length;
    consume(); // )
    LOG('selector_parseGroupOrCall', $current);

    if (!$current) return error('E_MISSING_GROUP_END');

    // group contents is optional for pseudo calls. otherwise mandatory
    var emptyGroup = $current.value === '(';

    if ($current.type === TOKEN_NUMBER) {
      // AnB?
      // TOFIX: this is only doing the simple AnB, not any edge cases
      // TOFIX: -> selector_parseAnB
      group.unshift(parseFloat(consume().value));
      if ($current && $current.value === '+') {
        consume(); // ignore
      } else if ($current && $current.value === '-') {
        group[0] = -group[0];
        consume();
      }
      if ($current && $current.value === 'n') {
        consume(); // n
        if ($current && $current.type === TOKEN_NUMBER) {
          group.unshift(parseFloat(consume().value));
          if ($current && $current.value === '+') {
            consume(); // ignore
          } else if ($current && $current.value === '-') {
            group[0] = -group[0];
            consume();
          }
        } else if ($current && $current.value === '+') {
          consume(); // +
          // n becomes 1, has no number prefix
          group.unshift(1);
        } else if ($current && $current.value === '-') {
          consume();
          // -n becomes -1
          group.unshift(-1);
        }
      }
      if ($current && $current.value !== '(') return error('E_MISSING_ANB_END');
    } else if (!emptyGroup) {
      selector_parseBetweenCommas(group);

      if ($current && $current.value !== '(') return error('E_MISSING_GROUP_END');
    }

    consume(); // (

    if ($current && $current.type === TOKEN_IDENT) {
      LOG('ident before paren; pseudo checks commencing');
      // consume is safe to do here: this either succeeds
      // as a pseudo or errors out. either way, state is sound
      var ident = consume().value;
      if ($current.type !== TOKEN_COLON) {
        // ok it's not a pseudo call. still valid in gss.
        return _selector_parseIdent(group, ident);
      }
      consume(); // :
      var dbl = $current && $current.type === TOKEN_COLON;
      if (dbl) {
        consume();
      }

      // alias `::this` to `&`
      if (dbl && ident === 'this') {
        LOG('converted ::this to &');
        ident = '&';
      } else {
        ident = ':' + ident;
      }

      // pseudo call, wrap the group parsed in this
      // func, unshift the pseudo, add as one element
      // to the original group that was passed on
      if (emptyGroup) {
        group.unshift([ident]);
      } else {
        group.unshift([ident].concat(group.splice(0, group.length-start)));
      }
    } else if (emptyGroup) {
      // NOW throw an error because the group wasn't part of a call
      return error('E_GROUP_CANNOT_BE_EMPTY');
    }
  }
  function selector_parseCaret(group) {
    // special case: this context modifier can repeat and repeats should be grouped together
    var count = 1;
    while (consume() && $current && $current.value === '^') ++count;
    if (count > 1) {
      group.unshift(['^', count]);
    } else {
      group.unshift(['^']);
    }
  }

  function selector_isAttrOp() {
    LOG('isAttrOp', $current);
    switch ($current && $current.value) {
      case '=':
      case '~=':
      case '^=':
      case '$=':
      case '*=':
      case '|=':
      case '!=':
        return LOG('yes'),true;
    }
    return LOG('no'),false;
  }
  function isConstraintOp() {
    LOG('isConstraintOp', $current);
    switch ($current && $current.value) {
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
  function selector_isCombinator(skipSpace) {
    LOG('isSelectorCombinator', $current, $whitespaceAfterCurrent, skipSpace);
    if (!skipSpace && $whitespaceAfterCurrent) return LOG('yes'),true;
    switch ($current && $current.value) {
      case '++':
      case '!': // ancestor
      case '!>': // parent
      case '!+': // left sibling
      case '!~': // all preceding siblings
      case '~':
      case '~~':
      case '>':
      case '+':
        return LOG('yes'),true;
    }
    return LOG('no'),false;
  }
  function calc_isOp() {
    LOG('_calc_isOp', $current);
    switch ($current && $current.value) {
      case '+':
      case '-':
      case '/':
      case '*':
        return true;
    }
    return false;
  }
  function calc_isAtomEnd(token, sansContext) {
    LOG('calc_isAtomEnd', $current, '->', token);
    if (!token) token = $current;
    if (!token) return LOG('no'),false;

    switch (token.type) {
      case TOKEN_NUMBER:
      case TOKEN_STRING: // cant think of an actual use case for this, but there was a test that required it.
      case TOKEN_IDENT:
        return LOG('yes'),true;
      case TOKEN_PUNCTUATOR:
        switch (token.value) {
          case ']':
          case ')':
            return LOG('yes'),true;
          case '^':
          case '&':
          case '$':
            // in CALC it may prefix a (optionally signed) variable
            return LOG(sansContext?'no':'yes'),sansContext?false:true;
        }
        break;
    }
    LOG('no');
    return false;
  }
  function selector_isAtomEnd() {
    LOG('selector_isAtomEnd', $current);
    if (!$current) return LOG('no'),false;

    switch ($current.type) {
      case TOKEN_IDENT:
      case TOKEN_HASH:
        return LOG('yes'),true;
      case TOKEN_PUNCTUATOR:
        switch ($current.value) {
          case ']':
            return LOG('yes'),true;
          case ')':
            // tofix: make testcases because this is true for pseudos but not for groups, i think
            return LOG('yes'),true; // SELECTOR mode
          case '^':
          case '&':
          case '$':
            // in SELECTOR it counts as a regular atom
            return LOG('yes'),true;
          case '*':
            // "any" one element selector
            return LOG('yes'),true;
        }
        break;
      case TOKEN_STRING:
        // double quoted strings are virtuals, kind of like an element
        // single quoted strings dont make much sense at all right now
        return LOG($current.value[0] === '"'?'yes':'no'),$current.value[0] === '"';
      case TOKEN_NUMBER: // splats, calc(An+B)
        return LOG('yes'),true;
    }
    LOG('no');
    return false;
  }
  function selector_isValidSelectorLhs() {
    LOG('selector_isValidSelectorLhs', $current, $whitespaceAfterCurrent);
    if ($whitespaceAfterCurrent) return LOG('no'),false;
    //if (current.value === '*') return false; // we agreed that star is only a tag on its own
    if (selector_isAtomEnd()) return LOG('yes'),true;
    return LOG('no'),false;
  }
  function calc_isValidUnitLhs() {
    // for `25 px`, check if the lhs is anything we want to parse flat
    // this would be: number, ident, func, group, accessor

    LOG('calc_isValidUnitLhs', $current, $whitespaceAfterCurrent);
    var SANS_CONTEXT = true; // ignores $ & ^ for this check
    if (calc_isAtomEnd(undefined, SANS_CONTEXT)) return LOG('yes'),true;
    return LOG('no'),false;
  }
  function calc_isAccessorLhs() {
    // for accessors the lhs group is fine, whitespace is not
    LOG('calc_isAccessorLhs', $current, $whitespaceAfterCurrent);
    if ($whitespaceAfterCurrent) return LOG('no'),false;
    //if (current.value === '*') return false; // we agreed that star is only a tag on its own

    if (selector_isAtomEnd()) {
      return LOG('yes'),true;
    }
    return LOG('no'),false;
  }
  function calc_isUnaryOp() {
    LOG('calc_isUnaryOp', $current);
    if ($current && ($current.type === TOKEN_PLUS || $current.type === TOKEN_DASH)) {
      // peek
      var prev = $gssTokens[$gssTokens.length-1];
      LOG('did find + or -, peeking token before:', prev);
      // unary if op is not preceded by another atom except for special context modifiers
      if (!prev || (!calc_isAtomEnd(prev) || prev.value === '^' || prev.value === '$' || prev.value === '&')) {
        return LOG('yes unary'), true;
        // note that we dont support nested unaries so this cant be one anymore
      }
    }
    return LOG('not unary'), false;
  }
  function calc_isGroupIdentPrefixed() {
    LOG('calc_isGroupIdentPrefixed', $current);
    // assumes we've just consumed a closing parenthesis
    // move left, skipping parenthesis _pairs_, until
    // we reach an unmatched closing parenthesis.
    // report whether the token before that is IDENT

    // TOFIX: we can eliminate this func by adding pair meta data to the tokens (reference pairs directly)

    if (!$current) return LOG('no'),false;

    // `current` is not part of $gssTokens anymore, so check it first
    if ($current.value === '(') {
      if ($gssTokens.length && $gssTokens[$gssTokens.length-1].type === TOKEN_IDENT) return LOG('yes:', $gssTokens[$gssTokens.length-1].value), true;
      return LOG('no'), false;
    }

    var i = $gssTokens.length;
    var pairs = $current.value === ')' ? 1 : 0;
    while (--i) { // if i=0 here, the group cannot have an ident prefix or there's an error. return false regardless
      var t = $gssTokens[i];
      if (!t) return error('E_CACHE_SHOULD_NOT_HAVE_HOLES');
      var v = t.value;
      if (v === ')') {
        LOG('nested');
        ++pairs;
      } else if (v === '(') {
        if (pairs) --pairs;
        // note: i is guaranteed to be >0
        else {
          var b = $gssTokens[i-1].type === TOKEN_IDENT;
          LOG(b?'yes: '+$gssTokens[i-1].value:'no');
          return b;
        }
      }
    }

    return LOG('no'),false;
  }
  function calc_isSimpleGss() {
    LOG('calc_isSimpleGss', $current);
    // scan forward and check if all tokens are either
    // identifiers or +-*/
    // used for function call argument to determine how to proceed parsing them

    // `current` is not part of $gssTokens anymore, so check it first
    if (!$current) return LOG('no, EOF'),false;
    switch ($current.value) {
      case '+':
      case '-':
      case '*':
      case '/':
        break;
      case ')':
        return LOG('yes (empty)'), true;
      case ']':
        return LOG('yes, probably accessor to the right...'), true; // UGLY HACK SADFACE
      default:
        if ($current.type !== TOKEN_IDENT && $current.type !== TOKEN_NUMBER) return LOG('no: %o', $current.value), false;
    }

    var i = $gssTokens.length;
    var pairs = $current.value === ')' ? 1 : 0;
    while (--i) { // if i=0 here, the group cannot have an ident prefix or there's an error. return false regardless
      var t = $gssTokens[i];
      var v = t.value;

      switch (v) {
        case ')':
          LOG('nested');
          ++pairs;
          break;
        case ',':
          if (!pairs) return LOG('yes, at comma'), true;
          break;
        case '(':
          if (!pairs) return LOG('yes, at paren'), true; // we didnt encounter "bad" tokens, so yeah
          --pairs;
          break;

        case '+':
        case '-':
        case '*':
        case '/':
          break; // ok

        default:
          if (t.type !== TOKEN_IDENT && t.type !== TOKEN_NUMBER) return LOG('no: %o', t.value), false;
      }
    }

    // cant happen? i think we already verified that we'll encounter the closing paren... not sure.
    LOG('no, throws');
    return error('E_EXPECTED_PRE_VALIDATION');
  }

  function error(msg) {
    var c = $current;
    if (!c) c = {offset:0, len:0,value:'EOF'};
    ERROR('Error:', msg);
    WARN(
      'Context (current token between ##): %o',
      $input.slice(Math.max(0, c.offset - 50), c.offset) + '##' + c.value + '##' + $input.slice(Math.max(0, c.offset+c.len), c.offset + 50)
    );
    $gssTokens.length = 0;
    $whitespaceAfterCurrent = false;
    $current = null;

    throw 'GSS_ERROR['+msg+']';
  }

  //BUILD_REMOVE_BEGIN
  function warn(msg) {
    WARN.apply(console, [].concat.apply(['Warning:'], arguments));
    LOG(new Error().stack);
    WARN('Context (lexer at ##): %o', $input.slice(Math.max(0, $current.offset - 50), $current.offset) + '##' + $input.slice(Math.max(0, $current.offset), $current.offset + 50));
  }
  //BUILD_REMOVE_END

  return (GSSPar = function(_gssTokens, _input){
    $gssTokens = _gssTokens; // _all_ tokens for this gss rule, left to right
    $input = _input; // for debugging

    LOG('GSS start');
    LOG('tokens: %o\ninput: %o', $gssTokens.slice(0), $input);
    LOG('parsing:', $gssTokens.map(function(t){ return t.value; }).join(' '));
    LOG('types:', $gssTokens.map(function(t){ return t._; }).join(' '));
    LOG('current:', $current);

    consume(); // set current to right-most token

    return parseRule();
  })(_gssTokens, _input);
}
