import { useEffect, useState } from 'react'
import { getContacts, getMetrics, markContactRead } from '../utils/api'
import { useAuth } from '../contexts/auth'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [contacts, setContacts] = useState({ items: [], total: 0, page: 1, limit: 10, loading: true })
  const [metrics, setMetrics] = useState({ resumeDownloads: 0 })

  useEffect(() => {
    let mounted = true
    Promise.all([
      getContacts({ page: 1, limit: 10 }),
      getMetrics(),
    ]).then(([c, m]) => {
      if (!mounted) return
      setContacts({ ...c, loading: false })
      setMetrics(m)
    }).catch(() => {
      if (!mounted) return
      setContacts((s) => ({ ...s, loading: false }))
    })
    return () => { mounted = false }
  }, [])

  if (!user) return <div className="mx-auto max-w-2xl px-4 py-16">Unauthorized</div>

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button onClick={logout} className="text-sm px-3 py-1 rounded border border-neutral-600">Log out</button>
      </div>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Metrics</h2>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="rounded border border-neutral-700 p-4">
            <div className="text-sm text-neutral-400">Resume downloads</div>
            <div className="text-2xl font-bold">{metrics.resumeDownloads ?? 0}</div>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Recent messages</h2>
        {contacts.loading ? (
          <p className="mt-3 text-neutral-400">Loading…</p>
        ) : (
          <ul className="mt-3 divide-y divide-neutral-800 border border-neutral-800 rounded">
            {contacts.items.map((c) => (
              <li key={c._id} className="p-4">
                <div className="font-medium flex items-center gap-2">
                  <span>{c.name} • {c.email}</span>
                  {c.read ? (
                    <span className="text-xs px-2 py-0.5 rounded-full border border-emerald-500/40 text-emerald-300">read</span>
                  ) : (
                    <button onClick={async ()=>{
                      const updated = await markContactRead(c._id)
                      setContacts((s)=>({ ...s, items: s.items.map(it => it._id===c._id? updated : it) }))
                    }} className="text-xs px-2 py-0.5 rounded border border-neutral-600 hover:bg-neutral-800">mark as read</button>
                  )}
                </div>
                <div className="text-sm mt-1 text-neutral-300">{c.message}</div>
                <div className="text-xs mt-1 text-neutral-500">{new Date(c.createdAt).toLocaleString()}</div>
              </li>
            ))}
            {contacts.items.length === 0 && <li className="p-4 text-neutral-400">No messages yet.</li>}
          </ul>
        )}
      </section>
    </div>
  )
}
