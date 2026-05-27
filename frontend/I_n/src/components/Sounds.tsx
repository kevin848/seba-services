import React, { useEffect, useState } from 'react'
import type { Sound } from '../types'
import { getSounds, createSound, updateSound, deleteSound } from '../api'

export default function Sounds() {
  const [items, setItems] = useState<Sound[]>([])
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Sound | null>(null)
  const [form, setForm] = useState<Partial<Sound>>({ title: '', description: '', url: '' })

  async function load() {
    setLoading(true)
    try {
      const res = await getSounds({ page, limit, q })
      setItems(res.items)
      setTotal(res.total)
    } catch (err) {
      console.error(err)
      alert('Failed to load sounds')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, q])

  function resetForm() {
    setEditing(null)
    setForm({ title: '', description: '', url: '' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editing && editing._id) {
        await updateSound(editing._id, form as Sound)
      } else {
        await createSound(form as Sound)
      }
      resetForm()
      load()
    } catch (err) {
      console.error(err)
      alert('Save failed')
    }
  }

  async function handleDelete(id?: string) {
    if (!id) return
    if (!confirm('Delete item?')) return
    try {
      await deleteSound(id)
      load()
    } catch (err) {
      console.error(err)
      alert('Delete failed')
    }
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Sounds</h2>
        <div className="controls">
          <input placeholder="Search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
          <button onClick={() => { resetForm(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>New</button>
        </div>
      </div>

      <form className="item-form" onSubmit={handleSubmit}>
        <input required placeholder="Title" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="URL" value={form.url || ''} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <textarea placeholder="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="form-actions">
          <button type="submit">{editing ? 'Update' : 'Create'}</button>
          <button type="button" onClick={resetForm}>Cancel</button>
        </div>
      </form>

      <div className="list">
        {loading ? <div>Loading...</div> : (
          <table>
            <thead>
              <tr><th>Title</th><th>URL</th><th>Created</th><th></th></tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it._id}>
                  <td>{it.title}</td>
                  <td>{it.url}</td>
                  <td>{new Date(it.createdAt || '').toLocaleString()}</td>
                  <td className="actions">
                    <button onClick={() => { setEditing(it); setForm({ title: it.title, url: it.url, description: it.description }) }}>Edit</button>
                    <button onClick={() => handleDelete(it._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="pager">
        <div>Showing {items.length} of {total}</div>
        <div>
          <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
          <span>Page {page}</span>
          <button disabled={page * limit >= total} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  )
}
