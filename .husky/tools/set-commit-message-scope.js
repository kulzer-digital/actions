

// setCommitMessageScope.js
const fs = require("fs");

function setCommitMessageScope(message, newScope) {
  // Regex to match conventional commits message format
  const commitMessageRegex = /^(?<type>[a-z]+)(\((?<scope>[^\)]+)\))?:\s(?<description>.+)/i;

  const match = message.match(commitMessageRegex);

  if (!match) {
    throw new Error('Invalid commit message format');
  }

  const { type, scope, description } = match.groups;

  // Add '#' prefix to newScope if it doesn't already have it
  const formattedNewScope = newScope.startsWith('#') ? newScope : `#${newScope}`;
  const updatedScope = scope ? formattedNewScope : `(${formattedNewScope})`;
  return `${type}${updatedScope}: ${description}`;
}

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error('Usage: node setCommitMessageScope.js <commitMessageFile> <newScope>');
  process.exit(1);
}

const commitMessageFile = args[0];

// Extract the numeric ID after the first slash in the branch name
const branchName = args[1];
const idMatch = branchName.match(/\/(\d+)/);
const newScope = idMatch ? idMatch[1] : '';

if (!newScope) {
  console.log('Unable to extract a numeric ID from the branch name');
  console.log('Please ensure your branch name is in the format: <type>/<id>-<description>');
  process.exit(0);
}

console.log(commitMessageFile, newScope);

fs.readFile(commitMessageFile, 'utf-8', (err, message) => {
  if (err) {
    console.error(`Error reading commit message file: ${err.message}`);
    process.exit(1);
  }

  try {
    const updatedMessage = setCommitMessageScope(message, newScope);
    fs.writeFile(commitMessageFile, updatedMessage, (err) => {
      if (err) {
        console.error(`Error writing commit message file: ${err.message}`);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
});
