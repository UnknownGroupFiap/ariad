import { useState, type FormEvent } from 'react'
import { PrivateLayout, Card, Input, Button, Badge } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { validateEmail } from '@/utils/validators'

export default function Organizacao() {
  const { user } = useAuth()

  const [nomeOrg, setNomeOrg] = useLocalStorage(
    `ariad:org:${user?.organizacaoId}`,
    user?.nomeClinica ?? 'Minha organização',
  )
  const [convites, setConvites] = useLocalStorage<string[]>(
    `ariad:convites:${user?.organizacaoId}`,
    [],
  )

  const [rascunhoNome, setRascunhoNome] = useState(nomeOrg)
  const [emailConvite, setEmailConvite] = useState('')
  const [erro, setErro] = useState('')

  const salvarNome = (e: FormEvent) => {
    e.preventDefault()
    setNomeOrg(rascunhoNome.trim() || nomeOrg)
  }

  const convidar = (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!validateEmail(emailConvite)) return setErro('Informe um email válido.')
    if (convites.includes(emailConvite))
      return setErro('Esse email já foi convidado.')
    setConvites([...convites, emailConvite])
    setEmailConvite('')
  }

  const remover = (email: string) =>
    setConvites(convites.filter((c) => c !== email))

  return (
    <PrivateLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl ">Configurações organizacionais</h1>
          <p>Gestão da organização.</p>
        </header>

        <Card>
          <form onSubmit={salvarNome} className="space-y-2">
            <Input
              label="Nome da organização"
              value={rascunhoNome}
              onChange={(e) => setRascunhoNome(e.target.value)}
            />
            <Button type="submit" variant="primary">
              Salvar nome
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-xl  mb-1">Convidar membros</h2>
          <p className=" mb-4">
            Convide profissionais para a sua organização por email.
          </p>
          <form onSubmit={convidar} className="flex gap-3 mb-4">
            <Input
              type="email"
              placeholder="email@clinica.com.br"
              value={emailConvite}
              onChange={(e) => setEmailConvite(e.target.value)}
            />
            <Button type="submit" variant="primary">
              Convidar
            </Button>
          </form>
          {erro && <p className="text-red-500 text-sm mb-3">{erro}</p>}

          {convites.length === 0 ? (
            <p className="text-sm ">Nenhum convite enviado.</p>
          ) : (
            <ul className="space-y-2">
              {convites.map((email) => (
                <li
                  key={email}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{email}</span>
                  <div className="flex items-center gap-3">
                    <Badge variant="warning">Convite pendente</Badge>
                    <button
                      onClick={() => remover(email)}
                      className=" hover:text-red-500"
                      aria-label={`Remover convite de ${email}`}
                    >
                      <i className="bi bi-x-lg" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PrivateLayout>
  )
}
