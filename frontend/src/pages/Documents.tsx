import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import client from '../api/client'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/dates'

export default function Documents() {
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('')
  const [sort, setSort] = useState('-createdAt')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['docs', q, tag, sort],
    queryFn: async () => {
      const p = new URLSearchParams()
      if(q) p.set('q', q)
      if(tag) p.set('tag', tag)
      if(sort) p.set('sort', sort)

      const r = await client.get(`/documents?${p.toString()}`)
      return r.data.items
    }
  })

  const tags = useMemo(() => {
    const s = new Set<string>()
    data?.forEach((d:any)=>d.tags?.forEach((t:string)=>s.add(t)))
    return [...s]
  }, [data])

  function search(e:any){ e.preventDefault(); refetch() }

  return (
    <div className="container">
      <div className="card">
        <form onSubmit={search} className="row wrap">
          <input className="input" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} />

          <select className="input" value={tag} onChange={e=>setTag(e.target.value)}>
            <option value="">All tags</option>
            {tags.map(t => <option key={t}>{t}</option>)}
          </select>

          <select className="input" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
          </select>

          <button className="btn">Search</button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        {isLoading && 'Loading...'}
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Type</th><th>Tags</th><th>Owner</th><th>Created</th></tr>
          </thead>

          <tbody>
            {data?.map((d:any)=>(
              <tr key={d.id}>
                <td><Link to={`/doc/${d.id}`}>{d.title}</Link></td>
                <td>{d.type}</td>
                <td>{d.tags?.map((t:string)=><span key={t} className="badge">{t}</span>)}</td>
                <td>{d.ownerEmail}</td>
                <td>{formatDate(d.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
