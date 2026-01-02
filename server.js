const express = require('express');
const path = require('path');
const https = require('https');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.SENDINBLUE_API_KEY;
const recipientEmail = 'appua0126@gmail.com';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const sendEmail = ({ name, email, message }) => {
  if (!apiKey) {
    return Promise.reject(new Error('Missing SENDINBLUE_API_KEY'));
  }

  const payload = {
    sender: { name: 'Portfolio Contact', email: recipientEmail },
    to: [{ email: recipientEmail, name: 'Appu M' }],
    replyTo: { email, name },
    subject: 'New portfolio inquiry',
    textContent: `Name: ${name}\nEmail: ${email}\n\n${message}`
  };

  const data = JSON.stringify(payload);

  const options = {
    hostname: 'api.brevo.com',
    path: '/v3/smtp/email',
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(data)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
          return;
        }
        const error = new Error(`Brevo request failed: ${res.statusCode}`);
        error.body = body;
        reject(error);
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    res.status(400).json({ ok: false, message: 'Missing required fields.' });
    return;
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    res.status(400).json({ ok: false, message: 'Invalid email.' });
    return;
  }

  try {
    await sendEmail({ name, email, message });
    res.json({ ok: true });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(502).json({ ok: false, message: 'Failed to send message.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
