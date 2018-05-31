# VSTS Pull Request Creator CLI

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]


> A simple command line tool that creates a VSTS PR on your current git repository

## Installation

```sh
npm install -g vsts-pull-request-creator
```

## Features

* For those who perfer CLI tools, it is a natural next step of the `git commit -> git push` flow
* Identifies from your local git repo the vsts account, repository and default branch to merge to
* Copies the new PR link to your clipboard for fast sharing to your teammates for a code review

## Usage

```sh
# Create a pull request
vsts-pr -t "My awesome feature" -d "A longer description of my feature"

# Create a pull request with default title and message
vsts-pr
```

### CLI Options

* `-t`, `--title` to set the PR title
* `-d`, `--description` to set the PR description

## License

MIT

[npm-image]: https://badge.fury.io/js/vsts-pull-request-creator.svg
[npm-url]: https://www.npmjs.com/package/vsts-pull-request-creator
[travis-image]: https://travis-ci.org/asafst/vsts-pull-request-creator.svg?branch=master
[travis-url]: https://travis-ci.org/asafst/vsts-pull-request-creator