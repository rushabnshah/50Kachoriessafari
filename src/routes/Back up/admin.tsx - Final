import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import PartyRoomingAdmin from './PartyRoomingAdmin'

type Traveller = {
  id: string
  name: string
  residency: 'Resident' | 'Non-resident'
  room_type: 'Double' | 'Twin' | 'Triple'
  room_number: number | null
  vehicle_number: number | null
  safari_amount_usd: number
  safari_amount_ksh: number
  paid_usd: number
  notes: string | null
}

type Vehicle = {
  id: string
  vehicle_number: number
  capacity: number
  notes: string | null
}

type Room = {
  id: string
  room_number: number
  room_type: 'Double' | 'Twin' | 'Triple'
  capacity: number
  notes: string | null
}

type ItineraryItem = {
  id: string
  day_number: number
  date: string | null
  title: string
  location: string | null
  start_time: string | null
  end_time: string | null
  description: string | null
  notes: string | null
  sort_order: number
}

type PartyEvent = {
  id: string
  title: string
  date: string | null
  start_time: string | null
  end_time: string | null
  location: string | null
  description: string | null
  notes: string | null
}

type PhotoSettings = {
  id: string
  title: string
  description: string | null
  safari_gallery_url: string | null
  party_gallery_url: string | null
}

type EditForm = {
  name: string
  residency: 'Resident' | 'Non-resident'
  room_type: 'Double' | 'Twin' | 'Triple'
  room_number: string
  vehicle_number: string
  safari_amount_usd: string
  safari_amount_ksh: string
  paid_usd: string
}

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const [travellers, setTravellers] = useState<Traveller[]>([])
  const [travellersLoading, setTravellersLoading] = useState(false)
  const [showTravellers, setShowTravellers] = useState(false)
  const [travellersError, setTravellersError] = useState('')

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehiclesLoading, setVehiclesLoading] = useState(false)
  const [vehiclesError, setVehiclesError] = useState('')
  const [showVehicles, setShowVehicles] = useState(false)
  const [activeSection, setActiveSection] = useState<
    'dashboard' | 'travellers' | 'vehicles' | 'accommodation' | 'payments' | 'itinerary' | 'photos' | 'party'
  >('dashboard')
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [roomsError, setRoomsError] = useState('')
  const [showRooms, setShowRooms] = useState(false)
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null)
  const [roomCapacity, setRoomCapacity] = useState('')
  const [savingRoomId, setSavingRoomId] = useState<string | null>(null)
  const [roomSaveError, setRoomSaveError] = useState('')

  // Itinerary
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([])
  const [itineraryLoading, setItineraryLoading] = useState(false)
  const [itineraryError, setItineraryError] = useState('')
  const [editingItineraryId, setEditingItineraryId] = useState<string | null>(null)
  const [itineraryForm, setItineraryForm] = useState({
    day_number: '1',
    date: '',
    title: '',
    location: '',
    start_time: '',
    end_time: '',
    description: '',
    notes: '',
    sort_order: '0',
  })

  // Party
  const [partyEvents, setPartyEvents] = useState<PartyEvent[]>([])
  const [partyLoading, setPartyLoading] = useState(false)
  const [partyError, setPartyError] = useState('')
  const [editingPartyId, setEditingPartyId] = useState<string | null>(null)
  const [partyForm, setPartyForm] = useState({
    title: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    description: '',
    notes: '',
  })

  // Photos
  const [photoSettings, setPhotoSettings] = useState<PhotoSettings | null>(null)
  const [photosLoading, setPhotosLoading] = useState(false)
  const [photosError, setPhotosError] = useState('')
  const [photoForm, setPhotoForm] = useState({
    safari_gallery_url: '',
    party_gallery_url: '',
  })
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null)
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [savingVehicleId, setSavingVehicleId] = useState<string | null>(null)
  const [vehicleSaveError, setVehicleSaveError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [residencyFilter, setResidencyFilter] = useState('All')
  const [roomFilter, setRoomFilter] = useState('All')
  const [vehicleFilter, setVehicleFilter] = useState('All')

  const [fxRate, setFxRate] = useState(130)
  const [fxRateInput, setFxRateInput] = useState('130')
  const [fxRateMessage, setFxRateMessage] = useState('')
  const [fxRateLoading, setFxRateLoading] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [saveError, setSaveError] = useState('')

  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [signingIn, setSigningIn] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const hasSession = Boolean(data.session)
      setLoggedIn(hasSession)
      setLoading(false)

      if (hasSession) {
        loadFxRate()
        loadTravellers()
        loadVehicles()
        loadRooms()
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const hasSession = Boolean(session)
      setLoggedIn(hasSession)

      if (hasSession) {
        loadFxRate()
        loadTravellers()
        loadVehicles()
        loadRooms()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function loadItinerary() {
    setItineraryLoading(true)
    setItineraryError('')

    const { data, error } = await supabase
      .from('itinerary')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('day_number', { ascending: true })

    setItineraryLoading(false)

    if (error) {
      console.error('Failed to load itinerary:', error)
      setItineraryError(error.message)
      return
    }

    setItinerary(data ?? [])
  }

  async function loadPartyEvents() {
    setPartyLoading(true)
    setPartyError('')

    const { data, error } = await supabase
      .from('party_events')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    setPartyLoading(false)

    if (error) {
      console.error('Failed to load party events:', error)
      setPartyError(error.message)
      return
    }

    setPartyEvents(data ?? [])
  }

  async function loadPhotoSettings() {
    setPhotosLoading(true)
    setPhotosError('')

    const { data, error } = await supabase
      .from('photo_settings')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    setPhotosLoading(false)

    if (error) {
      console.error('Failed to load photo settings:', error)
      setPhotosError(error.message)
      return
    }

    if (data) {
      setPhotoSettings(data)
      setPhotoForm({
        safari_gallery_url: data.safari_gallery_url ?? '',
        party_gallery_url: data.party_gallery_url ?? '',
      })
    }
  }

  function startEditingItinerary(item: ItineraryItem) {
    setEditingItineraryId(item.id)
    setItineraryForm({
      day_number: String(item.day_number),
      date: item.date ?? '',
      title: item.title,
      location: item.location ?? '',
      start_time: item.start_time?.slice(0, 5) ?? '',
      end_time: item.end_time?.slice(0, 5) ?? '',
      description: item.description ?? '',
      notes: item.notes ?? '',
      sort_order: String(item.sort_order ?? 0),
    })
  }

  function resetItineraryForm() {
    setEditingItineraryId(null)
    setItineraryForm({
      day_number: '1',
      date: '',
      title: '',
      location: '',
      start_time: '',
      end_time: '',
      description: '',
      notes: '',
      sort_order: '0',
    })
  }

  async function saveItineraryItem() {
    if (!itineraryForm.title.trim()) {
      setItineraryError('Itinerary title is required.')
      return
    }

    const payload = {
      day_number: Number(itineraryForm.day_number) || 1,
      date: itineraryForm.date || null,
      title: itineraryForm.title.trim(),
      location: itineraryForm.location.trim() || null,
      start_time: itineraryForm.start_time || null,
      end_time: itineraryForm.end_time || null,
      description: itineraryForm.description.trim() || null,
      notes: itineraryForm.notes.trim() || null,
      sort_order: Number(itineraryForm.sort_order) || 0,
    }

    const query = editingItineraryId
      ? supabase
          .from('itinerary')
          .update(payload)
          .eq('id', editingItineraryId)
      : supabase.from('itinerary').insert(payload)

    const { error } = await query

    if (error) {
      console.error('Failed to save itinerary:', error)
      setItineraryError(error.message)
      return
    }

    resetItineraryForm()
    await loadItinerary()
  }

  async function deleteItineraryItem(id: string) {
    const { error } = await supabase.from('itinerary').delete().eq('id', id)

    if (error) {
      setItineraryError(error.message)
      return
    }

    await loadItinerary()
  }

  function startEditingParty(event: PartyEvent) {
    setEditingPartyId(event.id)
    setPartyForm({
      title: event.title,
      date: event.date ?? '',
      start_time: event.start_time?.slice(0, 5) ?? '',
      end_time: event.end_time?.slice(0, 5) ?? '',
      location: event.location ?? '',
      description: event.description ?? '',
      notes: event.notes ?? '',
    })
  }

  function resetPartyForm() {
    setEditingPartyId(null)
    setPartyForm({
      title: '',
      date: '',
      start_time: '',
      end_time: '',
      location: '',
      description: '',
      notes: '',
    })
  }

  async function savePartyEvent() {
    if (!partyForm.title.trim()) {
      setPartyError('Party event title is required.')
      return
    }

    const payload = {
      title: partyForm.title.trim(),
      date: partyForm.date || null,
      start_time: partyForm.start_time || null,
      end_time: partyForm.end_time || null,
      location: partyForm.location.trim() || null,
      description: partyForm.description.trim() || null,
      notes: partyForm.notes.trim() || null,
    }

    const query = editingPartyId
      ? supabase.from('party_events').update(payload).eq('id', editingPartyId)
      : supabase.from('party_events').insert(payload)

    const { error } = await query

    if (error) {
      console.error('Failed to save party event:', error)
      setPartyError(error.message)
      return
    }

    resetPartyForm()
    await loadPartyEvents()
  }

  async function deletePartyEvent(id: string) {
    const { error } = await supabase.from('party_events').delete().eq('id', id)

    if (error) {
      setPartyError(error.message)
      return
    }

    await loadPartyEvents()
  }

  async function savePhotoSettings() {
    const payload = {
      safari_gallery_url: photoForm.safari_gallery_url.trim() || null,
      party_gallery_url: photoForm.party_gallery_url.trim() || null,
    }

    const query = photoSettings
      ? supabase.from('photo_settings').update(payload).eq('id', photoSettings.id)
      : supabase.from('photo_settings').insert(payload)

    const { data, error } = await query.select().single()

    if (error) {
      console.error('Failed to save photo settings:', error)
      setPhotosError(error.message)
      return
    }

    setPhotoSettings(data)
    setPhotoForm({
      safari_gallery_url: data.safari_gallery_url ?? '',
      party_gallery_url: data.party_gallery_url ?? '',
    })
  }

  async function loadFxRate() {
    setFxRateLoading(true)

    const { data, error } = await supabase
      .from('settings')
      .select('value_numeric')
      .eq('key', 'usd_ksh_rate')
      .maybeSingle()

    setFxRateLoading(false)

    if (error) {
      console.error('Failed to load FX rate:', error)
      setFxRateMessage(`Could not load saved FX rate: ${error.message}`)
      return
    }

    if (data?.value_numeric) {
      const rate = Number(data.value_numeric)
      setFxRate(rate)
      setFxRateInput(String(rate))
    }
  }

  async function loadTravellers() {
    setTravellersLoading(true)
    setTravellersError('')
    setShowTravellers(true)

    const { data, error } = await supabase
      .from('travellers')
      .select('*')
      .order('room_number', { ascending: true })
      .order('name', { ascending: true })

    setTravellersLoading(false)

    if (error) {
      console.error('Failed to load travellers:', error)
      setTravellersError(error.message)
      return
    }

    setTravellers(data ?? [])
  }

  async function loadRooms() {
    setRoomsLoading(true)
    setRoomsError('')
    setShowRooms(true)

    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('room_number', { ascending: true })

    setRoomsLoading(false)

    if (error) {
      console.error('Failed to load rooms:', error)
      setRoomsError(error.message)
      return
    }

    setRooms(data ?? [])
  }

  function getRoomOccupancy(roomNumber: number) {
    return travellers.filter(
      (traveller) => traveller.room_number === roomNumber,
    ).length
  }

  function getAvailableRooms(currentRoomNumber: number | null) {
    return rooms.filter((room) => {
      const occupancy = getRoomOccupancy(room.room_number)
      return (
        room.room_number === currentRoomNumber ||
        occupancy < room.capacity
      )
    })
  }

  function startEditingRoom(room: Room) {
    setRoomSaveError('')
    setEditingRoomId(room.id)
    setRoomCapacity(String(room.capacity))
  }

  function cancelEditingRoom() {
    setEditingRoomId(null)
    setRoomCapacity('')
    setRoomSaveError('')
  }

  async function saveRoomCapacity(room: Room) {
    const nextCapacity = Number(roomCapacity)

    if (!Number.isInteger(nextCapacity) || nextCapacity < 1) {
      setRoomSaveError('Capacity must be a whole number of at least 1.')
      return
    }

    const occupancy = getRoomOccupancy(room.room_number)

    if (nextCapacity < occupancy) {
      setRoomSaveError(
        `Capacity cannot be lower than the ${occupancy} traveller(s) currently assigned to Room ${room.room_number}.`,
      )
      return
    }

    setSavingRoomId(room.id)
    setRoomSaveError('')

    const { data, error } = await supabase
      .from('rooms')
      .update({ capacity: nextCapacity })
      .eq('id', room.id)
      .select()
      .single()

    setSavingRoomId(null)

    if (error) {
      console.error('Failed to save room capacity:', error)
      setRoomSaveError(error.message)
      return
    }

    setRooms((current) =>
      current.map((item) => (item.id === room.id ? data : item)),
    )
    setEditingRoomId(null)
    setRoomCapacity('')
  }

  async function loadVehicles() {
    setVehiclesLoading(true)
    setVehiclesError('')
    setShowVehicles(true)

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('vehicle_number', { ascending: true })

    setVehiclesLoading(false)

    if (error) {
      console.error('Failed to load vehicles:', error)
      setVehiclesError(error.message)
      return
    }

    setVehicles(data ?? [])
  }

  function getVehicleOccupancy(vehicleNumber: number) {
    return travellers.filter(
      (traveller) => traveller.vehicle_number === vehicleNumber,
    ).length
  }

  function getAvailableVehicles(currentVehicleNumber: number | null) {
    return vehicles.filter((vehicle) => {
      const occupancy = getVehicleOccupancy(vehicle.vehicle_number)
      return (
        vehicle.vehicle_number === currentVehicleNumber ||
        occupancy < vehicle.capacity
      )
    })
  }

  async function saveFxRate() {
    const nextRate = Number(fxRateInput)

    if (!Number.isFinite(nextRate) || nextRate <= 0) {
      setFxRateMessage('Enter a valid FX rate greater than 0.')
      return
    }

    setFxRateLoading(true)
    setFxRateMessage('Saving FX rate…')

    const { error } = await supabase
      .from('settings')
      .upsert(
        {
          key: 'usd_ksh_rate',
          value_numeric: nextRate,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' },
      )

    setFxRateLoading(false)

    if (error) {
      console.error('Failed to save FX rate:', error)
      setFxRateMessage(`Could not save FX rate: ${error.message}`)
      return
    }

    setFxRate(nextRate)
    setFxRateInput(String(nextRate))
    setFxRateMessage(`Saved: 1 USD = KSh ${nextRate}`)
  }

  const filteredTravellers = travellers.filter((traveller) => {
    const term = searchTerm.trim().toLowerCase()

    return (
      (!term || traveller.name.toLowerCase().includes(term)) &&
      (residencyFilter === 'All' || traveller.residency === residencyFilter) &&
      (roomFilter === 'All' ||
        String(traveller.room_number ?? '') === roomFilter) &&
      (vehicleFilter === 'All' ||
        (vehicleFilter === 'Unassigned'
          ? traveller.vehicle_number === null
          : String(traveller.vehicle_number ?? '') === vehicleFilter))
    )
  })

  function startEditingVehicle(vehicle: Vehicle) {
    setVehicleSaveError('')
    setEditingVehicleId(vehicle.id)
    setVehicleCapacity(String(vehicle.capacity))
  }

  function cancelEditingVehicle() {
    setEditingVehicleId(null)
    setVehicleCapacity('')
    setVehicleSaveError('')
    setShowRooms(false)
    setRooms([])
    setEditingRoomId(null)
    setRoomCapacity('')
    setRoomSaveError('')
  }

  async function saveVehicleCapacity(vehicle: Vehicle) {
    const newCapacity = Number(vehicleCapacity)

    if (!Number.isInteger(newCapacity) || newCapacity < 1) {
      setVehicleSaveError('Capacity must be a whole number of at least 1.')
      return
    }

    const assignedCount = travellers.filter(
      (traveller) => traveller.vehicle_number === vehicle.vehicle_number,
    ).length

    if (newCapacity < assignedCount) {
      setVehicleSaveError(
        `Capacity cannot be lower than the ${assignedCount} traveller(s) currently assigned to Vehicle ${vehicle.vehicle_number}.`,
      )
      return
    }

    setSavingVehicleId(vehicle.id)
    setVehicleSaveError('')

    const { data, error } = await supabase
      .from('vehicles')
      .update({ capacity: newCapacity })
      .eq('id', vehicle.id)
      .select()
      .single()

    setSavingVehicleId(null)

    if (error) {
      console.error('Failed to save vehicle capacity:', error)
      setVehicleSaveError(error.message)
      return
    }

    setVehicles((current) =>
      current.map((item) => (item.id === vehicle.id ? data : item)),
    )
    setEditingVehicleId(null)
    setVehicleCapacity('')
  }

  function startEditing(traveller: Traveller) {
    setSaveError('')
    setEditingId(traveller.id)
    setEditForm({
      name: traveller.name,
      residency: traveller.residency,
      room_type: traveller.room_type,
      room_number: traveller.room_number?.toString() ?? '',
      vehicle_number: traveller.vehicle_number?.toString() ?? '',
      safari_amount_usd: traveller.safari_amount_usd?.toString() ?? '',
      safari_amount_ksh: traveller.safari_amount_ksh?.toString() ?? '',
      paid_usd: traveller.paid_usd?.toString() ?? '0',
    })
  }

  function cancelEditing() {
    setEditingId(null)
    setEditForm(null)
    setSaveError('')
  }

  async function saveTraveller() {
    if (!editingId || !editForm) return

    setSavingId(editingId)
    setSaveError('')

    const selectedVehicle =
      editForm.vehicle_number === ''
        ? null
        : vehicles.find(
            (vehicle) =>
              vehicle.vehicle_number === Number(editForm.vehicle_number),
          )

    if (selectedVehicle) {
      const occupancy = travellers.filter(
        (traveller) =>
          traveller.vehicle_number === selectedVehicle.vehicle_number &&
          traveller.id !== editingId,
      ).length

      if (occupancy >= selectedVehicle.capacity) {
        setSavingId(null)
        setSaveError(
          `Vehicle ${selectedVehicle.vehicle_number} is full (${occupancy}/${selectedVehicle.capacity}).`,
        )
        return
      }
    }

    const selectedRoom =
      editForm.room_number === ''
        ? null
        : rooms.find(
            (room) => room.room_number === Number(editForm.room_number),
          )

    if (selectedRoom) {
      const occupancy = travellers.filter(
        (traveller) =>
          traveller.room_number === selectedRoom.room_number &&
          traveller.id !== editingId,
      ).length

      if (occupancy >= selectedRoom.capacity) {
        setSavingId(null)
        setSaveError(
          `Room ${selectedRoom.room_number} is full (${occupancy}/${selectedRoom.capacity}).`,
        )
        return
      }
    }

    const update = {
      name: editForm.name.trim(),
      residency: editForm.residency,
      room_type: editForm.room_type,
      room_number: editForm.room_number === '' ? null : Number(editForm.room_number),
      vehicle_number:
        editForm.vehicle_number === '' ? null : Number(editForm.vehicle_number),
      safari_amount_usd:
        editForm.safari_amount_usd === '' ? 0 : Number(editForm.safari_amount_usd),
      safari_amount_ksh:
        editForm.safari_amount_ksh === '' ? 0 : Number(editForm.safari_amount_ksh),
      paid_usd: editForm.paid_usd === '' ? 0 : Number(editForm.paid_usd),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('travellers')
      .update(update)
      .eq('id', editingId)
      .select()
      .single()

    setSavingId(null)

    if (error) {
      console.error('Failed to save traveller:', error)
      setSaveError(error.message)
      return
    }

    setTravellers((current) =>
      current.map((traveller) =>
        traveller.id === editingId ? data : traveller,
      ),
    )

    setEditingId(null)
    setEditForm(null)
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault()

    setError('')
    setSigningIn(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setSigningIn(false)

    if (error) {
      setError(error.message)
      return
    }

    setLoggedIn(true)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setLoggedIn(false)
    setShowTravellers(false)
    setTravellers([])
    setShowVehicles(false)
    setVehicles([])
    setEditingVehicleId(null)
    setVehicleCapacity('')
    setVehicleSaveError('')
  }

  if (loading) {
    return (
      <main className="admin-page">
        <nav
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '24px',
            padding: '12px',
            background: '#fff',
            borderRadius: '10px',
            border: '1px solid rgba(0,0,0,.08)',
          }}
        >
          {[
            ['dashboard', 'Dashboard'],
            ['travellers', 'Travellers'],
            ['vehicles', 'Vehicles'],
            ['accommodation', 'Accommodation'],
            ['payments', 'Payments'],
            ['itinerary', 'Itinerary'],
            ['photos', 'Photos'],
            ['party', 'Party'],
          ].map(([section, label]) => (
            <button
              key={section}
              type="button"
              onClick={() => {
                setActiveSection(section as typeof activeSection)

                if (section === 'travellers') {
                  setShowTravellers(true)
                } else {
                  setShowTravellers(false)
                }

                if (section === 'vehicles') {
                  loadVehicles()
                } else {
                  setShowVehicles(false)
                }

                if (section === 'accommodation') {
                  loadRooms()
                } else {
                  setShowRooms(false)
                }
              }}
              style={{
                padding: '9px 14px',
                borderRadius: '7px',
                cursor: 'pointer',
                fontWeight: activeSection === section ? 700 : 500,
              }}
            >
              {label}
            </button>
          ))}
        </nav>
        <section className="admin-card">
          <p>Loading admin…</p>
        </section>
      </main>
    )
  }

  if (!loggedIn) {
    return (
      <main className="admin-page">
        <section className="admin-card">
          <p className="admin-eyebrow">50 Kachoris Safari</p>
          <h1>Admin</h1>
          <p className="admin-intro">Sign in to manage the safari.</p>

          <form onSubmit={handleLogin}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {error && <p className="admin-error">{error}</p>}

            <button type="submit" disabled={signingIn}>
              {signingIn ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <>
      <style>{`
.safari-admin-shell{min-height:100vh;display:flex;background:#f5f2ea;color:#243028}
.safari-sidebar{width:235px;flex:0 0 235px;padding:28px 16px;background:#18352b;color:#fff;position:sticky;top:0;height:100vh;box-sizing:border-box}
.safari-brand{padding:4px 12px 28px}.safari-brand small{display:block;opacity:.7;font-size:11px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px}.safari-brand strong{font-size:20px}
.safari-nav{display:grid;gap:6px}.safari-nav button{width:100%;border:0;border-radius:9px;padding:11px 12px;background:transparent;color:rgba(255,255,255,.78);text-align:left;cursor:pointer;font:inherit}.safari-nav button:hover,.safari-nav button.active{background:rgba(255,255,255,.12);color:#fff}
.safari-main{min-width:0;flex:1;padding:30px 34px 50px}.safari-topbar{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:28px}.safari-topbar h1{margin:0;font-size:28px;letter-spacing:-.03em}.safari-muted{color:#68736c;margin:5px 0 0}
.safari-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin:22px 0 30px}.safari-stat{background:#fff;border:1px solid #e5e1d8;border-radius:14px;padding:20px;box-shadow:0 4px 18px rgba(30,45,37,.04)}.safari-stat-label{color:#68736c;font-size:13px;margin-bottom:8px}.safari-stat-value{font-size:28px;font-weight:750;letter-spacing:-.03em}
.safari-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.safari-action-card{border:1px solid #e5e1d8;border-radius:14px;background:#fff;padding:20px;text-align:left;cursor:pointer;box-shadow:0 4px 18px rgba(30,45,37,.04);font:inherit}.safari-action-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(30,45,37,.08)}.safari-action-card h2{margin:0 0 7px;font-size:17px}.safari-action-card p{margin:0;color:#68736c;line-height:1.45}
.safari-signout{border:1px solid #ddd8cc;background:#fff;border-radius:8px;padding:9px 13px;cursor:pointer}
@media(max-width:900px){.safari-sidebar{width:190px;flex-basis:190px}.safari-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.safari-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:650px){.safari-admin-shell{display:block}.safari-sidebar{width:auto;height:auto;position:static;padding:16px}.safari-brand{padding-bottom:14px}.safari-nav{grid-template-columns:repeat(2,1fr)}.safari-main{padding:20px 14px 35px}.safari-stats,.safari-grid{grid-template-columns:1fr}}
`}</style>
      <div className="safari-admin-shell">
        <aside className="safari-sidebar">
          <div className="safari-brand"><small>Safari Management</small><strong>50 Kachoris</strong></div>
          <div className="safari-nav">
            {[
              ['dashboard', 'Dashboard'],
              ['travellers', 'Travellers'],
              ['vehicles', 'Vehicles'],
              ['accommodation', 'Accommodation'],
              ['payments', 'Payments'],
              ['itinerary', 'Itinerary'],
              ['photos', 'Photos'],
              ['party', 'Party'],
            ].map(([section, label]) => (
              <button key={section} type="button" className={activeSection === section ? 'active' : ''}
                onClick={() => {
                  setActiveSection(section as typeof activeSection)
                  setShowTravellers(section === 'travellers')
                  setShowVehicles(section === 'vehicles')
                  setShowRooms(section === 'accommodation')
                  if (section === 'travellers') loadTravellers()
                  if (section === 'vehicles') loadVehicles()
                  if (section === 'accommodation') loadRooms()
                }}>
                {label}
              </button>
            ))}
          </div>
        </aside>

        <div className="safari-main">
          <div className="safari-topbar">
            <div>
              <h1>{activeSection === 'dashboard' ? 'Good evening' : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
              <p className="safari-muted">Safari management dashboard</p>
            </div>
          </div>

          <main className="admin-page">
      <section className="admin-dashboard">
        <div className="safari-topbar">
          <div>
            <p className="admin-eyebrow">50 Kachoris Safari</p>
            <h1>Admin Dashboard</h1>
            <p className="safari-muted">Manage your safari from one place.</p>
          </div>
          <button className="safari-signout" onClick={handleSignOut}>Sign out</button>
        </div>

        <div className="safari-stats">
          <div className="safari-stat"><div className="safari-stat-label">Travellers</div><div className="safari-stat-value">{travellers.length || '—'}</div></div>
          <div className="safari-stat"><div className="safari-stat-label">Vehicles</div><div className="safari-stat-value">{vehicles.length || '—'}</div></div>
          <div className="safari-stat"><div className="safari-stat-label">Rooms</div><div className="safari-stat-value">{rooms.length || '—'}</div></div>
          <div className="safari-stat">
            <div className="safari-stat-label">Outstanding</div>
            <div className="safari-stat-value">
              ${travellers.reduce((sum, traveller) => sum + Math.max(0, Number(traveller.safari_amount_usd || 0) - Number(traveller.paid_usd || 0)), 0).toLocaleString()}
            </div>
          </div>
        </div>

        {activeSection === 'dashboard' && (
          <>
            <h2 style={{ margin: '0 0 14px' }}>Quick access</h2>
            <div className="safari-grid">
              <button type="button" className="safari-action-card" onClick={() => { setActiveSection('travellers'); loadTravellers() }}>
                <h2>Travellers</h2><p>View and edit guest details, rooms, vehicles and payments.</p>
              </button>
              <button type="button" className="safari-action-card" onClick={() => { setActiveSection('vehicles'); loadVehicles() }}>
                <h2>Vehicles</h2><p>Manage vehicle capacity and passenger assignments.</p>
              </button>
              <button type="button" className="safari-action-card" onClick={() => { setActiveSection('accommodation'); loadRooms() }}>
                <h2>Accommodation</h2><p>Manage rooms, capacities and the rooming list.</p>
              </button>
              <button type="button" className="safari-action-card" onClick={() => setActiveSection('payments')}>
                <h2>Payments</h2><p>View deposits, payments and outstanding balances.</p>
              </button>
              <button type="button" className="safari-action-card" onClick={() => setActiveSection('itinerary')}>
                <h2>Itinerary</h2><p>Manage the daily safari plans, dates and timings.</p>
              </button>
              <button type="button" className="safari-action-card" onClick={() => setActiveSection('photos')}>
                <h2>Photos</h2><p>Manage the safari photo-sharing settings.</p>
              </button>
              <button type="button" className="safari-action-card" onClick={() => setActiveSection('party')}>
                <h2>Party</h2><p>Manage the party itinerary, food times and rooming list.</p>
              </button>
            </div>
          </>
        )}

        {showVehicles && (
          <section
            style={{
              marginTop: '40px',
              background: '#fffaf0',
              padding: '24px',
              borderRadius: '12px',
            }}
          >
            <h2>Vehicles</h2>

            {vehiclesLoading && <p>Loading vehicles…</p>}

            {vehiclesError && (
              <p className="admin-error">
                Could not load vehicles: {vehiclesError}
              </p>
            )}

            {!vehiclesLoading && !vehiclesError && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                  marginTop: '20px',
                }}
              >
                {vehicles.map((vehicle) => {
                  const assigned = travellers.filter(
                    (traveller) => traveller.vehicle_number === vehicle.vehicle_number,
                  )
                  const full = assigned.length >= vehicle.capacity

                  return (
                    <article
                      key={vehicle.id}
                      style={{
                        padding: '18px',
                        border: '1px solid rgba(0,0,0,.12)',
                        borderRadius: '10px',
                        background: '#fff',
                      }}
                    >
                      <h3 style={{ marginTop: 0 }}>
                        Vehicle {vehicle.vehicle_number}
                      </h3>

                      {editingVehicleId === vehicle.id ? (
                        <div style={{ marginBottom: '16px' }}>
                          <label
                            style={{
                              display: 'block',
                              marginBottom: '8px',
                              fontWeight: 600,
                            }}
                          >
                            Maximum passengers
                          </label>

                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={vehicleCapacity}
                            onChange={(event) =>
                              setVehicleCapacity(event.target.value)
                            }
                            style={{ width: '80px', padding: '8px' }}
                          />

                          <div style={{ marginTop: '10px' }}>
                            <button
                              type="button"
                              onClick={() => saveVehicleCapacity(vehicle)}
                              disabled={savingVehicleId === vehicle.id}
                              style={{ marginRight: '6px' }}
                            >
                              {savingVehicleId === vehicle.id ? 'Saving…' : 'Save'}
                            </button>

                            <button
                              type="button"
                              onClick={cancelEditingVehicle}
                              disabled={savingVehicleId === vehicle.id}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontWeight: 700, marginBottom: '8px' }}>
                            {assigned.length} / {vehicle.capacity}
                          </p>

                          <button
                            type="button"
                            onClick={() => startEditingVehicle(vehicle)}
                          >
                            Edit capacity
                          </button>
                        </div>
                      )}

                      {full && (
                        <p style={{ marginBottom: '10px', fontWeight: 700 }}>
                          Full
                        </p>
                      )}

                      {assigned.length === 0 ? (
                        <p style={{ opacity: 0.65 }}>No travellers assigned.</p>
                      ) : (
                        <ul style={{ paddingLeft: '20px' }}>
                          {assigned.map((traveller) => (
                            <li key={traveller.id}>{traveller.name}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  )
                })}
              </div>
            )}

            {vehicleSaveError && (
              <p className="admin-error" style={{ marginTop: '16px' }}>
                Could not save vehicle: {vehicleSaveError}
              </p>
            )}
          </section>
        )}

        {showRooms && (
          <section
            style={{
              marginTop: '40px',
              background: '#fffaf0',
              padding: '24px',
              borderRadius: '12px',
              overflowX: 'auto',
            }}
          >
            <h2>Accommodation</h2>

            {roomsLoading && <p>Loading rooms…</p>}

            {roomsError && (
              <p className="admin-error">
                Could not load rooms: {roomsError}
              </p>
            )}

            {!roomsLoading && !roomsError && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginTop: '20px',
                }}
              >
                {rooms.map((room) => {
                  const assigned = travellers.filter(
                    (traveller) => traveller.room_number === room.room_number,
                  )
                  const full = assigned.length >= room.capacity

                  return (
                    <article
                      key={room.id}
                      style={{
                        padding: '18px',
                        border: '1px solid rgba(0,0,0,.12)',
                        borderRadius: '10px',
                        background: '#fff',
                      }}
                    >
                      <h3 style={{ marginTop: 0 }}>
                        Room {room.room_number}
                      </h3>
                      <p style={{ marginBottom: '8px' }}>
                        {room.room_type}
                      </p>

                      {editingRoomId === room.id ? (
                        <div style={{ marginBottom: '16px' }}>
                          <label
                            style={{
                              display: 'block',
                              marginBottom: '8px',
                              fontWeight: 600,
                            }}
                          >
                            Maximum occupants
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={roomCapacity}
                            onChange={(event) =>
                              setRoomCapacity(event.target.value)
                            }
                            style={{ width: '80px', padding: '8px' }}
                          />
                          <div style={{ marginTop: '10px' }}>
                            <button
                              type="button"
                              onClick={() => saveRoomCapacity(room)}
                              disabled={savingRoomId === room.id}
                              style={{ marginRight: '6px' }}
                            >
                              {savingRoomId === room.id ? 'Saving…' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditingRoom}
                              disabled={savingRoomId === room.id}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontWeight: 700, marginBottom: '8px' }}>
                            {assigned.length} / {room.capacity}
                          </p>
                          <button
                            type="button"
                            onClick={() => startEditingRoom(room)}
                          >
                            Edit capacity
                          </button>
                        </div>
                      )}

                      {full && (
                        <p style={{ marginBottom: '10px', fontWeight: 700 }}>
                          Full
                        </p>
                      )}

                      {assigned.length === 0 ? (
                        <p style={{ opacity: 0.65 }}>
                          No travellers assigned.
                        </p>
                      ) : (
                        <ul style={{ paddingLeft: '20px' }}>
                          {assigned.map((traveller) => (
                            <li key={traveller.id}>{traveller.name}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  )
                })}
              </div>
            )}

            {roomSaveError && (
              <p className="admin-error" style={{ marginTop: '16px' }}>
                Could not save room: {roomSaveError}
              </p>
            )}
          </section>
        )}

        {activeSection === 'payments' && (
          <section
            className="admin-section"
            style={{ marginTop: '40px' }}
          >
            <h2>Payments</h2>
            <p>
              Payment management is already available in the Travellers
              section. We will build the dedicated payments workspace next.
            </p>
          </section>
        )}

        {activeSection === 'itinerary' && (
          <section className="admin-section" style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2>Itinerary</h2>
                <p>Build and edit the safari schedule.</p>
              </div>
              <button type="button" onClick={resetItineraryForm}>New day / activity</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '10px', marginBottom: '20px' }}>
              {[
                ['day_number', 'Day', 'number'],
                ['date', 'Date', 'date'],
                ['title', 'Title', 'text'],
                ['location', 'Location', 'text'],
                ['start_time', 'Start', 'time'],
                ['end_time', 'End', 'time'],
                ['sort_order', 'Order', 'number'],
              ].map(([key, label, type]) => (
                <label key={key} style={{ display: 'grid', gap: '5px', fontWeight: 600 }}>
                  {label}
                  <input
                    type={type}
                    value={itineraryForm[key as keyof typeof itineraryForm]}
                    onChange={(event) =>
                      setItineraryForm({ ...itineraryForm, [key]: event.target.value })
                    }
                  />
                </label>
              ))}
            </div>
            <label style={{ display: 'grid', gap: '5px', fontWeight: 600, marginBottom: '10px' }}>
              Description
              <textarea value={itineraryForm.description} onChange={(event) => setItineraryForm({ ...itineraryForm, description: event.target.value })} rows={3} />
            </label>
            <label style={{ display: 'grid', gap: '5px', fontWeight: 600, marginBottom: '10px' }}>
              Notes
              <textarea value={itineraryForm.notes} onChange={(event) => setItineraryForm({ ...itineraryForm, notes: event.target.value })} rows={2} />
            </label>
            <button type="button" onClick={saveItineraryItem}>{editingItineraryId ? 'Save changes' : 'Add itinerary item'}</button>
            {editingItineraryId && <button type="button" onClick={resetItineraryForm} style={{ marginLeft: '8px' }}>Cancel</button>}

            {itineraryError && <p className="admin-error">{itineraryError}</p>}
            {itineraryLoading ? <p>Loading itinerary…</p> : (
              <div style={{ marginTop: '24px', display: 'grid', gap: '12px' }}>
                {itinerary.length === 0 ? <p>No itinerary items yet.</p> : itinerary.map((item) => (
                  <article key={item.id} className="admin-section" style={{ padding: '16px' }}>
                    <strong>Day {item.day_number}{item.date ? ` — ${item.date}` : ''}</strong>
                    <h3 style={{ margin: '6px 0' }}>{item.title}</h3>
                    <p>{item.location || 'Location not set'}{item.start_time ? ` • ${item.start_time.slice(0,5)}` : ''}{item.end_time ? `–${item.end_time.slice(0,5)}` : ''}</p>
                    {item.description && <p>{item.description}</p>}
                    {item.notes && <small>{item.notes}</small>}
                    <div style={{ marginTop: '10px' }}>
                      <button type="button" onClick={() => startEditingItinerary(item)}>Edit</button>
                      <button type="button" onClick={() => deleteItineraryItem(item.id)} style={{ marginLeft: '8px' }}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeSection === 'photos' && (
          <section className="admin-section" style={{ marginTop: '40px' }}>
            <h2>Photos</h2>
            <p>Set the links and information for the safari photo gallery.</p>

            {photosLoading ? <p>Loading photo settings…</p> : (
              <>
                <div style={{ display: 'grid', gap: '18px', maxWidth: '700px', marginTop: '20px' }}>
                  <div style={{ padding: '18px', background: '#fff', border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px' }}>
                    <h3 style={{ marginTop: 0 }}>Safari Photos</h3>
                    <label style={{ display: 'grid', gap: '5px', fontWeight: 600 }}>
                      Shared Google Drive link
                      <input
                        type="url"
                        value={photoForm.safari_gallery_url}
                        onChange={(event) => setPhotoForm({ ...photoForm, safari_gallery_url: event.target.value })}
                        placeholder="https://drive.google.com/…"
                      />
                    </label>
                    {photoForm.safari_gallery_url && (
                      <a href={photoForm.safari_gallery_url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px' }}>
                        Open Safari Photos
                      </a>
                    )}
                  </div>

                  <div style={{ padding: '18px', background: '#fff', border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px' }}>
                    <h3 style={{ marginTop: 0 }}>Party Photos</h3>
                    <label style={{ display: 'grid', gap: '5px', fontWeight: 600 }}>
                      Shared Google Drive link
                      <input
                        type="url"
                        value={photoForm.party_gallery_url}
                        onChange={(event) => setPhotoForm({ ...photoForm, party_gallery_url: event.target.value })}
                        placeholder="https://drive.google.com/…"
                      />
                    </label>
                    {photoForm.party_gallery_url && (
                      <a href={photoForm.party_gallery_url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px' }}>
                        Open Party Photos
                      </a>
                    )}
                  </div>
                </div>
                <button type="button" onClick={savePhotoSettings} style={{ marginTop: '14px' }}>Save photo links</button>
                {photosError && <p className="admin-error">{photosError}</p>}
              </>
            )}
          </section>
        )}

        {activeSection === 'party' && (
          <section className="admin-section" style={{ marginTop: '40px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2>Party</h2>
              <p>Manage party and event details.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '10px', marginBottom: '12px' }}>
              {[
                ['title', 'Title', 'text'],
                ['date', 'Date', 'date'],
                ['start_time', 'Start', 'time'],
                ['end_time', 'End', 'time'],
                ['location', 'Location', 'text'],
              ].map(([key, label, type]) => (
                <label key={key} style={{ display: 'grid', gap: '5px', fontWeight: 600 }}>
                  {label}
                  <input type={type} value={partyForm[key as keyof typeof partyForm]} onChange={(event) => setPartyForm({ ...partyForm, [key]: event.target.value })} />
                </label>
              ))}
            </div>
            <label style={{ display: 'grid', gap: '5px', fontWeight: 600, marginBottom: '10px' }}>
              Description
              <textarea value={partyForm.description} onChange={(event) => setPartyForm({ ...partyForm, description: event.target.value })} rows={3} />
            </label>
            <label style={{ display: 'grid', gap: '5px', fontWeight: 600, marginBottom: '10px' }}>
              Notes
              <textarea value={partyForm.notes} onChange={(event) => setPartyForm({ ...partyForm, notes: event.target.value })} rows={2} />
            </label>
            <button type="button" onClick={savePartyEvent}>{editingPartyId ? 'Save changes' : 'Add event'}</button>
            {editingPartyId && <button type="button" onClick={resetPartyForm} style={{ marginLeft: '8px' }}>Cancel</button>}
            {partyError && <p className="admin-error">{partyError}</p>}
            {partyLoading ? <p>Loading party events…</p> : (
              <div style={{ marginTop: '24px', display: 'grid', gap: '12px' }}>
                {partyEvents.length === 0 ? <p>No party events yet.</p> : partyEvents.map((event) => (
                  <article key={event.id} className="admin-section" style={{ padding: '16px' }}>
                    <h3 style={{ margin: 0 }}>{event.title}</h3>
                    <p>{event.date || 'Date not set'}{event.start_time ? ` • ${event.start_time.slice(0,5)}` : ''}{event.end_time ? `–${event.end_time.slice(0,5)}` : ''}</p>
                    <p>{event.location || 'Location not set'}</p>
                    {event.description && <p>{event.description}</p>}
                    {event.notes && <small>{event.notes}</small>}
                    <div style={{ marginTop: '10px' }}>
                      <button type="button" onClick={() => startEditingParty(event)}>Edit</button>
                      <button type="button" onClick={() => deletePartyEvent(event.id)} style={{ marginLeft: '8px' }}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <PartyRoomingAdmin />
          </section>
        )}

        {activeSection === 'dashboard' && (
          <section style={{ marginTop: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <p className="admin-eyebrow">50 Kachoris Safari</p>
              <h1 style={{ marginBottom: '6px' }}>Admin Dashboard</h1>
              <p className="admin-intro">
                Manage your safari from one place.
              </p>
            </div>

            <div
              className="admin-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
              }}
            >
              <button
                type="button"
                className="admin-section"
                onClick={() => {
                  setActiveSection('travellers')
                  setShowTravellers(true)
                }}
                style={{ textAlign: 'left', cursor: 'pointer' }}
              >
                <h2>Travellers</h2>
                <p>View and edit guest details, payments, rooms and vehicles.</p>
              </button>

              <button
                type="button"
                className="admin-section"
                onClick={() => {
                  setActiveSection('vehicles')
                  loadVehicles()
                }}
                style={{ textAlign: 'left', cursor: 'pointer' }}
              >
                <h2>Vehicles</h2>
                <p>Manage vehicle capacity and passenger assignments.</p>
              </button>

              <button
                type="button"
                className="admin-section"
                onClick={() => {
                  setActiveSection('accommodation')
                  loadRooms()
                }}
                style={{ textAlign: 'left', cursor: 'pointer' }}
              >
                <h2>Accommodation</h2>
                <p>Manage rooms, capacities and the rooming list.</p>
              </button>

              <button
                type="button"
                className="admin-section"
                onClick={() => setActiveSection('payments')}
                style={{ textAlign: 'left', cursor: 'pointer' }}
              >
                <h2>Payments</h2>
                <p>View payment totals, deposits and outstanding balances.</p>
              </button>

              <article className="admin-section">
                <h2>FX Rate</h2>
                <p>Set the exchange rate used for all KSh calculations.</p>
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span>1 USD =</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={fxRateInput}
                      onChange={(event) => {
                        setFxRateInput(event.target.value)
                        setFxRateMessage('')
                      }}
                      style={{ width: '100px', padding: '9px' }}
                      aria-label="USD to KSh exchange rate"
                    />
                    <span>KSh</span>
                    <button
                      type="button"
                      onClick={saveFxRate}
                      disabled={fxRateLoading}
                    >
                      {fxRateLoading ? 'Saving…' : 'Save FX rate'}
                    </button>
                  </div>
                  <small style={{ display: 'block', marginTop: '8px' }}>
                    Current: 1 USD = KSh {fxRate}
                  </small>
                  {fxRateMessage && (
                    <small style={{ display: 'block', marginTop: '6px' }}>
                      {fxRateMessage}
                    </small>
                  )}
                </div>
              </article>

              <button
                type="button"
                className="admin-section"
                onClick={() => setActiveSection('itinerary')}
                style={{ textAlign: 'left', cursor: 'pointer' }}
              >
                <h2>Itinerary</h2>
                <p>Manage the safari schedule and daily activities.</p>
              </button>

              <button
                type="button"
                className="admin-section"
                onClick={() => setActiveSection('photos')}
                style={{ textAlign: 'left', cursor: 'pointer' }}
              >
                <h2>Photos</h2>
                <p>Manage the safari photo-sharing area.</p>
              </button>

              <button
                type="button"
                className="admin-section"
                onClick={() => setActiveSection('party')}
                style={{ textAlign: 'left', cursor: 'pointer' }}
              >
                <h2>Party</h2>
                <p>Manage party plans, timings and related information.</p>
              </button>
            </div>
          </section>
        )}

        {showTravellers && (
          <section
            style={{
              marginTop: '40px',
              background: '#fffaf0',
              padding: '24px',
              borderRadius: '12px',
              overflowX: 'auto',
            }}
          >
            <h2>Travellers</h2>

            {travellersLoading && <p>Loading travellers…</p>}

            {travellersError && (
              <p className="admin-error">
                Could not load travellers: {travellersError}
              </p>
            )}

            {!travellersLoading && !travellersError && (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginTop: '20px',
                    alignItems: 'center',
                  }}
                >
                  <input
                    placeholder="Search name…"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    style={{ padding: '9px', minWidth: '180px' }}
                  />

                  <select
                    value={residencyFilter}
                    onChange={(event) => setResidencyFilter(event.target.value)}
                  >
                    <option value="All">All residency</option>
                    <option value="Resident">Resident</option>
                    <option value="Non-resident">Non-resident</option>
                  </select>

                  <select
                    value={roomFilter}
                    onChange={(event) => setRoomFilter(event.target.value)}
                  >
                    <option value="All">All rooms</option>
                    {[...new Set(
                      travellers
                        .map((t) => t.room_number)
                        .filter((r) => r !== null),
                    )]
                      .sort((a, b) => Number(a) - Number(b))
                      .map((room) => (
                        <option key={room} value={String(room)}>
                          Room {room}
                        </option>
                      ))}
                  </select>

                  <select
                    value={vehicleFilter}
                    onChange={(event) => setVehicleFilter(event.target.value)}
                  >
                    <option value="All">All vehicles</option>
                    <option value="Unassigned">Unassigned</option>
                    {vehicles.map((vehicle) => (
                      <option
                        key={vehicle.id}
                        value={String(vehicle.vehicle_number)}
                      >
                        Vehicle {vehicle.vehicle_number}
                      </option>
                    ))}
                  </select>

                  <span style={{ opacity: 0.7 }}>
                    Showing {filteredTravellers.length} of {travellers.length}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    marginTop: '16px',
                    padding: '14px',
                    background: '#fff',
                    borderRadius: '8px',
                  }}
                >
                  <strong>
                    Total: ${filteredTravellers.reduce(
                      (sum, t) => sum + Number(t.safari_amount_usd || 0),
                      0,
                    ).toLocaleString()}
                  </strong>
                  <strong>
                    Deposit (25%): ${(
                      filteredTravellers.reduce(
                        (sum, t) => sum + Number(t.safari_amount_usd || 0),
                        0,
                      ) * 0.25
                    ).toLocaleString()}
                  </strong>
                  <strong>
                    Paid: ${filteredTravellers.reduce(
                      (sum, t) => sum + Number(t.paid_usd || 0),
                      0,
                    ).toLocaleString()}
                  </strong>
                  <strong>
                    Outstanding: ${filteredTravellers.reduce(
                      (sum, t) =>
                        sum +
                        Math.max(
                          0,
                          Number(t.safari_amount_usd || 0) -
                            Number(t.paid_usd || 0),
                        ),
                      0,
                    ).toLocaleString()}
                  </strong>
                </div>

                <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '20px',
                  minWidth: '1250px',
                }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Residency</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Room</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Type</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Vehicle</th>
                    <th style={{ textAlign: 'right', padding: '10px' }}>USD</th>
                    <th style={{ textAlign: 'right', padding: '10px' }}>KSH</th>
                    <th style={{ textAlign: 'right', padding: '10px' }}>Paid</th>
                    <th style={{ textAlign: 'right', padding: '10px' }}>Outstanding</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTravellers.map((traveller) => {
                    const editing = editingId === traveller.id

                    return (
                      <tr key={traveller.id}>
                        {editing && editForm ? (
                          <>
                            <td style={{ padding: '10px' }}>
                              <input
                                value={editForm.name}
                                onChange={(event) =>
                                  setEditForm({
                                    ...editForm,
                                    name: event.target.value,
                                  })
                                }
                              />
                            </td>

                            <td style={{ padding: '10px' }}>
                              <select
                                value={editForm.residency}
                                onChange={(event) =>
                                  setEditForm({
                                    ...editForm,
                                    residency: event.target.value as EditForm['residency'],
                                  })
                                }
                              >
                                <option value="Resident">Resident</option>
                                <option value="Non-resident">Non-resident</option>
                              </select>
                            </td>

                            <td style={{ padding: '10px' }}>
                              <select
                                value={editForm.room_number}
                                onChange={(event) => {
                                  const selectedRoom = rooms.find(
                                    (room) =>
                                      room.room_number === Number(event.target.value),
                                  )
                                  setEditForm({
                                    ...editForm,
                                    room_number: event.target.value,
                                    room_type:
                                      selectedRoom?.room_type ?? editForm.room_type,
                                  })
                                }}
                              >
                                <option value="">Unassigned</option>
                                {getAvailableRooms(traveller.room_number).map((room) => {
                                  const occupancy = getRoomOccupancy(room.room_number)
                                  return (
                                    <option
                                      key={room.id}
                                      value={room.room_number}
                                    >
                                      Room {room.room_number} — {occupancy}/{room.capacity} ({room.room_type})
                                    </option>
                                  )
                                })}
                              </select>
                            </td>

                            <td style={{ padding: '10px' }}>
                              <select
                                value={editForm.room_type}
                                onChange={(event) =>
                                  setEditForm({
                                    ...editForm,
                                    room_type: event.target.value as EditForm['room_type'],
                                  })
                                }
                              >
                                <option value="Double">Double</option>
                                <option value="Twin">Twin</option>
                                <option value="Triple">Triple</option>
                              </select>
                            </td>

                            <td style={{ padding: '10px' }}>
                              <select
                                value={editForm.vehicle_number}
                                onChange={(event) =>
                                  setEditForm({
                                    ...editForm,
                                    vehicle_number: event.target.value,
                                  })
                                }
                              >
                                <option value="">Unassigned</option>
                                {getAvailableVehicles(
                                  traveller.vehicle_number,
                                ).map((vehicle) => {
                                  const occupancy = getVehicleOccupancy(
                                    vehicle.vehicle_number,
                                  )
                                  return (
                                    <option
                                      key={vehicle.id}
                                      value={vehicle.vehicle_number}
                                    >
                                      Vehicle {vehicle.vehicle_number} — {occupancy}/{vehicle.capacity}
                                    </option>
                                  )
                                })}
                              </select>
                            </td>

                            <td style={{ padding: '10px' }}>
                              <input
                                type="number"
                                step="0.01"
                                value={editForm.safari_amount_usd}
                                onChange={(event) => {
                                  const usd = event.target.value
                                  const ksh =
                                    usd === ''
                                      ? ''
                                      : String(Math.round(Number(usd) * fxRate))

                                  setEditForm({
                                    ...editForm,
                                    safari_amount_usd: usd,
                                    safari_amount_ksh: ksh,
                                  })
                                }}
                                style={{ width: '90px' }}
                              />
                            </td>

                            <td style={{ padding: '10px' }}>
                              <input
                                type="number"
                                step="0.01"
                                value={editForm.safari_amount_ksh}
                                onChange={(event) =>
                                  setEditForm({
                                    ...editForm,
                                    safari_amount_ksh: event.target.value,
                                  })
                                }
                                style={{ width: '100px' }}
                              />
                            </td>

                            <td style={{ padding: '10px' }}>
                              <input
                                type="number"
                                step="0.01"
                                value={editForm.paid_usd}
                                onChange={(event) =>
                                  setEditForm({
                                    ...editForm,
                                    paid_usd: event.target.value,
                                  })
                                }
                                style={{ width: '90px' }}
                              />
                            </td>

                            <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                              <button
                                type="button"
                                onClick={saveTraveller}
                                disabled={savingId === traveller.id}
                                style={{ marginRight: '6px' }}
                              >
                                {savingId === traveller.id ? 'Saving…' : 'Save'}
                              </button>

                              <button
                                type="button"
                                onClick={cancelEditing}
                                disabled={savingId === traveller.id}
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: '10px' }}>{traveller.name}</td>
                            <td style={{ padding: '10px' }}>{traveller.residency}</td>
                            <td style={{ padding: '10px' }}>{traveller.room_number ?? '—'}</td>
                            <td style={{ padding: '10px' }}>{traveller.room_type}</td>
                            <td style={{ padding: '10px' }}>
                              {traveller.vehicle_number ?? '—'}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                              ${Number(traveller.safari_amount_usd).toLocaleString()}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                              KSh {Math.round(
                                Number(traveller.safari_amount_usd) * fxRate,
                              ).toLocaleString()}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                              ${Number(traveller.paid_usd).toLocaleString()}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                              ${Math.max(
                                0,
                                Number(traveller.safari_amount_usd) -
                                  Number(traveller.paid_usd),
                              ).toLocaleString()}
                            </td>
                            <td style={{ padding: '10px' }}>
                              {Number(traveller.paid_usd) >= Number(traveller.safari_amount_usd)
                                ? 'Paid'
                                : Number(traveller.paid_usd) > 0
                                  ? 'Part-paid'
                                  : 'Unpaid'}
                            </td>
                            <td style={{ padding: '10px' }}>
                              <button
                                type="button"
                                onClick={() => startEditing(traveller)}
                              >
                                Edit
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              </>
            )}

            {saveError && (
              <p className="admin-error" style={{ marginTop: '16px' }}>
                Could not save traveller: {saveError}
              </p>
            )}
          </section>
        )}
      </section>
    </main>
        </div>
      </div>
    </>
  )
}
