# Appu Portfolio

Modern, responsive portfolio site for Appu M with dedicated pages for About, Projects, Services, and Contact.

## Live Site
- https://appu-devloper.github.io/

## Features
- Clean, sectioned layout across multiple pages
- Smooth reveal animations and parallax accents
- Project and certificate carousels
- Responsive navigation with mobile toggle
- Contact form with validation

## Pages
- `/` (Home)
- `/about/`
- `/projects/`
- `/services/`
- `/contact/`

## Local Development
This is a static site, so you can open `index.html` directly. Some features (like the contact form backend) require a local server.

### Run a local server (optional)
If you want to use the contact form backend locally:

1) Install dependencies:
```
npm install
```

2) Create `.env` from the example:
```
SENDINBLUE_API_KEY=your_key_here
PORT=3000
```

3) Start the server:
```
npm start
```

Then open:
- http://localhost:3000/

## Contact Form Backend (Brevo / Sendinblue)
The contact form posts to `/api/contact`, which sends an email via Brevo (Sendinblue) using the `SENDINBLUE_API_KEY` environment variable.

Notes:
- GitHub Pages cannot run the Node backend. For production sending, use a server or serverless function.
- Make sure the sender address is verified in your Brevo account.

## Tech Stack
- HTML, CSS, JavaScript
- Node.js (Express) for the optional contact API

## License
See `LICENSE`.
