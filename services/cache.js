const fs = require('fs');
const { stat } = require('fs').promises;
const readline = require('readline');
const readLastLines = require('read-last-lines');

async function retrieveFileContent(filepath) {
  try {
    const readable = fs.createReadStream(filepath);
  
    const rl = readline.createInterface({
      input: readable
    });
  
    let result = [];
    for await (const line of rl) {
      result.unshift(line);
    }
  
    return result;
  } catch(err) {
    throw err;
  }
}

async function retrieveLastEvents(filepath, n = 10, keyword = '') {
  try {
    const lines = await readLastLines.read(filepath, n);

    return lines.split("\n").filter(line => {
      return line !== '' &&
        line.indexOf(keyword) !== -1;
    });
  } catch(err) {
    throw err;
  }
}

module.exports = function (watchFolder = '/var/log') {
  let ctimeByFile = {};

  return {
    async getData(filename, n, keyword) {
        try {
          const filepath = `${watchFolder}/${filename}`;
          const { ctimeMs: ctime } = await stat(filepath);   
  
          if(
            !ctimeByFile[filename] || // <- not yet visited file
            ctime > ctimeByFile[filename].ctime // <- last modified date outdated
          ) {
  
            // bring new data matching n and keyword or full content
            const data = (n && keyword) ? 
              await retrieveLastEvents(filepath, n, keyword) :
              await retrieveFileContent(filepath);

  
            // update in memory cache
            ctimeByFile[filename] = {
              ctime,
              data
            }
  
            return ctimeByFile[filename].data;
  
          } else {
            return ctimeByFile[filename].data;
          }
        } catch(err) {
          throw err;
        }
    }
  }
}
