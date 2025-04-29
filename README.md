# MarkItDown UI

A beautiful, modern web interface for the [MarkItDown](https://github.com/microsoft/markitdown) document conversion utility. This application allows users to upload various file formats and convert them to Markdown format. Use the markdown converter for llms, agents, and more.

## Features

- User-friendly file upload with drag and drop support
- Conversion of various document formats to Markdown
- Preview converted Markdown with syntax highlighting
- Copy Markdown to clipboard or download as .md file
- Responsive design that works on all devices

## Supported File Formats

MarkItDown supports a wide variety of file formats, including:

- PDF
- PowerPoint
- Word
- Excel
- Images (with OCR capabilities)
- Audio (with transcription)
- HTML, CSV, JSON, XML
- ZIP files
- YouTube URLs
- EPubs
- And more!

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Backend Integration

This frontend UI is designed to work with a backend API that utilizes the MarkItDown Python library. For a full deployment, you would need to:

1. Create a backend API service using a framework like Flask or FastAPI
2. Install the MarkItDown Python package: `pip install 'markitdown[all]'`
3. Create endpoints that receive files and use MarkItDown to convert them
4. Update the frontend to call your backend API endpoints

## License

This project is open source and available under the MIT License.

## Acknowledgements

- [MarkItDown](https://github.com/microsoft/markitdown) - The core conversion library
- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [Lucide React](https://lucide.dev/) - For icons 