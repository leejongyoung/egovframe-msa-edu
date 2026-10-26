import { CUSTOM_HEADER_SITE_ID_KEY, EDITOR_LOAD_IMAGE_URL } from '@constants'
import { SERVER_API_URL, SITE_ID } from '@constants/env'
import axios from 'axios'
import multer from 'multer'
import type { Request, Response } from 'express'
import type { NextApiRequest, NextApiResponse } from 'next'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 300000, files: 1 },
}).single('upload')

type UploadRequest = NextApiRequest & { file?: Express.Multer.File }

export const config = { api: { bodyParser: false } }

export default async (req: UploadRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: { message: 'Method not allowed' } })
    return
  }

  try {
    const { promise, resolve, reject } = Promise.withResolvers<void>()
    // Multer uses the same Node request/response streams as Next API routes.
    upload(req as unknown as Request, res as unknown as Response, error => {
      if (error) reject(error)
      else resolve()
    })
    await promise
  } catch (error) {
    const tooBig = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE'
    res.status(tooBig ? 413 : 400).json({ error: { message: tooBig ? 'File is too big' : 'Invalid upload' } })
    return
  }

  if (!req.file) {
    res.status(400).json({ error: { message: 'Upload file is required' } })
    return
  }

  const file = req.file
  const result = await axios.post<{ url: string }>(
    `${SERVER_API_URL}/portal-service/api/v1/upload/editor`,
    {
      fieldName: file.fieldname,
      originalName: file.originalname,
      fileType: file.mimetype,
      size: file.size,
      fileBase64: file.buffer.toString('base64'),
    },
    { headers: { 'Content-Type': 'application/json', [CUSTOM_HEADER_SITE_ID_KEY]: SITE_ID } },
  )

  res.status(200).json({
    ...result.data,
    url: `${SERVER_API_URL}${EDITOR_LOAD_IMAGE_URL}${result.data.url}`,
  })
}
