const fs = require('fs');
module.exports = function (watchFolder = '/var/log') {
  let ctimeByFile = {};

  return {
    getData(filename, n, keyword) {

      return new Promise((resolve, reject) => {
        if(!ctimeByFile[filename]) {

          fs.stat(`${watchFolder}/${filename}`, (err, stats) => {
  
            if(err) {
              reject(err);
            }
  
            const { ctime } = stats;
  
            // update in memory cache
            ctimeByFile[filename] = {
              data: '', 
              cTime: ctime
            }
  
            // bring new data matching n and keyword
  
            resolve(ctimeByFile[filename].data);
          })
        }
      });
    }
  }
}
