const fs = require("fs").promises;
const stream = require("stream");
const path = require("path");

const invalidFileType = (filename) => {
  return ['.tar', '.gz', '.zip', '.7z'].includes(path.extname(filename));
}

module.exports = class BackwardLineReader extends stream.Readable {
  constructor(filename, initialPos) {
    super();
    this.filename = filename;
    this.fd = null;
    this.pos = null;
    this.line = "";
  }

  async _read(n) {
    n = 100;
    if (this.fd == null) {
      try {
        const stats = await fs.stat(this.filename);
        const { size, mode } = await fs.stat(this.filename);

        if (invalidFileType(this.filename)) {
          this.destroy('only ASCII files supported');
          return;
        }

        if (mode != 33188) {
          this.destroy('not allowed file');
          return;
        }

        this.pos = size;
        this.fd = await fs.open(this.filename);
      } catch (err) {
        this.destroy(err);
      }
    }
    try {
      let bytesRead, newLineEnding;

      //Read at least one full line from file
      let chunks = [];
      do {
        n = Math.min(n, this.pos);
        this.pos -= n;
        let buf = Buffer.alloc(n);
        bytesRead = (await this.fd.read(buf, 0, n, this.pos)).bytesRead;
        newLineEnding = buf.lastIndexOf("\n");
        if (bytesRead > 0) {
          chunks.unshift(buf.slice(0, bytesRead));
        }
      } while (bytesRead > 0 && newLineEnding == -1);

      while (chunks.length > 0) {
        let chunk = chunks.pop();

        newLineEnding = chunk.lastIndexOf("\n");
        if (newLineEnding == -1) {
          this.line = chunk.toString() + this.line;
        } else {
          this.push(
            chunk.slice(newLineEnding + 1).toString() + this.line + "\n"
          );
          this.line = "";
          chunks.push(chunk.slice(0, newLineEnding));
        }
      }

      if (this.pos == 0) {
        if (this.line !== "") {
          this.push(this.line + "\n");
        }
        this.push(null);
      }
    } catch (err) {
      this.destroy(err);
    }
  }

  async _destroy(err, callback) {
    if (this.fd) {
      try {
        await this.fd.close();
        callback(err);
      } catch (er) {
        callback(er);
      }
    } else {
      callback(err);
    }
  }
};
