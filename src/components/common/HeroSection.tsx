import { type ReactNode } from 'react'

type HeroSectionProps = {
  children: ReactNode
  minHeight?: string
  className?: string
}

export default function HeroSection({
  children,
  minHeight = 'min-h-[80vh]',
  className = '',
}: HeroSectionProps) {
  return (
    <section
      className={`relative ${minHeight} flex items-center px-4 ${className}`}
    >
      <div className="max-w-6xl mx-auto w-full mb-8">{children}</div>

      <i
        className="bi bi-caret-down-fill absolute bottom-4 left-1/2 -translate-x-1/2 text-2xl text-ariad-green-water animate-bounce"
        aria-hidden="true"
      />
    </section>
  )
}
