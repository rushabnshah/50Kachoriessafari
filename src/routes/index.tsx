import { createFileRoute } from '@tanstack/react-router'
import {
  BedDouble,
  Binoculars,
  Briefcase,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Copy,
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
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/')({
  component: SafariTripPage,
})

type Guest = {
  name: string
  residency: 'Resident' | 'Non-resident'
  roomType: 'Double' | 'Twin' | 'Triple'
  room: number
  usd: number
  ksh: number
  paidUsd: number
}

const DEPOSIT_PERCENT = 0.25
const TRIP_START = new Date('2026-10-28T06:00:00+03:00')

const guests: Guest[] = [
  { name: 'Nilesh', residency: 'Non-resident', roomType: 'Double', room: 1, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Raksha', residency: 'Non-resident', roomType: 'Double', room: 1, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Seema', residency: 'Non-resident', roomType: 'Double', room: 2, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Jignesh', residency: 'Non-resident', roomType: 'Double', room: 2, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Mai', residency: 'Non-resident', roomType: 'Twin', room: 3, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Anya', residency: 'Non-resident', roomType: 'Twin', room: 3, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Rushab', residency: 'Resident', roomType: 'Twin', room: 4, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Sahil', residency: 'Non-resident', roomType: 'Twin', room: 4, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Hemel', residency: 'Resident', roomType: 'Double', room: 5, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Shinal', residency: 'Resident', roomType: 'Double', room: 5, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Sachi', residency: 'Resident', roomType: 'Triple', room: 6, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Siya', residency: 'Resident', roomType: 'Triple', room: 6, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Meher', residency: 'Non-resident', roomType: 'Triple', room: 6, usd: 475, ksh: 61750, paidUsd: 0 },
  { name: 'Kayaan', residency: 'Non-resident', roomType: 'Triple', room: 7, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Samay', residency: 'Non-resident', roomType: 'Triple', room: 7, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Chirag', residency: 'Non-resident', roomType: 'Triple', room: 7, usd: 475, ksh: 61750, paidUsd: 0 },
  { name: 'Miya', residency: 'Non-resident', roomType: 'Double', room: 8, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Rena', residency: 'Non-resident', roomType: 'Double', room: 8, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Anusha', residency: 'Non-resident', roomType: 'Twin', room: 9, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Neel', residency: 'Non-resident', roomType: 'Twin', room: 9, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Jinesh', residency: 'Resident', roomType: 'Double', room: 10, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Jyoti', residency: 'Resident', roomType: 'Double', room: 10, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Paraag', residency: 'Non-resident', roomType: 'Twin', room: 11, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Kavya', residency: 'Non-resident', roomType: 'Twin', room: 11, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Hemali', residency: 'Non-resident', roomType: 'Twin', room: 12, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Aaron', residency: 'Non-resident', roomType: 'Twin', room: 12, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Rohin', residency: 'Non-resident', roomType: 'Twin', room: 13, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Shalin', residency: 'Resident', roomType: 'Twin', room: 13, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Leora', residency: 'Non-resident', roomType: 'Twin', room: 14, usd: 330, ksh: 42900, paidUsd: 0 },
  { name: 'Priya', residency: 'Non-resident', roomType: 'Twin', room: 14, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Jinal', residency: 'Resident', roomType: 'Twin', room: 15, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Nishi', residency: 'Resident', roomType: 'Twin', room: 15, usd: 365, ksh: 47450, paidUsd: 0 },
  { name: 'Maanika', residency: 'Non-resident', roomType: 'Twin', room: 16, usd: 500, ksh: 65000, paidUsd: 0 },
  { name: 'Nishma', residency: 'Non-resident', roomType: 'Twin', room: 16, usd: 500, ksh: 65000, paidUsd: 0 },
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

function SafariTripPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'due' | 'paid'>('all')
  const [copied, setCopied] = useState<string | null>(null)

  const totals = useMemo(() => {
    const usd = guests.reduce((sum, guest) => sum + guest.usd, 0)
    const ksh = guests.reduce((sum, guest) => sum + guest.ksh, 0)
    const paid = guests.reduce((sum, guest) => sum + guest.paidUsd, 0)
    const paidCount = guests.filter((guest) => guest.paidUsd >= guest.usd * DEPOSIT_PERCENT).length
    return { usd, ksh, paid, paidCount, depositUsd: usd * DEPOSIT_PERCENT, depositKsh: ksh * DEPOSIT_PERCENT }
  }, [])

  const displayedGuests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return guests.filter((guest) => {
      const deposit = guest.usd * DEPOSIT_PERCENT
      const matchesQuery =
        guest.name.toLowerCase().includes(normalizedQuery) ||
        String(guest.room).includes(normalizedQuery) ||
        guest.roomType.toLowerCase().includes(normalizedQuery)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'due' && guest.paidUsd < deposit) ||
        (filter === 'paid' && guest.paidUsd >= deposit)
      return matchesQuery && matchesFilter
    })
  }, [filter, query])

  const countdownDays = Math.max(0, Math.ceil((TRIP_START.getTime() - Date.now()) / 86400000))

  const copyReminder = async (guest: Guest) => {
    const depositUsd = guest.usd * DEPOSIT_PERCENT
    const depositKsh = guest.ksh * DEPOSIT_PERCENT
    const message = `Hi ${guest.name}, your 25% deposit for the Taita Hills safari is now due: ${money(depositUsd, 'USD')} / ${money(depositKsh, 'KSH')}. Your full trip amount is ${money(guest.usd, 'USD')} / ${money(guest.ksh, 'KSH')}. Thank you!`
    await navigator.clipboard.writeText(message)
    setCopied(guest.name)
    window.setTimeout(() => setCopied(null), 1800)
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Taita Hills trip home">
          <span className="brand-mark"><Binoculars size={21} /></span>
          <span>50 Kachoris <em>in the wild</em></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#itinerary">Itinerary</a>
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
          <p className="hero-copy">Everything you need to know before 34 Kachoris descend on the savannah—itinerary, roommates, car assignments, and amounts due.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#payments">Check my deposit <ChevronDown size={18} /></a>
            <a className="text-link" href="#itinerary">Explore the trip <span>↗</span></a>
          </div>
        </div>
        <aside className="trip-ticket" aria-label="Trip summary">
          <div className="ticket-label">34 Kachoris · Safari</div>
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
        <div><WalletCards /><span><small>Deposit now due</small>{money(totals.depositUsd, 'USD')}</span></div>
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
          {itinerary.map((item, index) => (
            <article className={`day-card ${item.accent}`} key={item.day}>
              <div className="day-number">0{index + 1}</div>
              <div className="day-card-content">
                <p>{item.day} <span>{item.date}</span></p>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
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

      <section className="payments-section" id="payments">
        <div className="section payments-inner">
          <div className="section-heading payment-heading">
            <div>
              <p className="eyebrow">Payment desk</p>
              <h2>Deposits are now due</h2>
              <p>No payments have been recorded yet. The requested deposit is 25% of each traveler’s full safari amount.</p>
            </div>
            <div className="deposit-callout"><span>Requesting now</span><strong>25%</strong><small>per traveler</small></div>
          </div>

          <div className="money-summary">
            <article><span>Total trip value</span><strong>{money(totals.usd, 'USD')}</strong><small>{money(totals.ksh, 'KSH')} · rate 130</small></article>
            <article className="highlight-summary"><span>Deposit to collect</span><strong>{money(totals.depositUsd, 'USD')}</strong><small>{money(totals.depositKsh, 'KSH')}</small></article>
            <article><span>Collected so far</span><strong>{money(totals.paid, 'USD')}</strong><small>{totals.paidCount} of {guests.length} deposits received</small></article>
            <article><span>Still outstanding</span><strong>{money(Math.max(0, totals.depositUsd - totals.paid), 'USD')}</strong><small>Deposit balance only</small></article>
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
                <thead><tr><th>Traveler</th><th>Room</th><th>Full amount</th><th>25% deposit due</th><th>Paid</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {displayedGuests.map((guest) => {
                    const depositUsd = guest.usd * DEPOSIT_PERCENT
                    const depositKsh = guest.ksh * DEPOSIT_PERCENT
                    const isPaid = guest.paidUsd >= depositUsd
                    const isPartPaid = guest.paidUsd > 0 && !isPaid
                    const paymentStatus = isPaid ? 'Paid' : isPartPaid ? 'Part paid' : 'Deposit due'
                    return (
                      <tr key={guest.name}>
                        <td><strong>{guest.name}</strong><small>{guest.residency}</small></td>
                        <td><span className={`room-chip room-${guest.room}`}>#{guest.room}</span><small>{guest.roomType}</small></td>
                        <td><strong>{money(guest.usd, 'USD')}</strong><small>{money(guest.ksh, 'KSH')}</small></td>
                        <td className="deposit-cell"><strong>{money(depositUsd, 'USD')}</strong><small>{money(depositKsh, 'KSH')}</small></td>
                        <td><strong>{money(guest.paidUsd, 'USD')}</strong><small>{guest.paidUsd > 0 ? `${money(guest.paidUsd * 130, 'KSH')} recorded` : 'Nothing received'}</small></td>
                        <td><span className={`status-pill ${isPaid ? 'paid' : isPartPaid ? 'part-paid' : 'due'}`}>{isPaid ? <Check size={13} /> : <Clock3 size={13} />}{paymentStatus}</span></td>
                        <td><button className="copy-button" onClick={() => copyReminder(guest)} aria-label={`Copy payment reminder for ${guest.name}`}>{copied === guest.name ? <Check size={17} /> : <Copy size={17} />}<span>{copied === guest.name ? 'Copied' : 'Reminder'}</span></button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {displayedGuests.length === 0 && <div className="empty-state"><Users /><strong>No travelers found</strong><span>Try another name, room number or payment filter.</span></div>}
            </div>
          </div>
          <p className="ledger-note">Amounts in KSh use the supplied conversion rate of 130. “Paid” remains $0 until a payment is actually received and recorded in the guest data.</p>
        </div>
      </section>

      <footer>
        <div><span className="brand-mark"><Binoculars size={21} /></span><strong>50 Kachoris in the wild</strong></div>
        <p>Family safari hub · 28–30 October 2026</p>
        <div className="footer-links"><a href="mailto:Sharik@savannasecrets.com"><Mail size={16} /> Email safari contact</a><a href="#top">Back to top ↑</a></div>
      </footer>
    </main>
  )
}
