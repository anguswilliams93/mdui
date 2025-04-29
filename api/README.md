# MarkItDown API

This is a FastAPI backend that provides an API for converting various file formats to Markdown using the [MarkItDown](https://github.com/microsoft/markitdown) library.

## Features

- File conversion to Markdown
- Supports multiple file formats:
  - PDF
  - PowerPoint
  - Word
  - Excel
  - Images (EXIF metadata and OCR)
  - Audio (EXIF metadata and speech transcription)
  - HTML
  - Text-based formats (CSV, JSON, XML)
  - ZIP files
  - YouTube URLs
  - EPubs
  - and more

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   uvicorn app:app --reload
   ```

The API will be available at `http://localhost:8000`.

## API Endpoints

### POST /convert

Converts an uploaded file to Markdown.

Example request using curl:
```bash
curl -X POST -F "file=@document.pdf" http://localhost:8000/convert
```

Response:
```json
{
  "markdown": "# Document Title\n\nContent of the document...",
  "filename": "document.pdf"
}
```

### GET /health

Health check endpoint.

Example request:
```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy"
}
```

## API Documentation

After starting the server, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc 