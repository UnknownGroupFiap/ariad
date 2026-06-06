"""
Motor Diagnostico Ariad — Calculo de hipoteses via LIRICAL (Likelihood Ratio).

Usa dados reais do Orphadata (pt_product4.xml) para gerar porcentagens
de compatibilidade entre sintomas e doencas raras.

Uso:
  uv run scripts/calcular_hipoteses.py

Requisitos:
  - Arquivo /tmp/pt_product4.xml (baixar de https://www.orphadata.com/data/xml/pt_product4.xml)

Saida:
  - Hipoteses com porcentagens calculadas para cada caso mock
  - Arquivo api/_lib/base_doencas.json com dados pre-computados
"""

import json
import logging
import math
import os
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
)
log = logging.getLogger(__name__)

XML_PATH = os.environ.get("ORPHADATA_XML", "/tmp/pt_product4.xml")
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), "..", "api", "_lib", "base_doencas.json")

FREQ_MAP = {
    "Obrigatório (100%)": 0.99,
    "Muito frequente (99-80%)": 0.90,
    "Frequente (79-30%)": 0.55,
    "Ocasional (29-5%)": 0.17,
    "Muito raro (4-1%)": 0.025,
}

PSEUDO_COUNT = 0.005
PENALTY_OBRIGATORIO_AUSENTE = 0.01


TERMOS_PT_HPO: dict[str, list[str]] = {
    # Neurologicos - motores / parkinsonismo
    "tremor": ["HP:0001337"],
    "tremor em repouso": ["HP:0001337"],
    "tremor postural": ["HP:0001337", "HP:0002080"],
    "bradicinesia": ["HP:0002067"],
    "rigidez": ["HP:0001257"],
    "rigidez muscular": ["HP:0001257"],
    "instabilidade postural": ["HP:0002172"],
    "parkinsonismo": ["HP:0001300"],
    "lentidao nos movimentos": ["HP:0002067"],
    "espasticidade": ["HP:0001257"],
    "distonia": ["HP:0001332"],
    # Neurologicos - fraqueza
    "fraqueza": ["HP:0001324"],
    "fraqueza muscular": ["HP:0001324", "HP:0003324"],
    "fraqueza ascendente": ["HP:0003324", "HP:0009053"],
    "fraqueza assimetrica": ["HP:0003324", "HP:0003484"],
    "fraqueza progressiva": ["HP:0003324"],
    "atrofia muscular": ["HP:0003202"],
    "fasciculacoes": ["HP:0002380"],
    "caibras": ["HP:0003394"],
    "fadiga muscular": ["HP:0003324", "HP:0030197"],
    "fraqueza fatigavel": ["HP:0030197"],
    # Neurologicos - reflexos
    "arreflexia": ["HP:0001284", "HP:0001265"],
    "reflexos tendinosos ausentes": ["HP:0001284", "HP:0001265"],
    "hiper-reflexia": ["HP:0001347"],
    "hiporreflexia": ["HP:0001265"],
    # Neurologicos - coordenacao
    "ataxia": ["HP:0001251"],
    "ataxia de marcha": ["HP:0002066"],
    "instabilidade de marcha": ["HP:0002066", "HP:0002317"],
    "disartria": ["HP:0001260"],
    "escoliose": ["HP:0002650"],
    "incoordenacao": ["HP:0001310"],
    # Neurologicos - sensorial
    "parestesia": ["HP:0003401"],
    "formigamento": ["HP:0003401", "HP:0012534"],
    "acroparestesias": ["HP:0010829", "HP:0003401"],
    "dor neuropatica": ["HP:0010829", "HP:0003401"],
    "deficit sensitivo": ["HP:0010831"],
    # Neurologicos - oculares / bulbares
    "ptose": ["HP:0000508"],
    "ptose palpebral": ["HP:0000508"],
    "diplopia": ["HP:0000651"],
    "uveite": ["HP:0007813"],
    "disfagia": ["HP:0002015"],
    "disfonia": ["HP:0001618"],
    # Neurologicos - outros
    "convulsao": ["HP:0001250"],
    "macrocefalia": ["HP:0000256"],
    # Comportamento / psiquiatrico
    "alteracao de comportamento": ["HP:0000708", "HP:0000751"],
    "alteracoes de comportamento": ["HP:0000708", "HP:0000751"],
    # Gastrointestinal / hepatico
    "ictericia": ["HP:0000952"],
    "hepatopatia": ["HP:0001392", "HP:0001394"],
    "transaminases elevadas": ["HP:0002910"],
    "gastroenterite": ["HP:0002583"],
    # Cardiovascular
    "hipertrofia ventricular": ["HP:0001712"],
    "hipertrofia de ventriculo esquerdo": ["HP:0001712"],
    "angioqueratomas": ["HP:0001014"],
    "hipohidrose": ["HP:0000966"],
    "miocardiopatia": ["HP:0001638"],
    # Mucocutaneos
    "ulceras orais": ["HP:0000155"],
    "aftas orais": ["HP:0000155", "HP:0011107"],
    "ulceras genitais": ["HP:0003249"],
    "lesoes cutaneas": ["HP:0000951", "HP:0200034"],
    # Respiratorio
    "dificuldade respiratoria": ["HP:0002094"],
    "insuficiencia respiratoria": ["HP:0002878"],
    # Oftalmologico
    "anel de kayser-fleischer": ["HP:0200032"],
    # Sistemico
    "fadiga": ["HP:0012378"],
    "febre": ["HP:0001945"],
    "perda de peso": ["HP:0001824"],
    # Musculoesqueletico
    "artrite": ["HP:0001369"],
    "vasculite": ["HP:0002633"],
}


