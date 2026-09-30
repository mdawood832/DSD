export type Role = 'manager' | 'clinician'

export type Screen = 'ingest' | 'feed' | 'studio' | 'publisher' | 'review' | 'library' | 'config'

export type TopicStatus = 'clinical_review' | 'approved' | 'planned' | 'published'

export type SignalKey =
  | 'Frequency'
  | 'Anxiety'
  | 'Content gap'
  | 'Search demand'
  | 'Business value'
  | 'Complexity'

export type Signals = Record<SignalKey, number>

export type Channel =
  | 'Blog article'
  | 'FAQ entry'
  | 'Video script'
  | 'Google Business Profile post'
  | 'LinkedIn post'
  | 'Instagram carousel'

export interface Evidence {
  source: string
  cite: string
  detail?: string
}

export interface Claim {
  label: string
  evidence: Evidence[]
}

export interface Excerpt {
  patient: string
  clinician: string
}

export interface Metrics {
  views: string
  search: string
  engage: string
  consults: string
}

export type PlanTier = 'high' | 'support' | 'low'

export interface PlanItem {
  channel: Channel
  tier: PlanTier
  role: string
  driver: string
  recommended: boolean
  reason: string
  enabled: boolean
}

export interface Asset {
  channel: Channel
  body: string
  status: 'draft' | 'published'
}

export interface Topic {
  id: string
  status: TopicStatus
  title: string
  cluster: number
  audience: string
  existing: string
  why: string
  sig: Signals
  answer: string
  claims?: Claim[]
  excerpts?: Excerpt[]
  sources?: Evidence[]
  approvedBy?: string
  approvedDate?: string
  metrics?: Metrics
  plan: PlanItem[]
  assets?: Asset[]
}

export interface Platform {
  name: string
  color: string
  ini: string
}

export interface PublisherDraft {
  id: string
  caption: string
  platform: Platform
  type: string
}

export interface Instruction {
  key: string
  title: string
  kind: 'System' | 'Content format'
  body: string
}

export type Priority = 'high' | 'medium' | 'low'
