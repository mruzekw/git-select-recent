
const { exec } = require('child-process-promise');
const List = require('prompt-list');

function doesNotHaveHEAD(line) {
  return !/HEAD/.test(line);
}

function removeCurrentMarker(currentBranch) {
  return currentBranch.replace(/\*/, '').trim();
}

function removeRemotesPrefix(branch) {
  return branch.replace(/^remotes\//, '');
}

function parseLines(lines) {
  return lines
    .split('\n')
    .slice(0, -1)
    .map(s => s.trim());
}

function build(argv) {
  const baseCommand = 'git branch --sort=-committerdate';
  const buildLocalCheckout = (branch) => `git checkout ${removeCurrentMarker(branch)}`;
  const buildRemoteCheckout = (selected) => {
    const fullBranch = removeCurrentMarker(selected);
    const matches = fullBranch.match(/\/(.*)$/);
    if (!matches) {
      return buildLocalCheckout(fullBranch);
    }
    const localBranch = matches[1];
    return `git checkout -b ${localBranch} ${fullBranch}`;
  }

  if (argv.a) {
    return {
      command: `${baseCommand} -a`,
      parseGitBranch: (stdout) =>
        parseLines(stdout)
          .filter(doesNotHaveHEAD)
          .map(removeRemotesPrefix),
      buildGitCheckout: buildRemoteCheckout
    };
  }

  if (argv.r) {
    return {
      command: `${baseCommand} -r`,
      parseGitBranch: (stdout) =>
        parseLines(stdout)
          .filter(doesNotHaveHEAD),
      buildGitCheckout: buildRemoteCheckout
    };
  }

  return {
    command: baseCommand,
    parseGitBranch: (stdout) => parseLines(stdout),
    buildGitCheckout: buildLocalCheckout
  };
}

module.exports.default = function (argv) {
  const { command, parseGitBranch, buildGitCheckout } = build(argv);

  return exec(command)
    .then(function ({ stdout }) {
      const branches = parseGitBranch(stdout);
      const prompt = new List({
        type: 'list',
        name: 'branch',
        message: 'Select branch',
        default: branches[0],
        choices: branches
      });

      return prompt.run();
    })
    .then((selected) => {
      return exec(buildGitCheckout(selected))
        .then(({ stdout }) => console.log(stdout));
    });
}
