const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = dev ? 'localhost' : '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    // Serve uploaded files from a persistent directory
    if (parsedUrl.pathname && parsedUrl.pathname.startsWith('/uploads/')) {
      const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
      const requested = decodeURIComponent(parsedUrl.pathname.replace('/uploads/', ''));
      const safeName = requested.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = path.join(uploadDir, safeName);

      // Prevent path traversal
      if (!filePath.startsWith(path.resolve(uploadDir))) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }

      if (!fs.existsSync(filePath)) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const mime = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
      }[ext] || 'application/octet-stream';

      res.setHeader('Content-Type', mime);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

      fs.createReadStream(filePath)
        .on('error', () => {
          res.statusCode = 500;
          res.end('Error');
        })
        .pipe(res);
      return;
    }
    
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
