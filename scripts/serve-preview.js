#!/usr/bin/env node

import { createServer } from 'http'
import { readFileSync, existsSync, statSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const distDir = resolve(__dirname, '../dist')
const basePath = '/homeruncoach'

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

function getMimeType(path) {
  const ext = path.substring(path.lastIndexOf('.')).toLowerCase()
  return mimeTypes[ext] || 'application/octet-stream'
}

function getFilePath(url) {
  // Remove base path
  let filePath = url
  if (url.startsWith(basePath)) {
    filePath = url.substring(basePath.length)
  }
  
  // Default to index.html for root
  if (filePath === '/' || filePath === '') {
    filePath = '/index.html'
  }
  
  // Remove leading slash for file system
  const fullPath = join(distDir, filePath)
  return fullPath
}

const server = createServer((req, res) => {
  const filePath = getFilePath(req.url)
  
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    // Try index.html for SPA routing
    if (req.url.startsWith(basePath) && !req.url.includes('.')) {
      const indexPath = join(distDir, 'index.html')
      if (existsSync(indexPath)) {
        const content = readFileSync(indexPath)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(content)
        return
      }
    }
    
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('404 Not Found')
    return
  }
  
  try {
    const content = readFileSync(filePath)
    const mimeType = getMimeType(filePath)
    res.writeHead(200, { 'Content-Type': mimeType })
    res.end(content)
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('500 Internal Server Error')
  }
})

const port = process.env.PORT || 4173
server.listen(port, () => {
  console.log(`\n✅ Server running at http://localhost:${port}${basePath}/`)
  console.log(`   Make sure to access the full URL with the base path!\n`)
})