@dataclass
class Fenotipo:
    hpo_id: str
    termo: str
    frequencia: float


@dataclass
class Doenca:
    orpha_code: str
    nome: str
    fenotipos: list[Fenotipo] = field(default_factory=list)


def parse_orphadata(xml_path: str) -> dict[str, Doenca]:
    tree = ET.parse(xml_path)
    root = tree.getroot()

    doencas: dict[str, Doenca] = {}

    for disorder_set in root.iter("HPODisorderSetStatus"):
        disorder = disorder_set.find("Disorder")
        if disorder is None:
            continue

        orpha_code = disorder.findtext("OrphaCode", "")
        nome = disorder.findtext("Name", "")

        doenca = Doenca(orpha_code=orpha_code, nome=nome)

        assoc_list = disorder.find("HPODisorderAssociationList")
        if assoc_list is None:
            continue

        for assoc in assoc_list.iter("HPODisorderAssociation"):
            hpo_el = assoc.find("HPO")
            freq_el = assoc.find("HPOFrequency")

            if hpo_el is None or freq_el is None:
                continue

            hpo_id = hpo_el.findtext("HPOId", "")
            termo = hpo_el.findtext("HPOTerm", "")
            freq_name = freq_el.findtext("Name", "")

            freq_val = FREQ_MAP.get(freq_name, 0.17)

            doenca.fenotipos.append(Fenotipo(hpo_id=hpo_id, termo=termo, frequencia=freq_val))

        if doenca.fenotipos:
            doencas[orpha_code] = doenca

    log.info("Carregadas %d doencas do Orphadata", len(doencas))
    return doencas


def construir_indice(doencas: dict[str, Doenca]) -> dict[str, list[tuple[str, float]]]:
    indice: dict[str, list[tuple[str, float]]] = {}
    for code, d in doencas.items():
        for f in d.fenotipos:
            if f.hpo_id not in indice:
                indice[f.hpo_id] = []
            indice[f.hpo_id].append((code, f.frequencia))
    return indice


def calcular_freq_fundo(indice: dict[str, list[tuple[str, float]]], total_doencas: int) -> dict[str, float]:
    freq_fundo: dict[str, float] = {}
    for hpo_id, entries in indice.items():
        soma = sum(f for _, f in entries)
        freq_fundo[hpo_id] = soma / total_doencas
    return freq_fundo


def normalizar_texto(texto: str) -> str:
    return (
        texto.lower()
        .replace("á", "a").replace("é", "e").replace("í", "i")
        .replace("ó", "o").replace("ú", "u").replace("ã", "a")
        .replace("õ", "o").replace("ç", "c").replace("â", "a")
        .replace("ê", "e").replace("ô", "o")
    )


def extrair_hpo_do_texto(texto: str) -> list[str]:
    texto_norm = normalizar_texto(texto)
    hpo_ids: set[str] = set()

    termos_ordenados = sorted(TERMOS_PT_HPO.items(), key=lambda x: len(x[0]), reverse=True)

    for termo, hpos in termos_ordenados:
        if normalizar_texto(termo) in texto_norm:
            hpo_ids.update(hpos)

    return list(hpo_ids)


