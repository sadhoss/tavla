# Tavla Backend

A simple, containerized backend service for managing board data with in-memory storage.

## Features

- In-memory data storage
- RESTful API endpoints
- Bearer token authentication
- Docker support
- Single-user focused

## API Endpoints

- `GET /active` - List all active boards
- `POST /refresh/:bid` - Update board data
- `POST /update/:bid` - Remove a board
- `GET /alive` - Health check

## Requirements

- Rust
- Docker (optional, for containerization)

## Environment Variables

- `HOST` - Server host (default: "0.0.0.0")
- `PORT` - Server port (default: "3000")
- `BACKEND_API_KEY` - API key for authentication (required)

## Running Locally

1. Set environment variables:
   ```bash
   set BACKEND_API_KEY=your-api-key
   ```

2. Build and run:
   ```bash
   cd backend
   cargo build
   cargo run
   ```

## Running with Docker

1. Build the container:
   ```bash
   cd backend
   docker build -t tavla-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 -e BACKEND_API_KEY=your-api-key tavla-backend
   ```

## Authentication

All endpoints require Bearer token authentication. Include the API key in the Authorization header:
```
Authorization: Bearer your-api-key