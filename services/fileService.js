const fs = require('fs');
const inMemoryCache = require('./cache');

module.exports = class FileService {
  constructor() {
    this.cacheHandler = new inMemoryCache();
  }

  async getContent(filename, nEvents, keyword) {
    try {
      return await this.cacheHandler.getData( 
        filename,
        nEvents,
        keyword
      );
    } catch(err) {
      throw err;
    }
  }
}
