import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'


import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
  title: 'The 50 Kachoris 2026 celebration',
},
{
  name: 'description',
  content: 'The 50 Kachoris 2026 celebration — Kenya, 24–30 October 2026.',
},
{
  property: 'og:title',
  content: 'The 50 Kachoris 2026 celebration',
},
{
  property: 'og:description',
  content: 'The 50 Kachoris 2026 celebration — Kenya, 24–30 October 2026.',
},
      {
        name: 'theme-color',
        content: '#173f2a',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
