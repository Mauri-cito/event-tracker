const BackwardLineReader = require("./backwardLineReader");
const KeywordFilter = require("./keywordFilter");
const TakeFirstN = require("./takeFirstN");

module.exports = class FileService {
  constructor(basePath = "/var/log/") {
    this.basePath = basePath;
  }

  async getContent(output, filename, nEvents = -1, keyword = null) {
    const fullPath = this.basePath + filename;
    const readStream = new BackwardLineReader(fullPath);
    return new Promise((resolve, reject) => {
      readStream.on("error", (err) => {
        reject(err);
      });
      output.on("finish", (err) => {
        resolve();
      });
      let stream = readStream;
      if (keyword != null) {
        const keywordFilter = new KeywordFilter(keyword);
        stream = stream.pipe(keywordFilter);
      }
      if (nEvents > -1) {
        const takeFirstN = new TakeFirstN(nEvents);
        stream = stream.pipe(takeFirstN);
        stream.on('end', () => {
          readStream.destroy()
        });
      }
      stream.pipe(output);
    });
  }
};
