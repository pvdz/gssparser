function fuzz() {
  var s = '';
  var n = 5 + Math.floor(Math.random() * 25);
  for (var i=0; i<n; ++i) {
    switch (Math.floor(Math.random() * 40)) {
      case 0:
        s += '-';
        break;
      case 1:
        s += 'a';
        break;
      case 2:
        s += '+';
        break;
      case 3:
        s += ' ';
        break;
      case 4:
        s += '\\';
        break;
      case 5:
        s += '\n';
        break;
      case 6:
        s += '\r';
        break;
      case 7:
        s += '\f';
        break;
      case 8:
        s += '"';
        break;
      case 9:
        s += "'";
        break;
      case 10:
        s += '}';
        break;
      case 11:
        s += '{';
        break;
      case 12:
        s += '[';
        break;
      case 13:
        s += ']';
        break;
      case 14:
        s += '(';
        break;
      case 15:
        s += ')';
        break;
      case 16:
        s += '*';
        break;
      case 17:
        s += ':';
        break;
      case 18:
        s += ';';
        break;
      case 19:
        s += '\t';
        break;
      case 20:
        s += '^';
        break;
      case 21:
        s += '$';
        break;
      case 22:
        s += '~';
        break;
      case 23:
        s += '#';
        break;
      case 24:
        s += '.';
        break;
      case 25:
        s += '.';
        break;
      case 26:
        s += 'url(';
        break;
      case 27:
        s += '=';
        break;
      case 28:
        s += 'foo: bar;';
        break;
      case 29:
        s += 'foo: <= bar;';
        break;
      case 30:
        s += 'foo <= bar;';
        break;
      case 31:
        s += 'span {';
        break;
      case 32:
        s += '\n\r';
        break;
      default:
        s += 'x';
    }
  }
  return s;
}