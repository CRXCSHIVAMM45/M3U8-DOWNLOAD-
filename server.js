const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.post('/download', (req, res) => {
  const { url } = req.body;
  if (!url || !url.endsWith('.m3u8')) return res.json({ success: false, error: 'Invalid URL' });

  const filename = `video_${Date.now()}.mp4`;
  const filepath = path.join(__dirname, filename);

  const cmd = `ffmpeg -y -i "${url}" -c copy "${filepath}"`;
  exec(cmd, (error, stdout, stderr) => {
    if (error) return res.json({ success: false, error: 'Failed to download video.' });

    const fileUrl = `${req.protocol}://${req.get('host')}/files/${filename}`;
    res.json({ success: true, file: fileUrl });
  });
});

app.use('/files', express.static(__dirname));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