def calcular_lr(
    sintomas_hpo: list[str],
    doencas: dict[str, Doenca],
    indice: dict[str, list[tuple[str, float]]],
    freq_fundo: dict[str, float],
    max_candidatas: int = 50,
) -> list[dict]:
    candidatas: dict[str, int] = {}
    for hpo_id in sintomas_hpo:
        if hpo_id in indice:
            for orpha_code, _ in indice[hpo_id]:
                candidatas[orpha_code] = candidatas.get(orpha_code, 0) + 1

    min_match = 2 if len(sintomas_hpo) >= 3 else 1
    candidatas_filtradas = [c for c, count in candidatas.items() if count >= min_match]

    if not candidatas_filtradas:
        return []

    candidatas_filtradas.sort(key=lambda c: candidatas[c], reverse=True)
    candidatas_filtradas = candidatas_filtradas[:max_candidatas]

    resultados: list[dict] = []

    for orpha_code in candidatas_filtradas:
        doenca = doencas[orpha_code]
        fenotipos_dict = {f.hpo_id: f for f in doenca.fenotipos}

        log_lr = 0.0
        evidencias: list[str] = []

        for hpo_id in sintomas_hpo:
            if hpo_id in fenotipos_dict:
                fi = fenotipos_dict[hpo_id].frequencia
                bg = max(freq_fundo.get(hpo_id, PSEUDO_COUNT), PSEUDO_COUNT)
                lr_i = fi / bg
                log_lr += math.log(lr_i)
                evidencias.append(f"{fenotipos_dict[hpo_id].termo} (freq: {fi:.0%})")
            else:
                bg = max(freq_fundo.get(hpo_id, PSEUDO_COUNT), PSEUDO_COUNT)
                lr_i = PSEUDO_COUNT / bg
                log_lr += math.log(max(lr_i, 0.01))

        for f in doenca.fenotipos:
            if f.frequencia >= 0.99 and f.hpo_id not in sintomas_hpo:
                log_lr += math.log(PENALTY_OBRIGATORIO_AUSENTE)

        resultados.append({
            "orpha_code": orpha_code,
            "nome": doenca.nome,
            "log_lr": log_lr,
            "evidencias": evidencias,
        })

    max_log_lr = max(r["log_lr"] for r in resultados)

    for r in resultados:
        r["lr"] = math.exp(r["log_lr"] - max_log_lr)

    total_lr = sum(r["lr"] for r in resultados)

    for r in resultados:
        r["probabilidade"] = (r["lr"] / total_lr) * 100 if total_lr > 0 else 0

    resultados.sort(key=lambda r: r["probabilidade"], reverse=True)

    return resultados


