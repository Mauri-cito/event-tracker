const { Transform } = require("stream");

module.exports = class TakeFirstN extends Transform {
  constructor(numberOfLines) {
    super();
    this.maxNumberOfLines = numberOfLines;
    this.currentNumberOfLines = 0;
  }

  _transform(data, encoding, callback) {
    if (this.currentNumberOfLines >= this.maxNumberOfLines) {
      this.push(null);
      this.end();
    } else {
      this.push(data);
      this.currentNumberOfLines++;
    }
    callback();
  }
};
