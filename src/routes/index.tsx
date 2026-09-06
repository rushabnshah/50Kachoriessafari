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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import PartyRooming from './PartyRooming'

export const Route = createFileRoute('/')({
  component: ProtectedSafariTripPage,
})

function SafariPasswordGate({ onUnlock, onParty }: { onUnlock: () => void; onParty: () => void }) {
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
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '12px 20px', background: 'rgba(20,18,15,.95)', color: '#fff' }}>
        <strong>50 Kachoris – The Safari</strong>
        <button type="button" onClick={onParty} style={{ border: '1px solid rgba(255,255,255,.25)', background: 'transparent', color: '#fff', padding: '9px 14px', borderRadius: '999px', fontWeight: 700, cursor: 'pointer' }}>
          🎉 50 Kachoris – The Party
        </button>
      </div>
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

const SAFARI_GOOGLE_PHOTOS_URL = 'https://photos.app.goo.gl/o3LhyBGNx8kapZyz7'

const lantanaSlides = [
  { src: '/assets/party/lantana_real/le-cafe-restaurant.jpg', alt: 'Le Café restaurant at Lantana Galu Beach', caption: 'Le Café · Lantana Galu Beach' },
  { src: '/assets/party/lantana_real/pool.jpg', alt: 'Lantana Galu Beach swimming pool', caption: 'Main swimming pool' },
  { src: '/assets/party/lantana_real/property-gallery-1.jpg', alt: 'Lantana Galu Beach property and palms', caption: 'Lantana · tropical gardens' },
  { src: '/assets/party/lantana_real/property-gallery-6.jpg', alt: 'Lantana Galu Beach grounds', caption: 'Lantana · resort grounds' },
  { src: '/assets/party/lantana_real/property-gallery-8.jpg', alt: 'Lantana Galu Beach interior', caption: 'Lantana · interiors' },
  { src: '/assets/party/lantana_real/galu-beach-2.jpg', alt: 'Galu Beach coastline', caption: 'Galu Beach · Indian Ocean' },
  { src: '/assets/party/lantana_real/galu-beach-6.jpg', alt: 'Galu Beach aerial coastline', caption: 'Galu Beach · coastline' },
  { src: '/assets/party/lantana_real/lantana-beach.jpg', alt: 'Lantana Galu Beach', caption: 'Lantana · beachfront' },
]

const dayThemes = {
  'Return to Our Roots': {
    className: 'roots',
    eyebrow: 'Saturday · 24 October',
    title: 'RETURN TO OUR ROOTS',
    dj: 'DJ Frankie',
    intro: 'As many of us return to our birthplace, DJ Frankie will set the mood with old-school tunes for a nostalgic journey down memory lane. It is only fitting that we honour the country where it all began.',
    dress: 'Colours of the Kenya flag — please wear one dominant colour for the evening: red, black, green, or white.',
    extra: 'Keep it simple. Let the Kenyan colours do the talking.',
    icon: '🇰🇪',
    image: '/assets/party/days/day-roots-wide.jpg',
  },
  'The Rave': {
    className: 'rave',
    eyebrow: 'Sunday · 25 October',
    title: 'THE RAVE',
    dj: 'DJ Açqé',
    intro: 'Prepare for an unforgettable evening on the Lantana beachfront as DJ Açqé takes over the decks and keeps the celebration going into the early hours.',
    dress: 'Hawaiian or beachwear.',
    extra: 'To add to the fun, please make use of the props provided in your welcome party bags.',
    icon: '🎧',
    image: '/assets/party/days/day-rave-wide.jpg',
  },
  'The Wind Down': {
    className: 'bollywood',
    eyebrow: 'Monday · 26 October',
    title: 'THE WIND DOWN',
    dj: 'Bollywood evening',
    intro: 'As the party weekend draws to a close, we’ll ease into a relaxed evening of melodic Bollywood classics to complement the Indian catering set out for the night.',
    dress: 'None — please wear whatever makes you feel comfortable.',
    extra: 'A relaxed final evening to round off the celebrations with good food, music and friends.',
    icon: '🪔',
    image: '/assets/party/days/day-bollywood-wide.jpg',
  },
}

const fallbackPartyEvents: PartyEvent[] = [
  {
    id: 'party-24-oct',
    title: 'Return to Our Roots',
    date: '2026-10-24',
    start_time: null,
    end_time: null,
    location: 'Lantana Galu Beach',
    description: 'DJ Frankie sets the mood with old-school tunes for a nostalgic journey down memory lane, celebrating the country where it all began.',
    notes: 'Dress code: Colours of the Kenya flag — red, black, green, or white.',
  },
  {
    id: 'party-25-oct',
    title: 'The Rave',
    date: '2026-10-25',
    start_time: null,
    end_time: null,
    location: 'Lantana beachfront',
    description: 'Prepare for an unforgettable evening on the Lantana beachfront as DJ Acqé takes over the decks and keeps the celebration going into the early hours.',
    notes: 'Dress code: Hawaiian or beachwear. Please make use of the props provided in your welcome party bags.',
  },
  {
    id: 'party-26-oct',
    title: 'The Wind Down',
    date: '2026-10-26',
    start_time: null,
    end_time: null,
    location: 'Lantana Galu Beach',
    description: 'As the party weekend draws to a close, we’ll ease into a relaxed evening of melodic Bollywood classics alongside Indian catering.',
    notes: 'Dress code: None — please wear whatever makes you feel comfortable.',
  },
]

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
    return (
      <SafariPasswordGate
        onUnlock={() => setHasAccess(true)}
        onParty={() => setShowSafari(false)}
      />
    )
  }

  return <SafariTripPage />
}

