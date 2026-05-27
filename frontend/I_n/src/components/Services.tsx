import React, { useEffect, useState } from 'react'
import type { Service } from '../types'
import { getServices, createService, updateService, deleteService } from '../api'

export default function Services() {
  const [items, setItems] = useState<Service[]>([])
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<Partial<Service>>({ name: '', description: '', price: 0, active: true })

  async function load() {
    setLoading(true)
    try {
      const res = await getServices({ page, limit, q })
      setItems(res.items)
      setTotal(res.total)
    } catch (err) {
      console.error(err)
      alert('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, q])

  function resetForm() {
    setEditing(null)
    setForm({ name: '', description: '', price: 0, active: true })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editing && editing._id) {
        await updateService(editing._id, form as Service)
      } else {
        await createService(form as Service)
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
      await deleteService(id)
      load()
    } catch (err) {
      console.error(err)
      alert('Delete failed')
    }
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Services</h2>
        <div className="controls">
          <input placeholder="Search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
          <button onClick={() => { resetForm(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>New</button>
        </div>
      </div>

      <form className="item-form" onSubmit={handleSubmit}>
        <input required placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Price" type="number" value={String(form.price || 0)} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <label className="checkbox"><input type="checkbox" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
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
              <tr><th>Name</th><th>Price</th><th>Active</th><th>Created</th><th></th></tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it._id}>
                  <td>{it.name}</td>
                  <td>{it.price}</td>
                  <td>{it.active ? 'Yes' : 'No'}</td>
                  <td>{new Date(it.createdAt || '').toLocaleString()}</td>
                  <td className="actions">
                    <button onClick={() => { setEditing(it); setForm({ name: it.name, price: it.price, description: it.description, active: it.active }) }}>Edit</button>
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
