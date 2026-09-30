import type { Claim, Evidence, Excerpt, Topic } from '../types'

export type EvidenceKind = 'transcript' | 'provider' | 'research' | 'guideline' | 'reference'

export const EVIDENCE_KINDS: Record<EvidenceKind, { label: string; color: string; bg: string; icon: string }> = {
  transcript: { label: 'Patient transcript', color: '#2c6a72', bg: '#e4f0f1', icon: 'M2.5 3.2h11v7h-6.6L4 12.8v-2.6H2.5z' },
  provider: { label: 'Provider history', color: '#3c7a64', bg: '#e6f1ea', icon: 'M8 8.2a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3.2 13c.3-2.1 2.4-3.4 4.8-3.4s4.5 1.3 4.8 3.4' },
  research: { label: 'Published research', color: '#5b62a8', bg: '#eceef8', icon: 'M4 2.5h6l2.5 2.5v9H4zM6 8h4.5M6 10.5h3' },
  guideline: { label: 'Clinical guideline', color: '#9a7426', bg: '#f6efdd', icon: 'M8 1.8l4.3 1.9v3.1c0 3-2 5-4.3 6-2.3-1-4.3-3-4.3-6V3.7z' },
  reference: { label: 'Professional reference', color: '#7a6a9a', bg: '#efeaf6', icon: 'M4.5 2.5h5L12 5v8.5H4.5zM6.5 8h3.5' },
}

const KIND_ORDER: EvidenceKind[] = ['transcript', 'provider', 'research', 'guideline', 'reference']

/** Evidence is grouped by the kind of trust it provides. */
export const TRUST_GROUPS: { label: string; hint: string; color: string; kinds: EvidenceKind[] }[] = [
  { label: 'Where the concern came from', hint: 'the patient’s own words', color: '#2c6a72', kinds: ['transcript'] },
  { label: 'How you’ve answered it before', hint: 'your prior approved guidance', color: '#3c7a64', kinds: ['provider'] },
  { label: 'Supports clinical accuracy', hint: 'published research & guidelines', color: '#5b62a8', kinds: ['research', 'guideline', 'reference'] },
]

export type EvidenceItem =
  | { kind: 'transcript'; excerpt: Excerpt }
  | { kind: 'provider'; note: string }
  | {
      kind: 'research' | 'guideline' | 'reference'
      evidence: Evidence
      url: string | null
      /** Surfaced by the system; can be marked not applicable. */
      dismissKey?: string
      dismissed?: boolean
      /** Added by the clinician; can be removed. */
      addedIndex?: number
    }

function citationKind(source: string): 'research' | 'guideline' | 'reference' {
  const s = source.toLowerCase()
  if (s.includes('pubmed') || s.includes('cochrane') || s.includes('journal')) return 'research'
  if (s.includes('guideline') || s.includes('iti')) return 'guideline'
  return 'reference'
}

export function sourceUrl(e: Evidence): string {
  const q = encodeURIComponent(e.cite || e.detail || '')
  return /pubmed/i.test(e.source) ? 'https://pubmed.ncbi.nlm.nih.gov/?term=' + q : 'https://scholar.google.com/scholar?q=' + q
}

export const claimKey = (topicId: string, index: number) => topicId + ':' + index

/** Assembles every piece of evidence behind one claim, in display order. */
export function evidenceForClaim(
  topic: Topic,
  claim: Claim,
  index: number,
  dismissed: Record<string, boolean>,
  added: Record<string, Evidence[]>,
): EvidenceItem[] {
  const key = claimKey(topic.id, index)
  const items: EvidenceItem[] = []
  const excerpts = topic.excerpts ?? []
  if (excerpts.length) items.push({ kind: 'transcript', excerpt: excerpts[index % excerpts.length] })
  if (index === 0) {
    items.push({
      kind: 'provider',
      note:
        'Consistent with ' +
        (topic.cluster > 30 ? 'earlier answers' : 'a prior answer') +
        ' you’ve approved on this topic, no conflicts found in the Knowledge Library.',
    })
  }
  claim.evidence.forEach((e, ei) => {
    const dismissKey = key + ':' + ei
    items.push({ kind: citationKind(e.source), evidence: e, url: sourceUrl(e), dismissKey, dismissed: !!dismissed[dismissKey] })
  })
  ;(added[key] ?? []).forEach((e, ai) => {
    items.push({ kind: 'reference', evidence: e, url: e.cite ? sourceUrl(e) : null, addedIndex: ai })
  })
  return items
}

export function kindCounts(items: EvidenceItem[]) {
  const counts: Partial<Record<EvidenceKind, number>> = {}
  for (const it of items) counts[it.kind] = (counts[it.kind] ?? 0) + 1
  return KIND_ORDER.filter((k) => counts[k]).map((k) => ({ kind: k, count: counts[k]! }))
}
