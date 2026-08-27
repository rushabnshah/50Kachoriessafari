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
        .party-toolbar{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:flex-end;gap:20px;padding:12px 28px;background:rgba(8,8,7,.94);backdrop-filter:blur(16px);border-bottom:1px solid rgba(240,204,121,.18)}
        .party-toolbar .brand{display:none}.party-switches{display:flex;gap:8px}.party-switch{border:1px solid rgba(255,255,255,.22);background:transparent;color:#fff;padding:10px 16px;border-radius:999px;font:inherit;font-weight:700;cursor:pointer}.party-switch.active{background:var(--gold);color:#15120d;border-color:var(--gold)}
        .eyebrow{margin:0 0 8px;text-transform:uppercase;letter-spacing:.18em;font-size:.72rem;font-weight:800;color:var(--gold2)}
        .party-host-hero{position:relative;min-height:clamp(600px,43vw,700px);overflow:hidden;border-bottom:1px solid rgba(240,204,121,.28);background-color:#090908;background-image:linear-gradient(90deg,rgba(5,5,4,.96) 0%,rgba(5,5,4,.86) 22%,rgba(5,5,4,.62) 42%,rgba(5,5,4,.28) 62%,rgba(5,5,4,.08) 82%,rgba(5,5,4,.02) 100%),url("/assets/party/hero-galu-sunset-dark.jpg");background-size:cover;background-position:center center;background-repeat:no-repeat}.party-hero-logo-overlay{position:absolute;z-index:2;left:63%;top:54%;right:auto;transform:translate(-50%,-50%);width:min(32vw,455px);max-height:82%;display:flex;align-items:center;justify-content:center;pointer-events:none}.party-hero-logo-overlay img{display:block;width:100%;height:auto;max-height:570px;object-fit:contain;filter:drop-shadow(0 10px 24px rgba(0,0,0,.72)) drop-shadow(0 0 8px rgba(214,168,78,.16))}.party-host-copy{position:relative;z-index:3;min-height:inherit;width:min(680px,52%);max-width:680px;padding:clamp(54px,6vw,88px) clamp(34px,6vw,92px);display:flex;flex-direction:column;justify-content:center;background:linear-gradient(90deg,rgba(7,7,6,.94) 0%,rgba(7,7,6,.72) 52%,rgba(7,7,6,.18) 82%,transparent 100%)}.party-host-copy h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(3.1rem,5vw,5.3rem);font-weight:400;font-style:normal;line-height:.98;margin:0 0 22px;letter-spacing:-.035em;color:#f0cc79;text-shadow:0 3px 22px rgba(0,0,0,.5)}.party-host-copy h1:after{content:"";display:block;width:190px;height:1px;margin-top:22px;background:linear-gradient(90deg,#d7a84e,rgba(215,168,78,.08))}.party-host-copy p{max-width:600px;color:rgba(255,255,255,.94);line-height:1.72;font-size:1.02rem;font-family:Georgia,"Times New Roman",serif}.party-host-copy .party-host-lede{font-family:Georgia,"Times New Roman",serif;font-size:1.08rem;font-style:normal;color:rgba(255,255,255,.94);line-height:1.62;margin-bottom:2px}.host-signoff{margin-top:16px;line-height:1.65;font-family:Georgia,"Times New Roman",serif;color:#f0cc79;font-size:1rem}.host-signoff em{font-style:italic;color:rgba(255,255,255,.9)}.host-signoff strong{display:inline-block;margin-top:3px;font-family:Georgia,"Times New Roman",serif;font-size:1.18rem;font-weight:600;letter-spacing:.075em;color:#f0cc79;text-shadow:0 2px 12px rgba(0,0,0,.5)}.party-host-meta{display:flex;flex-wrap:wrap;gap:10px 24px;margin-top:24px;padding-top:16px;border-top:1px solid rgba(240,204,121,.28);font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.82)}
.party-50-logo-wrap{display:none}
.party-meta-strip{display:grid;grid-template-columns:repeat(3,1fr);background:#0e0e0c;border-bottom:1px solid rgba(240,204,121,.2)}.party-meta-strip div{text-align:center;padding:18px 14px;border-right:1px solid rgba(240,204,121,.16)}.party-meta-strip div:last-child{border-right:0}.party-meta-strip strong{display:block;color:var(--gold2);font-family:Georgia,serif;font-size:1.2rem}.party-meta-strip span{display:block;margin-top:4px;color:rgba(255,255,255,.62);font-size:.78rem;text-transform:uppercase;letter-spacing:.12em}
        .party-section{padding:76px clamp(22px,5vw,80px);max-width:1380px;margin:0 auto}.party-section-heading{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:30px}.party-section-heading h2{font-family:Georgia,serif;font-size:clamp(2.2rem,4vw,4rem);line-height:.95;margin:0;color:#fff}.party-section-heading>p{max-width:540px;color:rgba(255,255,255,.68);line-height:1.7;margin:0}
        .day-tabs{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid rgba(240,204,121,.42);border-radius:18px;overflow:hidden;background:#f7efe2;margin-bottom:22px}.day-tab{border:0;border-right:1px solid #dfcfb6;background:#f7efe2;color:#222;padding:18px 16px;cursor:pointer;font:inherit;transition:.2s}.day-tab:last-child{border-right:0}.day-tab strong{display:block;font-family:Georgia,serif;font-size:1.05rem}.day-tab span{display:block;margin-top:5px;color:#777;font-size:.82rem}.day-tab.active{background:linear-gradient(135deg,#e8c77f,#f7ead0);color:#15120d}.day-detail-panel{position:relative;width:100%;height:clamp(220px,23vw,340px);border:0;border-radius:18px;overflow:hidden;background:#111;box-shadow:0 18px 50px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center}.day-detail-bg{position:absolute;inset:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#111;overflow:hidden}.day-detail-bg img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;transform:scale(1.012)}.day-detail-content{display:none}.day-detail-date,.day-detail-content h3,.day-detail-content .dj,.day-detail-content p,.day-detail-grid,.day-detail-box{display:none}.day-theme-roots{background:#10261b;color:#fff}.day-theme-rave{background:#180b22;color:#fff}.day-theme-bollywood{background:#3a111b;color:#fff}.photo-viewer-backdrop{position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.88);display:grid;place-items:center;padding:24px}.photo-viewer{position:relative;width:min(1100px,96vw);height:min(86vh,800px);display:grid;place-items:center}.photo-viewer img{max-width:100%;max-height:100%;object-fit:contain;border-radius:12px;box-shadow:0 25px 90px rgba(0,0,0,.7)}.photo-viewer-close{position:absolute;right:0;top:-46px;width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(0,0,0,.55);color:#fff;display:grid;place-items:center;cursor:pointer}.photo-viewer-nav{position:absolute;top:50%;transform:translateY(-50%);width:48px;height:48px;border-radius:50%;border:1px solid var(--gold);background:rgba(0,0,0,.7);color:var(--gold2);display:grid;place-items:center;cursor:pointer}.photo-viewer-nav.prev{left:-58px}.photo-viewer-nav.next{right:-58px}
.party-location-grid{display:grid;grid-template-columns:.85fr 1.15fr;min-height:520px;border:1px solid rgba(240,204,121,.28);border-radius:24px;overflow:hidden;box-shadow:0 24px 65px rgba(0,0,0,.32)}.party-location-copy{padding:clamp(30px,5vw,64px);display:flex;flex-direction:column;justify-content:center;background:linear-gradient(145deg,#0f1f18,#173d2c)}.party-location-copy h2{font-family:Georgia,serif;font-size:clamp(2.4rem,4.4vw,4.6rem);line-height:.94;margin:0 0 18px;color:#fff}.party-location-copy p{color:rgba(255,255,255,.78);line-height:1.8}.party-location-copy .party-button{margin-top:16px;width:max-content}.party-location-carousel{position:relative;min-height:520px;background:#111;overflow:hidden}.party-location-carousel img{width:100%;height:100%;min-height:520px;object-fit:cover;display:block}.party-location-carousel:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.22),transparent 45%,rgba(0,0,0,.12));pointer-events:none}.party-image-controls{position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;padding:0 16px;pointer-events:none;z-index:4}.party-image-controls button{pointer-events:auto;width:46px;height:46px;border-radius:50%;border:1px solid var(--gold);background:rgba(0,0,0,.58);color:var(--gold2);display:grid;place-items:center;cursor:pointer}.party-image-caption{position:absolute;left:0;right:0;bottom:0;z-index:4;padding:60px 24px 20px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.78));font-weight:700}.party-image-dots{position:absolute;z-index:5;left:0;right:0;bottom:14px;display:flex;justify-content:center;gap:7px}.party-image-dots button{width:8px;height:8px;padding:0;border:1px solid rgba(255,255,255,.8);border-radius:50%;background:rgba(255,255,255,.35);cursor:pointer}.party-image-dots button.active{width:24px;border-radius:999px;background:var(--gold)}
        .party-rooming{background:#11100e;border:1px solid rgba(240,204,121,.22);border-radius:20px;overflow:hidden}.party-rooming-head{padding:22px;display:flex;gap:16px;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(240,204,121,.16)}.party-rooming-search{min-width:260px;border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:11px 15px;font:inherit;background:#191815;color:#fff}.party-room-grid{display:grid;grid-template-columns:repeat(4,1fr)}.party-room{padding:17px 20px;border-bottom:1px solid rgba(255,255,255,.08);border-right:1px solid rgba(255,255,255,.08)}.party-room strong{display:block;color:var(--gold2);margin-bottom:6px}.party-room span{display:block;line-height:1.45;color:rgba(255,255,255,.86)}.party-room-count{opacity:.55;font-size:.78rem;margin-top:5px}.party-button{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--gold);border-radius:999px;padding:12px 18px;background:var(--gold);color:#16120b;font-weight:800;cursor:pointer;font:inherit;text-decoration:none}.party-button:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,.2)}.photo-share-card{display:flex;align-items:flex-start;gap:22px}.photo-share-card>svg{flex:0 0 auto;color:var(--gold2)}.photo-share-button{display:inline-flex;align-items:center;justify-content:center;gap:9px;margin-top:14px;padding:12px 20px;border:1px solid var(--gold);border-radius:999px;background:var(--gold);color:#16120b;font-weight:800;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}.photo-share-button:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.22)}.party-photo-disabled{opacity:.45;cursor:not-allowed;pointer-events:none}.photo-share-placeholder,.party-photo-placeholder{display:block;margin-top:14px;color:rgba(255,255,255,.55);font-size:.9rem}.party-button.secondary{background:transparent;color:#fff}.party-bottom-links{display:grid;grid-template-columns:1fr 1fr;gap:18px}.party-bottom-card{padding:28px;border:1px solid rgba(240,204,121,.25);border-radius:20px;background:#11100e}.party-bottom-card h3{font-family:Georgia,serif;font-size:1.8rem;margin:0 0 8px}.party-bottom-card p{color:rgba(255,255,255,.68);line-height:1.6}.party-photo-upload{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:18px}.party-upload-label{display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border-radius:999px;background:var(--gold);color:#16120b;font-weight:800;cursor:pointer}.party-upload-label input{display:none}.party-photo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:20px}.party-photo-grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:12px;display:block}.party-photo-empty{margin-top:20px;padding:28px;border:1px dashed rgba(240,204,121,.3);border-radius:16px;text-align:center;color:rgba(255,255,255,.6)}
        .day-theme-roots{background:linear-gradient(135deg,#0d3021,#163d2c);color:#fff}.day-theme-rave{background:linear-gradient(135deg,#22052f,#5b0c61);color:#fff}.day-theme-bollywood{background:linear-gradient(135deg,#5d1021,#8e2735);color:#fff}.day-modal-backdrop{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.78);display:grid;place-items:center;padding:20px}.day-modal{width:min(980px,100%);max-height:92vh;overflow:hidden;border-radius:24px;position:relative;box-shadow:0 30px 90px rgba(0,0,0,.6)}.day-modal-media{height:330px;position:relative;overflow:hidden}.day-modal-media img{width:100%;height:100%;object-fit:cover;display:block}.day-modal-media-overlay{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.86),rgba(0,0,0,.05) 70%)}.day-modal-title{position:absolute;left:38px;right:70px;bottom:28px;color:#fff}.day-modal-title p{margin:0 0 8px;text-transform:uppercase;letter-spacing:.14em;font-size:.78rem;font-weight:800;opacity:.82}.day-modal-title h2{font-family:Georgia,serif;font-size:clamp(2.4rem,6vw,5rem);line-height:.92;margin:0}.day-modal-scroll{max-height:calc(92vh - 330px);overflow-y:auto}.day-modal-copy{padding:34px 40px 44px}.day-modal-copy h3{margin:28px 0 10px;font-size:1.1rem;text-transform:uppercase;letter-spacing:.08em}.day-modal p{max-width:760px;line-height:1.8;font-size:1.05rem}.day-detail-row{display:flex;justify-content:space-between;gap:18px;padding:13px 0;border-bottom:1px solid rgba(255,255,255,.16)}.day-detail-row span{font-size:.75rem;letter-spacing:.12em;font-weight:800;opacity:.68}.day-detail-row strong{text-align:right}.day-dress{padding:20px 22px;border:1px solid rgba(255,255,255,.25);border-radius:16px;background:rgba(0,0,0,.18);line-height:1.7}.day-modal-close{position:absolute;right:18px;top:18px;z-index:10;width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(0,0,0,.55);color:#fff;display:grid;place-items:center;cursor:pointer}
        @media(max-width:560px){.photo-share-card{gap:14px}.photo-share-button{width:100%}}
        @media(max-width:900px){.party-hero-logo-overlay{left:62%;width:min(42vw,360px);top:50%}.party-host-copy{width:min(680px,58%)}.party-toolbar{padding:10px 18px}.party-host-hero{min-height:720px;background-position:center top}.party-hero-logo-overlay{width:min(62vw,430px);right:4%;top:29%;opacity:.94}.party-host-copy{width:72%;max-width:680px;min-height:720px;padding:330px 34px 48px;background:linear-gradient(180deg,rgba(7,7,6,.06) 0%,rgba(7,7,6,.78) 43%,rgba(7,7,6,.97) 66%)}}
        @media(max-width:560px){.party-toolbar{padding:10px 14px}.party-switches{width:100%;justify-content:flex-end}.party-host-hero{min-height:760px;background-position:center top}.party-hero-logo-overlay{width:78vw;right:11%;top:23%;opacity:.9}.party-host-copy{width:100%;min-height:760px;padding:340px 22px 44px;background:linear-gradient(180deg,rgba(7,7,6,.04) 0%,rgba(7,7,6,.72) 43%,rgba(7,7,6,.98) 65%)}.party-host-copy h1{font-size:3.3rem}.party-host-copy .party-host-lede{font-size:1.05rem}}
        @media(max-width:900px){.party-toolbar{align-items:flex-start;flex-direction:column}.party-switches{width:100%;justify-content:flex-start}.party-location-grid{grid-template-columns:1fr}.party-section{padding:58px 18px}.party-section-heading{display:block}.party-section-heading>p{margin-top:14px}.party-day-detail{grid-template-columns:1fr}.party-room-grid{grid-template-columns:repeat(2,1fr)}.party-bottom-links{grid-template-columns:1fr}.party-bottom-links-three{grid-template-columns:1fr}.party-location-carousel,.party-location-carousel img{min-height:360px}.day-detail-panel{height:clamp(210px,31vw,300px)}.day-detail-content{min-height:600px}}
        @media(max-width:560px){.party-hero-logo-overlay{left:50%;top:25%;width:62vw;max-height:290px}.party-host-hero{min-height:760px;background-position:center top}.party-host-copy{width:100%;min-height:760px;padding:340px 22px 44px;background:linear-gradient(180deg,rgba(7,7,6,.02) 0%,rgba(7,7,6,.56) 42%,rgba(7,7,6,.96) 64%)}.party-host-copy h1{font-size:3.25rem}.party-host-copy .party-host-lede{font-size:1.02rem}.party-host-copy p{font-size:.98rem}.party-meta-strip{grid-template-columns:1fr}.party-meta-strip div{border-right:0;border-bottom:1px solid rgba(240,204,121,.16)}.party-host-copy{padding:48px 22px;min-height:600px}.party-host-copy h1{font-size:4rem}.day-tabs{grid-template-columns:1fr}.day-tab{border-right:0;border-bottom:1px solid #dfcfb6}.day-tab:last-child{border-bottom:0}.day-detail-panel{height:210px;border-radius:14px}.day-detail-content{padding:38px 24px;min-height:620px}.day-detail-content h3{font-size:3.4rem}.party-room-grid{grid-template-columns:1fr}.party-photo-grid{grid-template-columns:repeat(2,1fr)}.day-modal-media{height:250px}.day-modal-scroll{max-height:calc(92vh - 250px)}.day-modal-copy{padding:26px 22px 34px}.day-detail-row{flex-direction:column;gap:4px}.day-detail-row strong{text-align:left}}
      `}</style>

      <header className="party-toolbar">
        <div className="party-switches">
          <button className="party-switch active" type="button">🎉 50 Kachoris – The Party</button>
          <button className="party-switch" type="button" onClick={onSafari}>🦁 50 Kachoris – The Safari</button>
        </div>
      </header>

      <section className="party-host-hero" id="top" aria-label="Welcome from Jinal, Nishil and Jinesh">
        <div className="party-hero-logo-overlay" aria-hidden="true"><img src="/assets/party/party-50-logo-transparent.png" alt="" /></div>
        <div className="party-host-copy">
          <h1>Welcome to our 50th</h1>
          <p className="party-host-lede">We can’t wait to celebrate this very special milestone with all of you.</p>
          <p>What better way to mark our 50th birthdays than by bringing everyone together in Kenya — surrounded by family, friends, sunshine, music and plenty of good food?</p>
          <p>We’ve put together three unforgettable nights at Lantana Galu Beach, and we can’t wait to share them with you. Come ready to celebrate, laugh, dance and make some incredible memories together.</p>
          <p className="host-signoff"><em>With love,</em><br /><strong>Jinal · Nishil · Jinesh</strong></p>
          <div className="party-host-meta"><span>24–26 October 2026</span><span>Lantana Galu Beach</span><span>Kenya</span></div>
        </div>
        
      </section>



      <section className="party-section" id="weekend">
        <div className="party-section-heading">
          <div><p className="eyebrow">The celebration</p><h2>Three Nights at Lantana</h2></div>
        </div>
        <div className="day-tabs" role="tablist" aria-label="Party nights">
          {displayPartyEvents.map((event, index) => {
            const theme = themeForEvent(event)
            const label = index === 0 ? '24 October' : index === 1 ? '25 October' : '26 October'
            return <button key={event.id} className={`day-tab ${index === selectedDayIndex ? 'active' : ''}`} type="button" role="tab" aria-selected={index === selectedDayIndex} onClick={() => setSelectedDayIndex(index)}><strong>{label}</strong><span>{theme.title === 'RETURN TO OUR ROOTS' ? 'Return to Our Roots' : theme.title === 'THE RAVE' ? 'The Rave' : 'The Wind Down'}</span></button>
          })}
        </div>
        {(() => {
          const event = displayPartyEvents[selectedDayIndex] ?? displayPartyEvents[0]
          const theme = themeForEvent(event)
          return <article className={`day-detail-panel day-theme-${theme.className}`} aria-label={`${theme.title} — ${theme.eyebrow}`}>
            <div className="day-detail-bg">
              <img src={theme.image} alt={`${theme.title} party artwork`} />
            </div>
          </article>
        })()}
      </section>
      <section className="party-section" id="galu">
        <div className="party-section-heading">
          <div><p className="eyebrow">The setting</p><h2>Lantana Galu Beach</h2></div>
          <p>Our home for the weekend — beachfront, tropical gardens, warm Indian Ocean water and the perfect setting for the celebrations.</p>
        </div>
        <div className="party-location-grid">
          <div className="party-location-copy">
            <p className="eyebrow">Three nights by the sea</p>
            <h2>Lantana Galu Beach</h2>
            <p>A beautiful beachfront retreat on Galu Beach, with tropical gardens, direct beach access and a relaxed coastal setting.</p>
            <p>It is where the three nights, the music and the celebrations come together.</p>
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
          <div><p className="eyebrow">81 provisional guests · 40 rooms</p><h2>Find Your Room</h2></div>
          <p>Search by room number or name. This is the provisional rooming list and can be updated later as arrangements are confirmed.</p>
        </div>
        <PartyRooming />
      </section>

      <section className="party-section" id="party-links">
        <div className="party-bottom-links party-bottom-links-three">
          <div className="party-bottom-card party-bottom-card-action">
            <div className="party-bottom-icon">🛏️</div><p className="eyebrow">Accommodation</p><h3>Find Your Room</h3><p>See your room details and who you're sharing with.</p>
            <a className="party-button" href="#rooms">View rooms</a>
          </div>
          <div className="party-bottom-card party-bottom-card-action">
            <div className="party-bottom-icon">📷</div>
            <p className="eyebrow">Share the memories</p>
            <h3>Party Photos</h3>
            <p>View the photos from the celebrations and add your own memories to the shared Google Photos album.</p>
            {photoSettings?.party_gallery_url ? (
              <div className="party-photo-upload">
                <a
                  className="party-button"
                  href={photoSettings.party_gallery_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  📷 View &amp; Add Photos <ExternalLink size={15} />
                </a>
              </div>
            ) : (
              <div className="party-photo-upload">
                <span className="party-button party-photo-disabled" aria-disabled="true">
                  📷 View &amp; Add Photos
                </span>
                <p className="party-photo-placeholder">Party Google Photos link will be added in Admin.</p>
              </div>
            )}
          </div>
          <div className="party-bottom-card party-bottom-card-action">
            <div className="party-bottom-icon">📖</div><p className="eyebrow">For a bit of fun</p><h3>The Mongo Register</h3><p>See the full tongue-in-cheek register and all the classic entries.</p>
            <a className="party-button" href="/assets/party/mongo-register.jpg" target="_blank" rel="noreferrer">View the register <ExternalLink size={15} /></a>
          </div>
        </div>

      </section>




      <footer>
        <div><span className="brand-mark">🎉</span><strong>50 Kachoris – The Party</strong></div>
        <p>Jinal · Nishil · Jinesh · 50th birthday celebrations</p>
        <div className="footer-links"><a href="#top">Back to top ↑</a></div>
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
