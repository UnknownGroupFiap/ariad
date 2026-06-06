# Algoritmo Diagnostico — Ariad

## Estrategia

O Ariad usa **Likelihood Ratio (LR)** baseado no LIRICAL para ranquear doencas raras a partir de sintomas clinicos mapeados para termos HPO.

A base de dados e o **Orphadata** (`pt_product4.xml`): 4.337 doencas raras com ~115.000 anotacoes fenotipo-frequencia.

## Pipeline

```
Texto clinico
  → Keyword matching (portugues → HPO IDs)
  → Filtro de candidatas (>= 2 HPOs em comum)
  → Calculo de LR por doenca
  → Normalizacao para porcentagem
  → Top-5 hipoteses com evidencias
```

## Formulas

### Likelihood Ratio por sintoma

```
LR(hi, D) = P(hi | D) / P(hi | ~D)
```

- `P(hi | D)` = frequencia do sintoma na doenca (Orphanet)
- `P(hi | ~D)` = frequencia de fundo = media ponderada em todas as doencas

### LR combinado (log-space)

```
log_LR(D) = Σ log(LR(hi, D))  para cada sintoma observado
```

### Penalidades

| Situacao | Valor |
|---|---|
| Sintoma nao presente na doenca | `LR = pseudo_count / P(hi\|~D)` com floor 0.01 |
| Sintoma obrigatorio da doenca ausente no paciente | `LR = 0.01` |

### Normalizacao

Para estabilidade numerica, normalizamos em log-space relativo ao maximo:

```
LR_norm(D) = exp(log_LR(D) - max(log_LR))
%_final(D) = LR_norm(D) / Σ LR_norm(Dk) * 100
```

## Constantes

| Parametro | Valor | Justificativa |
|---|---|---|
| PSEUDO_COUNT | 0.005 | Evitar log(0), penaliza sintomas ausentes na doenca |
| PENALTY_OBRIGATORIO_AUSENTE | 0.01 | Penalidade forte para sintoma obrigatorio nao relatado |
| max_candidatas | 50 | Limite de doencas avaliadas por caso |
| min_match | 2 (se >= 3 HPOs) ou 1 | Filtro de pre-selecao |

## Frequencias Orphanet

| Categoria | Faixa | fi |
|---|---|---|
| Obrigatorio | 100% | 0.99 |
| Muito frequente | 99-80% | 0.90 |
| Frequente | 79-30% | 0.55 |
| Ocasional | 29-5% | 0.17 |
| Muito raro | 4-1% | 0.025 |

## Mapeamento texto → HPO

Dicionario manual de termos clinicos em portugues para HPO IDs. Matching por substring com normalizacao de acentos. Termos mais longos tem prioridade (greedy match).

## Limitacoes

- Porcentagem e score relativo entre candidatas, nao probabilidade clinica absoluta
- Assume independencia entre sintomas (Naive Bayes)
- Sem hierarquia HPO (matching exato apenas)
- Qualidade depende da cobertura do dicionario PT→HPO

## Referencias

- Robinson PN et al. AJHG 2020. [PMC7477017](https://pmc.ncbi.nlm.nih.gov/articles/PMC7477017/)
- Orphadata. [orphadata.com](https://www.orphadata.com/data/xml/pt_product4.xml) (CC-BY-4.0)
- HPO. [hpo.jax.org](https://hpo.jax.org/)
