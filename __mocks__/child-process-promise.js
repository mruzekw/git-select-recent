const path = require('path');
const child_process = jest.genMockFromModule('child-process-promise');

const commandResponses = {};

function __setGitBranchStdout(stdout, args = '') {
  if (typeof stdout !== 'string') throw new TypeError('stdout is not a string');
  commandResponses[`git branch --sort=-committerdate ${args}`.trim()] = stdout;
}

child_process.exec = jest.fn((command) => {
  return Promise.resolve({ stdout: commandResponses[command] || '' });
});

child_process.__setGitBranchStdout = __setGitBranchStdout;
module.exports = child_process;
