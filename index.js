const express = require('express'); 
const app = express();
const FileService = require('./services/fileService')
const fileService = new FileService();
const port = 3000;

/* 
 * handling customer request using POST
 * in order to avoid GET request being
 * cached for any route intermediate 
 */

/* root endpoint returning full file content */
app.post('/file/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const result = await fileService.getContent(filename);
    res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch(err) {
    res.status(400);
  }
})

/* endpoint returning last n events for given file */
app.post('/file/:filename/events/:n', async (req, res) => {
  try {
    const { 
      filename,
      n
    } = req.params;

    const result = await fileService.getContent(filename, n);
    res.status(200).json({
        status: 'ok',
        data: result
    });
  } catch(err) {
    res.status(400).json(err);
  }
})

/* endpoint returning all matching keyword from last n events */
app.post('/file/:filename/events/:n/keyword/:key', async (req, res) => {
  try {
    const { 
      filename,
      n,
      key
    } = req.params;

    const result = await fileService.getContent(filename, n, key);
    res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch(err) {
    res.status(400).json(err);
  }
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}/`);
})
