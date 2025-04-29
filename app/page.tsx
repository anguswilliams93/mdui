"use client"

import { useState } from 'react'
import { FileUploader } from '@/components/FileUploader'
import { MarkdownPreview } from '@/components/MarkdownPreview'
import { Header } from '@/components/Header'
import { SupportedFormats } from '@/components/SupportedFormats'
import { MarkdownConverter } from '@/components/MarkdownConverter'
import { FileText, Link, MessageSquare, ArrowRight } from 'lucide-react'

export default function Home() {
  const [markdownContent, setMarkdownContent] = useState<string>('')
  const [isConverting, setIsConverting] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleFileConversion = async (file: File) => {
    try {
      setIsConverting(true)
      setError(null)
      setFileName(file.name)
      
      const formData = new FormData()
      formData.append('file', file)
      
      // In a production app, this would call your actual backend API
      // For this demo, we'll use our mock API route
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to convert file')
      }
      
      const data = await response.json()
      setMarkdownContent(data.markdown)
    } catch (error) {
      console.error('Error converting file:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      setMarkdownContent('')
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">MarkItDown Converter</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Transform your documents, presentations, web content, and more into clean, structured Markdown with just a few clicks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">File Conversion</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Upload PDFs, Office documents, images, audio files, and more to convert them into well-structured Markdown.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                <Link className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">URL Conversion</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Convert web pages, YouTube videos, Wikipedia articles, and other online content directly from URLs.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Text Conversion</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Paste HTML, code snippets, or other text formats to instantly convert them to clean Markdown.
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Universal Markdown Converter</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Choose a conversion method below to transform your content into clean, structured Markdown.
              </p>
              
              <MarkdownConverter />
            </div>
          </div>
          
          <div className="mt-16">
            <SupportedFormats />
          </div>
          
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Choose Your Source</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload a file, enter a URL, or paste text content that you want to convert to Markdown.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Intelligent Conversion</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our application uses the MarkItDown library to extract and format your content with AI-powered document processing.
                </p>
              </div>
          
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Get Your Markdown</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Preview the result with syntax highlighting, copy to clipboard, or download the converted markdown for your projects.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl overflow-hidden shadow-lg text-white p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl font-bold mb-3">Powerful Document Intelligence</h2>
                <p className="text-white/80 mb-4">
                  Need advanced document processing? Enable our Document Intelligence feature for enhanced layout recognition, 
                  table extraction, and more accurate conversions.
                </p>
                <div className="flex items-center">
                  <a 
                    href="https://github.com/microsoft/markitdown" 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="inline-flex items-center bg-white text-primary-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-opacity-90 transition-colors"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-white/20 rounded w-full"></div>
                    <div className="h-3 bg-white/20 rounded w-3/4"></div>
                    <div className="h-3 bg-white/20 rounded w-5/6"></div>
                    <div className="h-3 bg-white/20 rounded w-2/3"></div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="h-10 bg-white/20 rounded"></div>
                      <div className="h-10 bg-white/20 rounded"></div>
                      <div className="h-10 bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-24 py-12">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>
            Powered by{' '}
            <a 
              href="https://github.com/microsoft/markitdown" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              MarkItDown
            </a>
            {' '}— A Microsoft Open Source Project
          </p>
        </div>
      </footer>
    </div>
  )
} 