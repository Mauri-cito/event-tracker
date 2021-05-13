const express = require("express");
const app = express();
const FileService = require("./services/fileService");
const fileService = new FileService();
const port = 3000;

/*
 * handling customer request using POST
 * in order to avoid GET request being
 * cached for any route intermediate
 */

/* root endpoint returning full file content */
app.post("/file/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const keyword = req.query.keyword;
    await fileService.getContent(res, filename, -1, keyword);
  } catch (err) {
    res.status(400).json({
      status: "failed",
      err,
    });
  }
});

/* endpoint returning last n events for given file */
app.post("/file/:filename/events/:n", async (req, res) => {
  try {
    const { filename, n } = req.params;
    const keyword = req.query.keyword;
    await fileService.getContent(res, filename, n, keyword);
  } catch (err) {
    res.status(400).json({
      status: "failed",
      err,
    });
  }
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}/`);
});
