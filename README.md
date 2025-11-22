##DoH Proxy Server

This project is a DNS over HTTPS (DoH) proxy server, fully developed with the help of AI. It is still under active development, and bug fixes and improvements will be released soon.

High-performance DNS over HTTPS (DoH) proxy server built with NestJS. Forwards client DoH requests to Cloudflare's secure DoH service.

## Features

- ✅ **DNS Wireformat Support**: GET and POST requests with `application/dns-message`
- ✅ **JSON API Support**: GET requests with `application/dns-json`
- ✅ **High Performance**: Connection pooling, HTTP keep-alive, response compression
- ✅ **Scalable**: PM2 cluster mode for multi-core utilization
- ✅ **Streaming**: Efficient request/response streaming without buffering
- ✅ **CORS Enabled**: Browser-compatible DoH client support

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run start:dev
```

Server will start on `http://localhost:3000`

### Production Build

```bash
npm run build
npm run start:prod
```

### Production with PM2 (Cluster Mode)

```bash
npm run build
pm2 start ecosystem.config.js
pm2 monit
```

## API Endpoints

### GET - DNS Wireformat

```bash
curl "http://localhost:3000/?dns=AAABAAABAAAAAAAAA3d3dwdleGFtcGxlA2NvbQAAAQAB"
```

### POST - DNS Wireformat

```bash
curl -X POST \
  -H "Content-Type: application/dns-message" \
  --data-binary @dns-query.bin \
  http://localhost:3000/
```

### GET - JSON Format

```bash
curl -H "Accept: application/dns-json" \
  "http://localhost:3000/?name=example.com&type=A"
```

## Configuration

Edit `.env` file:

```env
DOH_ENDPOINT=https://security.cloudflare-dns.com/dns-query
DOH_JSON_ENDPOINT=https://security.cloudflare-dns.com/dns-query
PORT=3000
PATH_PREFIX=
```

## Performance Optimizations

- **Connection Pooling**: 100 max sockets per protocol with keep-alive
- **HTTP Keep-Alive**: 30 second keep-alive timeout
- **Response Compression**: GZIP compression enabled
- **Cluster Mode**: PM2 configuration for all CPU cores
- **Minimal Logging**: Error/warn only in production
- **Streaming**: Zero-copy streaming for POST requests

## Testing Performance

Install `hey` for load testing:

```bash
# Test with 200 concurrent users
hey -n 10000 -c 200 "http://localhost:3000/?dns=AAABAAABAAAAAAAAA3d3dwdleGFtcGxlA2NvbQAAAQAB"
```

## License

0BSD
