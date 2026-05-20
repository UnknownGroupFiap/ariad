import { type ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow: string
  as?: 'h1' | 'h2'
  className?: string
  containerClassName?: string
  children: ReactNode
}

const titleSize = {
  h1: 'text-4xl md:text-5xl',
  h2: 'text-3xl md:text-4xl',
} as const

export default function SectionHeading({
  eyebrow,
  as = 'h2',
  className = '',
  containerClassName = '',
  children,
}: SectionHeadingProps) {
  const Tag = as

  return (
    <div className={containerClassName}>
      <p className="text-sm tracking-widest font-bold text-ariad-green-water uppercase mb-4">
        {eyebrow}
      </p>
      <Tag className={`${titleSize[as]} ${className}`}>{children}</Tag>
    </div>
  )
}
