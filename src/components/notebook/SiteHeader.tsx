'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export function SiteHeader({ name, email }: { name: string; email: string }) {
  const pathname = usePathname() || '/'

  return (
    <header className="nb-wrap nb-header">
      <Link href="/" className="hand nb-wordmark">
        {name}
      </Link>
      <nav className="nb-nav" aria-label="Main">
        <Link
          href="/projects"
          className={pathname.startsWith('/projects') ? 'nav-link current' : 'nav-link'}
        >
          work
        </Link>
        <Link href="/about" className={pathname === '/about' ? 'nav-link current' : 'nav-link'}>
          about
        </Link>
        <a href={`mailto:${email}`} className="hand say-hi scribble">
          say hi
        </a>
      </nav>
    </header>
  )
}