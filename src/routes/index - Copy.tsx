import { createFileRoute } from '@tanstack/react-router'
import {
  BedDouble,
  Binoculars,
  Briefcase,
  CalendarDays,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileDown,
  Filter,
  Mail,
  MapPin,
  Palmtree,
  Search,
  ShieldCheck,
  Users,
  WalletCards,
  Waves,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/index - Copy')({
  component: ProtectedSafariTripPage,
})

function SafariPasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (password === 'Karman') {
      sessionStorage.setItem('safariAccess', 'granted')
      onUnlock()
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  return (
    <main className="password-gate">
      <div className="password-background">
        <img
          src="/assets/photos/taita-elephants.webp"
          alt="Elephants in Taita Hills"
        />
      </div>

      <div className="password-overlay" />

      <div className="password-content">
        <p className="password-location">
          Taita Hills Wildlife Sanctuary · Kenya
        </p>

        <h1>
          50 Kachoris
          <br />
          <em>in the wild</em>
        </h1>

        <p className="password-tagline">
          Let the good times roar
        </p>

        <div className="password-card">
          <p className="eyebrow">Safari access</p>

          <h2>Welcome to the wild</h2>

          <p>
            Enter the safari password to access the itinerary,
            accommodation, payments and trip details.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              placeholder="Enter safari password"
              aria-label="Safari password"
              autoComplete="current-password"
            />

            <button type="submit">
              Enter Safari
            </button>
          </form>

          {error && (
            <p className="password-error">{error}</p>
          )}
        </div>

        <div className="password-thumbnails">
          <img
            src="/assets/photos/taita-giraffe.webp"
            alt="Giraffe in Taita Hills"
          />
          <img
            src="/assets/photos/taita-savanna.webp"
            alt="Taita Hills savanna"
          />
          <img
            src="/assets/photos/salt-lick-lodge.webp"
            alt="Salt Lick Safari Lodge"
          />
        </div>
      </div>
    </main>
  )
}


type Guest = {
  name: string
  residency: 'Resident' | 'Non-resident'
  roomType: 'Double' | 'Twin' | 'Triple'
  room: number
  vehicleNumber: number | null
  usd: number
  ksh: number
  paidUsd: number
}



