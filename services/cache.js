const fs = require('fs');
const { stat } = require('fs').promises;
const readline = require('readline');

async function retrieveLines(filepath, nlines = 5) {
  try {
    const readable = fs.createReadStream(filepath);
  
    const rl = readline.createInterface({
      input: readable
    });
  
    let result = [];
    let counter = 0;
    for await (const line of rl) {
      counter++;
      result.unshift(line);
      if(counter == nlines) {
        break;
      }
    }
  
    return result;
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
  
            // bring new data matching n and keyword
            const data = await retrieveLines(filepath);
  
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
