import { useState } from 'react'
import { FileUploader } from './FileUploader'
import { MarkdownPreview } from './MarkdownPreview'
import { AlertCircle, Link, MessageSquare } from 'lucide-react'

export function MarkdownConverter() {
  const [markdown, setMarkdown] = useState<string>('')
  const [filename, setFilename] = useState<string>('')
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversionMode, setConversionMode] = useState<'file' | 'url' | 'text'>('file')
  const [url, setUrl] = useState('')
  const [textContent, setTextContent] = useState('')
  const [textMimeType, setTextMimeType] = useState('text/plain')

  const handleFileSelect = async (file: File, options: { enablePlugins: boolean, useDocumentIntelligence: boolean }) => {
    setIsConverting(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('enable_plugins', options.enablePlugins.toString())
      formData.append('use_document_intelligence', options.useDocumentIntelligence.toString())
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to convert file')
      }
      
      const data = await response.json()
      setMarkdown(data.markdown)
      setFilename(data.filename)
    } catch (err) {
      console.error('Error converting file:', err)
      setError('Failed to convert file. Please try again with a different format.')
      setMarkdown('')
    } finally {
      setIsConverting(false)
    }
  }

  const handleUrlConvert = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConverting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/convert-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          conversion_options: {
            enable_plugins: false,
            use_document_intelligence: false
          }
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to convert URL')
      }
      
      const data = await response.json()
      setMarkdown(data.markdown)
      setFilename(data.filename || new URL(url).pathname.split('/').pop() || 'converted')
    } catch (err) {
      console.error('Error converting URL:', err)
      setError('Failed to convert URL. Please check the URL and try again.')
      setMarkdown('')
    } finally {
      setIsConverting(false)
    }
  }

  const handleTextConvert = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConverting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/convert-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textContent,
          mime_type: textMimeType,
          filename: 'text-content'
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to convert text')
      }
      
      const data = await response.json()
      setMarkdown(data.markdown)
      setFilename(data.filename || 'converted-text')
    } catch (err) {
      console.error('Error converting text:', err)
      setError('Failed to convert text. Please try a different format.')
      setMarkdown('')
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button 
          onClick={() => setConversionMode('file')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
            conversionMode === 'file' 
              ? 'bg-white dark:bg-gray-700 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          File Upload
        </button>
        <button 
          onClick={() => setConversionMode('url')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
            conversionMode === 'url' 
              ? 'bg-white dark:bg-gray-700 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          URL
        </button>
        <button 
          onClick={() => setConversionMode('text')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
            conversionMode === 'text' 
              ? 'bg-white dark:bg-gray-700 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Text
        </button>
      </div>
      
      <div className="mb-8">
        {conversionMode === 'file' && (
          <FileUploader onFileSelect={handleFileSelect} isConverting={isConverting} />
        )}
        
        {conversionMode === 'url' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Link className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-lg font-medium">Convert from URL</h3>
            </div>
            
            <form onSubmit={handleUrlConvert}>
              <div className="mb-4">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enter a URL to convert
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                  disabled={isConverting}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Supports websites, YouTube videos, Wikipedia articles, and more
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isConverting}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConverting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Converting...
                  </>
                ) : (
                  'Convert URL'
                )}
              </button>
            </form>
          </div>
        )}
        
        {conversionMode === 'text' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-lg font-medium">Convert Text Content</h3>
            </div>
            
            <form onSubmit={handleTextConvert}>
              <div className="mb-4">
                <label htmlFor="mime-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content Type
                </label>
                <select
                  id="mime-type"
                  value={textMimeType}
                  onChange={(e) => setTextMimeType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white mb-4"
                  disabled={isConverting}
                >
                  <option value="text/plain">Plain Text</option>
                  <option value="text/html">HTML</option>
                  <option value="text/markdown">Markdown</option>
                  <option value="application/json">JSON</option>
                  <option value="application/xml">XML</option>
                </select>
                
                <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enter content to convert
                </label>
                <textarea
                  id="text-content"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                  placeholder="Paste your text or code here..."
                  required
                  disabled={isConverting}
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isConverting}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConverting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Converting...
                  </>
                ) : (
                  'Convert Text'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
      
      {markdown && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Converted Markdown{filename ? ` - ${filename}` : ''}
          </h2>
          <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
            <MarkdownPreview markdown={markdown} fileName={filename} />
          </div>
        </div>
      )}
    </div>
  )
} 