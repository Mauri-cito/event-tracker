const { Transform } = require("stream");

module.exports = class KeywordFilter extends Transform {
  constructor(keyword) {
    super();
    this.keyword = keyword;
  }

  _transform(data, encoding, callback) {
    if (this.keyword == null || data.indexOf(this.keyword) !== -1) {
      this.push(data);
    }
    callback();
  }
};
