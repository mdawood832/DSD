import type { Priority, SignalKey, Topic, TopicStatus } from '../types'

const WEIGHTS: Record<SignalKey, number> = {
  Frequency: 0.24,
  Anxiety: 0.16,
  'Content gap': 0.18,
  'Search demand': 0.16,
  'Business value': 0.16,
  Complexity: 0.1,
}

export function scoreOf(t: Topic): number {
  let total = 0
  for (const key of Object.keys(WEIGHTS) as SignalKey[]) total += t.sig[key] * WEIGHTS[key]
  return Math.round(total)
}

export const priorityOf = (score: number): Priority => (score >= 78 ? 'high' : score >= 58 ? 'medium' : 'low')

export const PRIORITY_STYLE: Record<Priority, { label: string; color: string; bg: string; ring: string }> = {
  high: { label: 'High', color: '#a8431f', bg: '#f7ece6', ring: '#c2683f' },
  medium: { label: 'Medium', color: '#7d5c14', bg: '#f6f0e2', ring: '#b08a3e' },
  low: { label: 'Low', color: '#55656a', bg: '#eef2f2', ring: '#8aa0a3' },
}

export const STATUS_STYLE: Record<TopicStatus, { label: string; color: string; bg: string }> = {
  clinical_review: { label: 'In clinical review', color: '#9a7426', bg: '#f6f0e2' },
  approved: { label: 'Ready for content', color: '#2f7e87', bg: '#eef5f6' },
  planned: { label: 'In production', color: '#7a5ca0', bg: '#f0ecf6' },
  published: { label: 'Published', color: '#3c7a64', bg: '#e9f2ec' },
}

/** A topic with its score and priority styling attached. */
export interface ScoredTopic extends Topic {
  score: number
  pri: Priority
}

export function scoreTopic(t: Topic): ScoredTopic {
  const score = scoreOf(t)
  return { ...t, score, pri: priorityOf(score) }
}

/** The five signals shown in the "why this scores N" panel on Create cards. */
export const SIGNAL_BARS: { label: string; key: SignalKey; color: string }[] = [
  { label: 'Frequency', key: 'Frequency', color: '#2f7e87' },
  { label: 'Anxiety', key: 'Anxiety', color: '#c2683f' },
  { label: 'Search demand', key: 'Search demand', color: '#b08a3e' },
  { label: 'Missing content', key: 'Content gap', color: '#7a5ca0' },
  { label: 'Treatment value', key: 'Business value', color: '#3c7a64' },
]

export const reviewMinutes = (t: Topic) => Math.max(2, Math.round(2 + (t.claims?.length ?? 0) * 1.5))

export const initialsOf = (name?: string) =>
  (name ?? '?')
    .replace(/^Dr\.?\s*/, '')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export const truncate = (s: string, max: number, keep = max) => (s.length > max ? s.slice(0, keep) + '…' : s)
