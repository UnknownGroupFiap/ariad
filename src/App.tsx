import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { PrivateRoute, ScrollToTop } from '@/components'
import { ROUTES } from '@/utils/constants'

import Inicio from '@/pages/public/Inicio/Inicio'
import Plataforma from '@/pages/public/Plataforma/Plataforma'
import Sobre from '@/pages/public/Sobre/Sobre'
import Contato from '@/pages/public/Contato/Contato'
import Login from '@/pages/public/Login/Login'
import Cadastro from '@/pages/public/Cadastro/Cadastro'

import Dashboard from '@/pages/private/Dashboard/Dashboard'
import Casos from '@/pages/private/Casos/Casos'
import NovoCaso from '@/pages/private/NovoCaso/NovoCaso'
import Caso from '@/pages/private/Caso/Caso'
import ConfigPessoal from '@/pages/private/Configuracoes/Pessoais'
import ConfigOrganizacao from '@/pages/private/Configuracoes/Organizacao'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path={ROUTES.HOME} element={<Inicio />} />
          <Route path={ROUTES.PLATAFORMA} element={<Plataforma />} />
          <Route path={ROUTES.SOBRE} element={<Sobre />} />
          <Route path={ROUTES.CONTATO} element={<Contato />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.CADASTRO} element={<Cadastro />} />

          <Route
            path={ROUTES.DASHBOARD}
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.CASOS}
            element={
              <PrivateRoute>
                <Casos />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.NOVO_CASO}
            element={
              <PrivateRoute>
                <NovoCaso />
              </PrivateRoute>
            }
          />
          <Route
            path="/caso/:id"
            element={
              <PrivateRoute>
                <Caso />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.CONFIG_PESSOAL}
            element={
              <PrivateRoute>
                <ConfigPessoal />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.CONFIG_ORG}
            element={
              <PrivateRoute>
                <ConfigOrganizacao />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
