import type {
  TipoIntegracao,
  ConfigIntegracao,
  PacienteImportado,
  ConectorInfo,
} from '@/types'

const INTEGRACOES_KEY = 'ariad:integracoes'

export const CONECTORES: ConectorInfo[] = [
  {
    tipo: 'rnds',
    nome: 'RNDS / SUS',
    descricao:
      'Rede Nacional de Dados em Saúde. Importa vacinas, exames laboratoriais e dispensação de medicamentos do SUS via FHIR R4.',
    icone: 'bi-hospital',
    requisitos: 'Certificado digital ICP-Brasil e CNES vinculado',
    campos: [
      { name: 'certificado', label: 'Certificado digital (.pfx)', type: 'text' },
      { name: 'senhaCertificado', label: 'Senha do certificado', type: 'password' },
      { name: 'cnes', label: 'Código CNES', type: 'text' },
    ],
  },
  {
    tipo: 'tiss',
    nome: 'TISS / Convênios',
    descricao:
      'Troca de Informações em Saúde Suplementar (ANS). Importa guias, autorizações e procedimentos de convênios.',
    icone: 'bi-file-earmark-medical',
    requisitos: 'Registro ANS e credenciais da operadora',
    campos: [
      { name: 'registroAns', label: 'Registro ANS', type: 'text' },
      { name: 'usuario', label: 'Usuário', type: 'text' },
      { name: 'senha', label: 'Senha', type: 'password' },
    ],
  },
  {
    tipo: 'pep',
    nome: 'PEP Privado',
    descricao:
      'Prontuário Eletrônico do Paciente. Conecta com iClinic, ProntMed, Doctoralia, Medicina Direta, MV ou Tasy.',
    icone: 'bi-pc-display',
    requisitos: 'URL da API e token de acesso do sistema',
    campos: [
      { name: 'urlApi', label: 'URL da API', type: 'text' },
      { name: 'token', label: 'Token de acesso', type: 'password' },
    ],
  },
  {
    tipo: 'pdf',
    nome: 'Importar PDF / Laudos',
    descricao:
      'Extrai dados de laudos, resultados de exames e relatórios em PDF automaticamente via OCR.',
    icone: 'bi-file-earmark-pdf',
    requisitos: 'Nenhum pré-requisito',
    campos: [],
  },
]

const PACIENTES_MOCK: PacienteImportado[] = [
  {
    cpf: '001.002.003-04',
    nome: 'Ana Carolina Ferreira',
    idade: '45 anos',
    sexo: 'feminino',
    regiao: 'Brasília, DF',
    historicoFamiliar:
      'Mãe com artrite reumatoide diagnosticada aos 50 anos. Pai hipertenso em tratamento. Avó materna com hipotireoidismo.',
    alergias: 'Dipirona',
    medicamentosAtivos: ['Losartana 50mg', 'Levotiroxina 25mcg'],
  },
  {
    cpf: '005.006.007-08',
    nome: 'Roberto Santos Filho',
    idade: '67 anos',
    sexo: 'masculino',
    regiao: 'Campinas, SP',
    historicoFamiliar:
      'Pai faleceu de AVC aos 70 anos. Irmão mais velho com diabetes tipo 2. Mãe teve câncer de mama aos 65.',
    alergias: 'Amoxicilina',
    medicamentosAtivos: ['Metformina 850mg', 'AAS 100mg', 'Atorvastatina 20mg'],
  },
  {
    cpf: '009.010.011-12',
    nome: 'Juliana Martins',
    idade: '31 anos',
    sexo: 'feminino',
    regiao: 'Florianópolis, SC',
    historicoFamiliar: 'Sem histórico familiar relevante. Pais saudáveis.',
    medicamentosAtivos: [],
  },
  {
    cpf: '013.014.015-16',
    nome: 'Pedro Henrique Costa',
    idade: '52 anos',
    sexo: 'masculino',
    regiao: 'Goiânia, GO',
    historicoFamiliar:
      'Mãe diagnosticada com doença de Parkinson aos 68 anos. Avô paterno com demência senil. Pai hipertenso.',
    medicamentosAtivos: ['Enalapril 10mg'],
  },
  {
    cpf: '017.018.019-20',
    nome: 'Larissa Oliveira',
    idade: '28 anos',
    sexo: 'feminino',
    regiao: 'Manaus, AM',
    historicoFamiliar:
      'Irmã mais velha com lúpus eritematoso sistêmico diagnosticado aos 25 anos. Mãe com fibromialgia.',
    alergias: 'Sulfa',
    medicamentosAtivos: ['Hidroxicloroquina 400mg'],
  },
]

function lerIntegracoes(): ConfigIntegracao[] {
  try {
    return JSON.parse(localStorage.getItem(INTEGRACOES_KEY) ?? '[]')
  } catch {
    return []
  }
}

function gravarIntegracoes(configs: ConfigIntegracao[]): void {
  localStorage.setItem(INTEGRACOES_KEY, JSON.stringify(configs))
}

export function listarIntegracoes(): ConfigIntegracao[] {
  return lerIntegracoes()
}

export function obterIntegracao(
  tipo: TipoIntegracao,
): ConfigIntegracao | undefined {
  return lerIntegracoes().find((c) => c.tipo === tipo)
}

export function salvarIntegracao(config: ConfigIntegracao): void {
  const todas = lerIntegracoes().filter((c) => c.tipo !== config.tipo)
  todas.push(config)
  gravarIntegracoes(todas)
}

export function desconectarIntegracao(tipo: TipoIntegracao): void {
  const todas = lerIntegracoes().filter((c) => c.tipo !== tipo)
  gravarIntegracoes(todas)
}

export function temIntegracaoAtiva(): boolean {
  return lerIntegracoes().some((c) => c.status === 'conectado')
}

export function buscarPacientePorCpf(
  cpf: string,
): PacienteImportado | undefined {
  if (!temIntegracaoAtiva()) return undefined
  const alvo = cpf.trim()
  if (!alvo) return undefined
  return PACIENTES_MOCK.find((p) => p.cpf === alvo)
}
