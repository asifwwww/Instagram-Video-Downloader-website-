const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const qs = require('qs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/indown', async (req, res) => {
  const videoUrl = req.body.url;

  if (!videoUrl || !videoUrl.includes('instagram.com')) {
    return res.status(400).json({ error: 'Invalid Instagram URL' });
  }

  try {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://indown.io',
      'Referer': 'https://indown.io/',
      'User-Agent': 'Mozilla/5.0',
    };

    const data = qs.stringify({ url: videoUrl });
    const response = await axios.post('https://indown.io/download.php', data, { headers });

    const html = response.data;
    const match = html.match(/<a.*?href="(.*?)".*?>Download<\/a>/);

    if (match && match[1]) {
      return res.json({ downloadLink: match[1] });
    }

    res.status(500).json({ error: 'Download link not found' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Something went wrong with InDown proxy' });
  }
});

app.get('/', (req, res) => {
  res.send("Instagram Video Downloader Backend is Running");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
