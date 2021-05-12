const assert = require("assert");
const FileService = require("../services/fileService");
const stream = require("stream");

class StringWritableStream extends stream.Writable {
  constructor() {
    super();
    this.content = "";
  }

  _write(chunk, enc, next) {
    this.content += chunk.toString();
    next();
  }
}

describe("FileService", () => {
  const fs = new FileService("./test/logs/");

  it("Should return the content of the given file in reversed order", async () => {
    var outputStream = new StringWritableStream();
    await fs.getContent(outputStream, "test1.log");

    const expected = `May 11 15:30:01 laptop CRON[28672]: pam_unix(cron:session): session closed for user root
May 11 15:30:01 laptop CRON[28672]: pam_unix(cron:session): session opened for user root by (uid=0)
May 11 15:17:01 laptop CRON[27228]: pam_unix(cron:session): session closed for user root
`;

    assert.strictEqual(outputStream.content, expected);
  });

  it("Should return an error if passed a directory", async () => {
    var outputStream = new StringWritableStream();

    await assert.rejects(fs.getContent(outputStream, "dir"));
  });

  it("Should return an error if passed an invalid path", async () => {
    var outputStream = new StringWritableStream();

    await assert.rejects(fs.getContent(outputStream, "nonexistent"));
  });

  it("Should be able to filter by keyword", async () => {
    var outputStream = new StringWritableStream();
    await fs.getContent(outputStream, "test1.log", -1, "closed");

    const expected = `May 11 15:30:01 laptop CRON[28672]: pam_unix(cron:session): session closed for user root
May 11 15:17:01 laptop CRON[27228]: pam_unix(cron:session): session closed for user root
`;

    assert.strictEqual(outputStream.content, expected);
  });

  it("Should be able to limit the number of lines to N", async () => {
    var outputStream = new StringWritableStream();
    await fs.getContent(outputStream, "test1.log", 2);

    const expected = `May 11 15:30:01 laptop CRON[28672]: pam_unix(cron:session): session closed for user root
May 11 15:30:01 laptop CRON[28672]: pam_unix(cron:session): session opened for user root by (uid=0)
`;

    assert.strictEqual(outputStream.content, expected);
  });

  it("Should be able to limit the number of lines to N while applying a filter", async () => {
    var outputStream = new StringWritableStream();
    await fs.getContent(outputStream, "test1.log", 1, "closed");

    const expected = `May 11 15:30:01 laptop CRON[28672]: pam_unix(cron:session): session closed for user root
`;

    assert.strictEqual(outputStream.content, expected);
  });
});
