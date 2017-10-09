const keys = Object.freeze({
  up: '\u001b[A',
  down: '\u001b[B',
  left: '\u001b[D',
  right: '\u001b[C',
  enter: '\n',
  space: ' '
});

class InteractiveStdin {
  constructor(mockStdin) {
    this._mockStdin = mockStdin;
    this._commands = [];
  }

  pressDown() {
    this._commands.push(keys.down);
    return this;
  }

  pressEnter() {
    this._commands.push(keys.enter);
    return this;
  }

  send() {
    let k = 0;
    const _send = (cmd) => {
      setTimeout(() => {
        this._mockStdin.send(cmd);
        const next = this._commands[k + 1];
        if (next) {
          k++;
          _send(next);
        }
      }, 0);
    };
    _send(this._commands[k]);
  }
}

const stdin = require('mock-stdin').stdin();
const getInteractiveStdin = () => new InteractiveStdin(stdin);

module.exports = getInteractiveStdin;
