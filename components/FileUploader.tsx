"use client"

import { useState, useRef, DragEvent } from 'react'
import { Upload, Loader2, ToggleLeft, ToggleRight } from 'lucide-react'

interface FileUploaderProps {
  onFileSelect: (file: File, options: { enablePlugins: boolean, useDocumentIntelligence: boolean }) => void
  isConverting: boolean
}

export function FileUploader({ onFileSelect, isConverting }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [enablePlugins, setEnablePlugins] = useState(false)
  const [useDocumentIntelligence, setUseDocumentIntelligence] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      onFileSelect(file, { enablePlugins, useDocumentIntelligence })
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      onFileSelect(file, { enablePlugins, useDocumentIntelligence })
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Stop propagation for the options to prevent triggering file selection
  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const togglePlugins = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEnablePlugins(!enablePlugins)
  }

  const toggleDocIntel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setUseDocumentIntelligence(!useDocumentIntelligence)
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
        } transition-colors cursor-pointer dark:bg-gray-800/30`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".pdf,.docx,.pptx,.xlsx,.xls,.html,.csv,.json,.xml,.zip,.epub,.jpg,.jpeg,.png,.gif,.wav,.mp3"
        />
        
        <div className="flex flex-col items-center justify-center">
          {isConverting ? (
            <>
              <Loader2 className="h-12 w-12 text-primary-500 dark:text-primary-400 animate-spin mb-3" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Converting your file...</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">This may take a moment</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-primary-500 dark:text-primary-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Drop your file here</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">or click to browse</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                PDF, Word, PowerPoint, Excel, HTML, and many other formats supported
              </p>
            </>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4" onClick={handleOptionsClick}>
        <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3">Conversion Options</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Plugins</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Use additional conversion plugins for better results</p>
            </div>
            <button 
              onClick={togglePlugins}
              className="text-primary-500 hover:text-primary-600 dark:text-primary-400"
            >
              {enablePlugins ? (
                <ToggleRight className="h-6 w-6" />
              ) : (
                <ToggleLeft className="h-6 w-6" />
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Use Document Intelligence</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Apply AI-powered document analysis</p>
            </div>
            <button 
              onClick={toggleDocIntel}
              className="text-primary-500 hover:text-primary-600 dark:text-primary-400"
            >
              {useDocumentIntelligence ? (
                <ToggleRight className="h-6 w-6" />
              ) : (
                <ToggleLeft className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 