type LiveItinerary = {
  id: string
  day_number: number
  date: string | null
  title: string
  start_time: string | null
  end_time: string | null
  description: string | null
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

const TRIP_START = new Date('2026-10-28T06:00:00+03:00')

const fallbackGuests: Guest[] = [
  { name: 'Nilesh', vehicleNumber: 1, residency: 'Non-resident', roomType: 'Double', room: 1, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Raksha', vehicleNumber: 1, residency: 'Non-resident', roomType: 'Double', room: 1, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Seema', vehicleNumber: 2, residency: 'Non-resident', roomType: 'Double', room: 2, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Jignesh', vehicleNumber: 2, residency: 'Non-resident', roomType: 'Double', room: 2, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Mai', vehicleNumber: 3, residency: 'Non-resident', roomType: 'Twin', room: 3, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Anya', vehicleNumber: 3, residency: 'Non-resident', roomType: 'Twin', room: 3, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Rushab', vehicleNumber: 4, residency: 'Resident', roomType: 'Twin', room: 4, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Sahil', vehicleNumber: 4, residency: 'Non-resident', roomType: 'Twin', room: 4, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Hemel', vehicleNumber: 5, residency: 'Resident', roomType: 'Double', room: 5, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Shinal', vehicleNumber: 5, residency: 'Resident', roomType: 'Double', room: 5, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Sachi', vehicleNumber: 6, residency: 'Resident', roomType: 'Triple', room: 6, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Siya', vehicleNumber: 6, residency: 'Resident', roomType: 'Triple', room: 6, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Meher', vehicleNumber: 6, residency: 'Non-resident', roomType: 'Triple', room: 6, usd: 475, ksh: 61750, paidUsd: 0 },
  { name: 'Kayaan', vehicleNumber: 7, residency: 'Non-resident', roomType: 'Triple', room: 7, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Samay', vehicleNumber: 7, residency: 'Non-resident', roomType: 'Triple', room: 7, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Chirag', vehicleNumber: 7, residency: 'Non-resident', roomType: 'Triple', room: 7, usd: 475, ksh: 61750, paidUsd: 0 },
  { name: 'Miya', vehicleNumber: 8, residency: 'Non-resident', roomType: 'Double', room: 8, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Rena', vehicleNumber: 8, residency: 'Non-resident', roomType: 'Double', room: 8, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Anusha', vehicleNumber: 9, residency: 'Non-resident', roomType: 'Twin', room: 9, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Neel', vehicleNumber: 9, residency: 'Non-resident', roomType: 'Twin', room: 9, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Jinesh', vehicleNumber: 10, residency: 'Resident', roomType: 'Double', room: 10, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Jyoti', vehicleNumber: 10, residency: 'Resident', roomType: 'Double', room: 10, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Paraag', vehicleNumber: 11, residency: 'Non-resident', roomType: 'Twin', room: 11, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Kavya', vehicleNumber: 11, residency: 'Non-resident', roomType: 'Twin', room: 11, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Hemali', vehicleNumber: 12, residency: 'Non-resident', roomType: 'Twin', room: 12, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Aaron', vehicleNumber: 12, residency: 'Non-resident', roomType: 'Twin', room: 12, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Rohin', vehicleNumber: 13, residency: 'Non-resident', roomType: 'Twin', room: 13, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Shalin', vehicleNumber: 13, residency: 'Resident', roomType: 'Twin', room: 13, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Leora', vehicleNumber: 14, residency: 'Non-resident', roomType: 'Twin', room: 14, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Priya', vehicleNumber: 14, residency: 'Non-resident', roomType: 'Twin', room: 14, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Jinal', vehicleNumber: 15, residency: 'Resident', roomType: 'Twin', room: 15, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Nishi', vehicleNumber: 15, residency: 'Resident', roomType: 'Twin', room: 15, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Maanika', vehicleNumber: 16, residency: 'Non-resident', roomType: 'Twin', room: 16, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Nishma', vehicleNumber: 16, residency: 'Non-resident', roomType: 'Twin', room: 16, usd: 500, ksh: 65000, paidUsd: 0 },
]

const itinerary = [
  {
    day: 'Day 01',
    date: 'Wed, 28 Oct',
    title: 'Mombasa to Taita Hills',
    detail: 'Morning pickup, scenic transfer and first game drive. Settle into Salt Lick before an afternoon drive and dinner.',
    accent: 'sunrise',
  },
  {
    day: 'Day 02',
    date: 'Thu, 29 Oct',
    title: 'A full day on safari',
    detail: 'Early game drive, breakfast, guided wildlife viewing, lunch and a final golden-hour drive before dinner.',
    accent: 'savanna',
  },
  {
    day: 'Day 03',
    date: 'Fri, 30 Oct',
    title: 'Final drive & Mombasa return',
    detail: 'One last early drive and breakfast, then return via the curio shop with an optional Maasai village visit.',
    accent: 'dusk',
  },
]

const money = (amount: number, currency: 'USD' | 'KSH') => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return currency === 'USD' ? `$${formattedAmount}` : `KSh ${formattedAmount}`
}

function ProtectedSafariTripPage() {
  const [showSafari, setShowSafari] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      sessionStorage.getItem('safariAccess') === 'granted'
    ) {
      setHasAccess(true)
    }
  }, [])

  if (!showSafari) {
    return (
      <PublicPartyHome
        onSafari={() => {
          setShowSafari(true)
          if (typeof window !== 'undefined' && sessionStorage.getItem('safariAccess') === 'granted') {
            setHasAccess(true)
          }
        }}
      />
    )
  }

  if (!hasAccess) {
    return <SafariPasswordGate onUnlock={() => setHasAccess(true)} />
  }

  return <SafariTripPage />
}