function PublicPartyHome({ onSafari }: { onSafari: () => void }) {
  const [partyEvents, setPartyEvents] = useState<PartyEvent[]>(fallbackPartyEvents)
  const [photoSettings, setPhotoSettings] = useState<PhotoSettings | null>(null)
  const [lantanaIndex, setLantanaIndex] = useState(0)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, started: false })

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

      if (!partyResult.error && partyResult.data?.length) {
        setPartyEvents(partyResult.data)
      }

      if (!photosResult.error) {
        setPhotoSettings(photosResult.data ?? null)
      }
    }

    loadPartyPage()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const target = new Date('2026-10-24T18:00:00+03:00').getTime()

    const updateCountdown = () => {
      const difference = target - Date.now()
      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, started: true })
        return
      }

      setCountdown({
        days: Math.ceil(difference / 86400000),
        hours: 0,
        minutes: 0,
        seconds: 0,
        started: false,
      })
    }

    updateCountdown()
    const timer = window.setInterval(updateCountdown, 60000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    lantanaSlides.forEach((slide) => {
      const image = new Image()
      image.src = slide.src
    })
    const timer = window.setInterval(() => {
      setLantanaIndex((current) => (current + 1) % lantanaSlides.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [])

  const displayPartyEvents = useMemo(() => {
    const findEvent = (terms: string[]) =>
      partyEvents.find((event) => {
        const title = event.title.toLowerCase()
        return terms.some((term) => title.includes(term))
      })

    const themeEntries = [
      { key: 'Return to Our Roots' as const, terms: ['roots', 'return'] },
      { key: 'The Rave' as const, terms: ['rave'] },
      { key: 'The Wind Down' as const, terms: ['wind down', 'wind', 'bollywood'] },
    ]

    return themeEntries.map(({ key, terms }) => {
      const theme = dayThemes[key]
      const event = findEvent(terms)
      return event ?? {
        id: `fallback-${theme.className}`,
        title: theme.title,
        date: theme.eyebrow.includes('Saturday') ? '2026-10-24' : theme.eyebrow.includes('Sunday') ? '2026-10-25' : '2026-10-26',
        start_time: null,
        end_time: null,
        location: key === 'The Rave' ? 'Lantana beachfront' : 'Lantana Galu Beach',
        description: theme.intro,
        notes: `Dress code: ${theme.dress}`,
      }
    })
  }, [partyEvents])

  const themeForEvent = (event: PartyEvent) => {
    const title = event.title.toLowerCase()
    if (title.includes('rave')) return dayThemes['The Rave']
    if (title.includes('wind') || title.includes('bollywood')) return dayThemes['The Wind Down']
    return dayThemes['Return to Our Roots']
  }

  return (
    <main className="party-page">
      <style>{`
        .party-page{--gold:#d7a84e;--gold2:#f0cc79;--ink:#0c0c0b;background:#0b0b0a;color:#f7f0e5;min-height:100vh;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .party-toolbar{position:sticky;top:0;z-index:100;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:22px;padding:10px clamp(18px,4vw,54px);background:rgba(8,8,7,.94);backdrop-filter:blur(16px);border-bottom:1px solid rgba(240,204,121,.18)}
        .party-anchor-nav{display:flex;align-items:center;gap:24px;min-width:0}.party-anchor-nav a{color:rgba(255,255,255,.72);font-size:.72rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;transition:color .2s ease}.party-anchor-nav a:hover{color:var(--gold2)}
        .party-toolbar .brand{display:none}.party-toolbar-countdown{display:flex;align-items:baseline;justify-content:center;gap:7px;padding:5px 16px;border-left:1px solid rgba(240,204,121,.22);border-right:1px solid rgba(240,204,121,.22);white-space:nowrap}.party-toolbar-countdown strong{font-family:Georgia,serif;font-size:1.25rem;line-height:1;color:var(--gold2);font-weight:400}.party-toolbar-countdown span{font-size:.63rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.82)}.party-toolbar-countdown.started strong{font-size:.75rem;font-family:inherit;font-weight:800;letter-spacing:.12em}.party-switches{display:flex;gap:8px;justify-self:end}.party-switch{border:1px solid rgba(255,255,255,.22);background:transparent;color:#fff;padding:9px 15px;border-radius:999px;font:inherit;font-weight:700;cursor:pointer}.party-switch.active{background:var(--gold);color:#15120d;border-color:var(--gold)}
        .eyebrow{margin:0 0 8px;text-transform:uppercase;letter-spacing:.18em;font-size:.72rem;font-weight:800;color:var(--gold2)}
        .party-host-hero{position:relative;min-height:clamp(600px,43vw,700px);overflow:hidden;border-bottom:1px solid rgba(240,204,121,.28);background-color:#090908;background-image:linear-gradient(90deg,rgba(5,5,4,.96) 0%,rgba(5,5,4,.86) 22%,rgba(5,5,4,.62) 42%,rgba(5,5,4,.28) 62%,rgba(5,5,4,.08) 82%,rgba(5,5,4,.02) 100%),url("/assets/party/hero-galu-sunset-dark.jpg");background-size:cover;background-position:center center;background-repeat:no-repeat}.party-hero-logo-overlay{position:absolute;z-index:2;left:63%;top:54%;right:auto;transform:translate(-50%,-50%);width:min(32vw,455px);max-height:82%;display:flex;align-items:center;justify-content:center;pointer-events:none}.party-hero-logo-overlay img{display:block;width:100%;height:auto;max-height:570px;object-fit:contain;filter:drop-shadow(0 10px 24px rgba(0,0,0,.72)) drop-shadow(0 0 8px rgba(214,168,78,.16))}.party-host-copy{position:relative;z-index:3;min-height:inherit;width:min(680px,52%);max-width:680px;padding:clamp(54px,6vw,88px) clamp(34px,6vw,92px);display:flex;flex-direction:column;justify-content:center;background:linear-gradient(90deg,rgba(7,7,6,.94) 0%,rgba(7,7,6,.72) 52%,rgba(7,7,6,.18) 82%,transparent 100%)}.party-host-copy h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(3.1rem,5vw,5.3rem);font-weight:400;font-style:normal;line-height:.98;margin:0 0 22px;letter-spacing:-.035em;color:#f0cc79;text-shadow:0 3px 22px rgba(0,0,0,.5)}.party-host-copy h1:after{content:"";display:block;width:190px;height:1px;margin-top:22px;background:linear-gradient(90deg,#d7a84e,rgba(215,168,78,.08))}.party-host-copy p{max-width:600px;color:rgba(255,255,255,.94);line-height:1.72;font-size:1.02rem;font-family:Georgia,"Times New Roman",serif}.party-host-copy .party-host-lede{font-family:Georgia,"Times New Roman",serif;font-size:1.08rem;font-style:normal;color:rgba(255,255,255,.94);line-height:1.62;margin-bottom:2px}.host-signoff{margin-top:16px;line-height:1.65;font-family:Georgia,"Times New Roman",serif;color:#f0cc79;font-size:1rem}.host-signoff em{font-style:italic;color:rgba(255,255,255,.9)}.host-signoff strong{display:inline-block;margin-top:3px;font-family:Georgia,"Times New Roman",serif;font-size:1.18rem;font-weight:600;letter-spacing:.075em;color:#f0cc79;text-shadow:0 2px 12px rgba(0,0,0,.5)}.party-host-meta{display:flex;flex-wrap:wrap;gap:10px 24px;margin-top:24px;padding-top:16px;border-top:1px solid rgba(240,204,121,.28);font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.82)}
.party-50-logo-wrap{display:none}
.party-meta-strip{display:grid;grid-template-columns:repeat(3,1fr);background:#0e0e0c;border-bottom:1px solid rgba(240,204,121,.2)}.party-meta-strip div{text-align:center;padding:18px 14px;border-right:1px solid rgba(240,204,121,.16)}.party-meta-strip div:last-child{border-right:0}.party-meta-strip strong{display:block;color:var(--gold2);font-family:Georgia,serif;font-size:1.2rem}.party-meta-strip span{display:block;margin-top:4px;color:rgba(255,255,255,.62);font-size:.78rem;text-transform:uppercase;letter-spacing:.12em}
        .party-section{padding:76px clamp(22px,5vw,80px);max-width:1380px;margin:0 auto}.party-section-heading{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:30px}.party-section-heading h2{font-family:Georgia,serif;font-size:clamp(2.2rem,4vw,4rem);line-height:.95;margin:0;color:#fff}.party-section-heading>p{max-width:540px;color:rgba(255,255,255,.68);line-height:1.7;margin:0}
        .day-tabs{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid rgba(240,204,121,.42);border-radius:18px;overflow:hidden;background:#f7efe2;margin-bottom:22px}.day-tab{border:0;border-right:1px solid #dfcfb6;background:#f7efe2;color:#222;padding:18px 16px;cursor:pointer;font:inherit;transition:.2s}.day-tab:last-child{border-right:0}.day-tab strong{display:block;font-family:Georgia,serif;font-size:1.05rem}.day-tab span{display:block;margin-top:5px;color:#777;font-size:.82rem}.day-tab.active{background:linear-gradient(135deg,#e8c77f,#f7ead0);color:#15120d}.day-detail-panel{position:relative;width:100%;aspect-ratio:1536/337;height:auto;border:0;border-radius:18px;overflow:hidden;background:#111;box-shadow:0 18px 50px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center}.day-detail-bg{position:absolute;inset:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#111;overflow:hidden}.day-detail-bg img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;transform:none}.day-detail-content{display:none}.day-detail-date,.day-detail-content h3,.day-detail-content .dj,.day-detail-content p,.day-detail-grid,.day-detail-box{display:none}.day-theme-roots{background:#10261b;color:#fff}.day-theme-rave{background:#180b22;color:#fff}.day-theme-bollywood{background:#3a111b;color:#fff}.photo-viewer-backdrop{position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.88);display:grid;place-items:center;padding:24px}.photo-viewer{position:relative;width:min(1100px,96vw);height:min(86vh,800px);display:grid;place-items:center}.photo-viewer img{max-width:100%;max-height:100%;object-fit:contain;border-radius:12px;box-shadow:0 25px 90px rgba(0,0,0,.7)}.photo-viewer-close{position:absolute;right:0;top:-46px;width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(0,0,0,.55);color:#fff;display:grid;place-items:center;cursor:pointer}.photo-viewer-nav{position:absolute;top:50%;transform:translateY(-50%);width:48px;height:48px;border-radius:50%;border:1px solid var(--gold);background:rgba(0,0,0,.7);color:var(--gold2);display:grid;place-items:center;cursor:pointer}.photo-viewer-nav.prev{left:-58px}.photo-viewer-nav.next{right:-58px}
.party-location-grid{display:grid;grid-template-columns:.85fr 1.15fr;min-height:520px;border:1px solid rgba(240,204,121,.28);border-radius:24px;overflow:hidden;box-shadow:0 24px 65px rgba(0,0,0,.32)}.party-location-copy{padding:clamp(30px,5vw,64px);display:flex;flex-direction:column;justify-content:center;background:linear-gradient(145deg,#0f1f18,#173d2c)}.party-location-copy h2{font-family:Georgia,serif;font-size:clamp(2.4rem,4.4vw,4.6rem);line-height:.94;margin:0 0 18px;color:#fff}.party-location-copy p{color:rgba(255,255,255,.78);line-height:1.8}.party-location-copy .party-button{margin-top:16px;width:max-content}.party-location-carousel{position:relative;min-height:520px;background:#111;overflow:hidden}.party-location-carousel img{width:100%;height:100%;min-height:520px;object-fit:cover;display:block}.party-location-carousel:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.22),transparent 45%,rgba(0,0,0,.12));pointer-events:none}.party-image-controls{position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;padding:0 16px;pointer-events:none;z-index:4}.party-image-controls button{pointer-events:auto;width:46px;height:46px;border-radius:50%;border:1px solid var(--gold);background:rgba(0,0,0,.58);color:var(--gold2);display:grid;place-items:center;cursor:pointer}.party-image-caption{position:absolute;left:0;right:0;bottom:0;z-index:4;padding:60px 24px 20px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.78));font-weight:700}.party-image-dots{position:absolute;z-index:5;left:0;right:0;bottom:14px;display:flex;justify-content:center;gap:7px}.party-image-dots button{width:8px;height:8px;padding:0;border:1px solid rgba(255,255,255,.8);border-radius:50%;background:rgba(255,255,255,.35);cursor:pointer}.party-image-dots button.active{width:24px;border-radius:999px;background:var(--gold)}
        .party-rooming{background:#11100e;border:1px solid rgba(240,204,121,.22);border-radius:20px;overflow:hidden}.party-rooming-head{padding:22px;display:flex;gap:16px;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(240,204,121,.16)}.party-rooming-search{min-width:260px;border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:11px 15px;font:inherit;background:#191815;color:#fff}.party-room-grid{display:grid;grid-template-columns:repeat(4,1fr)}.party-room{padding:17px 20px;border-bottom:1px solid rgba(255,255,255,.08);border-right:1px solid rgba(255,255,255,.08)}.party-room strong{display:block;color:var(--gold2);margin-bottom:6px}.party-room span{display:block;line-height:1.45;color:rgba(255,255,255,.86)}.party-room-count{opacity:.55;font-size:.78rem;margin-top:5px}.party-button{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--gold);border-radius:999px;padding:12px 18px;background:var(--gold);color:#16120b;font-weight:800;cursor:pointer;font:inherit;text-decoration:none}.party-button:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,.2)}.photo-share-card{display:flex;align-items:flex-start;gap:22px}.photo-share-card>svg{flex:0 0 auto;color:var(--gold2)}.photo-share-button{display:inline-flex;align-items:center;justify-content:center;gap:9px;margin-top:14px;padding:12px 20px;border:1px solid var(--gold);border-radius:999px;background:var(--gold);color:#16120b;font-weight:800;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}.photo-share-button:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.22)}.party-photo-disabled{opacity:.45;cursor:not-allowed;pointer-events:none}.photo-share-placeholder,.party-photo-placeholder{display:block;margin-top:14px;color:rgba(255,255,255,.55);font-size:.9rem}.party-button.secondary{background:transparent;color:#fff}.party-bottom-links{display:grid;grid-template-columns:1fr 1fr;gap:18px}.party-bottom-card{padding:28px;border:1px solid rgba(240,204,121,.25);border-radius:20px;background:#11100e}.party-bottom-card h3{font-family:Georgia,serif;font-size:1.8rem;margin:0 0 8px}.party-bottom-card p{color:rgba(255,255,255,.68);line-height:1.6}.party-photo-upload{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:18px}.party-upload-label{display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border-radius:999px;background:var(--gold);color:#16120b;font-weight:800;cursor:pointer}.party-upload-label input{display:none}.party-photo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:20px}.party-photo-grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:12px;display:block}.party-photo-empty{margin-top:20px;padding:28px;border:1px dashed rgba(240,204,121,.3);border-radius:16px;text-align:center;color:rgba(255,255,255,.6)}
        .day-theme-roots{background:linear-gradient(135deg,#0d3021,#163d2c);color:#fff}.day-theme-rave{background:linear-gradient(135deg,#22052f,#5b0c61);color:#fff}.day-theme-bollywood{background:linear-gradient(135deg,#5d1021,#8e2735);color:#fff}.day-modal-backdrop{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.78);display:grid;place-items:center;padding:20px}.day-modal{width:min(980px,100%);max-height:92vh;overflow:hidden;border-radius:24px;position:relative;box-shadow:0 30px 90px rgba(0,0,0,.6)}.day-modal-media{height:330px;position:relative;overflow:hidden}.day-modal-media img{width:100%;height:100%;object-fit:cover;display:block}.day-modal-media-overlay{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.86),rgba(0,0,0,.05) 70%)}.day-modal-title{position:absolute;left:38px;right:70px;bottom:28px;color:#fff}.day-modal-title p{margin:0 0 8px;text-transform:uppercase;letter-spacing:.14em;font-size:.78rem;font-weight:800;opacity:.82}.day-modal-title h2{font-family:Georgia,serif;font-size:clamp(2.4rem,6vw,5rem);line-height:.92;margin:0}.day-modal-scroll{max-height:calc(92vh - 330px);overflow-y:auto}.day-modal-copy{padding:34px 40px 44px}.day-modal-copy h3{margin:28px 0 10px;font-size:1.1rem;text-transform:uppercase;letter-spacing:.08em}.day-modal p{max-width:760px;line-height:1.8;font-size:1.05rem}.day-detail-row{display:flex;justify-content:space-between;gap:18px;padding:13px 0;border-bottom:1px solid rgba(255,255,255,.16)}.day-detail-row span{font-size:.75rem;letter-spacing:.12em;font-weight:800;opacity:.68}.day-detail-row strong{text-align:right}.day-dress{padding:20px 22px;border:1px solid rgba(255,255,255,.25);border-radius:16px;background:rgba(0,0,0,.18);line-height:1.7}.day-modal-close{position:absolute;right:18px;top:18px;z-index:10;width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(0,0,0,.55);color:#fff;display:grid;place-items:center;cursor:pointer}
        @media(max-width:560px){.photo-share-card{gap:14px}.photo-share-button{width:100%}}
        @media(max-width:900px){.party-hero-logo-overlay{left:62%;width:min(42vw,360px);top:50%}.party-host-copy{width:min(680px,58%)}.party-toolbar{padding:10px 18px}.party-host-hero{min-height:720px;background-position:center top}.party-hero-logo-overlay{width:min(62vw,430px);right:4%;top:29%;opacity:.94}.party-host-copy{width:72%;max-width:680px;min-height:720px;padding:330px 34px 48px;background:linear-gradient(180deg,rgba(7,7,6,.06) 0%,rgba(7,7,6,.78) 43%,rgba(7,7,6,.97) 66%)}}
        @media(max-width:560px){.party-toolbar{padding:10px 14px}.party-switches{width:100%;justify-content:flex-end}.party-host-hero{min-height:760px;background-position:center top}.party-hero-logo-overlay{width:78vw;right:11%;top:23%;opacity:.9}.party-host-copy{width:100%;min-height:760px;padding:340px 22px 44px;background:linear-gradient(180deg,rgba(7,7,6,.04) 0%,rgba(7,7,6,.72) 43%,rgba(7,7,6,.98) 65%)}.party-host-copy h1{font-size:3.3rem}.party-host-copy .party-host-lede{font-size:1.05rem}}
        @media(max-width:900px){.party-toolbar{align-items:flex-start;flex-direction:column}.party-switches{width:100%;justify-content:flex-start}.party-location-grid{grid-template-columns:1fr}.party-section{padding:58px 18px}.party-section-heading{display:block}.party-section-heading>p{margin-top:14px}.party-day-detail{grid-template-columns:1fr}.party-room-grid{grid-template-columns:repeat(2,1fr)}.party-bottom-links{grid-template-columns:1fr}.party-bottom-links-three{grid-template-columns:1fr}.party-location-carousel,.party-location-carousel img{min-height:360px}.day-detail-panel{height:clamp(210px,31vw,300px)}.day-detail-content{min-height:600px}}
        @media(max-width:820px){.party-anchor-nav{display:flex}.party-toolbar{justify-content:flex-end}.party-practical-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:560px){party-practical{padding:64px 22px}.party-practical-grid{grid-template-columns:1fr;margin-top:28px}.party-practical-grid article{padding:20px}.party-scroll-cue{margin-top:10px}.party-hero-logo-overlay{left:50%;top:25%;width:62vw;max-height:290px}.party-host-hero{min-height:760px;background-position:center top}.party-host-copy{width:100%;min-height:760px;padding:340px 22px 44px;background:linear-gradient(180deg,rgba(7,7,6,.02) 0%,rgba(7,7,6,.56) 42%,rgba(7,7,6,.96) 64%)}.party-host-copy h1{font-size:3.25rem}.party-host-copy .party-host-lede{font-size:1.02rem}.party-host-copy p{font-size:.98rem}.party-meta-strip{grid-template-columns:1fr}.party-meta-strip div{border-right:0;border-bottom:1px solid rgba(240,204,121,.16)}.party-host-copy{padding:48px 22px;min-height:600px}.party-host-copy h1{font-size:4rem}.day-tabs{grid-template-columns:1fr}.day-tab{border-right:0;border-bottom:1px solid #dfcfb6}.day-tab:last-child{border-bottom:0}.day-detail-panel{height:210px;border-radius:14px}.day-detail-content{padding:38px 24px;min-height:620px}.day-detail-content h3{font-size:3.4rem}.party-room-grid{grid-template-columns:1fr}.party-photo-grid{grid-template-columns:repeat(2,1fr)}.day-modal-media{height:250px}.day-modal-scroll{max-height:calc(92vh - 250px)}.day-modal-copy{padding:26px 22px 34px}.day-detail-row{flex-direction:column;gap:4px}.day-detail-row strong{text-align:left}}

        
        .party-practical{padding:84px clamp(22px,5vw,80px);background:#0e0e0c;border-top:1px solid rgba(240,204,121,.16);border-bottom:1px solid rgba(240,204,121,.16)}.party-practical-inner{max-width:1380px;margin:0 auto}.party-practical-heading{max-width:700px;margin-bottom:34px}.party-practical-heading h2{font-family:Georgia,serif;font-weight:400;font-size:clamp(2.2rem,4vw,3.8rem);line-height:.98;margin:0;color:#fff}.party-practical-heading>p:last-child{margin:14px 0 0;color:rgba(255,255,255,.62);line-height:1.7}.party-practical-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.party-practical-grid article{display:flex;align-items:flex-start;gap:16px;min-height:128px;padding:24px;border:1px solid rgba(240,204,121,.18);border-radius:16px;background:linear-gradient(145deg,#151512,#10100e);box-shadow:0 14px 35px rgba(0,0,0,.16);transition:transform .2s ease,border-color .2s ease}.party-practical-grid article:hover{transform:translateY(-2px);border-color:rgba(240,204,121,.36)}.party-practical-grid article>span{font-size:1.45rem;line-height:1}.party-practical-grid article strong{display:block;color:var(--gold2);font-size:.78rem;text-transform:uppercase;letter-spacing:.14em}.party-practical-grid article p{margin:8px 0 0;color:rgba(255,255,255,.78);line-height:1.55;font-size:.92rem}.party-footer{display:grid;grid-template-columns:1.3fr 1fr auto;align-items:center;gap:32px;padding:34px clamp(22px,5vw,80px);background:#080807;border-top:1px solid rgba(240,204,121,.22);color:#fff}.party-footer-brand{display:grid;grid-template-columns:auto 1fr;column-gap:12px;align-items:center}.party-footer-brand .brand-mark{grid-row:span 2;width:34px;height:34px;display:grid;place-items:center;border-radius:50%;background:#16150f}.party-footer-brand strong{font-family:Georgia,serif;font-size:1.15rem;color:#fff}.party-footer-tagline{grid-column:2;color:rgba(255,255,255,.48);font-size:.72rem;margin-top:3px}.party-footer-nav{display:flex;flex-wrap:wrap;justify-content:center;gap:18px}.party-footer-nav a,.party-footer-actions a{color:rgba(255,255,255,.66);font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.12em;transition:color .2s ease}.party-footer-nav a:hover,.party-footer-actions a:hover{color:var(--gold2)}.party-footer-actions{display:flex;flex-direction:column;align-items:flex-end;gap:10px}.party-footer-actions a:last-child{color:var(--gold2)}
        @media(max-width:900px){.party-toolbar{grid-template-columns:minmax(0,1fr) auto;gap:14px}.party-anchor-nav{overflow-x:auto;padding-bottom:2px;scrollbar-width:none}.party-anchor-nav::-webkit-scrollbar{display:none}.party-toolbar-countdown{justify-self:center}.party-footer{grid-template-columns:1fr;text-align:center;gap:22px}.party-footer-brand{justify-content:center;text-align:left}.party-footer-nav{justify-content:center}.party-footer-actions{align-items:center}.party-practical-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:560px){.party-toolbar{grid-template-columns:1fr auto;gap:10px;padding:9px 14px}.party-anchor-nav{grid-column:1 / -1;gap:18px;width:100%}.party-anchor-nav a{font-size:.61rem}.party-toolbar-countdown{grid-column:1;grid-row:2;justify-self:start;padding:4px 11px}.party-toolbar-countdown strong{font-size:1rem}.party-toolbar-countdown span{font-size:.54rem}.party-switches{grid-column:2;grid-row:2}.party-switch{padding:7px 11px;font-size:.72rem}.party-practical{padding:64px 22px}.party-practical-grid{grid-template-columns:1fr;gap:10px}.party-practical-grid article{min-height:0;padding:20px}.party-footer{padding:30px 22px}.party-footer-nav{gap:12px 16px}.party-footer-nav a,.party-footer-actions a{font-size:.62rem}}

        /* Final Party polish */
        .party-section-heading{margin-bottom:34px}.party-section-heading h2{letter-spacing:-.025em}.party-section-heading>p{font-family:Georgia,serif;font-size:1rem}
        .day-tabs{margin-bottom:18px;border-radius:16px;background:#15130f;border-color:rgba(240,204,121,.28);padding:5px;gap:5px;overflow:visible}.day-tab{border:0!important;border-radius:12px;background:transparent;color:rgba(255,255,255,.72);padding:16px 18px;text-align:left}.day-tab:hover{background:rgba(240,204,121,.07);color:#fff}.day-tab.active{background:linear-gradient(135deg,#e8c77f,#f7ead0);color:#15120d;box-shadow:0 8px 25px rgba(0,0,0,.22)}.day-tab-date{display:block;font-size:.65rem;font-weight:800;letter-spacing:.15em;text-transform:uppercase;opacity:.72}.day-tab strong{display:block;margin-top:5px;font-family:Georgia,serif;font-size:1.18rem;letter-spacing:.01em}.day-tab-hint{display:block;margin-top:5px;font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;opacity:.52}.day-tab.active .day-tab-date,.day-tab.active .day-tab-hint{opacity:.7}
        .day-detail-panel{height:auto;aspect-ratio:auto;border-radius:20px;box-shadow:0 22px 65px rgba(0,0,0,.32);background:#111}.day-detail-bg{position:relative;inset:auto;width:100%;height:auto;overflow:hidden}.day-detail-bg img{display:block;width:100%;height:auto;max-width:100%;object-fit:contain;object-position:center}.day-detail-panel:after{content:"";position:absolute;inset:0;border:1px solid rgba(255,255,255,.07);border-radius:inherit;pointer-events:none}
        .party-location-grid{min-height:560px}.party-location-copy{background:linear-gradient(145deg,#11130f,#19392a)}.party-location-copy h2{letter-spacing:-.03em}.party-location-carousel,.party-location-carousel img{min-height:560px}
        .party-bottom-links-three{grid-template-columns:repeat(3,1fr);gap:18px}.party-bottom-card{min-height:300px;display:flex;flex-direction:column;align-items:flex-start}.party-bottom-card .party-button{margin-top:auto}.party-bottom-icon{width:48px;height:48px;display:grid;place-items:center;border:1px solid rgba(240,204,121,.25);border-radius:50%;background:#17150f;margin-bottom:20px}.party-bottom-card h3{font-family:Georgia,serif;font-size:1.7rem;font-weight:400;color:#fff;margin:0 0 10px}.party-bottom-card>p:not(.eyebrow){color:rgba(255,255,255,.66);line-height:1.65;margin:0 0 18px}
        .party-practical{background:linear-gradient(180deg,#0d0d0b,#10100e);padding-top:88px;padding-bottom:88px}.party-practical-heading{max-width:760px}.party-practical-heading h2{letter-spacing:-.025em}.party-practical-grid{grid-template-columns:repeat(3,1fr);gap:16px}.party-practical-grid article{min-height:145px;padding:25px;background:linear-gradient(145deg,#161511,#10100e)}.party-practical-grid article>span{width:42px;height:42px;display:grid;place-items:center;border:1px solid rgba(240,204,121,.2);border-radius:50%;background:#12110e;flex:0 0 42px}
        .party-footer{grid-template-columns:minmax(260px,1.4fr) minmax(280px,1fr) auto;gap:45px;padding:56px clamp(22px,5vw,80px);background:#070706}.party-footer-main .eyebrow{margin-bottom:10px}.party-footer-main h2{font-family:Georgia,serif;font-size:clamp(1.7rem,2.4vw,2.5rem);line-height:1.08;font-weight:400;color:#f0cc79;margin:0;max-width:560px}.party-footer-main>p:last-child{margin:14px 0 0;color:rgba(255,255,255,.45);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}.party-footer-nav{justify-content:flex-start;gap:12px 22px}.party-footer-actions{align-items:flex-end;white-space:nowrap}
        @media(max-width:900px){.day-detail-panel{height:auto;aspect-ratio:auto}.party-location-grid{min-height:0}.party-location-carousel,.party-location-carousel img{min-height:420px}.party-bottom-links-three{grid-template-columns:1fr}.party-bottom-card{min-height:240px}.party-footer{grid-template-columns:1fr;gap:26px}.party-footer-nav{justify-content:flex-start}.party-footer-actions{align-items:flex-start}}
        @media(max-width:560px){.day-tabs{grid-template-columns:1fr;gap:4px;padding:4px}.day-tab{padding:13px 15px}.day-tab strong{font-size:1.05rem}.day-tab-hint{display:none}.day-detail-panel{height:auto;aspect-ratio:16/9;border-radius:14px}.day-detail-bg{position:absolute;inset:0;height:100%}.day-detail-bg img{width:100%;height:100%;object-fit:contain}.party-location-carousel,.party-location-carousel img{min-height:320px}.party-bottom-card{min-height:0;padding:24px}.party-practical{padding:64px 18px}.party-practical-grid{grid-template-columns:1fr;gap:10px}.party-practical-grid article{min-height:0;padding:20px}.party-footer{padding:42px 22px}.party-footer-main h2{font-size:1.8rem}.party-footer-nav{gap:12px 18px}}
      
        @media(max-width:820px){.party-anchor-nav{display:flex;overflow-x:auto;white-space:nowrap;scrollbar-width:none}.party-anchor-nav::-webkit-scrollbar{display:none}}

        /* Final party-page polish */
        .party-host-kicker{margin:0 0 18px;color:var(--gold2);font-size:.7rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase}
        .party-host-copy{padding-top:clamp(60px,7vw,104px);padding-bottom:clamp(60px,7vw,104px)}
        .party-host-copy h1{max-width:640px}
        .party-host-copy .party-host-lede{font-family:Georgia,"Times New Roman",serif;font-size:clamp(1.15rem,1.55vw,1.42rem);line-height:1.55;color:#f3e5c7;max-width:600px}
        .party-host-copy>p:not(.party-host-lede):not(.host-signoff){max-width:570px;color:rgba(255,255,255,.76)}
        .party-host-meta{margin-top:22px}
        .party-scroll-cue{margin-top:24px;border-bottom:1px solid rgba(240,204,121,.35);padding-bottom:6px;width:max-content}

        .party-section{position:relative}
        .party-section-heading{padding-bottom:4px}
        .party-section-heading .eyebrow{margin-bottom:10px}
        .party-section-heading h2{letter-spacing:-.035em}
        #weekend.party-section{padding-top:88px;padding-bottom:92px}
        #weekend.party-section:before{content:"";position:absolute;left:clamp(22px,5vw,80px);right:clamp(22px,5vw,80px);top:0;height:1px;background:linear-gradient(90deg,transparent,rgba(240,204,121,.32),transparent)}
        .day-tabs{background:#11100e;border-color:rgba(240,204,121,.3);box-shadow:0 12px 35px rgba(0,0,0,.2)}
        .day-tab{background:#11100e;color:#fff;border-color:rgba(255,255,255,.08);min-height:112px;text-align:left;padding:20px 18px}
        .day-tab-date{font-size:.68rem!important;font-weight:800;letter-spacing:.17em;text-transform:uppercase;color:rgba(255,255,255,.42)!important}
        .day-tab strong{font-size:1.08rem;margin-top:10px;color:#fff}
        .day-tab-hint{font-size:.68rem!important;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.32)!important}
        .day-tab.active{background:linear-gradient(135deg,#ead09a,#f5e4bd);box-shadow:inset 0 0 0 1px rgba(255,255,255,.2)}
        .day-tab.active .day-tab-date,.day-tab.active .day-tab-hint{color:rgba(20,17,12,.52)!important}
        .day-tab.active strong{color:#17130d}
        .day-detail-panel{border-radius:20px;box-shadow:0 24px 70px rgba(0,0,0,.38);background:#050505}
        .day-detail-bg{background:#050505}
        .day-detail-bg img{object-fit:contain}

        #galu.party-section{padding-top:86px;padding-bottom:96px}
        .party-location-grid{min-height:0;grid-template-columns:.8fr 1.2fr;border-color:rgba(240,204,121,.25);box-shadow:0 25px 70px rgba(0,0,0,.28)}
        .party-location-copy{padding:clamp(34px,5vw,70px)}
        .party-location-copy h2{font-size:clamp(2.5rem,4vw,4.3rem)}
        .party-location-copy .eyebrow{margin-bottom:10px}
        .party-location-carousel{min-height:560px}
        .party-location-carousel img{min-height:560px}

        #rooms.party-section{padding-top:86px;padding-bottom:86px}
        #rooms .party-rooming{box-shadow:0 20px 55px rgba(0,0,0,.22)}
        #rooms .party-section-heading>p{font-size:.96rem}

        #memories.party-section{padding-top:88px;padding-bottom:96px}
        .party-bottom-links-three{grid-template-columns:repeat(3,1fr);gap:16px}
        .party-bottom-card{min-height:270px;padding:30px;display:flex;flex-direction:column;align-items:flex-start;background:linear-gradient(145deg,#151411,#0f0f0d);border-color:rgba(240,204,121,.22);box-shadow:0 18px 45px rgba(0,0,0,.2);transition:transform .22s ease,border-color .22s ease,background .22s ease}
        .party-bottom-card:hover{transform:translateY(-4px);border-color:rgba(240,204,121,.46);background:linear-gradient(145deg,#1a1813,#11110e)}
        .party-bottom-card h3{font-size:1.75rem}
        .party-bottom-card .party-button{margin-top:auto}
        .party-bottom-icon{width:46px;height:46px;display:grid;place-items:center;border-radius:50%;background:#1d1a13;border:1px solid rgba(240,204,121,.22);font-size:1.25rem;margin-bottom:20px}
        .party-practical{padding-top:86px;padding-bottom:86px}
        .party-practical-heading{margin-bottom:30px}
        .party-practical-grid article{min-height:116px}
        .party-footer{padding-top:48px;padding-bottom:48px}
        .party-footer-main h2{font-family:Georgia,serif;font-weight:400;line-height:1.08}

        @media(max-width:900px){
          .party-host-copy{padding-top:52px;padding-bottom:52px}
          .party-location-grid{grid-template-columns:1fr}
          .party-location-carousel,.party-location-carousel img{min-height:420px}
          .party-bottom-links-three{grid-template-columns:1fr}
          .party-bottom-card{min-height:220px}
        }
        @media(max-width:820px){
          .party-anchor-nav{display:flex;overflow-x:auto;white-space:nowrap;scrollbar-width:none}
          .party-anchor-nav::-webkit-scrollbar{display:none}
          #weekend.party-section,#galu.party-section,#rooms.party-section,#memories.party-section{padding-top:68px;padding-bottom:72px}
        }
        @media(max-width:560px){
          .party-host-kicker{font-size:.62rem;letter-spacing:.16em}
          .party-host-copy h1{font-size:3.25rem}
          .party-host-copy .party-host-lede{font-size:1.08rem}
          .day-tab{min-height:92px;padding:16px}
          .day-detail-panel{border-radius:14px}
          .party-location-carousel,.party-location-carousel img{min-height:300px}
          .party-bottom-card{padding:24px}
        }



        /* Final usability + responsive polish */
        html{scroll-behavior:smooth;scroll-padding-top:72px}
        .party-page a,.party-page button{transition:color .2s ease,background-color .2s ease,border-color .2s ease,transform .2s ease,box-shadow .2s ease}
        .party-anchor-nav{scrollbar-width:none}
        .party-anchor-nav::-webkit-scrollbar{display:none}
        .party-section[id]{scroll-margin-top:72px}
        .party-bottom-card-action{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:flex-start;min-height:270px}
        .party-bottom-card-action:after{content:"";position:absolute;right:-70px;bottom:-95px;width:190px;height:190px;border:1px solid rgba(240,204,121,.12);border-radius:50%;pointer-events:none}
        .party-bottom-card-action .party-button{margin-top:auto}
        .party-bottom-card-action:hover{border-color:rgba(240,204,121,.48);transform:translateY(-3px);box-shadow:0 18px 45px rgba(0,0,0,.22)}
        .party-bottom-icon{font-size:1.7rem;margin-bottom:18px;filter:grayscale(.15)}
        .party-practical-grid article{transition:transform .2s ease,border-color .2s ease,background-color .2s ease}
        .party-practical-grid article:hover{transform:translateY(-2px);border-color:rgba(240,204,121,.35);background:rgba(255,255,255,.035)}
        .party-location-copy .party-button{align-self:flex-start}
        .party-image-controls button:hover{transform:scale(1.06);background:rgba(0,0,0,.78)}
        .day-tab:hover:not(.active){background:#efe5d5}
        .party-scroll-cue:hover{transform:translateX(4px)}

        @media(max-width:1100px){
          .party-toolbar{gap:14px;padding-left:22px;padding-right:22px}
          .party-anchor-nav{gap:15px}
          .party-anchor-nav a{font-size:.66rem;letter-spacing:.09em}
          .party-host-copy{width:min(700px,58%)}
          .party-hero-logo-overlay{left:67%;width:min(30vw,390px)}
        }
        @media(max-width:900px){
          .party-toolbar{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"nav switches" "countdown countdown";gap:9px 14px;padding-top:10px;padding-bottom:10px}
          .party-anchor-nav{grid-area:nav;min-width:0;overflow-x:auto;padding-bottom:2px}
          .party-switches{grid-area:switches}
          .party-toolbar-countdown{grid-area:countdown;width:max-content;justify-self:center}
          .party-host-hero{min-height:650px;background-position:center center}
          .party-host-copy{width:62%;padding-left:36px;padding-right:32px}
          .party-hero-logo-overlay{left:72%;width:min(28vw,330px)}
          .party-location-grid{min-height:0}
          .party-location-carousel,.party-location-carousel img{min-height:440px}
        }
        @media(max-width:560px){
          html{scroll-padding-top:108px}
          .party-toolbar{grid-template-columns:1fr auto;grid-template-areas:"nav nav" "countdown switches";padding:9px 14px}
          .party-anchor-nav{gap:18px;width:100%;padding:2px 2px 6px}
          .party-anchor-nav a{font-size:.61rem;letter-spacing:.075em}
          .party-switches{justify-self:end}
          .party-switch{padding:8px 12px;font-size:.68rem}
          .party-toolbar-countdown{justify-self:start;border-left:0;padding-left:2px;padding-right:12px}
          .party-host-hero{min-height:650px;background-position:60% top}
          .party-hero-logo-overlay{left:72%;top:23%;width:54vw;opacity:.95}
          .party-host-copy{width:100%;padding:290px 22px 40px;background:linear-gradient(180deg,rgba(7,7,6,.02) 0%,rgba(7,7,6,.58) 40%,rgba(7,7,6,.96) 62%,rgba(7,7,6,.99) 100%)}
          .party-host-copy h1{font-size:clamp(3rem,13vw,4rem)}
          .party-host-copy p{font-size:.96rem;line-height:1.65}
          .party-host-meta{gap:8px 15px;font-size:.63rem}
          .party-section{padding-left:18px;padding-right:18px}
          .day-detail-panel{aspect-ratio:1536/337;height:auto;min-height:0}
          .day-detail-bg{position:relative;inset:auto;width:100%;height:auto;aspect-ratio:1536/337}
          .day-detail-bg img{width:100%;height:100%;object-fit:contain}
          .party-location-carousel,.party-location-carousel img{min-height:300px;height:300px}
          .party-bottom-card-action{min-height:240px}
          .party-practical{padding-left:18px;padding-right:18px}
        }



        /* Mobile refinement — keep all rules inside the component style block */
        @media(max-width:560px){
          html,body,#root{max-width:100%;overflow-x:hidden}
          .party-page{width:100%;overflow-x:hidden}
          .party-toolbar{position:sticky;top:0;z-index:100;display:grid;grid-template-columns:1fr auto;grid-template-areas:"nav nav" "countdown switches";gap:8px;padding:9px 12px 10px}
          .party-anchor-nav{grid-area:nav;display:flex!important;width:100%;overflow-x:auto;gap:20px;padding:1px 2px 5px;white-space:nowrap;-webkit-overflow-scrolling:touch;scrollbar-width:none}
          .party-anchor-nav::-webkit-scrollbar{display:none}
          .party-anchor-nav a{font-size:.58rem;letter-spacing:.10em;flex:0 0 auto}
          .party-toolbar-countdown{grid-area:countdown;justify-self:start;border-left:0;padding:4px 0}
          .party-toolbar-countdown strong{font-size:1rem}
          .party-toolbar-countdown span{font-size:.52rem}
          .party-switches{grid-area:switches;justify-self:end;align-self:center}
          .party-switch{min-height:32px;padding:6px 10px;font-size:.62rem;letter-spacing:.02em}

          /* Compact hero: keep the 50 mark higher and to the right so the welcome message starts sooner. */
          .party-host-hero{min-height:0;height:auto;background-position:center top;background-size:auto 520px;background-repeat:no-repeat}
          .party-hero-logo-overlay{position:absolute;left:auto;right:7%;top:34px;transform:none;width:min(48vw,205px);max-height:none}
          .party-hero-logo-overlay img{width:100%;max-height:none}
          .party-host-copy{width:100%;min-height:0;padding:225px 22px 42px;background:linear-gradient(180deg,rgba(7,7,6,0) 0%,rgba(7,7,6,.18) 24%,rgba(7,7,6,.84) 50%,rgba(7,7,6,.99) 67%,rgba(7,7,6,1) 100%)}
          .party-host-copy h1{font-size:clamp(2.9rem,13vw,3.6rem);line-height:.98;margin-bottom:18px;letter-spacing:-.04em}
          .party-host-copy h1:after{width:145px;margin-top:18px}
          .party-host-copy .party-host-lede{font-size:1rem;line-height:1.55}
          .party-host-copy p{font-size:.94rem;line-height:1.62}
          .party-host-meta{display:none}

          .party-section{width:100%;box-sizing:border-box;padding:56px 18px}
          .party-section-heading{margin-bottom:22px}
          .party-section-heading h2{font-size:2.3rem;line-height:1.02}
          .party-section-heading>p{margin-top:12px;font-size:.96rem;line-height:1.6}

          /* All three dates stay visible without horizontal scrolling. */
          .day-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;padding:4px;margin-bottom:14px;overflow:hidden;border-radius:14px}
          .day-tab{min-width:0;min-height:90px;padding:13px 7px;border-radius:10px;text-align:center}
          .day-tab-date{font-size:.49rem;letter-spacing:.07em;white-space:nowrap}
          .day-tab strong{margin-top:5px;font-size:.76rem;line-height:1.12}
          .day-tab-hint{display:none}

          /* Make the wide invitation genuinely readable on a phone: show it larger and let guests swipe across it rather than shrinking it to a tiny strip. */
          .day-detail-panel{height:200px!important;aspect-ratio:auto;border-radius:12px;overflow:hidden;position:relative}
          .day-detail-bg{position:absolute!important;inset:0!important;width:100%;height:100%!important;aspect-ratio:auto;overflow-x:auto;overflow-y:hidden;background:#090909;display:flex;align-items:center;justify-content:flex-start;-webkit-overflow-scrolling:touch;scrollbar-width:none}
          .day-detail-bg::-webkit-scrollbar{display:none}
          .day-detail-bg img{width:auto!important;height:200px!important;max-width:none!important;object-fit:contain!important;display:block;flex:0 0 auto}
          .day-detail-panel:before{content:"Swipe to view invitation →";position:absolute;right:8px;bottom:8px;z-index:5;padding:5px 7px;border-radius:999px;background:rgba(0,0,0,.72);color:rgba(255,255,255,.9);font-size:.5rem;letter-spacing:.04em;text-transform:uppercase;pointer-events:none}

          .party-location-grid{display:flex;flex-direction:column;min-height:0}
          .party-location-copy{padding:28px 22px}
          .party-location-copy h2{font-size:2.4rem}
          .party-location-copy p{font-size:.94rem;line-height:1.62}
          .party-location-copy .party-button{width:100%;justify-content:center}
          .party-location-carousel,.party-location-carousel img{min-height:300px;height:300px}

          .party-room-grid,.party-bottom-links-three,.party-practical-grid{grid-template-columns:1fr!important}
          .party-bottom-card,.party-bottom-card-action{min-height:0;padding:24px!important}
          .party-bottom-card h3{font-size:1.5rem}
          .party-practical{padding:56px 18px!important}
          .party-practical-grid{gap:10px}
          .party-practical-grid article{min-height:0;padding:20px}

          .party-footer{display:flex!important;flex-direction:column;align-items:center;text-align:center;gap:22px;padding:38px 20px}
          .party-footer-brand{display:flex;flex-direction:column;align-items:center;gap:9px;text-align:center}
          .party-footer-nav{display:grid;grid-template-columns:repeat(2,1fr);width:100%;max-width:280px;gap:14px 20px}
          .party-footer-actions{align-items:center}
        }


          /* Mobile invitation details: keep the artwork visual, then provide the full readable invitation copy below it. */
          .day-detail-mobile-content{display:none}
          @media(max-width:560px){
            .party-hero-logo-overlay{
              left:50%;
              right:auto;
              top:12px;
              transform:translateX(-50%);
              width:min(50vw,205px);
              max-width:205px;
            }
            .party-hero-logo-overlay img{width:100%;height:auto;max-height:none}
            .party-host-copy{padding-top:205px}

            .day-detail-panel{
              height:auto!important;
              aspect-ratio:auto!important;
              overflow:hidden;
              border-radius:14px;
              background:#0d0d0b;
            }
            .day-detail-bg{
              position:relative!important;
              inset:auto!important;
              width:100%!important;
              height:220px!important;
              min-height:220px!important;
              aspect-ratio:auto!important;
              overflow-x:auto!important;
              overflow-y:hidden!important;
              display:flex!important;
              align-items:center!important;
              justify-content:flex-start!important;
              background:#090909;
              -webkit-overflow-scrolling:touch;
              scrollbar-width:none;
            }
            .day-detail-bg::-webkit-scrollbar{display:none}
            .day-detail-bg img{
              width:auto!important;
              height:220px!important;
              max-width:none!important;
              object-fit:contain!important;
              object-position:center!important;
              display:block!important;
              flex:0 0 auto!important;
            }
            .day-detail-panel:before{
              content:"Swipe to view invitation →";
              position:absolute;
              right:8px;
              top:194px;
              bottom:auto;
              z-index:5;
              padding:5px 7px;
              border-radius:999px;
              background:rgba(0,0,0,.72);
              color:rgba(255,255,255,.9);
              font-size:.5rem;
              letter-spacing:.04em;
              text-transform:uppercase;
              pointer-events:none;
            }
            .day-detail-mobile-content{
              display:block!important;
              position:relative;
              padding:24px 20px 28px;
              background:linear-gradient(180deg,#11110f 0%,#0b0b0a 100%);
              border-top:1px solid rgba(240,204,121,.16);
            }
            .day-detail-mobile-content .day-detail-date{
              display:block!important;
              margin:0 0 8px;
              color:rgba(255,255,255,.48);
              font-size:.62rem;
              font-weight:800;
              letter-spacing:.16em;
              text-transform:uppercase;
            }
            .day-detail-mobile-content h3{
              display:block!important;
              margin:0 0 5px;
              color:#f0cc79;
              font-family:Georgia,"Times New Roman",serif;
              font-size:1.8rem;
              line-height:1.05;
              font-weight:400;
            }
            .day-detail-mobile-content .dj{
              display:block!important;
              margin:0 0 14px;
              color:#b9df75;
              font-size:.78rem;
              font-weight:800;
              text-transform:uppercase;
              letter-spacing:.1em;
            }
            .day-detail-mobile-content .day-detail-intro{
              display:block!important;
              margin:0 0 16px;
              color:rgba(255,255,255,.8);
              font-size:.93rem;
              line-height:1.62;
            }
            .day-detail-mobile-content .day-detail-box{
              display:flex!important;
              flex-direction:column;
              gap:5px;
              margin:4px 0 14px;
              padding:12px 14px;
              border-left:2px solid #d7a84e;
              background:rgba(240,204,121,.05);
            }
            .day-detail-mobile-content .day-detail-box strong{
              display:block!important;
              color:#f0cc79;
              font-size:.62rem;
              letter-spacing:.14em;
            }
            .day-detail-mobile-content .day-detail-box span{
              display:block!important;
              color:rgba(255,255,255,.78);
              font-size:.88rem;
              line-height:1.5;
            }
            .day-detail-mobile-content .day-detail-extra{
              display:block!important;
              margin:0!important;
              color:#d9b66a!important;
              font-family:Georgia,"Times New Roman",serif;
              font-style:italic;
              font-size:.88rem!important;
              line-height:1.55!important;
            }
          }

          /* Final mobile invitation layout:
             show the complete artwork at the page width, with the readable narrative immediately below.
             No overlay, no horizontal swipe, and no cropping. */
          @media(max-width:560px){
            .party-hero-logo-overlay{
              left:50%!important;
              right:auto!important;
              top:8px!important;
              transform:translateX(-50%)!important;
              width:155px!important;
              max-width:155px!important;
            }
            .party-hero-logo-overlay img{
              width:100%!important;
              height:auto!important;
            }
            .party-host-copy{
              padding-top:175px!important;
            }
            .party-host-copy .party-host-kicker{
              margin:10px 0 14px!important;
              font-size:.78rem!important;
              line-height:1.3!important;
              letter-spacing:.11em!important;
              white-space:normal!important;
            }

            .day-detail-panel{
              display:block!important;
              height:auto!important;
              min-height:0!important;
              aspect-ratio:auto!important;
              overflow:hidden!important;
              border-radius:14px!important;
              background:#0d0d0b!important;
            }
            .day-detail-bg{
              position:relative!important;
              inset:auto!important;
              width:100%!important;
              height:auto!important;
              min-height:0!important;
              overflow:visible!important;
              display:block!important;
              background:#090909!important;
            }
            .day-detail-bg img{
              display:block!important;
              width:100%!important;
              height:auto!important;
              max-width:100%!important;
              max-height:none!important;
              object-fit:contain!important;
              object-position:center!important;
            }
            .day-detail-panel:before{
              display:none!important;
              content:none!important;
            }
            .day-detail-mobile-content{
              display:block!important;
              position:relative!important;
              padding:20px 20px 24px!important;
              background:linear-gradient(180deg,#11110f 0%,#0b0b0a 100%)!important;
              border-top:1px solid rgba(240,204,121,.16)!important;
            }
          }

          /* Final mobile invitation treatment: split the original artwork into two readable halves. */
          .day-detail-mobile-split{display:none}
          .day-detail-full-image{display:block}
          @media(max-width:560px){
            .party-hero-logo-overlay{
              top:10px!important;
              left:50%!important;
              width:190px!important;
              max-width:190px!important;
              transform:translateX(-50%)!important;
              filter:drop-shadow(0 4px 12px rgba(240,204,121,.38)) drop-shadow(0 0 18px rgba(0,0,0,.85));
              z-index:3!important;
            }
            .party-hero-logo-overlay img{width:100%!important;height:auto!important}
            .party-host-copy{padding-top:205px!important}

            .day-detail-full-image{display:none!important}
            .day-detail-mobile-split{
              display:block!important;
              width:100%;
              background:#050505;
            }
            .day-detail-split-half{
              position:relative;
              width:100%;
              overflow:hidden;
              background:#050505;
              line-height:0;
            }
            .day-detail-split-half img{
              display:block;
              width:200%!important;
              max-width:none!important;
              height:auto!important;
              object-fit:contain!important;
            }
            .day-detail-split-left img{transform:translateX(0)}
            .day-detail-split-right img{transform:translateX(-50%)}
            .day-detail-mobile-content{display:none!important}
            .day-detail-panel{
              border-radius:14px!important;
              overflow:hidden!important;
              background:#050505!important;
            }
          }

          /* Final mobile invitation: show ONLY the two halves of the original artwork.
             The full-width desktop artwork is completely removed on phones. */
          .day-detail-mobile-split{display:none!important}
          @media(max-width:560px){
            .party-hero-logo-overlay{
              left:50%!important;
              right:auto!important;
              top:8px!important;
              transform:translateX(-50%)!important;
              width:175px!important;
              max-width:175px!important;
              z-index:5!important;
              filter:drop-shadow(0 5px 14px rgba(240,204,121,.55)) drop-shadow(0 0 22px rgba(0,0,0,.9))!important;
            }
            .party-host-copy{
              padding-top:198px!important;
            }
            .party-host-copy .party-host-kicker{
              margin-top:10px!important;
            }

            .day-detail-bg{
              display:none!important;
            }
            .day-detail-mobile-split{
              display:block!important;
              width:100%!important;
              background:#050505!important;
              overflow:hidden!important;
            }
            .day-detail-split-half{
              display:block!important;
              position:relative!important;
              width:100%!important;
              height:auto!important;
              overflow:hidden!important;
              background:#050505!important;
              line-height:0!important;
            }
            .day-detail-split-half img{
              display:block!important;
              width:200%!important;
              max-width:none!important;
              height:auto!important;
              object-fit:fill!important;
              flex:none!important;
            }
            .day-detail-split-left img{
              transform:translateX(0)!important;
            }
            .day-detail-split-right img{
              transform:translateX(-50%)!important;
            }
            .day-detail-mobile-content{
              display:none!important;
            }
            .day-detail-panel{
              height:auto!important;
              min-height:0!important;
              aspect-ratio:auto!important;
              overflow:hidden!important;
              border-radius:14px!important;
              background:#050505!important;
            }
          }
      `}</style>

      <header className="party-toolbar">
        <nav className="party-anchor-nav" aria-label="Party sections">
          <a href="#top">Welcome</a>
          <a href="#weekend">The Weekend</a>
          <a href="#galu">Lantana</a>
          <a href="#rooms">Rooms</a>
          <a href="#memories">Photos</a>
        </nav>
        <div className={`party-toolbar-countdown${countdown.started ? ' started' : ''}`} aria-label="Countdown to the first celebration">
          {countdown.started ? (
            <span>The party has started</span>
          ) : (
            <>
              <strong>{countdown.days}</strong>
              <span>DAYS TO GO</span>
            </>
          )}
        </div>
        <div className="party-switches">
          <button className="party-switch active" type="button" aria-current="page">PARTY</button>
          <button className="party-switch" type="button" onClick={onSafari}>SAFARI</button>
        </div>
      </header>

      <section className="party-host-hero" id="top" aria-label="Welcome from Jinal, Nishil and Jinesh">
        <div className="party-hero-logo-overlay" aria-hidden="true"><img src="/assets/party/party-50-logo-transparent.png" alt="" /></div>
        <div className="party-host-copy">
          <h1>Welcome to our 50th</h1>
          <p className="party-host-kicker">KENYA · 24–26 OCTOBER 2026</p>
          <p className="party-host-lede">We can’t wait to celebrate this very special milestone with all of you.</p>
          <p>What better way to mark our 50th birthdays than by bringing everyone together in Kenya — surrounded by family, friends, sunshine, music and plenty of good food?</p>
          <p>We’ve put together three unforgettable nights at Lantana Galu Beach, and we can’t wait to share them with you. Come ready to celebrate, laugh, dance and make some incredible memories together.</p>
          <p className="host-signoff"><em>With love,</em><br /><strong>Jinal · Nishil · Jinesh</strong></p>
          <div className="party-host-meta"><span>24–26 October 2026</span><span>Lantana Galu Beach</span><span>Kenya</span></div>
          <a className="party-scroll-cue" href="#weekend">↓ Explore the weekend</a>
        </div>
        
      </section>

      <section className="party-section" id="weekend">
        <div className="party-section-heading">
          <div><p className="eyebrow">The celebration</p><h2>The Weekend</h2></div><p>Three days. Three moods. One unforgettable weekend — from Kenyan roots to the rave, then a relaxed Bollywood wind down.</p>
        </div>
        <div className="day-tabs" role="tablist" aria-label="Party nights">
          {displayPartyEvents.map((event, index) => {
            const theme = themeForEvent(event)
            const label = index === 0 ? '24 October' : index === 1 ? '25 October' : '26 October'
            return <button key={event.id} className={`day-tab ${index === selectedDayIndex ? 'active' : ''}`} type="button" role="tab" aria-selected={index === selectedDayIndex} onClick={() => setSelectedDayIndex(index)}><span className="day-tab-date">{label}</span><strong>{theme.title}</strong><span className="day-tab-hint">View invitation</span></button>
          })}
        </div>
        {(() => {
          const event = displayPartyEvents[selectedDayIndex] ?? displayPartyEvents[0]
          const theme = themeForEvent(event)
          return <article className={`day-detail-panel day-theme-${theme.className}`} aria-label={`${theme.title} — ${theme.eyebrow}`}>
            <div className="day-detail-bg">
              <img className="day-detail-full-image" src={theme.image} alt={`${theme.title} party artwork`} />
            </div>
            <div className="day-detail-mobile-split" aria-label={`${theme.title} invitation artwork`}>
              <div className="day-detail-split-half day-detail-split-left"><img src={theme.image} alt="" /></div>
              <div className="day-detail-split-half day-detail-split-right"><img src={theme.image} alt="" /></div>
            </div>
            <div className="day-detail-content day-detail-mobile-content">
              <p className="day-detail-date">{theme.eyebrow}</p>
              <h3>{theme.title}</h3>
              <p className="dj">{theme.dj}</p>
              <p className="day-detail-intro">{theme.intro}</p>
              <div className="day-detail-box">
                <strong>DRESS CODE</strong>
                <span>{theme.dress}</span>
              </div>
              <p className="day-detail-extra">{theme.extra}</p>
            </div>
          </article>
        })()}
      </section>
      <section className="party-section" id="galu">
        <div className="party-section-heading">
          <div><p className="eyebrow">The setting</p><h2>Welcome to Lantana</h2></div>
          <p>Three nights by the Indian Ocean — a beachfront retreat, tropical gardens, warm water and a setting made for celebrating together.</p>
        </div>
        <div className="party-location-grid">
          <div className="party-location-copy">
            <p className="eyebrow">Three nights by the sea</p>
            <h2>Lantana Galu Beach</h2>
            <p>A beautiful beachfront retreat on Galu Beach, with tropical gardens, direct beach access and a relaxed coastal setting.</p>
            <p>Between the beach, the gardens and the ocean, Lantana is the backdrop for the whole weekend.</p>
            <a className="party-button" href="https://www.lantana-galu-beach.co.ke/gallery.html" target="_blank" rel="noreferrer">Discover Lantana <ExternalLink size={15} /></a>
          </div>
          <div className="party-location-carousel">
            <img key={lantanaSlides[lantanaIndex].src} src={lantanaSlides[lantanaIndex].src} alt={lantanaSlides[lantanaIndex].alt} onError={() => setLantanaIndex((current) => (current + 1) % lantanaSlides.length)} />
            <div className="party-image-controls">
              <button type="button" aria-label="Previous Lantana image" onClick={() => setLantanaIndex((current) => (current - 1 + lantanaSlides.length) % lantanaSlides.length)}><ChevronLeft /></button>
              <button type="button" aria-label="Next Lantana image" onClick={() => setLantanaIndex((current) => (current + 1) % lantanaSlides.length)}><ChevronRight /></button>
            </div>
            <div className="party-image-caption">{lantanaSlides[lantanaIndex].caption}</div>
            <div className="party-image-dots">
              {lantanaSlides.map((slide,index) => <button key={slide.src} type="button" className={index===lantanaIndex?'active':''} aria-label={`Show Lantana image ${index+1}`} onClick={() => setLantanaIndex(index)} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="party-section" id="rooms">
        <div className="party-section-heading">
          <div><p className="eyebrow">Your accommodation</p><h2>Where are you staying?</h2></div>
          <p>Find your room allocation and see who you’ll be sharing with for the weekend.</p>
        </div>
        <PartyRooming />
      </section>

      <section className="party-section" id="memories">
        <div className="party-section-heading">
          <div><p className="eyebrow">The memories</p><h2>Relive the weekend</h2></div>
          <p>Safari, sunshine, dancing and questionable decisions. The memories will live here.</p>
        </div>
        <div className="party-bottom-links party-bottom-links-three">
          <div className="party-bottom-card party-bottom-card-action">
            <div className="party-bottom-icon">🛏️</div><p className="eyebrow">Your stay</p><h3>Find Your Room</h3><p>Check your allocation and see who you’re sharing with.</p>
            <a className="party-button" href="#rooms">Find my room</a>
          </div>
          <div className="party-bottom-card party-bottom-card-action">
            <div className="party-bottom-icon">📷</div>
            <p className="eyebrow">Share the memories</p>
            <h3>Party Photos</h3>
            <p>View the celebrations and add your favourite moments to the shared album.</p>
            <div className="party-photo-upload">
              {photoSettings?.party_gallery_url ? (
                <a className="party-button" href={photoSettings.party_gallery_url} target="_blank" rel="noreferrer">📷 View &amp; Add Photos <ExternalLink size={15} /></a>
              ) : (
                <span className="party-photo-placeholder">The party album link will appear here once it is added.</span>
              )}
            </div>
          </div>
          <div className="party-bottom-card party-bottom-card-action">
            <div className="party-bottom-icon">📖</div><p className="eyebrow">For a bit of fun</p><h3>The Mongo Register</h3><p>The official record of questionable decisions, classic entries and legendary moments.</p>
            <a className="party-button" href="/assets/party/mongo-register.jpg" target="_blank" rel="noreferrer">View the register <ExternalLink size={15} /></a>
          </div>
        </div>
      </section>

      <section className="party-practical" id="before-you-arrive">
        <div className="party-practical-inner">
          <div className="party-practical-heading">
            <p className="eyebrow">Before you arrive</p>
            <h2>A few things to know.</h2>
            <p>The useful bits, all in one place — so you can concentrate on enjoying the weekend.</p>
          </div>
          <div className="party-practical-grid">
            <article><span>📍</span><div><strong>Where</strong><p>Lantana Galu Beach, Kenya</p></div></article>
            <article><span>📅</span><div><strong>When</strong><p>24–26 October 2026</p></div></article>
            <article><span>👕</span><div><strong>Dress</strong><p>A different theme for each celebration</p></div></article>
            <article><span>🛏️</span><div><strong>Rooms</strong><p>Check your allocation above</p></div></article>
            <article><span>📸</span><div><strong>Photos</strong><p>Shared albums will be updated throughout the celebrations</p></div></article>
            <article><span>🎉</span><div><strong>The plan</strong><p>Come ready to celebrate, laugh, dance and make memories</p></div></article>
          </div>
        </div>
      </section>

     <footer className="party-footer">
        <div className="party-footer-main">
          <p className="eyebrow">50 Kachoris</p>
          <h2>Fifty years · One unforgettable weekend.</h2>
          <p>Kenya · 24–26 October 2026</p>
        </div>
        <nav className="party-footer-nav" aria-label="Footer navigation">
          <a href="#top">Welcome</a>
          <a href="#weekend">The Weekend</a>
          <a href="#galu">Lantana</a>
          <a href="#rooms">Rooms</a>
          <a href="#memories">Photos</a>
        </nav>
        <div className="party-footer-actions">
          <a href="#top">Back to top ↑</a>
          <a href="/admin" aria-label="Admin login">🔒 Admin Login</a>
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
        <a className="brand" href="#top" aria-label="50 Kachoris safari">
          <span className="brand-mark"><Binoculars size={21} /></span>
          <span>50 Kachoris <em>– The Safari</em></span>
        </a>
        <nav aria-label="Safari navigation">
          <a href="#itinerary">Itinerary</a>
          <a href="#stay">The stay</a>
          <a href="#payments">Payments</a>
        </nav>
        <button className="nav-cta" type="button" onClick={() => {
          sessionStorage.removeItem('safariAccess')
          window.location.reload()
        }}>
          🎉 50 Kachoris – The Party
        </button>
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

      <section className="section" id="photos">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Share the memories</p>
            <h2>Safari photos</h2>
          </div>
          <p>{photoSettings?.description ?? 'View the safari memories and add your own photos to the shared album.'}</p>
        </div>
        <div className="info-stack">
          <article className="info-card photo-share-card">
            <Binoculars />
            <div>
              <p className="eyebrow">Google Photos</p>
              <h3>{photoSettings?.title ?? 'Safari Photos'}</h3>
              <p>
                View the safari memories and add your own photos to the shared
                Google Photos album.
              </p>
              <a
                className="photo-share-button"
                href={photoSettings?.safari_gallery_url || SAFARI_GOOGLE_PHOTOS_URL}
                target="_blank"
                rel="noreferrer"
              >
                📷 View &amp; Add Photos <ExternalLink size={15} />
              </a>
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
        <p>Safari hub · 28–30 October 2026</p>
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
