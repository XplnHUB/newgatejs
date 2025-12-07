<img width="944" height="411" alt="NewGate-Banner" src="https://github.com/user-attachments/assets/af212f3a-0e96-42d1-a6d0-9ed34a178ad6" />

> A modern, lightweight, and multi-format backend framework for Node.js.

[![npm version](https://img.shields.io/npm/v/newgatejs.svg)](https://www.npmjs.com/package/newgatejs)
[![npm downloads](https://img.shields.io/npm/dm/newgatejs.svg)](https://www.npmjs.com/package/newgatejs)
[![npm total downloads](https://img.shields.io/npm/dt/newgatejs.svg)](https://www.npmjs.com/package/newgatejs)
[![License](https://img.shields.io/npm/l/newgatejs.svg)](https://github.com/XplnHUB/newgatejs/blob/main/LICENSE)

## Overview

**Newgate** is a modern Node.js backend framework designed for developers who want to handle multiple data formats effortlessly. It combines the simplicity of Express-style routing with automatic parsing for JSON, CSV, XML, YAML, form-data, and binary data.

Whether you're building a REST API, a data processing service, or an IoT backend, Newgate has you covered.

## Features

- **Express-style Routing**: Familiar API for defining routes and middleware.
- **Multi-format Parsing**: Automatic parsing for JSON, CSV, XML, YAML, Form-Data, and Binary.
- **Middleware System**: Robust middleware support for logging, authentication, and more.
- **Lightweight**: Zero external dependencies for core routing and middleware.
- **Security**: Built-in security features like XXE protection and file upload limits.
- **Enhanced Responses**: Helper methods for sending responses in various formats (`res.json`, `res.csv`, `res.xml`, etc.).
- **Auto-Documentation**: Automatically generate API documentation from your routes.

## Installation

```bash
npm install newgate
```

## Quick Start

Create a simple server in `index.js`:

```javascript
import App from 'newgate';

const app = new App();

// Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


// XML route
app.post("/xml", (req, res) => {
  res.json({ received: req.body, type: req.bodyType });
});

// Binary route
app.post("/binary", (req, res) => {
  res.send(`Binary data received: ${req.body.length} bytes`);
});

// Start server
app.listen(3000, () => console.log("newgate running on http://localhost:3000"));
```

---

## Example Requests

**JSON**

```bash
curl -X POST http://localhost:3000/json \
-H "Content-Type: application/json" \
-d '{"name":"arpit","age":20}'
```

**CSV**

```bash
curl -X POST http://localhost:3000/csv \
-H "Content-Type: text/csv" \
--data "name,age\narpit,20\nadarsh,19"
```

**XML**

```bash
curl -X POST http://localhost:3000/xml \
-H "Content-Type: application/xml" \
--data "<users><user><name>arpit</name><age>20</age></user></users>"
```

**Binary**

```bash
curl -X POST http://localhost:3000/binary \
-H "Content-Type: application/octet-stream" \
--data-binary "@largefile.bin"
```

---

## Documentation

* **[API Reference](./docs/api.md)** - Complete API documentation with examples
* **[Architecture Overview](./docs/architecture.md)** - Internal design and patterns
* **[Security Practices](./docs/security.md)** - Security guidelines and best practices
* **[Troubleshooting Guide](./docs/troubleshooting.md)** - Common issues and solutions

---

## How It Works

1. The HTTP server receives the request.
2. The auto-detect parser identifies the content type and parses the body into `req.body`.
3. Middleware functions are executed in order.
4. The appropriate route handler is called with extracted parameters.
5. Response helpers send data back to the client in the desired format.

---

## Roadmap

**v1.0 – Core Framework**

* JSON, CSV, XML, YAML, Form-data, Binary parsing
* Express-style routing
* Middleware support
* Basic response helpers

**v1.5 – Developer Experience**

* CLI for scaffolding projects
* Hot reload for routes
* Auto-generated API documentation

**v2.0 – Advanced Features**

* AI-assisted validation and error suggestions
* Edge/serverless deployment support
* Multi-protocol support (HTTP, WebSocket, gRPC)
* Plugin system for third-party parsers
* Predictive caching and monitoring

**v3.0+ – Next-gen Backend**

* Reactive routes (Observable streams)
* Real-time request/response dashboard
* Versioned APIs and time-travel debugging
* Auto translation between data formats

---

## Contributing

Contributions are welcome. Fork the repository, submit pull requests, or suggest new features.

---

## License

MIT License

