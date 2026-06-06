import { type ReactNode, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/utils/constants'
import logo from '@/assets/logo.svg'

type PrivateLayoutProps = {
  children: ReactNode
}

const navItens = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.CASOS, label: 'Casos' },
  { to: ROUTES.NOVO_CASO, label: 'Novo caso' },
]

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuUsuario, setMenuUsuario] = useState(false)
  const [menuMobile, setMenuMobile] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.HOME)
  }

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-md transition-colors ${
      isActive
        ? 'bg-ariad-green-water-light'
        : ' hover:bg-ariad-green-water-light'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-ariad-beige-light">
      <header
        className={`bg-ariad-beige-light sticky top-0 z-50 border-b transition-colors ${
          scrolled ? 'border-ariad-green-water' : 'border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2">
              <img src={logo} alt="Ariad" className="w-8 h-8" />
              <span className="text-lg font-semibold ">Ariad</span>
            </Link>

            <div className="flex items-center gap-8">
              <nav className="hidden md:flex items-center gap-6">
                {navItens.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={linkClasses}
                    end
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="relative">
                <button
                  onClick={() => setMenuUsuario((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-ariad-green-water-light"
                  aria-haspopup="true"
                  aria-expanded={menuUsuario}
                >
                  <i
                    className="bi bi-person-circle text-xl "
                    aria-hidden="true"
                  />
                  <span className="hidden sm:block text-left">
                    <span className="block text-sm font-medium">
                      {user?.nome}
                    </span>
                    <span className="block text-xs ">
                      CRM {user?.crm}/{user?.uf}
                    </span>
                  </span>
                  <i
                    className="bi bi-chevron-down font-medium"
                    aria-hidden="true"
                  />
                </button>

                {menuUsuario && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuUsuario(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-ariad-green-water rounded-lg shadow-md z-50 py-2">
                      <Link
                        to={ROUTES.CONFIG_PESSOAL}
                        onClick={() => setMenuUsuario(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm  hover:bg-ariad-green-water-light"
                      >
                        <i className="bi bi-person-fill" aria-hidden="true" />
                        Configurações pessoais
                      </Link>
                      <Link
                        to={ROUTES.CONFIG_ORG}
                        onClick={() => setMenuUsuario(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm  hover:bg-ariad-green-water-light"
                      >
                        <i className="bi bi-building" aria-hidden="true" />
                        Configurações organizacionais
                      </Link>
                      <Link
                        to={ROUTES.CONFIG_INTEGRACOES}
                        onClick={() => setMenuUsuario(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm  hover:bg-ariad-green-water-light"
                      >
                        <i className="bi bi-plug" aria-hidden="true" />
                        Integrações
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm  hover:bg-ariad-green-water-light w-full text-left"
                      >
                        <i className="bi bi-x-lg" aria-hidden="true" />
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setMenuMobile((v) => !v)}
                className="md:hidden  text-xl"
                aria-label={menuMobile ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={menuMobile}
                aria-controls="menu-mobile"
              >
                <i
                  className={`bi ${menuMobile ? 'bi-x-lg' : 'bi-list'}`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {menuMobile && (
            <nav
              id="menu-mobile"
              className="md:hidden flex flex-col gap-1 pb-4"
            >
              {navItens.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={linkClasses}
                  onClick={() => setMenuMobile(false)}
                  end
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

      <footer className="lg:px-8 py-4 text-center text-xs border-t border-ariad-green-water">
        Ferramenta de apoio ao raciocínio clínico. Não substitui o diagnóstico
        médico nem a autonomia profissional.
      </footer>
    </div>
  )
}
