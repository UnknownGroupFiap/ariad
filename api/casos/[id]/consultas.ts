import { sql } from '../../_lib/sql'
import { gerarDiagnostico } from '../../_lib/motor'

export const config = { runtime: 'edge' }

type Body = {
  medicoId: string
  sintomas: string
  evolucao: string
  primeiraConsulta: boolean
  data: string
  paciente?: {
    pacienteNome?: string
    pacienteIdade?: string
    pacienteSexo?: 'masculino' | 'feminino' | 'outro'
    pacienteRegiao?: string
    pacienteEspecialidade?: string
    historicoFamiliar?: string
  }
}

function extrairCasoId(request: Request): string {
  return new URL(request.url).pathname.split('/')[3] ?? ''
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'metodo nao permitido' }, { status: 405 })
  }

  const casoId = extrairCasoId(request)
  if (!casoId) {
    return Response.json({ error: 'casoId obrigatorio' }, { status: 400 })
  }

  const body = (await request.json()) as Body
  if (!body.medicoId || !body.sintomas || !body.data) {
    return Response.json({ error: 'campos obrigatorios faltando' }, { status: 400 })
  }

  const { hipoteses, investigacoes } = gerarDiagnostico(body.sintomas, body.evolucao)
  const p = body.paciente ?? {}

  try {
    const casoRows = await sql`
      UPDATE casos SET
        paciente_nome          = COALESCE(${p.pacienteNome ?? null}, paciente_nome),
        paciente_idade         = COALESCE(${p.pacienteIdade ?? null}, paciente_idade),
        paciente_sexo          = COALESCE(${p.pacienteSexo ?? null}, paciente_sexo),
        paciente_regiao        = COALESCE(${p.pacienteRegiao ?? null}, paciente_regiao),
        paciente_especialidade = COALESCE(${p.pacienteEspecialidade ?? null}, paciente_especialidade),
        historico_familiar     = COALESCE(${p.historicoFamiliar ?? null}, historico_familiar),
        hipoteses              = ${JSON.stringify(hipoteses)}::jsonb,
        investigacoes          = ${JSON.stringify(investigacoes)}::jsonb,
        atualizado_em          = NOW()
      WHERE id = ${casoId} AND medico_id = ${body.medicoId}
      RETURNING
        id,
        medico_id              AS "medicoId",
        paciente_nome          AS "pacienteNome",
        paciente_cpf           AS "pacienteCpf",
        paciente_idade         AS "pacienteIdade",
        paciente_sexo          AS "pacienteSexo",
        paciente_regiao        AS "pacienteRegiao",
        paciente_especialidade AS "pacienteEspecialidade",
        historico_familiar     AS "historicoFamiliar",
        status, hipoteses, investigacoes,
        criado_em              AS "criadoEm",
        atualizado_em          AS "atualizadoEm"
    `

    if (casoRows.length === 0) {
      return Response.json({ error: 'caso nao encontrado' }, { status: 404 })
    }

    await sql`
      INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
      VALUES (
        ${casoId}, ${body.data}::timestamptz,
        ${body.primeiraConsulta}, ${body.sintomas}, ${body.evolucao},
        ${casoRows[0].status}
      )
    `

    const consultaRows = await sql`
      SELECT
        id, data,
        primeira_consulta AS "primeiraConsulta",
        sintomas, evolucao, status, transcricao
      FROM consultas
      WHERE caso_id = ${casoId}
      ORDER BY data ASC
    `

    return Response.json({ ...casoRows[0], consultas: consultaRows }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
