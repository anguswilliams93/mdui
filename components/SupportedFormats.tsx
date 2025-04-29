"use client"

import { FileText, FileImage, FileAudio, FileCode, File, PieChart, Presentation, Check } from 'lucide-react'

interface FormatCategoryProps {
  icon: React.ReactNode
  title: string
  formats: string[]
}

function FormatCategory({ icon, title, formats }: FormatCategoryProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-3">
        {icon}
        <h3 className="text-lg font-semibold ml-2 text-gray-800 dark:text-white">{title}</h3>
      </div>
      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        {formats.map((format, index) => (
          <li key={index} className="flex items-center">
            <span className="w-2 h-2 bg-primary-400 rounded-full mr-2"></span>
            {format}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SupportedFormats() {
  const formats = [
    {
      title: "Documents",
      items: ["PDF", "Word (.docx)", "PowerPoint (.pptx)", "Excel (.xlsx, .xls)", "Text-based formats"]
    },
    {
      title: "Images",
      items: ["JPG/JPEG", "PNG", "GIF", "BMP", "WEBP", "SVG", "TIFF", "HEIC"]
    },
    {
      title: "Audio",
      items: ["MP3", "WAV", "FLAC", "OGG", "AAC"]
    },
    {
      title: "Web Content",
      items: ["HTML", "RSS Feeds", "YouTube Videos", "Wikipedia Articles", "Any Website URL"]
    },
    {
      title: "Data & Code",
      items: ["JSON", "XML", "CSV", "YAML", "Jupyter Notebooks (.ipynb)"]
    },
    {
      title: "Archives & eBooks",
      items: ["ZIP", "EPub", "Email (.msg)", "Archives with text-based content"]
    }
  ]

  const conversionTypes = [
    {
      title: "File Upload",
      description: "Upload local files from your computer",
      examples: ["PDF documents", "Office files", "Images", "Audio files"]
    },
    {
      title: "URL Conversion",
      description: "Convert online content directly from URLs",
      examples: ["Web pages", "YouTube videos", "Wikipedia articles", "Online documents"]
    },
    {
      title: "Text Conversion",
      description: "Paste and convert text content",
      examples: ["HTML snippets", "Code blocks", "JSON/XML data", "Plain text"]
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 sm:p-10">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Supported Formats & Conversion Types</h2>
      
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Conversion Methods</h3>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {conversionTypes.map((type) => (
          <div key={type.title} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">{type.title}</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{type.description}</p>
            <ul className="space-y-1">
              {type.examples.map((example) => (
                <li key={example} className="text-gray-600 dark:text-gray-400 text-sm flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                  {example}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Supported File Formats</h3>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {formats.map((category) => (
          <div key={category.title} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">{category.title}</h4>
            <ul className="space-y-1.5">
              {category.items.map((item) => (
                <li key={item} className="text-gray-600 dark:text-gray-400 text-sm flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800 text-center">
        <p className="text-primary-700 dark:text-primary-300 text-sm">
          Powered by the{' '}
          <a 
            href="https://github.com/microsoft/markitdown" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            MarkItDown
          </a>
          {' '}library. Don't see your format? New converters are being added regularly!
        </p>
      </div>
    </div>
  )
} 