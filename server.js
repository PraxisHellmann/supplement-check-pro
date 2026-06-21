const express = require('express');
const fetch   = require('node-fetch');
const path    = require('path');
const app     = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/analyze', async (req, res) => {
  console.log('Anfrage erhalten!');
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    console.log('Anthropic Status:', response.status);
    res.json(data);
  } catch (err) {
    console.error('Fehler:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/test', (req, res) => {
  res.json({ status: 'Server läuft ✅', key: process.env.ANTHROPIC_API_KEY ? 'API Key vorhanden ✅' : 'API Key FEHLT ❌' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server läuft auf Port ' + PORT));
