const path = require('path');
const util = require('util');
const fs = require('fs');
const writeFile = util.promisify(fs.writeFile)
const { reject, filter, chunk } = require('lodash');
const moment = require('moment');

module.exports = async (pathLine, contentType, field, writeEntriesToFile, writeDuplicatesToFile) => {
  const current = require(pathLine);
  const entries = filter(current.entries, (entry) => entry.sys.contentType.sys.id === contentType);
  const date = moment().format('YYYYMMDDHHmmss');
  if (writeEntriesToFile) {
    const filename = `entries.${contentType}.${date}.json`
    await writeFile(path.resolve(__dirname, `../data/${filename}`), JSON.stringify(entries, null, '  '));
  }
  let entryRegistry = [];
  let duplicateRegistry = [];
  for (const entry of entries) {
    const value = entry.fields[field]['en-US'];
    if (!entryRegistry.includes(value)) {
      entryRegistry.push(value);
    } else {
      duplicateRegistry.push(entry)
    }
  }
  if (writeDuplicatesToFile) {
    const filename = `duplicates.${contentType}.${field}.${date}.json`
    await writeFile(path.resolve(__dirname, `../data/${filename}`), JSON.stringify(entries, null, '  '));
  }
  return duplicateRegistry;
}