CASOS_MOCK = [
    {
        "id": "caso-001",
        "nome": "Antonio Silva - Parkinson",
        "sintomas": "Tremor em repouso na mão direita, bradicinesia, rigidez muscular, instabilidade postural",
        "evolucao": "Paciente de 62 anos com tremor progressivo há 8 meses. Iniciou com tremor unilateral em membro superior direito, principalmente em repouso. Relata lentidão progressiva nos movimentos e dificuldade para iniciar caminhada.",
    },
    {
        "id": "caso-002",
        "nome": "Maria Lima - Guillain-Barre",
        "sintomas": "Fraqueza muscular ascendente bilateral, parestesia em extremidades, arreflexia, dificuldade respiratória leve",
        "evolucao": "Paciente de 34 anos com quadro de fraqueza progressiva há 5 dias, iniciando em membros inferiores e ascendendo. Relata formigamento em mãos e pés. Há 2 semanas apresentou quadro de gastroenterite. Reflexos tendinosos ausentes. Força muscular grau 3 em MMII.",
    },
    {
        "id": "caso-003",
        "nome": "Beatriz Andrade - Wilson",
        "sintomas": "Tremor postural, disartria, alteração de comportamento, icterícia leve",
        "evolucao": "Mulher de 24 anos com tremor e alterações de fala há 6 meses, associada a transaminases elevadas e anel de Kayser-Fleischer ao exame oftalmológico.",
    },
    {
        "id": "caso-004",
        "nome": "Carlos Mendes - ELA",
        "sintomas": "Fraqueza assimétrica em membro superior, fasciculações, atrofia muscular, cãibras",
        "evolucao": "Homem de 57 anos com fraqueza progressiva indolor há 7 meses, fasciculações difusas e hiper-reflexia, sem déficit sensitivo.",
    },
    {
        "id": "caso-005",
        "nome": "Daniela Rocha - Behcet",
        "sintomas": "Úlceras orais recorrentes, úlceras genitais, uveíte, lesões cutâneas",
        "evolucao": "Mulher de 29 anos com aftas orais recorrentes há mais de 1 ano, episódios de úlceras genitais e quadro de uveíte anterior.",
    },
    {
        "id": "caso-006",
        "nome": "Eduardo Pinto - Fabry",
        "sintomas": "Acroparestesias, angioqueratomas, hipohidrose, hipertrofia ventricular",
        "evolucao": "Homem de 41 anos com dor neuropática em extremidades desde a adolescência, angioqueratomas em região inguinal e hipertrofia de ventrículo esquerdo ao ecocardiograma.",
    },
    {
        "id": "caso-007",
        "nome": "Fernanda Souza - Miastenia Gravis",
        "sintomas": "Ptose flutuante, diplopia, fadiga muscular ao esforço, fraqueza vespertina",
        "evolucao": "Mulher de 38 anos com ptose palpebral que piora ao fim do dia, diplopia intermitente e fraqueza que melhora com repouso.",
    },
    {
        "id": "caso-008",
        "nome": "Gabriel Teixeira - Ataxia de Friedreich",
        "sintomas": "Ataxia de marcha progressiva, arreflexia, disartria, escoliose",
        "evolucao": "Adolescente de 19 anos com instabilidade de marcha progressiva desde os 13 anos, arreflexia em membros inferiores, disartria e escoliose. Pais consanguíneos.",
    },
]


def exportar_base(doencas: dict[str, Doenca], indice: dict[str, list[tuple[str, float]]], freq_fundo: dict[str, float]) -> None:
    base_export = {}
    for code, d in doencas.items():
        base_export[code] = {
            "nome": d.nome,
            "fenotipos": [
                {"hpo": f.hpo_id, "termo": f.termo, "freq": f.frequencia}
                for f in d.fenotipos
            ],
        }

    output = {
        "doencas": base_export,
        "freq_fundo": freq_fundo,
        "meta": {
            "total_doencas": len(doencas),
            "total_hpo": len(indice),
            "fonte": "Orphadata pt_product4.xml (Dec 2025)",
            "licenca": "CC-BY-4.0",
        },
    }

    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=None)

    size_mb = os.path.getsize(OUTPUT_JSON) / (1024 * 1024)
    log.info("Exportado %s (%.1f MB)", OUTPUT_JSON, size_mb)


def main() -> int:
    if not os.path.exists(XML_PATH):
        log.error("Arquivo %s nao encontrado.", XML_PATH)
        log.error("Baixe de: https://www.orphadata.com/data/xml/pt_product4.xml")
        log.error("  curl -o /tmp/pt_product4.xml https://www.orphadata.com/data/xml/pt_product4.xml")
        return 1

    doencas = parse_orphadata(XML_PATH)
    indice = construir_indice(doencas)
    freq_fundo = calcular_freq_fundo(indice, len(doencas))

    log.info("Indice HPO: %d termos | Freq. fundo: %d termos", len(indice), len(freq_fundo))

    for caso in CASOS_MOCK:
        texto_completo = f"{caso['sintomas']} {caso['evolucao']}"
        hpo_ids = extrair_hpo_do_texto(texto_completo)

        print(f"\n[{caso['id']}] {caso['nome']}")
        print(f"  HPOs extraidos: {len(hpo_ids)}")

        resultados = calcular_lr(hpo_ids, doencas, indice, freq_fundo)

        if not resultados:
            print("  Nenhuma hipotese encontrada.")
            continue

        for i, r in enumerate(resultados[:5], 1):
            print(f"  {i}. {r['nome']} — {r['probabilidade']:.1f}%")
            for ev in r["evidencias"][:3]:
                print(f"     {ev}")

    exportar_base(doencas, indice, freq_fundo)
    return 0


if __name__ == "__main__":
    sys.exit(main())