function PublicPartyHome({ onSafari }: { onSafari: () => void }) {
  const [partyEvents, setPartyEvents] = useState<PartyEvent[]>([])
  const [photoSettings, setPhotoSettings] = useState<PhotoSettings | null>(null)

  useEffect(() => {
    let active = true

    async function loadPartyPage() {
      const [partyResult, photosResult] = await Promise.all([
        supabase
          .from('public_party_events')
          .select('id, title, date, start_time, end_time, location, description, notes')
          .order('date', { ascending: true })
          .order('start_time', { ascending: true }),
        supabase
          .from('public_photo_settings')
          .select('id, title, description, safari_gallery_url, party_gallery_url')
          .limit(1)
          .maybeSingle(),
      ])

      if (!active) return

      if (!partyResult.error) setPartyEvents(partyResult.data ?? [])
      if (!photosResult.error) setPhotoSettings(photosResult.data ?? null)
    }

    loadPartyPage()

    return () => {
      active = false
    }
  }, [])

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="50 Kachoris party home">
          <span className="brand-mark"><Binoculars size={21} /></span>
          <span>50 Kachoris <em>in the wild</em></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#party">Party</a>
          <a href="#party-photos">Photos</a>
        </nav>
        <button className="nav-cta" type="button" onClick={onSafari}>
          <ShieldCheck size={16} /> Safari Login
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-content">
          <p className="eyebrow"><Palmtree size={16} /> The celebration · Kenya</p>
          <h1>50 Kachoris<br/><span>in the wild</span></h1>
          <p className="hero-tagline">Let the good times roar</p>
          <p className="hero-copy">Everything you need for the party — timings, locations, photos and the details for the big celebration.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#party">Party details <ChevronDown size={18} /></a>
            <button className="text-link" type="button" onClick={onSafari}>Safari guest login <span>↗</span></button>
          </div>
        </div>
        <aside className="trip-ticket" aria-label="Party summary">
          <div className="ticket-label">50 Kachoris · Celebration</div>
          <div className="ticket-route">
            <div><strong>KEN</strong><span>Kenya</span></div>
            <div className="route-line"><Palmtree size={19} /></div>
            <div><strong>🎉</strong><span>Party</span></div>
          </div>
          <div className="ticket-meta">
            <span><small>Guests</small>80</span>
            <span><small>Events</small>{partyEvents.length}</span>
            <span><small>Photos</small>Shared</span>
          </div>
        </aside>
      </section>

      <section className="section" id="party">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">The celebration</p>
            <h2>Party plans</h2>
          </div>
          <p>Everything for the celebration, in one place.</p>
        </div>

        {partyEvents.length > 0 ? (
          <div className="itinerary-grid">
            {partyEvents.map((event) => (
              <article className="day-card dusk" key={event.id}>
                <div className="day-number">🎉</div>
                <div className="day-card-content">
                  <p>{event.date ?? 'Date TBC'} {event.location && <span>{event.location}</span>}</p>
                  <h3>{event.title}</h3>
                  {(event.start_time || event.end_time) && (
                    <small>{event.start_time ?? ''}{event.start_time && event.end_time ? ' – ' : ''}{event.end_time ?? ''}</small>
                  )}
                  <p>{event.description ?? ''}</p>
                  {event.notes && <small>{event.notes}</small>}
                </div>
                <CalendarDays className="day-icon" aria-hidden="true" />
              </article>
            ))}
          </div>
        ) : (
          <p className="ledger-note">Party details will appear here once they are added in Admin.</p>
        )}
      </section>

      <section className="section" id="party-photos">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Share the memories</p>
            <h2>Party photos</h2>
          </div>
          <p>{photoSettings?.description ?? 'Shared photo folder for the celebration.'}</p>
        </div>
        <div className="info-stack">
          <article className="info-card">
            <Palmtree />
            <div>
              <p className="eyebrow">Party photos</p>
              <h3>Shared celebration album</h3>
              {photoSettings?.party_gallery_url ? (
                <a href={photoSettings.party_gallery_url} target="_blank" rel="noreferrer">Open Party Photos <ExternalLink size={15} /></a>
              ) : (
                <p>Party photo folder will be added in Admin.</p>
              )}
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="info-card">
          <ShieldCheck />
          <div>
            <p className="eyebrow">Safari guests</p>
            <h3>Travelling on the safari?</h3>
            <p>Use the private Safari Login to access the itinerary, rooming, vehicles and payment details.</p>
            <button className="primary-button" type="button" onClick={onSafari}>Enter Safari</button>
          </div>
        </div>
      </section>

      <footer>
        <div><span className="brand-mark"><Binoculars size={21} /></span><strong>50 Kachoris in the wild</strong></div>
        <p>Family celebration · Kenya</p>
        <div className="footer-links">
          <a href="mailto:Sharik@savannasecrets.com"><Mail size={16} /> Email safari contact</a>
        </div>
      </footer>
    </main>
  )
}

