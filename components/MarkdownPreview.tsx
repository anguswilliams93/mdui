"use client"

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Copy, Check, Download, Eye, Code } from 'lucide-react'

interface MarkdownPreviewProps {
  markdown: string
  fileName: string
}

export function MarkdownPreview({ markdown, fileName }: MarkdownPreviewProps) {
  const [copied, setCopied] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'preview' | 'source'>('preview')
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName.split('.')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-md font-medium text-sm ${
              activeTab === 'preview'
                ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Eye className="inline-block w-4 h-4 mr-1" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('source')}
            className={`px-4 py-2 rounded-md font-medium text-sm ${
              activeTab === 'source'
                ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Code className="inline-block w-4 h-4 mr-1" />
            Markdown
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleCopyToClipboard}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
          
          <button
            onClick={handleDownload}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Download markdown"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="p-6 max-h-[600px] overflow-auto">
        {activeTab === 'preview' ? (
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="my-3" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-3" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-3" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                a: ({ node, ...props }) => (
                  <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-1 my-3 text-gray-700 dark:text-gray-300 italic"
                    {...props}
                  />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => <thead className="bg-gray-100 dark:bg-gray-800" {...props} />,
                th: ({ node, ...props }) => (
                  <th
                    className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-semibold"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2" {...props} />
                ),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <SyntaxHighlighter
            language="markdown"
            style={vscDarkPlus}
            className="rounded-md text-sm"
          >
            {markdown}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  )
} 