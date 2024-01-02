'use strict';

module.exports = function (_ref) {
  var allScopes = _ref.allScopes,
      defaultScope = _ref.defaultScope;

  var scopeQuestion = allScopes && allScopes.length && defaultScope != null ? {
    type: 'autocomplete',
    name: allScopes && allScopes.length ? 'scope' : 'input',
    default: defaultScope,
    choices: allScopes,
    message: 'Denote the scope of this change:'
  } : {
    type: 'input',
    name: 'scope',
    message: 'Denote the scope of this change:'
  };
  return [{
    type: 'autocomplete',
    name: 'type',
    message: "Select the type of change that you're committing:",
    choices: [{
      value: 'feat',
      name: 'feat:     ✨  A new feature (note: this will indicate a release)'
    }, {
      value: 'fix',
      name: 'fix:      🛠  A bug fix (note: this will indicate a release)'
    }, { value: 'docs', name: 'docs:     Documentation only changes' }, {
      value: 'style',
      name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)'
    }, {
      value: 'refactor',
      name: 'refactor: A code change that neither fixes a bug nor adds a feature'
    }, {
      value: 'perf',
      name: 'perf:     A code change that improves performance'
    }, { value: 'test', name: 'test:     Adding missing tests' }, {
      value: 'chore',
      name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation'
    }, { value: 'revert', name: 'revert:   Revert to a commit' }]
  }, scopeQuestion, {
    type: 'input',
    name: 'subject',
    message: 'Write a short, imperative tense description of the change:\n',
    filter: function filter(value) {
      return value.charAt(0).toLowerCase() + value.slice(1);
    },
    validate: function validate(value) {
      return !!value;
    }
  }, {
    type: 'input',
    name: 'body',
    message: 'Provide a longer description of the change (optional). Use "|" to break new line:\n'
  }, {
    type: 'input',
    name: 'breaking',
    message: 'List any BREAKING CHANGES (if none, leave blank):\n'
  }, {
    type: 'input',
    name: 'footer',
    message: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n'
  }];
};