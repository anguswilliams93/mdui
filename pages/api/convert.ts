import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { createReadStream } from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse form with uploaded file
    const form = formidable()
    const [fields, files] = await form.parse(req)
    
    const uploadedFile = files.file?.[0]
    
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Create form data for the Python backend
    const formData = new FormData()
    formData.append('file', createReadStream(uploadedFile.filepath), {
      filename: uploadedFile.originalFilename || 'file',
      contentType: uploadedFile.mimetype || undefined,
    })

    // Forward to Python backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    const response = await fetch(`${backendUrl}/convert`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Backend error: ${error}`)
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Error processing file:', error)
    return res.status(500).json({ error: 'Error processing file' })
  }
}