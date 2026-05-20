import { type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

type PublicLayoutProps = {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-ariad-beige-light">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
