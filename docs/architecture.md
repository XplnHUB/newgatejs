# Newgate Architecture Overview

This document describes the internal architecture and design patterns of the Newgate framework.

## Table of Contents

- [Overview](#overview)
- [Core Components](#core-components)
- [Request Flow](#request-flow)
- [Module Structure](#module-structure)
- [Design Patterns](#design-patterns)

---

## Overview

Newgate is a lightweight, multi-format backend framework built on Node.js's native HTTP module. It provides:

- **Express-like routing** with parameter and wildcard support
- **Automatic content-type detection** and parsing
- **Middleware system** with global and route-level support
- **Enhanced response helpers** for multiple formats
- **Error handling** with custom middleware
- **Graceful shutdown** with cleanup hooks

The framework is designed to be minimal yet extensible, allowing developers to handle multiple data formats without external dependencies for routing or middleware.

---

## Core Components

### 1. App (`src/core/app.js`)

The main application class that orchestrates the framework.

**Responsibilities:**
- Route registration (GET, POST, PUT, DELETE, PATCH)
- Global middleware management
- CORS configuration
- Shutdown hook management
- Server lifecycle (listen, shutdown)

**Key Methods:**
- `get/post/put/delete/patch(path, ...handlers)` - Register routes
- `use(middleware)` - Register middleware
### 1. App Class (`src/core/app.js`)

The `App` class is the main entry point. It orchestrates:
- Server creation (`http.createServer`)
- Route registration
- Middleware execution
- Request/Response enhancement
- Error handling

### 2. Router (`src/core/router.js`)

The `Router` handles URL matching and handler dispatching.
- Stores routes in a structured format.
- Supports parameterized routes (`/users/:id`).
- Supports wildcard routes (`/files/*`).
- Handles HTTP methods (GET, POST, PUT, DELETE, etc.).

### 3. Middleware Engine

Newgate uses a middleware stack similar to Connect/Express.
- **Global Middleware**: Runs for every request.
- **Path-Specific Middleware**: Runs for requests matching a path prefix.
- **Route-Specific Middleware**: Runs for specific routes.
- **Error Middleware**: Handles errors propagated via `next(err)`.

### 4. Parsers (`src/parsers/`)

The parsing system is modular. It inspects the `Content-Type` header and delegates to the appropriate parser.
- `json.js`: Handles `application/json`.
- `csv.js`: Handles `text/csv`.
- `xml.js`: Handles `application/xml`.
- `yaml.js`: Handles `application/x-yaml`.
- `formdata.js`: Handles `multipart/form-data`.
- `binary.js`: Handles `application/octet-stream`.

### 5. Response Enhancer (`src/response/enhance.js`)

The `enhanceResponse` function adds helper methods to the native `ServerResponse` object.
- `res.json(data)`
- `res.csv(data)`
- `res.xml(data)`
- `res.status(code)`
- `res.send(data)`

## Request Flow

1. **Incoming Request**: HTTP server receives a request.
2. **Enhancement**: `req` and `res` objects are enhanced with Newgate properties and methods.
3. **Body Parsing**: The body is parsed based on `Content-Type`.
4. **Middleware Execution**: Global and path-specific middleware are executed in order.
5. **Route Matching**: The router finds a matching route handler.
6. **Handler Execution**: The route handler is executed.
7. **Response**: The handler sends a response using one of the helper methods.

## Module Structure

```
newgatejs/
├── bin/
│   └── newgatejs.js          # CLI entry point
├── src/
│   ├── core/
│   │   ├── app.js      # Main App class
│   │   ├── router.js   # Routing logic
│   │   └── server.js   # HTTP server wrapper
│   ├── middleware/
│   │   └── index.js    # Built-in middleware
│   ├── parsers/
│   │   ├── index.js    # Parser dispatcher
│   │   ├── json.js
│   │   ├── csv.js
│   │   └── ...
│   ├── response/
│   │   └── enhance.js  # Response helpers
│   └── utils/
│       └── logger.js   # Logger utility
├── tests/              # Unit and integration tests
├── docs/               # Documentation
└── package.json
```

## Extensibility

Newgate is designed to be extensible.
- **Custom Parsers**: Can be added by modifying the parser dispatcher (future feature: plugin system).
- **Custom Middleware**: Standard middleware signature `(req, res, next)` allows easy integration of custom logic.
- `xml(data)` - Send XML
- `yaml(data)` - Send YAML
- `file(buffer, mimetype)` - Send binary
- `error(options)` - Send error response
- `stream(stream)` - Pipe stream
- `download(path, filename)` - Send file download

### 7. Utilities (`src/utils/`)

Helper functions for common tasks.

**Utilities:**
- `detectContentType.js` - Parse content-type header
- `streamToBuffer.js` - Convert stream to buffer
- `urlParser.js` - Parse URL components
- `deepMerge.js` - Recursively merge objects

---

## Request Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Incoming HTTP Request                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  Parse Request Body            │
        │  (based on content-type)       │
        └────────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │  Enhance Response Object       │
        │  (add helper methods)          │
        └────────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │  Execute Global Middleware     │
        │  (in order)                    │
        └────────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │  Match Route                   │
        │  (method + path)               │
        └────────────┬───────────────────┘
                     │
            ┌────────┴────────┐
            │                 │
        ┌───▼──┐          ┌──▼────┐
        │Found │          │ Not   │
        │      │          │ Found │
        └───┬──┘          └──┬────┘
            │                │
            ▼                ▼
    ┌──────────────┐   ┌─────────────┐
    │Execute Route │   │Send 404     │
    │Handlers      │   │Response     │
    └──────┬───────┘   └─────────────┘
           │
           ▼
    ┌──────────────┐
    │Send Response │
    └──────────────┘
```

---

## Module Structure

```
newgatejs/
├── src/
│   ├── core/
│   │   ├── app.js           # Main App class
│   │   ├── router.js        # Route matching
│   │   ├── middleware.js    # Middleware engine
│   │   └── server.js        # HTTP server
│   ├── parsers/
│   │   ├── index.js         # Parser dispatcher
│   │   ├── json.js          # JSON parser
│   │   ├── csv.js           # CSV parser
│   │   ├── xml.js           # XML parser
│   │   ├── yaml.js          # YAML parser
│   │   ├── formdata.js      # Form-data parser
│   │   └── binary.js        # Binary parser
│   ├── response/
│   │   └── enhance.js       # Response helpers
│   └── utils/
│       ├── detectContentType.js
│       ├── streamToBuffer.js
│       ├── urlParser.js
│       └── deepMerge.js
├── tests/
├── docs/
├── examples/
├── index.js                 # Entry point
├── index.d.ts              # TypeScript definitions
└── package.json
```

---

## Design Patterns

### 1. Middleware Chain Pattern

Middleware is executed sequentially with a `next()` callback:

```javascript
app.use((req, res, next) => {
  // Do something
  next(); // Continue to next middleware
});
```

**Features:**
- Error propagation via `next(err)`
- Async support with promises
- Error handler detection (4 parameters)

### 2. Route Handler Pattern

Routes accept multiple handlers (middleware + final handler):

```javascript
app.get('/path',
  (req, res, next) => { /* middleware */ next(); },
  (req, res) => { /* handler */ }
);
```

### 3. Content-Type Negotiation

Automatic parsing based on `Content-Type` header:

```
Content-Type: application/json     → parseJSON()
Content-Type: text/csv             → parseCSV()
Content-Type: application/xml      → parseXML()
Content-Type: application/x-yaml   → parseYAML()
Content-Type: multipart/form-data  → parseFormData()
```

### 4. Response Enhancement

Response object is enhanced with format-specific methods:

```javascript
res.json(data)      // JSON response
res.csv(data)       // CSV response
res.xml(data)       // XML response
res.yaml(data)      // YAML response
res.download(path)  // File download
```

### 5. Error Handling

Three-level error handling:

1. **Parser errors** - Caught during request parsing
2. **Middleware errors** - Passed via `next(err)`
3. **Route errors** - Caught by error handlers

Error handlers are identified by 4 parameters:

```javascript
app.useError((err, req, res, next) => {
  // Handle error
});
```

### 6. Graceful Shutdown

Shutdown hooks allow cleanup:

```javascript
app.onShutdown(async () => {
  // Close connections
  // Cleanup resources
});
```

---

## Performance Considerations

### 1. Route Matching

- Routes are stored in an array
- Linear search through routes (O(n))
- Regex compilation happens at registration time
- Consider route ordering for frequently accessed paths

### 2. Middleware Execution

- Middleware runs sequentially
- Async middleware is awaited
- Early termination possible via response send

### 3. Parser Performance

- Streaming for large files (form-data)
- Buffer-based parsing for other formats
- Schema validation optional (CSV)

### 4. Memory Management

- Form-data has configurable limits
- Stream-based parsing for large uploads
- Automatic cleanup on server shutdown

---

## Extension Points

### Custom Middleware

```javascript
app.use((req, res, next) => {
  // Custom logic
  next();
});
```

### Custom Error Handlers

```javascript
app.useError((err, req, res, next) => {
  // Custom error handling
});
```

### Custom Parsers

Extend the parser dispatcher in `src/parsers/index.js`:

```javascript
if (contentType === 'custom/format') {
  body = parseCustom(buffer);
  bodyType = 'custom';
}
```

### Custom Response Methods

Extend response in `src/response/enhance.js`:

```javascript
res.custom = (data) => {
  res.setHeader('Content-Type', 'custom/format');
  res.end(data);
};
```

---

## Security Considerations

### 1. XML External Entity (XXE) Protection

XML parser runs in safe mode by default:
- External entities disabled
- DOCTYPE processing disabled

### 2. File Upload Limits

Form-data parser enforces:
- File size limits (10MB default)
- Total memory limits (50MB default)
- File count limits (10 default)

### 3. CORS Configuration

CORS headers are configurable:
- Origin validation
- Method restrictions
- Header filtering

### 4. Error Messages

Production mode hides error details:
- Development: Full error messages
- Production: Generic error messages

---

## Future Enhancements

### Planned Features

1. **Route Caching** - Cache compiled route patterns
2. **Middleware Caching** - Pre-compile middleware chains
3. **Request Pooling** - Reuse request/response objects
4. **Plugin System** - Load custom modules
5. **Rate Limiting** - Built-in rate limiting middleware
6. **Compression** - Gzip/brotli compression
7. **Clustering** - Multi-process support
8. **Metrics** - Built-in performance metrics

### Optimization Opportunities

1. Replace linear route search with trie-based matching
2. Implement middleware pre-compilation
3. Add request/response object pooling
4. Optimize regex compilation
5. Add caching layer for parsed requests
