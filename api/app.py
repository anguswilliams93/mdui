from fastapi import FastAPI, UploadFile, HTTPException, File, Form, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import io
import os
from markitdown import MarkItDown, StreamInfo
import tempfile
import shutil
from pydantic import BaseModel, HttpUrl
from typing import Optional, Dict, Any, List
import requests


# initialize the document intelligence client
DOC_INTEL_ENDPOINT = os.getenv("DOC_INTEL_ENDPOINT")
DOC_INTEL_KEY = os.getenv("DOC_INTEL_KEY")


app = FastAPI(title="MarkItDown API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UrlRequest(BaseModel):
    url: HttpUrl
    stream_info: Optional[Dict[str, Any]] = None
    conversion_options: Optional[Dict[str, Any]] = None

class MarkdownResponse(BaseModel):
    markdown: str
    filename: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

def create_markitdown_instance(enable_plugins: bool = False, use_document_intelligence: bool = False, **kwargs):
    """Helper function to create a properly configured MarkItDown instance"""
    if use_document_intelligence:
        # Use Document Intelligence for enhanced document processing
        return MarkItDown(
            enable_plugins=enable_plugins,
            docintel_endpoint=DOC_INTEL_ENDPOINT
            **kwargs
        )
    return MarkItDown(enable_plugins=enable_plugins, **kwargs)

@app.post("/convert", response_model=MarkdownResponse)
async def convert_file(
    file: UploadFile = File(...),
    enable_plugins: bool = Form(False),
    use_document_intelligence: bool = Form(False)
):
    """
    Convert an uploaded file to markdown using MarkItDown.
    
    Supports: PDF, Word, PowerPoint, Excel, Images, Audio, HTML, 
    Text-based formats, ZIP files, YouTube URLs, EPubs, and more.
    """
    try:
        # Initialize MarkItDown with specified options
        md = create_markitdown_instance(
            enable_plugins=enable_plugins,
            use_document_intelligence=use_document_intelligence
        )
        
        # Save the uploaded file to a temporary file
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            # Copy content from uploaded file to temp file
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name
        
        try:
            # Convert the file to markdown
            result = md.convert(temp_file_path)
            
            # Return the markdown content
            return MarkdownResponse(
                markdown=result.text_content,
                filename=file.filename,
                metadata=result.metadata if hasattr(result, "metadata") else None
            )
        finally:
            # Clean up the temporary file
            os.unlink(temp_file_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")

@app.post("/convert-url", response_model=MarkdownResponse)
async def convert_url(request: UrlRequest):
    """
    Convert content from a URL to markdown using MarkItDown.
    
    Supports various web content, including HTML pages, YouTube videos, 
    Wikipedia articles, and more.
    """
    try:
        # Initialize MarkItDown
        md = create_markitdown_instance(
            enable_plugins=request.conversion_options.get("enable_plugins", False) if request.conversion_options else False,
            use_document_intelligence=request.conversion_options.get("use_document_intelligence", False) if request.conversion_options else False
        )
        
        # Create StreamInfo if provided
        stream_info = None
        if request.stream_info:
            stream_info = StreamInfo(**request.stream_info)
        
        # Convert the URL to markdown
        result = md.convert_url(str(request.url), stream_info=stream_info)
        
        # Extract filename from URL if possible
        filename = None
        try:
            from urllib.parse import urlparse
            parsed_url = urlparse(str(request.url))
            path = parsed_url.path
            if path and "/" in path:
                filename = path.rstrip("/").split("/")[-1]
        except:
            pass
            
        # Return the markdown content
        return MarkdownResponse(
            markdown=result.text_content,
            filename=filename,
            metadata=result.metadata if hasattr(result, "metadata") else None
        )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL conversion error: {str(e)}")

@app.post("/convert-text", response_model=MarkdownResponse)
async def convert_text(
    text: str = Body(..., embed=True),
    filename: Optional[str] = Body(None, embed=True),
    mime_type: Optional[str] = Body("text/plain", embed=True)
):
    """
    Convert text content to markdown using MarkItDown.
    
    Useful for converting HTML, code, or other text formats to markdown.
    """
    try:
        # Initialize MarkItDown
        md = create_markitdown_instance()
        
        # Convert the text to bytes and create a BytesIO object
        text_bytes = text.encode('utf-8')
        stream = io.BytesIO(text_bytes)
        
        # Create stream info with the provided mime type
        stream_info = StreamInfo(mimetype=mime_type, filename=filename)
        
        # Convert the stream to markdown
        result = md.convert_stream(stream, stream_info=stream_info)
        
        # Return the markdown content
        return MarkdownResponse(
            markdown=result.text_content,
            filename=filename,
            metadata=result.metadata if hasattr(result, "metadata") else None
        )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text conversion error: {str(e)}")

@app.post("/convert-response", response_model=MarkdownResponse)
async def convert_http_response(
    url: HttpUrl = Body(..., embed=True),
    headers: Optional[Dict[str, str]] = Body({}, embed=True)
):
    """
    Convert an HTTP response directly to markdown using MarkItDown.
    
    This endpoint fetches the content from the URL and converts the response.
    """
    try:
        # Fetch the content from the URL
        session = requests.Session()
        response = session.get(str(url), headers=headers, stream=True)
        response.raise_for_status()
        
        # Initialize MarkItDown
        md = create_markitdown_instance()
        
        # Convert the response to markdown
        result = md.convert_response(response)
        
        # Return the markdown content
        return MarkdownResponse(
            markdown=result.text_content,
            filename=None,
            metadata=result.metadata if hasattr(result, "metadata") else None
        )
            
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"HTTP request error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Response conversion error: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"} 