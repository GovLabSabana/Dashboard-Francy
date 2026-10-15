// Servidor HTTP nativo optimizado para Railway y entornos cloud
// No requiere dependencias externas (usa exclusivamente módulos nativos de Node.js)
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = '0.0.0.0'; // Requerido por Railway y Docker para escuchar conexiones externas

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Manejo de endpoint de salud (Health check para Railway)
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/health' || pathname === '/ping') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    return res.end(JSON.stringify({ status: 'healthy', uptime: process.uptime() }));
  }

  // Resolver la ruta del archivo solicitado
  let relativePath = pathname.replace(/^\/+/, '');
  if (!relativePath || relativePath === '') {
    relativePath = 'index.html';
  }

  // Prevenir Directory Traversal
  const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(__dirname, safePath);

  // Si se solicita un directorio, intentar servir index.html dentro de él
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Fallback si no existe: probar index.html o el dashboard HTML
  if (!fs.existsSync(filePath)) {
    const defaultFile = path.join(__dirname, 'index.html');
    const legacyFile = path.join(__dirname, 'Dashboard_Executive_Escuela_Gobierno_V12_Corregido.html');
    if (fs.existsSync(defaultFile)) {
      filePath = defaultFile;
    } else if (fs.existsSync(legacyFile)) {
      filePath = legacyFile;
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 No encontrado');
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Cabeceras de seguridad y caché
  const headers = {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN'
  };

  // Compresión gzip si el cliente la soporta y el archivo es texto/html/css/js
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const isCompressible = /text|javascript|json|svg/.test(contentType);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 No encontrado');
    }

    if (isCompressible && acceptEncoding.includes('gzip')) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);
      const rawStream = fs.createReadStream(filePath);
      const gzipStream = zlib.createGzip();
      rawStream.pipe(gzipStream).pipe(res);
    } else {
      headers['Content-Length'] = stats.size;
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`=========================================`);
  console.log(`🚀 Dashboard Ejecutivo desplegado`);
  console.log(`📍 Escuchando en http://${HOST}:${PORT}`);
  console.log(`🩺 Health check: http://${HOST}:${PORT}/health`);
  console.log(`=========================================`);
});

// Manejo de señales para apagado elegante en contenedores
process.on('SIGTERM', () => {
  console.log('Recibida señal SIGTERM, cerrando servidor...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('Recibida señal SIGINT, cerrando servidor...');
  server.close(() => process.exit(0));
});
