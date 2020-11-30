import { existsSync } from "fs";
import { join, normalize } from "path";
import shell from "shelljs";

const root = process.cwd();

const COMMITLINT_FILE_NAME = "commitlint.config.js";

const possibleLocations = [
  join(root, COMMITLINT_FILE_NAME),
  join(root, "..", COMMITLINT_FILE_NAME),
  join(root, "..", "..", COMMITLINT_FILE_NAME),
];

const commitLintFile = possibleLocations.reduce(
  (acc, path) => (existsSync(path) ? path : acc),
  null
);

/**
 * A list of scopes exported in the "commitlint.config.js" file at the root of
 * the monorepo
 */
let scopes = [];

if (commitLintFile) {
  scopes = require(commitLintFile).scopes;
}

const featFolderPattern = /\/src\/([a-zA-Z0-9]+)\//;

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
const getDefaultScope = () => {
  const changedFiles = shell
    .exec("git diff --cached --name-only", { silent: true })
    .stdout.split("\n")
    .map(normalize);

  const folders = changedFiles
    .map((path) => {
      const matches = featFolderPattern.exec(path);
      return (!!matches && matches[1]) || "";
    })
    .map((path) => path.toLowerCase());

  const featuresMap = folders.reduce((acc, folder) => {
    if (folder) {
      if (folder in acc) {
        acc[folder] += 1;
      } else {
        acc[folder] = 1;
      }
    }
    return acc;
  }, {});

  const mostUsedFeature = Object.entries(featuresMap).reduce(
    (acc, [feature, count]) => {
      return count > (featuresMap[acc] || 0) && scopes.includes(feature)
        ? feature
        : acc;
    },
    ""
  );

  return mostUsedFeature;
};

module.exports = {
  getDefaultScope,
  scopes,
};
