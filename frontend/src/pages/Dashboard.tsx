import { useQuery } from '@tanstack/react-query'
import client from '../api/client'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/dates'

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['recent'],
    queryFn: async () => {
      const r = await client.get('/documents?limit=5&sort=-createdAt')
      return r.data.items
    }
  })

  return (
    <div className="container">
      <div className="card">
        <h2>Recent Documents</h2>
        {isLoading && 'Loading...'}

        <table className="table">
          <thead>
            <tr><th>Title</th><th>Type</th><th>Owner</th><th>Created</th></tr>
          </thead>

          <tbody>
            {data?.map((d: any) => (
              <tr key={d.id}>
                <td><Link to={`/doc/${d.id}`}>{d.title}</Link></td>
                <td>{d.type}</td>
                <td>{d.ownerEmail}</td>
                <td>{formatDate(d.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Link to="/documents" className="btn secondary" style={{ marginTop: 12 }}>
          View All
        </Link>
      </div>
    </div>
  )
}
