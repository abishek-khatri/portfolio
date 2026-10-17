import React from 'react'

export function SiteFooter({ email, footerText }: { email: string; footerText: string }) {
  return (
    <footer className="nb-wrap nb-footer">
      <div className="footer-row">
        <p className="display footer-title">say hi.</p>
        <a href={`mailto:${email}`} className="footer-email scribble">
          {email}
        </a>
      </div>
      <p className="hand footer-copy">{footerText}</p>
    </footer>
  )
}