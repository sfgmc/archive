const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async () => {
  const { stdout, stderr } = await exec('contentful space export', { cwd: path.resolve(__dirname, '../data') });
  console.log(stdout, stderr);
  if (stderr) { throw new Error(stderr) }
  const lines = stdout.split('\n')
  let pathLine = '';
  for (const line of lines) {
    if (line.includes('Stored space data to json file at: ')) {
      pathLine = line;
      break;
    }
  }
  pathLine = pathLine.split('at: ')[1];
  return pathLine;
}