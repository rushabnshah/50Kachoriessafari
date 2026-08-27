import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

type PartyRoomingRow = {
  id: string
  room: string
  guest_name: string
  room_type: 'Single' | 'Double' | 'Twin' | 'Triple'
  sort_order: number
}

const INITIAL_ROOMING: Omit<PartyRoomingRow, 'id'>[] = [
  { room: 'R1', guest_name: 'Arvind mama', room_type: 'Double', sort_order: 1 },
  { room: 'R1', guest_name: 'Indu mami', room_type: 'Double', sort_order: 2 },
  { room: 'R2', guest_name: 'Nilesh mama', room_type: 'Double', sort_order: 3 },
  { room: 'R2', guest_name: 'Raksha mami', room_type: 'Double', sort_order: 4 },
  { room: 'R3', guest_name: 'Surbhi masi', room_type: 'Double', sort_order: 5 },
  { room: 'R3', guest_name: 'Ashok masa', room_type: 'Double', sort_order: 6 },
  { room: 'R4', guest_name: 'Shakumasi', room_type: 'Double', sort_order: 7 },
  { room: 'R4', guest_name: 'Shaila', room_type: 'Double', sort_order: 8 },
  { room: 'R5', guest_name: 'Dina masi', room_type: 'Double', sort_order: 9 },
  { room: 'R5', guest_name: 'Nitin masa', room_type: 'Double', sort_order: 10 },
  { room: 'R6', guest_name: 'Anila masi', room_type: 'Double', sort_order: 11 },
  { room: 'R6', guest_name: 'Vinod masa', room_type: 'Double', sort_order: 12 },
  { room: 'R7', guest_name: 'Nishil', room_type: 'Double', sort_order: 13 },
  { room: 'R7', guest_name: 'Rushab', room_type: 'Double', sort_order: 14 },
  { room: 'R8', guest_name: 'Jinesh', room_type: 'Double', sort_order: 15 },
  { room: 'R8', guest_name: 'Jyoti', room_type: 'Double', sort_order: 16 },
  { room: 'R9', guest_name: 'Meher', room_type: 'Double', sort_order: 17 },
  { room: 'R9', guest_name: 'Samay', room_type: 'Double', sort_order: 18 },
  { room: 'R10', guest_name: 'Hemel', room_type: 'Double', sort_order: 19 },
  { room: 'R10', guest_name: 'Shinal', room_type: 'Double', sort_order: 20 },
  { room: 'R11', guest_name: 'Sachi', room_type: 'Double', sort_order: 21 },
  { room: 'R11', guest_name: 'Siya', room_type: 'Double', sort_order: 22 },
  { room: 'R12', guest_name: 'Sejal', room_type: 'Double', sort_order: 23 },
  { room: 'R12', guest_name: 'Nishu', room_type: 'Double', sort_order: 24 },
  { room: 'R13', guest_name: 'Chirag', room_type: 'Double', sort_order: 25 },
  { room: 'R13', guest_name: 'Rena', room_type: 'Double', sort_order: 26 },
  { room: 'R14', guest_name: 'Miya', room_type: 'Double', sort_order: 27 },
  { room: 'R14', guest_name: 'Kayaan', room_type: 'Double', sort_order: 28 },
  { room: 'R15', guest_name: 'Paraag', room_type: 'Double', sort_order: 29 },
  { room: 'R15', guest_name: 'Hemali', room_type: 'Double', sort_order: 30 },
  { room: 'R16', guest_name: 'Kaiya', room_type: 'Double', sort_order: 31 },
  { room: 'R16', guest_name: 'Aaron', room_type: 'Double', sort_order: 32 },
  { room: 'R17', guest_name: 'Sahil', room_type: 'Double', sort_order: 33 },
  { room: 'R17', guest_name: 'Aasav', room_type: 'Double', sort_order: 34 },
  { room: 'R18', guest_name: 'Dipan', room_type: 'Triple', sort_order: 35 },
  { room: 'R18', guest_name: 'Pooja', room_type: 'Triple', sort_order: 36 },
  { room: 'R18', guest_name: 'Ehaan', room_type: 'Triple', sort_order: 37 },
  { room: 'R19', guest_name: 'Shalin', room_type: 'Double', sort_order: 38 },
  { room: 'R19', guest_name: 'Priya', room_type: 'Double', sort_order: 39 },
  { room: 'R20', guest_name: 'Rohin', room_type: 'Double', sort_order: 40 },
  { room: 'R20', guest_name: 'Leora', room_type: 'Double', sort_order: 41 },
  { room: 'R21', guest_name: 'Rushina', room_type: 'Triple', sort_order: 42 },
  { room: 'R21', guest_name: 'Nitin', room_type: 'Triple', sort_order: 43 },
  { room: 'R21', guest_name: 'Mahi', room_type: 'Triple', sort_order: 44 },
  { room: 'R22', guest_name: 'Maanika', room_type: 'Double', sort_order: 45 },
  { room: 'R22', guest_name: 'Aarti', room_type: 'Double', sort_order: 46 },
  { room: 'R23', guest_name: 'Seema', room_type: 'Double', sort_order: 47 },
  { room: 'R23', guest_name: 'Jignesh', room_type: 'Double', sort_order: 48 },
  { room: 'R24', guest_name: 'Sheena', room_type: 'Double', sort_order: 49 },
  { room: 'R24', guest_name: 'Mayank', room_type: 'Double', sort_order: 50 },
  { room: 'R25', guest_name: 'Kush', room_type: 'Double', sort_order: 51 },
  { room: 'R25', guest_name: 'Anish', room_type: 'Double', sort_order: 52 },
  { room: 'R26', guest_name: 'Priya', room_type: 'Double', sort_order: 53 },
  { room: 'R26', guest_name: 'Binoy', room_type: 'Double', sort_order: 54 },
  { room: 'R27', guest_name: 'Atul', room_type: 'Double', sort_order: 55 },
  { room: 'R27', guest_name: 'Meeta', room_type: 'Double', sort_order: 56 },
  { room: 'R28', guest_name: 'Ashish', room_type: 'Double', sort_order: 57 },
  { room: 'R28', guest_name: 'Anisha', room_type: 'Double', sort_order: 58 },
  { room: 'R29', guest_name: 'Meehir', room_type: 'Double', sort_order: 59 },
  { room: 'R29', guest_name: 'Sejal', room_type: 'Double', sort_order: 60 },
  { room: 'R30', guest_name: 'Sirj', room_type: 'Double', sort_order: 61 },
  { room: 'R30', guest_name: 'Vaish', room_type: 'Double', sort_order: 62 },
  { room: 'R31', guest_name: 'Sachen', room_type: 'Double', sort_order: 63 },
  { room: 'R31', guest_name: 'Minal', room_type: 'Double', sort_order: 64 },
  { room: 'R32', guest_name: 'Mai', room_type: 'Double', sort_order: 65 },
  { room: 'R32', guest_name: 'Luke', room_type: 'Double', sort_order: 66 },
  { room: 'R33', guest_name: 'Sagar', room_type: 'Double', sort_order: 67 },
  { room: 'R33', guest_name: 'Poonam', room_type: 'Double', sort_order: 68 },
  { room: 'R34', guest_name: 'Nivaan', room_type: 'Double', sort_order: 69 },
  { room: 'R34', guest_name: 'Sanaya', room_type: 'Double', sort_order: 70 },
  { room: 'R35', guest_name: 'Manju mami', room_type: 'Double', sort_order: 71 },
  { room: 'R35', guest_name: 'Alika Shah', room_type: 'Double', sort_order: 72 },
  { room: 'R36', guest_name: 'Neel', room_type: 'Double', sort_order: 73 },
  { room: 'R36', guest_name: 'Anya', room_type: 'Double', sort_order: 74 },
  { room: 'R37', guest_name: 'Shilen Pattani', room_type: 'Double', sort_order: 75 },
  { room: 'R37', guest_name: 'Anjali Pattani', room_type: 'Double', sort_order: 76 },
  { room: 'R38', guest_name: 'Suraj', room_type: 'Double', sort_order: 77 },
  { room: 'R38', guest_name: 'Ajul', room_type: 'Double', sort_order: 78 },
  { room: 'R39', guest_name: 'Shanay', room_type: 'Single', sort_order: 79 },
  { room: 'R40', guest_name: 'Jinal', room_type: 'Double', sort_order: 80 },
  { room: 'R40', guest_name: 'Caroline', room_type: 'Double', sort_order: 81 }
]

