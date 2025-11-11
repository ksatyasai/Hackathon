import { useState } from 'react'
import client from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [progress, setProgress] = useState(0)
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()

  async function uploadFile() {
    if (!file) return alert('Please select a file.')

    setBusy(true)
    setProgress(0)

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('title', title || file.name)
      fd.append('tags', tags)

      await client.post('/documents', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => {
          if (e.total) {
            const p = Math.round((e.loaded / e.total) * 100)
            setProgress(p)
          }
        }
      })

      nav('/documents')
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Upload Document</h2>

        <input
          className="input"
          placeholder="Title (optional)"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          className="input"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />

        <input
          className="input"
          type="file"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />

        <button className="btn" onClick={uploadFile} disabled={busy}>
          {busy ? `Uploading… ${progress}%` : 'Upload'}
        </button>

        {busy && (
          <p style={{ marginTop: 12 }}>
            Progress: {progress}%
          </p>
        )}
      </div>
    </div>
  )
}
