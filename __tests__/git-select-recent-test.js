
const path = require('path');
const yargs = require('yargs');
const { spawn } = require('child_process');
const { readFileSync } = require('fs');
const getInteractiveStdin = require('../testUtils/getInteractiveStdin');

jest.mock('child-process-promise');

describe('git select-recent', () => {
  let cpMock;
  let execSpy;
  let runCommand;

  beforeEach(() => {
    cpMock = require('child-process-promise');
    execSpy = cpMock.exec;
    runCommand = require('../lib/runCommand').default;
  });

  describe('defaults with no args', () => {

    let argv;

    const branches = [
      'add-raven-js-types',
      'libdef_prerel',
      '* master',
      'new-install-cmd',
      ''
    ];

    beforeEach(() => {
      cpMock.__setGitBranchStdout(branches.join('\n'));
      argv = yargs().argv;
    });

    it('should checkout the first local branch', () => {
      getInteractiveStdin()
        .pressEnter()
        .send();

      return runCommand(argv)
        .then(() => {
          expect(execSpy).toHaveBeenCalledWith(`git checkout ${branches[0]}`);
        });
    });

    it('should checkout the second local branch', () => {
      getInteractiveStdin()
        .pressDown()
        .pressEnter()
        .send();

      return runCommand(argv)
        .then(() => {
          expect(execSpy).toHaveBeenCalledWith(`git checkout ${branches[1]}`);
        });
    });

  });

  describe('-r', () => {

    let argv;

    const branches = [
      'origin/HEAD -> origin/master',
      'origin/add-raven-js-types',
      'origin/enzyme_v2.3.x-flow_v0.53.x-defs',
      'origin/fix_037',
      'origin/flow_version_validation',
      'origin/libdef_prerel',
      'origin/master',
      'origin/new-install-cmd',
      'origin/prerel_versions',
      'origin/testAll',
      'origin/thejameskyle-patch-1',
      'origin/travis_node_version',
      'upstream/fix_037',
      'upstream/flow_version_validation',
      'upstream/libdef_prerel',
      'upstream/master',
      'upstream/new-install-cmd',
      'upstream/prerel_versions',
      'upstream/testAll',
      'upstream/thejameskyle-patch-1',
      'upstream/travis_node_version',
      ''
    ];

    beforeEach(() => {
      cpMock.__setGitBranchStdout(branches.join('\n'), '-r');
      argv = yargs('-r').argv;
    });

    it('should checkout the first remote branch as a local branch', () => {
      getInteractiveStdin()
        .pressEnter()
        .send();

      return runCommand(argv)
        .then(() => {
          expect(execSpy).toHaveBeenCalledWith(`git checkout -b ${branches[1].replace('origin/', '')} ${branches[1]}`);
        });
    });

    it('should checkout the second remote branch as a local branch', () => {
      getInteractiveStdin()
        .pressDown()
        .pressEnter()
        .send();

      return runCommand(argv)
        .then(() => {
          expect(execSpy).toHaveBeenCalledWith(`git checkout -b ${branches[2].replace('origin/', '')} ${branches[2]}`);
        });
    });

  });

  describe('-a', () => {

    let argv;

    const branches = [
      'add-raven-js-types',
      'libdef_prerel',
      '* master',
      'new-install-cmd',
      'remotes/origin/HEAD -> origin/master',
      'remotes/origin/add-raven-js-types',
      'remotes/origin/enzyme_v2.3.x-flow_v0.53.x-defs',
      'remotes/origin/fix_037',
      'remotes/origin/flow_version_validation',
      'remotes/origin/libdef_prerel',
      'remotes/origin/master',
      'remotes/origin/new-install-cmd',
      'remotes/origin/prerel_versions',
      'remotes/origin/testAll',
      'remotes/origin/thejameskyle-patch-1',
      'remotes/origin/travis_node_version',
      'remotes/upstream/fix_037',
      'remotes/upstream/flow_version_validation',
      'remotes/upstream/libdef_prerel',
      'remotes/upstream/master',
      'remotes/upstream/new-install-cmd',
      'remotes/upstream/prerel_versions',
      'remotes/upstream/testAll',
      'remotes/upstream/thejameskyle-patch-1',
      'remotes/upstream/travis_node_version',
      ''
    ];

    beforeEach(() => {
      cpMock.__setGitBranchStdout(branches.join('\n'), '-a');
      argv = yargs('-a').argv;
    });

    it('should checkout the first local branch', () => {
      getInteractiveStdin()
        .pressEnter()
        .send();

      return runCommand(argv)
        .then(() => {
          expect(execSpy).toHaveBeenCalledWith(`git checkout ${branches[0]}`);
        });
    });

    it('should checkout the second remote branch as a local branch', () => {
      getInteractiveStdin()
        .pressDown()
        .pressDown()
        .pressDown()
        .pressDown()
        .pressEnter()
        .send();

      return runCommand(argv)
        .then(() => {
          expect(execSpy).toHaveBeenCalledWith(`git checkout -b ${branches[5].replace('remotes/origin/', '')} ${branches[5].replace('remotes/', '')}`);
        });
    });

  });

});
