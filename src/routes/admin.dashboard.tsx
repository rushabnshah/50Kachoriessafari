import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboard,
})

function AdminDashboard() {
  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/admin'
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '40px',
        background: '#f4efe4',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          50 Kachoris Safari
        </p>

        <h1>Admin Dashboard</h1>

        <p>
          Welcome. This is where the safari information will be managed.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginTop: '40px',
          }}
        >
          <div className="info-card">
            <h2>Travellers</h2>
            <p>Manage guests, rooms and vehicle assignments.</p>
          </div>

          <div className="info-card">
            <h2>Itinerary</h2>
            <p>Edit the safari schedule and timings.</p>
          </div>

          <div className="info-card">
            <h2>Payments</h2>
            <p>Manage payment and bank information.</p>
          </div>

          <div className="info-card">
            <h2>Photos</h2>
            <p>Manage the safari photo-sharing settings.</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            marginTop: '40px',
            padding: '12px 20px',
            border: 0,
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </div>
    </main>
  )
}