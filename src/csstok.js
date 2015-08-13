//BUILD_REMOVE_BEGIN
// these lines can be dropped in the build because all debug logging is stripped as well
var VERBOSE;
var LOG = function(){ if (VERBOSE) console.log.apply(console, arguments); };
var WARN = function(){ if (VERBOSE) console.warn.apply(console, arguments); };
var ERROR = function(){ if (VERBOSE) console.error.apply(console, arguments); };
//BUILD_REMOVE_END

function CSSTok(input) {

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

  //BUILD_REMOVE_BEGIN
  // this is mostly for debugging... though maybe we want to expose this?
  CSSTok[CSSTok.NONE = TOKEN_NONE] = 'NONE';
  CSSTok[CSSTok.INCLUDES = TOKEN_INCLUDES] = 'INCLUDES';
  CSSTok[CSSTok.DASHMATCH = TOKEN_DASHMATCH] = 'DASHMATCH';
  CSSTok[CSSTok.PREFIXMATCH = TOKEN_PREFIXMATCH] = 'PREFIXMATCH';
  CSSTok[CSSTok.SUFFIXMATCH = TOKEN_SUFFIXMATCH] = 'SUFFIXMATCH';
  CSSTok[CSSTok.SUBSTRINGMATCH = TOKEN_SUBSTRINGMATCH] = 'SUBSTRINGMATCH';
  CSSTok[CSSTok.IDENT = TOKEN_IDENT] = 'IDENT';
  CSSTok[CSSTok.STRING = TOKEN_STRING] = 'STRING';
  CSSTok[CSSTok.FUNCTION = TOKEN_FUNCTION] = 'FUNCTION';
  CSSTok[CSSTok.NUMBER = TOKEN_NUMBER] = 'NUMBER';
  CSSTok[CSSTok.HASH = TOKEN_HASH] = 'HASH';
  CSSTok[CSSTok.PLUS = TOKEN_PLUS] = 'PLUS';
  CSSTok[CSSTok.GREATER = TOKEN_GREATER] = 'GREATER';
  CSSTok[CSSTok.COMMA = TOKEN_COMMA] = 'COMMA';
  CSSTok[CSSTok.TILDE = TOKEN_TILDE] = 'TILDE';
  CSSTok[CSSTok.NOT = TOKEN_COLON] = 'COLON';
  CSSTok[CSSTok.ATKEYWORD = TOKEN_AT] = 'ATKEYWORD';
  CSSTok[CSSTok.INVALID = TOKEN_INVALID] = 'INVALID';
  CSSTok[CSSTok.PERCENTAGE = TOKEN_PERCENTAGE] = 'PERCENTAGE';
  CSSTok[CSSTok.DASH = TOKEN_DASH] = 'DASH';
  CSSTok[CSSTok.CDO = TOKEN_CDO] = 'CDO';
  CSSTok[CSSTok.CDC = TOKEN_CDC] = 'CDC';
  CSSTok[CSSTok.EOF = TOKEN_EOF] = 'EOF';
  CSSTok[CSSTok.ERROR = TOKEN_ERROR] = 'ERROR';
  CSSTok[CSSTok.COMMENT = TOKEN_COMMENT] = 'COMMENT';
  CSSTok[CSSTok.WHITESPACE = TOKEN_WHITESPACE] = 'WHITESPACE';
  CSSTok[CSSTok.NEWLINE = TOKEN_NEWLINE] = 'NEWLINE';
  CSSTok[CSSTok.DOT = TOKEN_DOT] = 'DOT';
  CSSTok[CSSTok.PUNCTUATOR = TOKEN_PUNCTUATOR] = 'PUNCTUATOR';
  CSSTok[CSSTok.URL = TOKEN_URL] = 'URL';
  CSSTok[CSSTok.BAD_URL = TOKEN_BAD_URL] = 'BAD_URL';
  //BUILD_REMOVE_END

  var ORD_A_61 = 0x61;
  var ORD_A_UC_41 = 0x41;
  var ORD_B_62 = 0x62;
  var ORD_B_UC_42 = 0x42;
  var ORD_C_63 = 0x63;
  var ORD_C_UC_43 = 0x43;
  var ORD_D_64 = 0x64;
  var ORD_D_UC_44 = 0x44;
  var ORD_E_65 = 0x65;
  var ORD_E_UC_45 = 0x45;
  var ORD_F_66 = 0x66;
  var ORD_F_UC_46 = 0x46;
  var ORD_G_67 = 0x67;
  var ORD_G_UC_47 = 0x47;
  var ORD_H_68 = 0x68;
  var ORD_H_UC_48 = 0x48;
  var ORD_I_69 = 0x69;
  var ORD_I_UC_49 = 0x49;
  var ORD_J_6A = 0x6A;
  var ORD_J_UC_4A = 0x4A;
  var ORD_K_6B = 0x6B;
  var ORD_K_UC_4B = 0x4B;
  var ORD_L_6C = 0x6C;
  var ORD_L_UC_4C = 0x4C;
  var ORD_M_6D = 0x6D;
  var ORD_M_UC_4D = 0x4D;
  var ORD_N_6E = 0x6E;
  var ORD_N_UC_4E = 0x4E;
  var ORD_O_6F = 0x6F;
  var ORD_O_UC_4F = 0x4F;
  var ORD_P_70 = 0x70;
  var ORD_P_UC_50 = 0x50;
  var ORD_Q_71 = 0x71;
  var ORD_Q_UC_51 = 0x51;
  var ORD_R_72 = 0x72;
  var ORD_R_UC_52 = 0x52;
  var ORD_S_73 = 0x73;
  var ORD_S_UC_53 = 0x53;
  var ORD_T_74 = 0x74;
  var ORD_T_UC_54 = 0x54;
  var ORD_U_75 = 0x75;
  var ORD_U_UC_55 = 0x55;
  var ORD_V_76 = 0x76;
  var ORD_V_UC_56 = 0x56;
  var ORD_W_77 = 0x77;
  var ORD_W_UC_57 = 0x57;
  var ORD_X_78 = 0x78;
  var ORD_X_UC_58 = 0x58;
  var ORD_Y_79 = 0x79;
  var ORD_Y_UC_59 = 0x59;
  var ORD_Z_7A = 0x7a;
  var ORD_Z_UC_5A = 0x5a;
  var ORD_0_30 = 0x30;
  var ORD_1_31 = 0x31;
  var ORD_2_32 = 0x32;
  var ORD_3_33 = 0x33;
  var ORD_4_34 = 0x34;
  var ORD_5_35 = 0x35;
  var ORD_6_36 = 0x36;
  var ORD_7_37 = 0x37;
  var ORD_8_38 = 0x38;
  var ORD_9_39 = 0x39;

  var ORD_TAB_09 = 0x09;
  var ORD_LF_0A = 0x0A; // \n
  var ORD_VTAB_0B = 0x0B;
  var ORD_FF_0C = 0x0C; // \f
  var ORD_CR_0D = 0x0D; // \r
  var ORD_SPACE_20 = 0x20;
  var ORD_EXCL_21 = 0x21;
  var ORD_DQUOTE_22 = 0x22;
  var ORD_HASH_23 = 0x23;
  var ORD_$_24 = 0x24;
  var ORD_PERCENT_25 = 0x25;
  var ORD_AND_26 = 0x26;
  var ORD_SQUOTE_27 = 0x27;
  var ORD_FWDSLASH_2F = 0x2f;
  var ORD_OPEN_PAREN_28 = 0x28;
  var ORD_CLOSE_PAREN_29 = 0x29;
  var ORD_STAR_2A = 0x2a;
  var ORD_PLUS_2B = 0x2b;
  var ORD_COMMA_2C = 0x2c;
  var ORD_DASH_2D = 0x2d;
  var ORD_DOT_2E = 0x2e;
  var ORD_COLON_3A = 0x3a;
  var ORD_SEMI_3B = 0x3b;
  var ORD_LT_3C = 0x3c;
  var ORD_IS_3D = 0x3d;
  var ORD_GT_3E = 0x3e;
  var ORD_QMARK_3F = 0x3f;
  var ORD_AT_40 = 0x40;
  var ORD_OPEN_SQUARE_5B = 0x5b;
  var ORD_BACKSLASH_5C = 0x5c;
  var ORD_XOR_5E = 0x5e;
  var ORD_CLOSE_SQUARE_5D = 0x5d;
  var ORD_LODASH_5F = 0x5f;
  var ORD_OPEN_CURLY_7B = 0x7b;
  var ORD_OR_7C = 0x7c;
  var ORD_CLOSE_CURLY_7D = 0x7d;
  var ORD_TILDE_7E = 0x7e;
  var ORD_DELETE_7F = 0x7f;
  var ORD_FIRST_NON_ASCII = 0x80;
  var ORD_NBSP_A0 = 0xA0;
  var ORD_ZWS = 0x200B;
  var ORD_LS_2029 = 0x2029;
  var ORD_PS_2028 = 0x2028;
  var ORD_BOM_FEFF = 0xFEFF;

  var START_AT_FIRST = 0;
  var START_AT_SECOND = 1;
  var START_AT_THIRD = 2;
  var CONSUME_OFFENDING_CHAR_TOO = 1; // by far most errors just concern 1 character

  var $offset = 0;
  var $row = 0;
  // row is tab-insensitive! so tab always counts as one char.
  // crlf also counts as one line, as per the standard.
  var $lastNewlinePos = 0; // col=offset-lastNewlinePos

  // https://thegrid.slack.com/archives/gss/p1438779418000410 //  "i think tabs should count as single character"

  var $inplen = input.length;
  var $hadWhite = false;

  // make sure to always return the same EOF token once one is generated
  var $eofToken = undefined;

  function next() {
    $hadWhite = false;
    var protect = 1000;
    var t = undefined;
    do {
      if (t && t.type !== TOKEN_COMMENT) $hadWhite = true; // whitespace was skipped if t is set and not a comment (comments are ignored entirely)
      if ($offset >= $inplen) return createToken(TOKEN_EOF, $offset, 0, '');
      t = nextToken();
    } while ((t.type === TOKEN_WHITESPACE || t.type === TOKEN_NEWLINE || t.type === TOKEN_COMMENT || t.type === TOKEN_NONE) && --protect >= 0);
    if (protect <= 0) return parseErrorAndConsume(0, 'A_LOOP_PROTECTION', CONSUME_OFFENDING_CHAR_TOO);
    return t;
  }

  function createToken(type, offset, len, value) {
    if (type === TOKEN_EOF && $eofToken) return $eofToken;

    // remove line continuations.
    // there should be no danger of stepping in double escape traps since raw newlines
    // can _only_ be part of valid strings as line continuations in the first place
    if (type === TOKEN_STRING) value = value.replace(/\\(?:(?:\n\r)|[\n\r\f])/g, '');
    var url = '';
    if (type === TOKEN_URL || type === TOKEN_BAD_URL) {
      // slow but whatever
      url = value.slice(4, -1).replace(/^[\s\n]*(.*)[\s\n]*$/, '$1').replace(/^['"]|['"]$/g, '');
    }

    var t = {
      //BUILD_REMOVE_BEGIN
      _: CSSTok[type], // debugging
      //BUILD_REMOVE_END
      'value': value,
      'type': type,
      'offset': offset,
      'len': len,
      'row': $row,
      'col': offset-$lastNewlinePos,
      'pbws': $hadWhite, // "preceded by white space"
      'url': url // specific for URL tokens. this is the argument, trimmed and without quotes if it was a string
    };

    if (type === TOKEN_EOF) $eofToken = t;

    LOG('T>', t);

    return t;
  }
  function consumeToken(type, delta) {
    return consumeTokenMsg(type, delta, '');
  }
  function consumeTokenMsg(type, delta, errmsg) {
    var value = input.slice($offset, $offset + delta);

    // exceptions go here :'(
    if (type === TOKEN_IDENT) {
      if (isAnB(value)) {
        // special An+B case, cut up in two tokens
        delta = 1;
        value = input.slice($offset, $offset + delta);
        // either dash or ident (`n`), never a number
        type = value === 'n' ? TOKEN_IDENT : TOKEN_DASH;
      }
    }

    var token = createToken(type, $offset, delta, value);
    $offset += delta;
    if (errmsg) token.error = errmsg;
    return token;
  }

  var n = 100;
  function nextToken() {
    // we are going to parse the start of a new token. millions of ways to go,
    // so first we determine asap which kind of token to parse. the rest is easy.

    // a-z A-Z - _ >127 = identifier
    // url chars = url token
    // +-.0-9 = number

    var c = charAt(0);
    LOG('nextToken:', '0x'+c.toString(16), isIdentifierStart(c, 0));

    if (isIdentifierStart(c, 0)) return parseIdentifier(START_AT_FIRST); // first because escape
    if (isNumber(c)) return parseNumberBefore();

    switch (c) {
      case ORD_FWDSLASH_2F:
        if (charAt(1) === ORD_STAR_2A) return parseComment();
        return parseFwdSlash();

      case ORD_TILDE_7E:
        if (charAt(1) === ORD_IS_3D) return parseIncludeMatch();
        // note: significant whitespace
        return parseTilde();
      case ORD_OR_7C:
        if (charAt(1) === ORD_IS_3D) return parseDashMatch();
        return parsePunctuator();
      case ORD_XOR_5E:
        if (charAt(1) === ORD_IS_3D) return parsePrefixMatch();
        return parsePunctuator(); // GSS
      case ORD_$_24:
        if (charAt(1) === ORD_IS_3D) return parseSuffixMatch();
        return parsePunctuator();
      case ORD_STAR_2A:
        if (charAt(1) === ORD_IS_3D) return parseSubstringMatch();
        return parsePunctuator();

      case ORD_SQUOTE_27:
        return parseString(ORD_SQUOTE_27, 0);
      case ORD_DQUOTE_22:
        return parseString(ORD_DQUOTE_22, 0);

      case ORD_HASH_23:
        return parseHash();

      case ORD_PLUS_2B:
        // note: significant whitespace
        return parsePlus();
      case ORD_GT_3E:
        // note: significant whitespace
        return parseGreater();
      case ORD_COMMA_2C:
        // note: significant whitespace
        return parseComma();

      case ORD_COLON_3A:
        return parseColon();
      case ORD_AT_40:
        return parseAt();

      case ORD_TAB_09:
      case ORD_SPACE_20:
        return parseWhitespace();
      case ORD_CR_0D:
        return parseCrlf();
      case ORD_LF_0A:
      case ORD_FF_0C:
        return parseNewline();

      case ORD_LT_3C:
        // GSS
        if (charAt(1) === ORD_EXCL_21 && charAt(2) === ORD_DASH_2D && charAt(3) === ORD_DASH_2D) return parseCDO();
        if (charAt(1) === ORD_IS_3D) return consumeToken(TOKEN_PUNCTUATOR, 2);
        return consumeToken(TOKEN_PUNCTUATOR, 1);
      case ORD_DASH_2D:
        var d = charAt(1);
        if (d === ORD_DASH_2D) {
          var e = charAt(2);
          if (e === ORD_GT_3E) return parseCDC();
          return parseIdentifier(START_AT_THIRD); // --x, properly parse x again for the escape case
        } else if (isIdentifierStart(d, 1)) { // -x
          return parseIdentifier(START_AT_SECOND); // check x too because it may be escape
        } else if (d === ORD_BACKSLASH_5C) {
          return parseEscapeFrom(1);
        }
        // expressions (note that plus is an explicit token token)
        return parseDash();

      case ORD_DOT_2E:
        if (isNumber(charAt(1))) return parseNumberAfter();
        if (charAt(1) === ORD_DOT_2E && charAt(2) === ORD_DOT_2E) return consumeToken(TOKEN_PUNCTUATOR, 3); // GSS
        return parseDot();
      case ORD_PERCENT_25:
        return parsePercentage();

      case ORD_BACKSLASH_5C:
        return parseBackslashFromTokenStart();

      case ORD_IS_3D: // attr selectors
        if (charAt(1) === ORD_IS_3D) return consumeToken(TOKEN_PUNCTUATOR, 2); // GSS
      // fall-through
      case ORD_OPEN_CURLY_7B:
      case ORD_CLOSE_CURLY_7D:
      case ORD_OPEN_SQUARE_5B: // attr selectors
      case ORD_CLOSE_SQUARE_5D:
      case ORD_OPEN_PAREN_28: // funcs
      case ORD_CLOSE_PAREN_29:
      case ORD_AND_26: // GSS
      case ORD_SEMI_3B: // not sure where this is in the spec, but whatevah
        return parsePunctuator();

      case ORD_EXCL_21:
        if (charAt(1) === ORD_GT_3E) return consumeToken(TOKEN_PUNCTUATOR, 2); // GSS
        if (charAt(1) === ORD_PLUS_2B) return consumeToken(TOKEN_PUNCTUATOR, 2); // GSS
        if (charAt(1) === ORD_TILDE_7E) return consumeToken(TOKEN_PUNCTUATOR, 2); // GSS
        return parseExclamationMark();

      default:
        if (c >= ORD_FIRST_NON_ASCII) return parseIdentifier(START_AT_SECOND);
    }

    // attempt custom tokens

    // consume into error token until but excluding first following token boundary marker (whitespace, closing curly, etc)
    // we can try to be smart here, like ignoring full bodies and such. may be just as bad though.
    return parseErrorAndConsume(0, 'E_UNKNOWN_CHAR', CONSUME_OFFENDING_CHAR_TOO);
  }

  function charAt(delta) {
    return input.charCodeAt($offset + delta);
  }

  function parseComment() {
    var delta = 1;
    var newlines = 0;
    var lastnl = 0;
    while (++delta < $inplen) {
      var c = charAt(delta);
      if (c === ORD_STAR_2A && charAt(delta + 1) === ORD_FWDSLASH_2F) {
        var t = consumeToken(TOKEN_COMMENT, delta + 2);
        if (newlines) {
          $lastNewlinePos = lastnl;
          $row += newlines;
        }
        return t;
      }

      // track newlines
      var nlen = getNewlineLen(c, delta);
      if (nlen) {
        delta += nlen-1; // nlen might be 2 for CRLF. this prevents counting them as two newlines anyways.
        lastnl = $offset + delta + 1; // note: delta is updated for nlen but not has yet skipped backslash
        ++newlines;
      }
    }

    return parseError(delta, 'E_UNCLOSED_COMMENT');
  }
  function parseFwdSlash() {
    return consumeToken(TOKEN_PUNCTUATOR, 1);
  }
  function parseWhitespace() {
    return consumeToken(TOKEN_WHITESPACE, 1);
  }
  function parseNewline() {
    LOG('parseNewline');
    var t = consumeToken(TOKEN_NEWLINE, 1);

    $lastNewlinePos = $offset;
    ++$row;

    return t;
  }
  function parseCrlf() {
    LOG('parseCrlf');
    var t = consumeToken(TOKEN_NEWLINE, charAt(1) !== ORD_LF_0A ? 1 : 2);

    // offset should be after the (last) newline now
    $lastNewlinePos = $offset;
    ++$row;

    return t;
  }
  function parseAt() {
    return consumeToken(TOKEN_AT, 1);
  }
  function parseString(delimiter, delta) {
    //string    {string1}|{string2}
    //string1   \"([^\n\r\f\\"]|\\{nl}|{nonascii}|{escape})*\"
    //string2   \'([^\n\r\f\\']|\\{nl}|{nonascii}|{escape})*\'

    // for row/col reporting, remember if we parsed a newline
    var lastnl = 0;
    var newlines = 0;

    while ($offset+(++delta) < $inplen) { // EOF is valid string terminator...
      var c = charAt(delta);
      if (c === delimiter) break;
      if (c === ORD_BACKSLASH_5C) {
        if ($offset + delta + 1 >= $inplen) { delta--; break; } // dont make the backslash part of the string. it's only confusing.

        var d = charAt(delta + 1);
        var len = getEscapeLen(d, delta + 1);
        if (!len) {
          var t1 = parseErrorAndConsume(delta-1, 'E_INVALID_ESCAPE_IN_STRING', CONSUME_OFFENDING_CHAR_TOO); // only consumes the backslash

          $lastNewlinePos = lastnl;
          $row += newlines;

          return t1;
        }

        // line continuation? note that crlf would skip 2 (!)
        var nlen = getNewlineLen(d, delta + 1);
        if (nlen) {
          delta += nlen; // note: backslash will be consumed by main loop. this is only for "extra" skips
          lastnl = $offset + delta + 1; // note: delta is updated for nlen but not has yet skipped backslash
          ++newlines;
        } else {
          delta += len; // note: backslash will be consumed by main loop. this is only "extra" skips
        }
      } else if (isNewline(c)) {
        delta += getNewlineLen(c, delta); // already know c to be a newline... but this may be CRLF
        var t2 = parseError(delta, 'E_UNESCAPED_NEWLINE_IN_STRING'); // will parse backslash. dont parse newline

        $lastNewlinePos = $offset;
        $row += newlines + 1;

        return t2;
      }
    }

    if ($offset+delta < $inplen) ++delta; // EOF does not inc delta

    var t3 = consumeToken(TOKEN_STRING, delta);

    if (newlines) {
      $lastNewlinePos = lastnl;
      $row += newlines;
    }

    return t3;
  }
  function parsePercentage() {
    return consumeToken(TOKEN_PERCENTAGE, 1);
  }
  function parseBackslashFromTokenStart() {
    var l = getNewlineLenFrom(1);
    if (l) {
      var t = parseErrorAndConsume(0, 'E_CANNOT_ESCAPE_NEWLINE_HERE', 1+l); // 1 for backslash, 1 for newline (or 2 for crlf)
      $lastNewlinePos = $offset;
      ++$row;
      return t;
    }
    if ($offset+1 < $inplen) return parseErrorAndConsume(0, 'A_UNEXPECTED_BACKSLASH', CONSUME_OFFENDING_CHAR_TOO); // should be subsumed by the identifierstart check
    return consumeToken(TOKEN_NONE, 1); // escaped EOF... weird but not illegal. just ignore it.
  }
  function parseIncludeMatch() {
    return consumeToken(TOKEN_INCLUDES, 2);
  }
  function parseDashMatch() {
    return consumeToken(TOKEN_DASHMATCH, 2);
  }
  function parsePrefixMatch() {
    return consumeToken(TOKEN_PREFIXMATCH, 2);
  }
  function parseSuffixMatch() {
    return consumeToken(TOKEN_SUFFIXMATCH, 2);
  }
  function parseSubstringMatch() {
    return consumeToken(TOKEN_SUBSTRINGMATCH, 2);
  }
  function parseCDO() {
    return consumeToken(TOKEN_CDO, 4);
  }
  function parseCDC() {
    return consumeToken(TOKEN_CDC, 3);
  }
  function parseDot() {
    return consumeToken(TOKEN_DOT, 1);
  }
  function parseIdentifierAs(delta, overrideTokenType) {
    LOG('parseIdentifierAs');
    // 4.3.9. Check if three code points would start an identifier
    // an identifier can start with `X` `-X` `--X` `\Y` `-\Y`. X is valid ident start. Y is valid escape char(s).
    // X is a letter, a non-ascii-char, or an underscore
    // Y is nearly anything but cannot be a backslash or newline
    // (basically an identifier can start with any number of dashes but cannot be "just" one dash)
    // (it also cant start with a number or a dash then a number)

    while ($offset+delta < $inplen) {
      var c = charAt(delta);
      if (c === ORD_BACKSLASH_5C) {
        // escaping EOF is not an error... but a weird kind of whitespace and not part of the ident
        // "4.3.7. Consume an escaped code point" says it should introduce a 0xFFFD... TOFIX?
        if ($offset+delta+1 >= $inplen) break;

        var d = charAt(delta+1);
        if (isNewline(d)) return parseErrorAndConsume(delta, 'E_ESCAPED_NEWLINE_IN_IDENT', CONSUME_OFFENDING_CHAR_TOO);

        var len = getEscapeLen(d, delta+1);
        if (!len) return parseErrorAndConsume(delta, 'E_INVALID_ESCAPE_IN_IDENT', CONSUME_OFFENDING_CHAR_TOO);

        delta += 1 + len;
      } else if (isIdentifierRest(c, delta)) {
        ++delta;
      } else {
        break;
      }
    }
    LOG(delta);
    if (!delta) return parseErrorAndConsume(0, 'E_EMPTY_IDENTIFIER', CONSUME_OFFENDING_CHAR_TOO);
    return consumeToken(overrideTokenType, delta);
  }
  function parseIdentifier(delta) {
    LOG('parseIdentifier', delta);
    var t = parseIdentifierAs(delta, TOKEN_IDENT);

    // special case for url tokens, since any alternative makes things harder
    if (t.value === 'url' && charAt(0) === ORD_OPEN_PAREN_28) return parseURL(t);

    return t;
  }
  function parseURL(urlToken) {
    LOG('parseURL', urlToken);
    // basically parse the whole `url(..)` thing into a single token, replacing the argument token in stream

    var start = urlToken.offset;
    var delta = 1; // start after `(`
    // url() arg is either string or raw url characters
    // raw url is escape, or neither <0x20 nor delete (0x7f)
    // url arg may be padded by whitespace on either side
    // if illegal chars before url-end, consume rest until end, consider "bad url token"
    // url token ends with ) or EOF (!), may be empty

    LOG('delta before', delta);
    delta += _parseUrlWhitespace_readNote(delta); // row/lastNewlinePos may be updated here
    LOG('delta after', delta, 'colrow', $lastNewlinePos, $row);

    var c = charAt(delta);
    switch (c) {
      case ORD_SQUOTE_27:
      case ORD_DQUOTE_22:
        ++delta; // a quote
        while ($offset + delta < $inplen) {
          var d = charAt(delta);

          if (c === d) {
            ++delta;
            break;
          }
          if (isNewline(d)) return parseBadUrl(start, delta, urlToken.row, urlToken.col);
          if (d === ORD_BACKSLASH_5C) {
            if ($offset + delta + 1 >= $inplen) break;

            var l1 = getNewlineLenFrom(delta+1);
            if (l1) { // escaped newline is fine in a string
              delta += l1;
              ++$row;
              $lastNewlinePos = $offset + delta + 1;
              // TOFIX: investigate why it doesnt matter whether `else ++delta` is applied...
            //} else {
            //  WARN('foo')
            //  ++delta;
            }
          }
          ++delta;
          LOG(delta)
        }
        break;
      default:
        while ($offset + delta < $inplen) {
          if (isUnquotedUrlPart(delta)) {
            ++delta;
            break;
          }
          if (charAt(delta++) === ORD_BACKSLASH_5C) {
            var l2 = getNewlineLenFrom(delta);
            if (l2) { // is newline allowed inside badurl? i think so...
              delta += l2;
              ++$row;
              $lastNewlinePos = $offset + delta;
            } else {
              ++delta;
            }
          }
        }
    }
    delta += _parseUrlWhitespace_readNote(delta); // row/lastNewlinePos may be updated here
    LOG(delta, $offset, $inplen);

    // this replaces the urlToken. offset may have been forwarded by string parser.
    // current delta is relative to _current_ offset, regardless
    delta += $offset - start;
    $offset = start;

    LOG('delta offset inplen', delta, $offset, $inplen);
    LOG('lastnl row', $lastNewlinePos, $row);

    if ($offset + delta < $inplen) { // arbitrary EOF at this point is valid end of URL token...
      if (charAt(delta) !== ORD_CLOSE_PAREN_29) return parseBadUrl(start, delta, urlToken.row, urlToken.col);
      ++delta; // skip )
    }

    LOG('delta offset inplen', delta, $offset, $inplen);

    var t = consumeToken(TOKEN_URL, delta);

    // copy row/col because they will have been updated after the original token was parsed
    t.row = urlToken.row;
    t.col = urlToken.col;

    return t;
  }
  function parseBadUrl(start, delta, tr, tc) {
    LOG('parseBadUrl', 'start='+start, 'delta='+delta, 'trow='+tr, 'tcol='+tc, '$offset='+$offset, '$inplen='+$inplen, 'eof='+($offset+delta>=$inplen));
    // need to track row/col while skipping...
    var newlines = 0;
    var lastnl = 0;

    // keep consuming until ) or EOF, results in bad-url-token
    while ($offset + delta < $inplen) {
      var c = charAt(delta);
      if (c === ORD_CLOSE_PAREN_29) break;
      if (c === ORD_BACKSLASH_5C) {
        if ($offset + delta + 1 >= $inplen) break;
        var l1 = getNewlineLenFrom(delta+1);
        if (l1) { // is newline allowed inside badurl? i think so...
          delta += l1; // can be 2 for crlf, the 1 is for the backslash
          ++newlines;
          lastnl = $offset + delta + 1; // 1 for backslash, delta incremented for that below
        } else {
          ++delta;
        }
      }
      var l2 = getNewlineLen(c, delta);
      if (l2) {
        delta += l2; // l can be 2 for crlf
        ++newlines;
        lastnl = $offset + delta;
      } else {
        ++delta;
      }
    }

    LOG('delta after loop', delta);

    if (c === ORD_CLOSE_PAREN_29) ++delta;
    else if ($offset + delta + 1 < $inplen && c !== ORD_BACKSLASH_5C) parseError(delta, 'E_EXPECTED_BACKSLASH_IN_BAD_URL');

    LOG('delta='+delta, '$lastNewlinePos='+$lastNewlinePos, 'lastnl='+lastnl, '$row='+$row, 'newlines='+newlines, 'offset='+$offset, 'next col:'+($offset+delta-lastnl));
    if (newlines) {
      $row += newlines;
      $lastNewlinePos = lastnl;
    }

    var t = consumeToken(TOKEN_BAD_URL, delta);
    LOG('offset after consume=', $offset, 'so next col=', $offset-$lastNewlinePos);

    // copy row/col because they will have been updated after the original token was parsed
    t.row = tr;
    t.col = tc;

    return t;
  }
  function _parseUrlWhitespace_readNote(delta) {
    LOG('_parseUrlWhitespace_readNote', delta, [input[$offset+delta]]);
    // note: !! this function may increment the global row/col directly !!
    // (other parsing funcs postpone this step until after parsing the token)

    var wslen = 0;
    while (LOG('loop', 'n=', wslen, 'c=', charAt(delta + wslen), 'pos', $offset + delta + wslen , $inplen, 'colrow', $lastNewlinePos, $row), $offset + delta + wslen < $inplen) {
      var c = charAt(delta + wslen);
      if (c === ORD_SPACE_20 || c === ORD_TAB_09) ++wslen;
      else {
        var nlen = getNewlineLen(c, delta + wslen);
        LOG('is newline?', nlen, 'then lastpos = ', $offset+delta+wslen+nlen);
        if (nlen) {
          wslen += nlen;
          // rationale for updating now: when parsing a url token we'll already have parsed
          // a token. so the col/row data will already not be what we need anyways. doing
          // the  update here prevents awkward schemes and allows us to contain the ws-skip
          // in this function.
          ++$row; // GLOBAL
          $lastNewlinePos = $offset+delta+wslen; // GLOBAL
        }
        else return wslen;
      }
    }
    return wslen;
  }
  function isUnquotedUrlPart(delta) {
    // quotes, whitespace, nonprints are all out
    // non-print is anything <= 0x1f or 0x7f. all whitespace is inside this range
    var c = charAt(delta);
    return c !== ORD_SQUOTE_27 && c !== ORD_DQUOTE_22 && c > 0x1f && c !== ORD_DELETE_7F;
  }
  function parseEscapeFrom(delta) {
    if ($offset+delta+1 >= $inplen) return parseErrorAndConsume(delta-1, 'E_ESCAPED_EOF', CONSUME_OFFENDING_CHAR_TOO); // escaping EOF is not an error... but a weird kind of whitespace

    var c = charAt(delta+1);
    if (isNewline(c)) return parseErrorAndConsume(delta, 'E_ESCAPED_NEWLINE_IN_IDENT', CONSUME_OFFENDING_CHAR_TOO);

    var delta2 = getEscapeLen(c, delta+1);
    if (delta2) return parseIdentifier(delta+1+delta2);

    return parseErrorAndConsume(delta, 'E_INVALID_ESCAPE_IN_IDENT', CONSUME_OFFENDING_CHAR_TOO); // only consume backslash itself
  }
  function parseNumberBefore() {
    var delta = getNumberLen(1) + 1;

    if (charAt(delta) === ORD_DOT_2E) {
      var after = getNumberLen(delta+1);
      if (after) delta += 1 + after;
      else return parseErrorAndConsume(delta-1, 'E_NUMBER_WITH_DOT_MUST_HAVE_DECIMAL', CONSUME_OFFENDING_CHAR_TOO);
    }
    return consumeToken(TOKEN_NUMBER, delta);
  }
  function parseNumberAfter() {
    return consumeToken(TOKEN_NUMBER, 2 + getNumberLen(2));
  }
  function parsePlus() {
    if (charAt(1) === ORD_PLUS_2B) return consumeToken(TOKEN_PUNCTUATOR, 2); // GSS
    return consumeToken(TOKEN_PLUS, 1);
  }
  function parseDash() {
    return consumeToken(TOKEN_DASH, 1);
  }
  function parseGreater() {
    if (charAt(1) === ORD_IS_3D) return consumeToken(TOKEN_PUNCTUATOR, 2); // GSS
    return consumeToken(TOKEN_GREATER, 1);
  }
  function parseComma() {
    return consumeToken(TOKEN_COMMA, 1);
  }
  function parseTilde() {
    if (charAt(1) === ORD_TILDE_7E) return consumeToken(TOKEN_PUNCTUATOR, 2); // GSS
    return consumeToken(TOKEN_TILDE, 1);
  }
  function parseColon() {
    return consumeToken(TOKEN_COLON, 1); // we must not combine with identifier for parsing a declaration
    //var delta = 1;
    //if (charAt(1) === ORD_COLON_3A) ++delta;
    //return parseIdentifierAs(delta, TOKEN_COLON);
  }
  function parsePunctuator() {
    // note: punctuators are not explicitly defined in the spec.
    // they are usually things quoted in the grammar
    // I may revisit this to define explicit tokens for each,
    // should make things simpler/faster on the parser side
    return consumeToken(TOKEN_PUNCTUATOR, 1);
  }
  function parseHash() {
    // note: this will be split in the parse tree but there's a
    // css edge case where the identifier part of a hash can be
    // of a value otherwise illegal as stand-alone identifier.
    var delta = 1;
    while (isIdentifierRest(charAt(delta), delta)) ++delta;

    if (delta > 1) return consumeToken(TOKEN_HASH, delta);
    return parseErrorAndConsume(0, 'E_HASH_WITHOUT_IDENTIFIER', CONSUME_OFFENDING_CHAR_TOO);
  }
  function parseExclamationMark() {
    return consumeToken(TOKEN_PUNCTUATOR, 1);
  }

  function isAlpha(c) {
    return c >= ORD_A_61 && c <= ORD_Z_7A || c >= ORD_A_UC_41 && c <= ORD_Z_UC_5A;
  }
  function isNumber(c) {
    return c >= ORD_0_30 && c <= ORD_9_39;
  }
  function isNonAscii(c) {
    return c >= ORD_FIRST_NON_ASCII;
  }
  function isIdentifierStart(c, delta) {
    LOG('isIdentifierStart', c, '0x'+c.toString(16));
    // GSS: $
    return isAlpha(c) || c === ORD_LODASH_5F || isNonAscii(c) || isEscape(c, delta);
  }
  function isIdentifierRest(c, delta) {
    return isIdentifierStart(c, delta) || isNumber(c) || c === ORD_DASH_2D || isEscape(c, delta);
  }
  function isHexDigit(c) {
    LOG('isHexDigit', c, '0x'+c.toString(16));
    return isNumber(c) || (c >= ORD_A_61 && c <= ORD_F_66) || (c >= ORD_A_UC_41 && c <= ORD_F_UC_46);
  }
  function isNewline(c) {
    return c === ORD_CR_0D || c === ORD_LF_0A || c === ORD_FF_0C;
  }
  function isEscape(c, delta) {
    LOG('isEscape', c, '0x'+c.toString(16), delta);
    // no need to parse entire hex, just return quick.
    if (c !== ORD_BACKSLASH_5C) return false;
    if ($offset+delta+1 >= $inplen) return false; // escaping EOF is handled elsewhere
    c = charAt(delta+1);
    if (isHexDigit(c)) return true;
    return !isNewline(c);
  }
  function isAnB(value) {
    // these cannot have numbers followed as-is. parser will enforce it.
    if (value === 'n') return true;
    if (value === '-n') return true;

    var n = 0;
    if (value[0] === 'n' && value[1] === '-') n = 2;
    else if (value[0] === '-' && value[1] === 'n' && value[2] === '-') n = 3;
    else return false;

    var len = value.length;
    // hack: if ident are exactly `-n` or `-n-`; skip number requirement check now
    // reason: op after `n` may be whitespace padded. this skip prevents a lot of ugly checks.
    // effect: `n-`, and `-n-` are always chopped up into two/three individual tokens
    if (n === len) return true;

    while (n < len) {
      if (!isNumber(value.charCodeAt(n++))) return false;
    }

    return true;
  }

  function getEscapeLen(c, delta) {
    LOG('getEscapeLen', c, '0x'+c.toString(16), delta);
    if (isHexDigit(c)) {
      var len = getEscapedHexLen(delta);
      // a space after a hex escape is assumed to mean to disambiguate the hex. you must use double space to actually use a space.
      if (charAt(delta + len) === ORD_SPACE_20) return len + 1;
      return len;
    }
    LOG('- digit not hex');
    return 1;
  }
  function getEscapedHexLen(delta) {
    // first char will already have been validated...
    if (isHexDigit(charAt(delta+1))) {
      if (isHexDigit(charAt(delta+2))) {
        if (isHexDigit(charAt(delta+3))) {
          if (isHexDigit(charAt(delta+4))) {
            if (isHexDigit(charAt(delta+5))) return 6;
            return 5;
          }
          return 4;
        }
        return 3;
      }
      return 2;
    }
    return 1;
  }
  function getNewlineLen(c, deltaOfC) {
    if (c === ORD_LF_0A || c === ORD_FF_0C) return 1;
    if (c === ORD_CR_0D) {
      if (charAt(deltaOfC+1) === ORD_LF_0A) return 2;
      return 1;
    }
    return 0;
  }
  function getNewlineLenFrom(delta) {
    return getNewlineLen(charAt(delta), delta);
  }
  function getNumberLen(delta) {
    var n = 0;
    while (isNumber(charAt(delta++))) ++n;
    return n;
  }

  function parseErrorAndConsume(delta, msg, toConsume) {
    // delta should be up to the offending character

    ERROR('Lexer error:', msg);
    WARN('Context (error at ##): %o', input.slice(Math.max(0, $offset + delta - 50), $offset + delta) + '##' + input.slice(Math.max(0, $offset + delta)
      , $offset + delta + 50));
    return consumeTokenMsg(TOKEN_ERROR, delta + (toConsume || 0), msg);
  }
  function parseError(delta, msg){
    return parseErrorAndConsume(delta, msg, 0);
  }

  //return parseAll();
  return next;
}