function SafariTripPage() {
  const [guests, setGuests] = useState<Guest[]>(fallbackGuests)
  const [guestsLoading, setGuestsLoading] = useState(true)
  const [guestsError, setGuestsError] = useState('')
  const [liveItinerary, setLiveItinerary] = useState<LiveItinerary[]>([])
  const [partyEvents, setPartyEvents] = useState<PartyEvent[]>([])
  const [photoSettings, setPhotoSettings] = useState<PhotoSettings | null>(null)
  const [fxRate, setFxRate] = useState(130)
  const [syncError, setSyncError] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'due' | 'paid'>('all')

  useEffect(() => {
    let active = true

    async function loadPublicData() {
      setGuestsLoading(true)
      setGuestsError('')
      setSyncError('')

      const [
        travellersResult,
        itineraryResult,
        partyResult,
        photosResult,
        fxResult,
      ] = await Promise.all([
        supabase
          .from('public_safari_travellers')
          .select('name, residency, room_type, room_number, vehicle_number, safari_amount_usd, safari_amount_ksh, paid_usd')
          .order('room_number', { ascending: true })
          .order('name', { ascending: true }),
        supabase
          .from('public_itinerary')
          .select('id, day_number, date, title, start_time, end_time, description, sort_order')
          .order('sort_order', { ascending: true })
          .order('day_number', { ascending: true }),
        supabase
          .from('public_party_events')
          .select('id, title, date, start_time, end_time, location, description, notes')
          .order('date', { ascending: true })
          .order('start_time', { ascending: true }),
        supabase
          .from('public_photo_settings')
          .select('id, title, description, safari_gallery_url, party_gallery_url')
          .limit(1)
          .maybeSingle(),
        supabase
          .from('public_fx_rate')
          .select('usd_ksh_rate')
          .limit(1)
          .maybeSingle(),
      ])

      if (!active) return

      if (travellersResult.error) {
        console.error('Failed to load public travellers:', travellersResult.error)
        setGuestsError('Live traveller information could not be loaded.')
      } else {
        setGuests((travellersResult.data ?? []).map((guest) => ({
          name: guest.name,
          residency: guest.residency,
          roomType: guest.room_type,
          room: Number(guest.room_number),
          vehicleNumber: guest.vehicle_number == null ? null : Number(guest.vehicle_number),
          usd: Number(guest.safari_amount_usd),
          ksh: Number(guest.safari_amount_ksh),
          paidUsd: Number(guest.paid_usd ?? 0),
        })))
      }
      setGuestsLoading(false)

      if (!itineraryResult.error) {
        setLiveItinerary(itineraryResult.data ?? [])
      } else {
        console.error('Failed to load public itinerary:', itineraryResult.error)
      }

      if (!partyResult.error) {
        setPartyEvents(partyResult.data ?? [])
      } else {
        console.error('Failed to load public party:', partyResult.error)
      }

      if (!photosResult.error) {
        setPhotoSettings(photosResult.data ?? null)
      } else {
        console.error('Failed to load public photos:', photosResult.error)
      }

      if (!fxResult.error && fxResult.data?.usd_ksh_rate) {
        setFxRate(Number(fxResult.data.usd_ksh_rate))
      } else if (fxResult.error) {
        console.error('Failed to load public FX rate:', fxResult.error)
      }

      const failed = [
        travellersResult.error,
        itineraryResult.error,
        partyResult.error,
        photosResult.error,
        fxResult.error,
      ].filter(Boolean)

      if (failed.length > 0) {
        setSyncError('Some trip information could not be loaded right now.')
      }

    }

    loadPublicData()

    return () => {
      active = false
    }
  }, [])

  const totals = useMemo(() => {
    const usd = guests.reduce((sum, guest) => sum + guest.usd, 0)
    const paid = guests.reduce((sum, guest) => sum + guest.paidUsd, 0)
    const outstanding = guests.reduce((sum, guest) => sum + Math.max(0, guest.usd - guest.paidUsd), 0)
    const paidCount = guests.filter((guest) => guest.paidUsd >= guest.usd).length
    return {
      usd,
      ksh: usd * fxRate,
      paid,
      outstanding,
      paidKsh: paid * fxRate,
      outstandingKsh: outstanding * fxRate,
      paidCount,
    }
  }, [guests, fxRate])

  const displayedGuests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return guests.filter((guest) => {
      const matchesQuery =
        guest.name.toLowerCase().includes(normalizedQuery) ||
        String(guest.room).includes(normalizedQuery) ||
        guest.roomType.toLowerCase().includes(normalizedQuery) ||
        String(guest.vehicleNumber ?? '').includes(normalizedQuery)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'due' && guest.paidUsd < guest.usd) ||
        (filter === 'paid' && guest.paidUsd >= guest.usd)
      return matchesQuery && matchesFilter
    })
  }, [filter, query, guests])

  const countdownDays = Math.max(0, Math.ceil((TRIP_START.getTime() - Date.now()) / 86400000))


  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Taita Hills trip home">
          <span className="brand-mark"><Binoculars size={21} /></span>
          <span>50 Kachoris <em>in the wild</em></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#itinerary">Itinerary</a>
          <a href="#vehicles">Vehicles</a>
          <a href="#stay">The stay</a>
          <a href="#payments">Payments</a>
        </nav>
        <a className="nav-cta" href="/assets/taita-hills-itinerary.pdf" target="_blank" rel="noreferrer">
          <FileDown size={16} /> Itinerary
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-content">
          <p className="eyebrow"><MapPin size={16} /> Taita Hills Wildlife Sanctuary, Kenya</p>
          <h1>50 Kachoris<br/><span>in the wild</span></h1>
	  <p className="hero-tagline">Let the good times roar</p>
          <p className="hero-copy">Everything you need to know before {guests.length} Kachoris descend on the savannah—itinerary, rooming, vehicle assignments, and live trip payments.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#payments">Check my payments <ChevronDown size={18} /></a>
            <a className="text-link" href="#itinerary">Explore the trip <span>↗</span></a>
          </div>
        </div>
        <aside className="trip-ticket" aria-label="Trip summary">
          <div className="ticket-label">{guests.length} Kachoris · Safari</div>
          <div className="ticket-route">
            <div><strong>MBA</strong><span>Mombasa</span></div>
            <div className="route-line"><Binoculars size={19} /></div>
            <div><strong>THS</strong><span>Taita Hills</span></div>
          </div>
          <div className="ticket-meta">
            <span><small>Depart</small>28 OCT 2026</span>
            <span><small>Return</small>30 OCT 2026</span>
            <span><small>Kachoris</small>{guests.length}</span>
          </div>
          <div className="countdown"><strong>{countdownDays}</strong><span>days until the first game drive</span></div>
        </aside>
        <a className="hero-credit" href="https://commons.wikimedia.org/wiki/File:Group_of_Loxodonta_africana_and_a_game_viewer_vehicle_in_the_evening_south_of_Taita_Hills_Game_Lodge_within_the_Taita_Hills_Wildlife_Sanctuary_in_Kenya_2.jpg" target="_blank" rel="noreferrer">Taita Hills elephants · CT Cooper / CC BY 3.0</a>
      </section>

      <section className="quick-strip" aria-label="Trip highlights">
        <div><CalendarDays /><span><small>Dates</small>28–30 October 2026</span></div>
        <div><Clock3 /><span><small>Duration</small>3 days · 2 nights</span></div>
        <div><BedDouble /><span><small>Rooms</small>16 shared rooms</span></div>
        <div><WalletCards /><span><small>Total outstanding</small>{money(totals.outstanding, 'USD')}</span></div>
      </section>

      <section className="section itinerary-section" id="itinerary">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">The route</p>
            <h2>Our safari, day by day</h2>
          </div>
          <p>Game drives at first light, long lunches overlooking the sanctuary, and the kind of sunsets that make everyone go quiet.</p>
        </div>
        <div className="itinerary-grid">
          {(liveItinerary.length > 0 ? liveItinerary : itinerary.map((item, index) => ({
            id: item.day,
            day_number: index + 1,
            date: null,
            title: item.title,
            start_time: null,
            end_time: null,
            description: item.detail,
            sort_order: index,
          }))).map((item, index) => (
            <article className={`day-card ${['sunrise', 'savanna', 'dusk'][index % 3]}`} key={item.id}>
              <div className="day-number">0{index + 1}</div>
              <div className="day-card-content">
                <p>Day {item.day_number} {item.date && <span>{item.date}</span>}</p>
                <h3>{item.title}</h3>
                {(item.start_time || item.end_time) && (
                  <small>{item.start_time ?? ''}{item.start_time && item.end_time ? ' – ' : ''}{item.end_time ?? ''}</small>
                )}
                <p>{item.description ?? ''}</p>
              </div>
              <Binoculars className="day-icon" aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="wild-gallery" aria-label="Taita Hills photo gallery">
        <figure className="gallery-landscape">
          <img src="/assets/photos/taita-savanna.webp" alt="Wide savanna landscape in Taita Hills Wildlife Sanctuary" loading="lazy" />
          <figcaption><strong>The red-earth horizon</strong><a href="https://commons.wikimedia.org/wiki/File:Savanna_towards_the_south-east_from_the_south-west_of_Taita_Hills_Game_Lodge_within_the_Taita_Hills_Wildlife_Sanctuary_in_Kenya_2.jpg" target="_blank" rel="noreferrer">Taita Hills savanna · CT Cooper / CC BY 3.0</a></figcaption>
        </figure>
        <figure>
          <img src="/assets/photos/taita-giraffe.webp" alt="Giraffe walking through the Taita Hills landscape" loading="lazy" />
          <figcaption><strong>Long-necked locals</strong><a href="https://commons.wikimedia.org/wiki/File:Giraffe_TaitaHills_Kenia.jpg" target="_blank" rel="noreferrer">Taita Hills giraffe · Mar del Sur / CC BY-SA 3.0</a></figcaption>
        </figure>
        <figure>
          <img src="/assets/photos/taita-elephants.webp" alt="Elephants near a safari vehicle at Taita Hills Wildlife Sanctuary" loading="lazy" />
          <figcaption><strong>Golden-hour traffic</strong><a href="https://commons.wikimedia.org/wiki/File:Group_of_Loxodonta_africana_and_a_game_viewer_vehicle_in_the_evening_south_of_Taita_Hills_Game_Lodge_within_the_Taita_Hills_Wildlife_Sanctuary_in_Kenya_2.jpg" target="_blank" rel="noreferrer">Taita Hills elephants · CT Cooper / CC BY 3.0</a></figcaption>
        </figure>
      </section>

      <section className="section stay-section" id="stay">
        <div className="stay-feature">
          <div className="stay-copy">
            <p className="eyebrow">Where we’re staying</p>
            <h2>Salt Lick Safari Lodge</h2>
            <p>Iconic stilted rooms overlook a busy watering hole in the heart of Taita Hills Wildlife Sanctuary.</p>
            <div className="stay-links">
              <a href="https://saltlicksafarilodge.com/" target="_blank" rel="noreferrer">Official lodge site <ExternalLink size={15} /></a>
              <a href="/assets/taita-hills-itinerary.pdf" target="_blank" rel="noreferrer">Open full itinerary <FileDown size={15} /></a>
            </div>
          </div>
          <a className="stay-credit" href="https://commons.wikimedia.org/wiki/File:Salt_Lick_Safari.jpg" target="_blank" rel="noreferrer">Salt Lick Safari Lodge / CC BY-SA 4.0</a>
        </div>
        <div className="info-stack">
          <article className="info-card pool-card">
            <Waves />
            <div><p className="eyebrow">Pool access</p><h3>Swim next door</h3><p>Salt Lick has no pool. Pool access is available at neighboring Taita Hills Safari Resort & Spa; after lunch is the easiest window.</p></div>
          </article>
         <article className="info-card contact-card">
  <Mail />
  <div>
    <p className="eyebrow">Tour Operator</p>
    <h3>Savanna Secrets Safaris Ltd</h3>
    <p>
      Mombasa<br />
      Sharik Suleman — <a href="tel:+254721786885">+254 721 786 885</a><br />
      WhatsApp — <a href="https://wa.me/254741888889" target="_blank" rel="noreferrer">+254 741 888 889</a><br />
      <a href="mailto:Sharik@savannasecrets.com">Sharik@savannasecrets.com</a>
    </p>
  </div>
</article>
          <article className="info-card included-card">
            <Palmtree />
            <div><p className="eyebrow">Package includes</p><h3>Stay, meals & game drives</h3><p>Accommodation, specified meals, sanctuary fees, transport and guiding are covered.</p></div>
          </article>
<article className="info-card luggage-card">
  <Briefcase />
  <div>
    <p className="eyebrow">🧳 Luggage</p>
    <h3>Pack light for the safari</h3>
    <ul>
      <li>Safari vehicles have limited space.</li>
      <li>If you're bringing two large suitcases, please try to take only one on safari.</li>
      <li>We'll arrange for the second to be sent ahead to Casa Dina, ready for you on your return to Mombasa.</li>
    </ul>
  </div>
</article>
        </div>
      </section>

      <section className="section" id="party">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">The celebration</p>
            <h2>Party plans</h2>
          </div>
          <p>Party details are available from the main event page.</p>
        </div>
        <a className="primary-button" href="#top">Back to party page</a>
      </section>

      <section className="section" id="photos">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Share the memories</p>
            <h2>Safari photos</h2>
          </div>
          <p>{photoSettings?.description ?? 'Shared photos from the safari.'}</p>
        </div>
        <div className="info-stack">
          <article className="info-card">
            <Binoculars />
            <div>
              <p className="eyebrow">Safari photos</p>
              <h3>{photoSettings?.title ?? 'Safari Photos'}</h3>
              {photoSettings?.safari_gallery_url ? (
                <a href={photoSettings.safari_gallery_url} target="_blank" rel="noreferrer">Open Safari Photos <ExternalLink size={15} /></a>
              ) : (
                <p>Safari photo folder will be added in Admin.</p>
              )}
            </div>
          </article>
        </div>
      </section>

      <section className="payments-section" id="payments">
        <div className="section payments-inner">
          <div className="section-heading payment-heading">
            <div>
              <p className="eyebrow" style={{ fontSize: '16px', letterSpacing: '0.12em' }}>Payment summary</p>
              <h2>Safari totals</h2>
              {guestsLoading && (
                <p style={{ marginTop: '8px', fontSize: '0.9rem', opacity: 0.7 }}>
                  Updating payment information…
                </p>
              )}
              {guestsError && (
                <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                  {guestsError}
                </p>
              )}
              {syncError && (
                <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                  {syncError}
                </p>
              )}
            </div>
          </div>

          <div className="money-summary">
            <article><span>Total trip value</span><strong>{money(totals.usd, 'USD')}</strong><small>{money(totals.ksh, 'KSH')} · rate {fxRate}</small></article>
            <article className="highlight-summary"><span>Collected so far</span><strong>{money(totals.paid, 'USD')}</strong><small>{money(totals.paidKsh, 'KSH')}</small></article>
            <article><span>Still outstanding</span><strong>{money(totals.outstanding, 'USD')}</strong><small>{money(totals.outstandingKsh, 'KSH')} · full balance</small></article>
          </div>

          <div className="ledger-card">
            <div className="ledger-toolbar">
              <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, room or type" /><span>{displayedGuests.length}</span></label>
              <div className="filter-group" aria-label="Filter payment status">
                <Filter size={16} />
                {(['all', 'due', 'paid'] as const).map((option) => (
                  <button className={filter === option ? 'active' : ''} onClick={() => setFilter(option)} key={option}>{option === 'all' ? 'Everyone' : option === 'due' ? 'Still owe' : 'Paid'}</button>
                ))}
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead><tr><th>Traveler</th><th>Room</th><th>Vehicle</th><th>USD total</th><th>KSh total</th><th>USD paid</th><th>KSh paid</th><th>Outstanding</th></tr></thead>
                <tbody>
                  {displayedGuests.map((guest) => {
                    const outstandingUsd = Math.max(0, guest.usd - guest.paidUsd)
                    const totalKsh = guest.usd * fxRate
                    const paidKsh = guest.paidUsd * fxRate
                    const outstandingKsh = outstandingUsd * fxRate
                    return (
                      <tr key={guest.name}>
                        <td><strong>{guest.name}</strong><small>{guest.residency}</small></td>
                        <td><span className={`room-chip room-${guest.room}`}>#{guest.room}</span><small>{guest.roomType}</small></td>
                        <td><strong>{guest.vehicleNumber == null ? '—' : `Vehicle ${guest.vehicleNumber}`}</strong></td>
                        <td><strong>{money(guest.usd, 'USD')}</strong></td>
                        <td><strong>{money(totalKsh, 'KSH')}</strong></td>
                        <td><strong>{money(guest.paidUsd, 'USD')}</strong></td>
                        <td><strong>{money(paidKsh, 'KSH')}</strong></td>
                        <td><strong>{money(outstandingUsd, 'USD')}</strong><small>{money(outstandingKsh, 'KSH')}</small></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {displayedGuests.length === 0 && <div className="empty-state"><Users /><strong>No travelers found</strong><span>Try another name, room number or payment filter.</span></div>}
            </div>
          </div>
          <p className="ledger-note">KSh figures use the current exchange rate.</p>
        </div>
      </section>

      <footer>
        <div><span className="brand-mark"><Binoculars size={21} /></span><strong>50 Kachoris in the wild</strong></div>
        <p>Family safari hub · 28–30 October 2026</p>
        <div className="footer-links">
          <a href="mailto:Sharik@savannasecrets.com"><Mail size={16} /> Email safari contact</a>
          <a href="#top">Back to top ↑</a>
        </div>
        <div className="admin-footer-link">
          <a href="/admin" aria-label="Admin login">
            <ShieldCheck size={14} /> Admin Login
          </a>
        </div>
      </footer>
    </main>
  )
}
