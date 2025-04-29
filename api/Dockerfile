FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for markitdown
RUN apt-get update && apt-get install -y \
    libmagic1 \
    tesseract-ocr \
    libreoffice \
    poppler-utils \
    ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"] 