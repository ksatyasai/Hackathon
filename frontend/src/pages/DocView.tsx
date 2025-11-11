import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import client from '../api/client'
import { formatDate } from '../utils/dates'

export default function DocView() {
  const { id } = useParams()

  const meta = useQuery({
    queryKey: ['doc', id],
    queryFn: async () => (await client.get(`/documents/${id}`)).data
  })

  const summary = useQuery({
    queryKey: ['summary', id],
    queryFn: async () => (await client.get(`/ai/summary/${id}`)).data
  })

  if(meta.isLoading) return <div className="container"><div className="card">Loading…</div></div>
  if(!meta.data) return <div className="container"><div className="card">Not found</div></div>

  const d = meta.data

  return (
    <div className="container">
      <div className="card">
        <h2>{d.title}</h2>
        <p>
          Owner: {d.ownerEmail} • Created: {formatDate(d.createdAt)}
        </p>

        <button className="btn" onClick={()=>{
          window.open(`${client.defaults.baseURL}/documents/${id}/download?inline=1`, '_blank')
        }}>Open / Download</button>

        <iframe
          src={`${client.defaults.baseURL}/documents/${id}/download?inline=1`}
          style={{
            width:'100%',
            height:500,
            marginTop:20,
            border:'1px solid #1a2347',
            borderRadius:8
          }}
        />

        <h3 style={{ marginTop: 24 }}>AI Summary</h3>
        {summary.isLoading && 'Summarizing…'}
        {summary.data && (
          <>
            <p>{summary.data.summary}</p>
            {summary.data.keywords.map((k:string)=><span key={k} className="badge">{k}</span>)}
          </>
        )}
      </div>
    </div>
  )
}
