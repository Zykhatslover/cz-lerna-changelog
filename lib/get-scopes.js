'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fs = require('fs');

var _path = require('path');

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = process.cwd();

var COMMITLINT_FILE_NAME = 'commitlint.config.js';

var possibleLocations = [(0, _path.join)(root, COMMITLINT_FILE_NAME), (0, _path.join)(root, '..', COMMITLINT_FILE_NAME), (0, _path.join)(root, '..', '..', COMMITLINT_FILE_NAME)];

var commitLintFile = possibleLocations.reduce(function (acc, path) {
  return (0, _fs.existsSync)(path) ? path : acc;
}, null);

/**
 * A list of scopes exported in the "commitlint.config.js" file at the root of
 * the monorepo
 */
var scopes = [];

if (commitLintFile) {
  scopes = require(commitLintFile).scopes;
}

var featFolderPattern = /\/src\/([a-zA-Z0-9]+)\//;

/** Get the default scope of the commit by analysing the most recurrent
 * "feature folder".
 * e.g. for this list of files
 * 
    packages/g1-gaming-web/src/jackpot/components/Jackpot/index.tsx
    packages/g1-gaming-web/src/search/pages/GamingSearchDiceResultsPage.tsx
    packages/g1-gaming-web/src/search/pages/GamingSearchResultsPage.tsx
    packages/g1-site-default/.env
    yarn.lock
 * The result will be "search"
 */
var getDefaultScope = function getDefaultScope() {
  var changedFiles = _shelljs2.default.exec('git diff --cached --name-only', { silent: true }).stdout.split('\n').map(_path.normalize);

  var folders = changedFiles.map(function (path) {
    var matches = featFolderPattern.exec(path);
    return !!matches && matches[1] || '';
  }).map(function (path) {
    return path.toLowerCase();
  });

  var featuresMap = folders.reduce(function (acc, folder) {
    if (folder) {
      if (folder in acc) {
        acc[folder] += 1;
      } else {
        acc[folder] = 1;
      }
    }
    return acc;
  }, {});

  var mostUsedFeature = Object.entries(featuresMap).reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        feature = _ref2[0],
        count = _ref2[1];

    return count > (featuresMap[acc] || 0) && scopes.includes(feature) ? feature : acc;
  }, '');

  return mostUsedFeature;
};

module.exports = {
  getDefaultScope: getDefaultScope,
  scopes: scopes
};