const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <h1>M3U8 Downloader</h1>
    <form method="GET" action="/download">
      <input type="text" name="url" placeholder="Enter M3U8 URL" size="60" required>
      <button type="submit">Download</button>
    </form>
  `);
});

app.get('/download', (req, res) => {
  const m3u8Url = req.query.url;
  if (!m3u8Url) return res.send('Please provide a M3U8 URL.');

  const outputFile = `output_${Date.now()}.mp4`;
  const command = `ffmpeg -i "${m3u8Url}" -c copy ${outputFile}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return res.send('Error downloading stream. Check server logs.');
    }
    res.download(outputFile, () => {
      exec(`rm ${outputFile}`); // Clean up after sending
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
