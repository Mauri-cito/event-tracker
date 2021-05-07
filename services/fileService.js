const fs = require('fs');
const inMemoryCache = require('./cache');

module.exports = class FileService {
  constructor() {
    this.cacheHandler = new inMemoryCache();
  }

  async getContent(filename, nEvents, keyword) {
    console.log(`calling fileService::getContent(${filename}, ${nEvents}, ${keyword})`);
    return await this.cacheHandler.getData(
      filename,
      nEvents,
      keyword
    );
  }
}