const emptyForm = {
  room: 'R1',
  guest_name: '',
  room_type: 'Double' as PartyRoomingRow['room_type'],
}

export default function PartyRoomingAdmin() {
  const [rows, setRows] = useState<PartyRoomingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function loadRooming() {
    setLoading(true)
    setError('')

    const { data, error: loadError } = await supabase
      .from('party_rooming')
      .select('id, room, guest_name, room_type, sort_order')
      .order('sort_order', { ascending: true })

    if (loadError) {
      setError(`Could not load Party rooming: ${loadError.message}`)
      setLoading(false)
      return
    }

    if (!data || data.length === 0) {
      const { data: seeded, error: seedError } = await supabase
        .from('party_rooming')
        .insert(INITIAL_ROOMING)
        .select('id, room, guest_name, room_type, sort_order')

      if (seedError) {
        setError(`Party rooming is empty and could not be pre-populated: ${seedError.message}`)
        setLoading(false)
        return
      }

      setRows((seeded ?? []) as PartyRoomingRow[])
      setLoading(false)
      return
    }

    setRows(data as PartyRoomingRow[])
    setLoading(false)
  }

  useEffect(() => {
    loadRooming()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (row) =>
        row.room.toLowerCase().includes(q) ||
        row.guest_name.toLowerCase().includes(q),
    )
  }, [rows, query])

  function startEdit(row: PartyRoomingRow) {
    setEditingId(row.id)
    setForm({
      room: row.room,
      guest_name: row.guest_name,
      room_type: row.room_type,
    })
    setError('')
  }

  function startNew() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  async function save() {
    if (!form.room.trim() || !form.guest_name.trim()) {
      setError('Room and guest name are required.')
      return
    }

    setSaving(true)
    setError('')

    if (editingId) {
      const { data, error: saveError } = await supabase
        .from('party_rooming')
        .update({
          room: form.room.trim().toUpperCase(),
          guest_name: form.guest_name.trim(),
          room_type: form.room_type,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId)
        .select('id, room, guest_name, room_type, sort_order')
        .single()

      if (saveError) {
        setError(`Could not save changes: ${saveError.message}`)
      } else {
        setRows((current) =>
          current.map((row) =>
            row.id === editingId ? (data as PartyRoomingRow) : row,
          ),
        )
        startNew()
      }
    } else {
      const nextOrder =
        rows.length > 0
          ? Math.max(...rows.map((row) => Number(row.sort_order) || 0)) + 1
          : 1

      const { data, error: saveError } = await supabase
        .from('party_rooming')
        .insert({
          room: form.room.trim().toUpperCase(),
          guest_name: form.guest_name.trim(),
          room_type: form.room_type,
          sort_order: nextOrder,
        })
        .select('id, room, guest_name, room_type, sort_order')
        .single()

      if (saveError) {
        setError(`Could not add guest: ${saveError.message}`)
      } else {
        setRows((current) => [...current, data as PartyRoomingRow])
        startNew()
      }
    }

    setSaving(false)
  }

  async function remove(id: string) {
    if (!window.confirm('Remove this guest from the party rooming list?')) return

    const { error: removeError } = await supabase
      .from('party_rooming')
      .delete()
      .eq('id', id)

    if (removeError) {
      setError(`Could not remove guest: ${removeError.message}`)
      return
    }

    setRows((current) => current.filter((row) => row.id !== id))
    if (editingId === id) startNew()
  }

  return (
    <section
      className="admin-section"
      style={{
        marginTop: '40px',
        padding: '24px',
        background: '#fffaf0',
        borderRadius: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p className="admin-eyebrow">Party accommodation</p>
          <h2 style={{ marginBottom: 6 }}>Party Rooming</h2>
          <p style={{ margin: 0 }}>
            Edit guest names, room assignments and room types here.
            Changes are saved to the Party rooming list.
          </p>
        </div>
        <button type="button" onClick={startNew}>+ Add guest</button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
          marginTop: 20,
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search guest or room…"
          style={{ minWidth: 260, padding: '10px' }}
        />
        <strong>{rows.length} guests · 40 rooms</strong>
        <button type="button" onClick={loadRooming} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 18,
          background: '#fff',
          borderRadius: 10,
          border: '1px solid rgba(0,0,0,.1)',
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          {editingId ? 'Edit guest' : 'Add guest'}
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
            gap: 12,
          }}
        >
          <label style={{ display: 'grid', gap: 5, fontWeight: 600 }}>
            Room
            <input
              value={form.room}
              onChange={(event) => setForm({ ...form, room: event.target.value })}
              placeholder="R1"
            />
          </label>

          <label style={{ display: 'grid', gap: 5, fontWeight: 600 }}>
            Guest name
            <input
              value={form.guest_name}
              onChange={(event) => setForm({ ...form, guest_name: event.target.value })}
              placeholder="Guest name"
            />
          </label>

          <label style={{ display: 'grid', gap: 5, fontWeight: 600 }}>
            Room type
            <select
              value={form.room_type}
              onChange={(event) =>
                setForm({
                  ...form,
                  room_type: event.target.value as PartyRoomingRow['room_type'],
                })
              }
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Twin">Twin</option>
              <option value="Triple">Triple</option>
            </select>
          </label>
        </div>

        <div style={{ marginTop: 14 }}>
          <button type="button" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add guest'}
          </button>
          {editingId && (
            <button type="button" onClick={startNew} style={{ marginLeft: 8 }} disabled={saving}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="admin-error" style={{ marginTop: 14, padding: 12, borderRadius: 8 }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ marginTop: 20 }}>Loading Party rooming…</p>
      ) : filtered.length === 0 ? (
        <p style={{ marginTop: 20 }}>No guests found. Use Refresh or Add guest above.</p>
      ) : (
        <div style={{ marginTop: 20, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700, background: '#fff' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 10 }}>Room</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Guest</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Type</th>
                <th style={{ padding: 10 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td style={{ padding: 10, fontWeight: 700 }}>{row.room}</td>
                  <td style={{ padding: 10 }}>{row.guest_name}</td>
                  <td style={{ padding: 10 }}>{row.room_type}</td>
                  <td style={{ padding: 10, whiteSpace: 'nowrap' }}>
                    <button type="button" onClick={() => startEdit(row)}>Edit</button>
                    <button type="button" onClick={() => remove(row.id)} style={{ marginLeft: 8 }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
