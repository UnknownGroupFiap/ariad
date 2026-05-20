import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg' | 'nav'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'cursor-pointer inline-flex items-center justify-center font-medium rounded transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary:
      'bg-ariad-blue-medium text-white hover:bg-ariad-blue-slate focus:ring-ariad-blue-medium',
    secondary:
      'bg-ariad-green-water hover:bg-ariad-green-mint hover:text-white focus:ring-ariad-green-water',
    outline:
      'border-2 border-ariad-blue-slate  hover:bg-ariad-beige-light focus:ring-ariad-blue-slate',
    light:
      'bg-white  hover:bg-ariad-blue-slate hover:text-white focus:ring-ariad-blue-slate',
    dark: 'bg-ariad-blue-slate text-white hover:bg-white hover: focus:ring-ariad-blue-slate',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
    nav: 'px-3 py-1.5 text-base leading-6',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
