import { Link } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'
import logo from '@/assets/logo.svg'

const navLinks = [
  { to: ROUTES.HOME, label: 'Início' },
  { to: ROUTES.PLATAFORMA, label: 'A plataforma' },
  { to: ROUTES.SOBRE_PROJETO, label: 'Sobre o projeto' },
  { to: ROUTES.SOBRE, label: 'Sobre nós' },
  { to: ROUTES.CONTATO, label: 'Contato' },
]

export default function Footer() {
  return (
    <footer className="border-t border-ariad-green-water py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm pb-6 mb-6 border-b border-ariad-green-water">
          <p>
            O Ariad é uma ferramenta de apoio ao raciocínio clínico. Não
            substitui o diagnóstico médico nem a autonomia do profissional de
            saúde.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Ariad" className="w-8 h-8" />
            <div>
              <div className="font-semibold">Ariad</div>
              <div className="text-xs">
                Para os casos que ainda não têm nome
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm ">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:underline decoration-ariad-green-water decoration-2 underline-offset-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
