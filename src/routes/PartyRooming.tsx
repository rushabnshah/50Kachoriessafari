import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

type PartyRoomingRow = {
  id: string
  room: string
  guest_name: string
  room_type: 'Single' | 'Double' | 'Twin' | 'Triple'
  sort_order: number
}

type PartyRoom = {
  room: string
  guests: string[]
  roomType: PartyRoomingRow['room_type']
}

export default function PartyRooming() {
  const [rows, setRows] = useState<PartyRoomingRow[]>([])
  const [show, setShow] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let active = true
    supabase
      .from('public_party_rooming')
      .select('id, room, guest_name, room_type, sort_order')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (active && data?.length) setRows(data as PartyRoomingRow[])
      })
    return () => { active = false }
  }, [])

  const rooms = useMemo<PartyRoom[]>(() => {
    const grouped = new Map<string, PartyRoom>()
    rows.forEach((row) => {
      const current = grouped.get(row.room)
      if (current) current.guests.push(row.guest_name)
      else grouped.set(row.room, { room: row.room, guests: [row.guest_name], roomType: row.room_type })
    })
    return Array.from(grouped.values())
  }, [rows])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rooms
    return rooms.filter(
      (room) =>
        room.room.toLowerCase().includes(q) ||
        room.guests.some((guest) => guest.toLowerCase().includes(q)),
    )
  }, [rooms, query])

  return (
    <div className="party-rooming">
      <div className="party-rooming-head">
        <div>
          <strong>Party accommodation</strong>
          <div style={{ opacity: .55, marginTop: 4 }}>
            38 double rooms · 2 triple rooms · 1 single room
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            className="party-rooming-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a name or room…"
            aria-label="Search party rooming"
          />
          <button
            className="party-button secondary"
            type="button"
            onClick={() => setShow((value) => !value)}
          >
            {show ? 'Hide rooming list' : 'View rooming list'}
          </button>
        </div>
      </div>

      {show && (
        <div className="party-room-grid">
          {filtered.map((room) => (
            <div className="party-room" key={room.room}>
              <strong>{room.room}</strong>
              {room.guests.map((guest) => <span key={guest}>{guest}</span>)}
              <span className="party-room-count">
                {room.guests.length} {room.guests.length === 1 ? 'guest' : 'guests'}
              </span>
            </div>
          ))}
        </div>
      )}

      {show && filtered.length === 0 && (
        <div style={{ padding: 24 }}>No room or guest found for “{query}”.</div>
      )}
    </div>
  )
}
