import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Button from '../common/Button'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/utils/constants'
import logo from '@/assets/logo.svg'

const navLinks = [
  { to: ROUTES.HOME, label: 'Início' },
  { to: ROUTES.PLATAFORMA, label: 'A plataforma' },
  { to: ROUTES.SOBRE_PROJETO, label: 'Sobre o projeto' },
  { to: ROUTES.SOBRE, label: 'Sobre nós' },
  { to: ROUTES.CONTATO, label: 'Contato' },
]

export default function Header() {
  const { isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-md ${
      isActive
        ? 'bg-ariad-green-water-light'
        : 'hover:bg-ariad-green-water-light'
    }`

  return (
    <header
      className={`bg-ariad-beige-light sticky top-0 z-50 border-b ${
        scrolled ? 'border-ariad-green-water' : 'border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <img src={logo} alt="Ariad" className="w-8 h-8" />
            <span className="text-lg font-semibold">
              Ariad
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClasses} end>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link to={ROUTES.DASHBOARD}>
                  <Button variant="dark" size="nav">
                    Acessar painel
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN}>
                    <Button variant="light" size="nav">
                      Entrar
                    </Button>
                  </Link>
                  <Link to={ROUTES.CADASTRO} className="hidden sm:block">
                    <Button variant="dark" size="nav">
                      Criar conta
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
