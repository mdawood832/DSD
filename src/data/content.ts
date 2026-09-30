import type { Asset, Channel, Instruction, PlanItem, Platform, PublisherDraft, Topic } from '../types'
import { RAW_TOPICS } from './topics'

// ---------- Content plan ----------

const PLAN: Omit<PlanItem, 'enabled'>[] = [
  { channel: 'Blog article', tier: 'high', role: 'Cornerstone explainer', driver: 'Topic needs depth', recommended: true, reason: 'This topic needs room to explain, so a thorough, search-optimized article does the heavy lifting. Every other format links back to it.' },
  { channel: 'FAQ entry', tier: 'high', role: 'Direct answer', driver: 'Patients search this directly', recommended: true, reason: 'Answers the exact phrasing patients type, and is built to win the concise answer box in search.' },
  { channel: 'Video script', tier: 'support', role: 'Trust builder', driver: 'Reassurance lands better on camera', recommended: true, reason: 'An anxiety-driven question. Seeing the clinician say it on camera reassures in a way text can’t.' },
  { channel: 'Google Business Profile post', tier: 'support', role: 'Local discovery', driver: 'Nearby “near me” intent', recommended: true, reason: 'Captures nearby “near me” intent and keeps the profile active for local search.' },
  { channel: 'LinkedIn post', tier: 'low', role: 'Professional reach', driver: 'Audience skews B2B', recommended: false, reason: 'Audience skews B2B, limited patient reach here. Hold unless repurposing for referring dentists.' },
  { channel: 'Instagram carousel', tier: 'low', role: 'Reinforcement', driver: 'Similar post published 2 weeks ago', recommended: false, reason: 'A similar carousel published two weeks ago, engagement data suggests little added value right now.' },
]

export const planList = (): PlanItem[] => PLAN.map((p) => ({ ...p, enabled: p.recommended }))

// ---------- Asset generation (mock) ----------

function genBody(ch: Channel, t: Pick<Topic, 'title' | 'answer'>): string {
  const q = t.title
  const a = t.answer
  const short = a.length > 150 ? a.slice(0, 150) + '…' : a
  switch (ch) {
    case 'Blog article':
      return 'H1: ' + q + '\n\n' + a + '\n\n[Full article expands each point in patient-friendly language and closes with a consultation CTA.]'
    case 'FAQ entry':
      return 'Q: ' + q + '\nA: ' + a
    case 'Video script':
      return '[Hook] Worried about this? Here’s what actually happens.\n[Explain] ' + short + '\n[Close] Book a consultation and we’ll walk you through your options.'
    case 'Google Business Profile post':
      return short + ' Learn more or book a consultation today.'
    case 'LinkedIn post':
      return 'Patients ask us this constantly: “' + q + '”\n\n' + short
    case 'Instagram carousel':
      return 'Slide 1: ' + q + '\nSlide 2: The short answer\nSlide 3: What to expect\nSlide 4: Book a consultation'
  }
}

export const genAssets = (t: Pick<Topic, 'title' | 'answer'>, channels: Channel[], status: Asset['status']): Asset[] =>
  channels.map((channel) => ({ channel, body: genBody(channel, t), status }))

export function seedTopics(): Topic[] {
  return RAW_TOPICS.map((raw) => {
    const t: Topic = { ...raw, plan: planList() }
    if (t.status === 'planned' || t.status === 'published') {
      const enabled = t.plan.filter((p) => p.enabled).map((p) => p.channel)
      t.assets = genAssets(t, enabled, t.status === 'published' ? 'published' : 'draft')
    }
    return t
  })
}

// ---------- Channels ----------

const CHANNEL_STYLE: Record<Channel, { chColor: string; chBg: string }> = {
  'Blog article': { chColor: '#8b6a3e', chBg: '#f6f0e2' },
  'FAQ entry': { chColor: '#2f7e87', chBg: '#eef5f6' },
  'Video script': { chColor: '#bf5a30', chBg: '#f7ece6' },
  'Google Business Profile post': { chColor: '#3c7a64', chBg: '#e9f2ec' },
  'LinkedIn post': { chColor: '#3a6098', chBg: '#eaf0f7' },
  'Instagram carousel': { chColor: '#9a4f86', chBg: '#f6ecf3' },
}
export const chStyle = (ch: Channel) => CHANNEL_STYLE[ch]

export const CHANNEL_SHORT: Record<Channel, string> = {
  'Blog article': 'Blog',
  'FAQ entry': 'FAQ',
  'Video script': 'Video',
  'Google Business Profile post': 'GBP',
  'LinkedIn post': 'LinkedIn',
  'Instagram carousel': 'IG',
}

const PLATFORMS = {
  website: { name: 'Website', color: '#2f7e87', ini: 'W' },
  youtube: { name: 'YouTube', color: '#ef4444', ini: 'YT' },
  google: { name: 'Google Business', color: '#4285f4', ini: 'G' },
  linkedin: { name: 'LinkedIn', color: '#0a66c2', ini: 'in' },
  instagram: { name: 'Instagram', color: '#c13584', ini: 'IG' },
  facebook: { name: 'Facebook', color: '#1877f2', ini: 'f' },
} satisfies Record<string, Platform>

const CHANNEL_PLATFORM: Record<Channel, Platform> = {
  'Blog article': PLATFORMS.website,
  'FAQ entry': PLATFORMS.website,
  'Video script': PLATFORMS.youtube,
  'Google Business Profile post': PLATFORMS.google,
  'LinkedIn post': PLATFORMS.linkedin,
  'Instagram carousel': PLATFORMS.instagram,
}

// ---------- Publisher ----------

export function draftsFromTopic(t: Topic): PublisherDraft[] {
  const chans = (t.assets ?? []).map((a) => a.channel)
  const list: Channel[] = chans.length ? chans : ['LinkedIn post', 'Instagram carousel']
  return list.map((ch, i) => ({ id: t.id + '-' + i, caption: t.title, platform: CHANNEL_PLATFORM[ch], type: 'From knowledge brief' }))
}

export const SEED_DRAFTS: PublisherDraft[] = [
  { id: 'd-pain-0', caption: 'Does getting an implant hurt?', platform: PLATFORMS.instagram, type: 'From knowledge brief' },
  { id: 'd-cost-0', caption: 'How much do implants cost, and can I finance them?', platform: PLATFORMS.linkedin, type: 'From knowledge brief' },
  { id: 'd-recovery-0', caption: 'What is recovery and aftercare like after implants?', platform: PLATFORMS.instagram, type: 'From knowledge brief' },
]

export const SCHEDULED_POSTS: { caption: string; platform: Platform; dateBig: string; dateSub: string }[] = [
  { caption: 'Thinking about veneers or a smile makeover? Here’s what to know before you book.', platform: PLATFORMS.instagram, dateBig: '29 Jul 2026', dateSub: '06:00 PM' },
  { caption: 'Julia Roberts’ smile is one of the most recognizable in the world. Here’s the dentistry behind smiles like it.', platform: PLATFORMS.linkedin, dateBig: '29 Jul 2026', dateSub: '06:00 PM' },
  { caption: 'Tooth sensitivity, recession, and grinding: what your teeth are trying to tell you.', platform: PLATFORMS.facebook, dateBig: '27 Jul 2026', dateSub: '08:00 PM' },
  { caption: 'Sensitivity is a symptom, not a diagnosis. Let’s find the real cause.', platform: PLATFORMS.linkedin, dateBig: '27 Jul 2026', dateSub: '08:00 PM' },
  { caption: 'Dry mouth is easy to dismiss, until you understand what it does to your teeth.', platform: PLATFORMS.linkedin, dateBig: '22 Jul 2026', dateSub: '06:00 PM' },
  { caption: 'Dry mouth is more than uncomfortable. It affects your whole mouth’s health.', platform: PLATFORMS.facebook, dateBig: '22 Jul 2026', dateSub: '06:00 PM' },
  { caption: 'Did you know your mouth’s pH drops every time you snack?', platform: PLATFORMS.instagram, dateBig: '15 Jul 2026', dateSub: '06:00 PM' },
  { caption: 'Most people think of cavities as a sugar problem. It’s bigger than that.', platform: PLATFORMS.linkedin, dateBig: '15 Jul 2026', dateSub: '06:00 PM' },
]

export const SOCIAL_ACCOUNTS: Platform[] = [
  PLATFORMS.facebook,
  PLATFORMS.instagram,
  PLATFORMS.linkedin,
  { name: 'TikTok', color: '#111111', ini: 'TT' },
  PLATFORMS.google,
  { name: 'X', color: '#111111', ini: 'X' },
]

// ---------- Statistics ----------

export const STAT_KPIS = [
  { label: 'Content pieces live', glyph: '22', value: '22', delta: '+6', iconBg: '#eef5f6', iconColor: '#2f7e87' },
  { label: 'Total views', glyph: '◉', value: '13.2k', delta: '+18%', iconBg: '#eef5f6', iconColor: '#2f7e87' },
  { label: 'Engagements', glyph: '♡', value: '1,693', delta: '+12%', iconBg: '#f0ecf6', iconColor: '#7a5ca0' },
  { label: 'Consults booked', glyph: '⚑', value: '51', delta: '+9', iconBg: '#f7ece6', iconColor: '#c2683f' },
]

export interface PerfRow {
  topic: string
  channels: string
  views: string
  search: string
  engage: string
  consults: number
  followUp?: string
}

export const PERF_ROWS: PerfRow[] = [
  { topic: 'Does getting an implant hurt?', channels: 'Blog · FAQ · Video · Instagram', views: '7.2k', search: '+52%', engage: '1,038', consults: 27, followUp: 'Implant recovery & aftercare timeline' },
  { topic: 'How much do implants cost, and can I finance them?', channels: 'Blog · FAQ · GBP · Video', views: '6.4k', search: '+41%', engage: '914', consults: 24 },
  { topic: 'Implant vs. bridge, which is right for me?', channels: 'Blog · FAQ · GBP', views: '5.1k', search: '+34%', engage: '742', consults: 21 },
  { topic: 'Does insurance cover dental implants?', channels: 'FAQ · GBP', views: '2.8k', search: '+22%', engage: '318', consults: 9 },
  { topic: 'Will I be awake during the procedure? Sedation options', channels: 'Blog · Instagram', views: '3.4k', search: '+15%', engage: '401', consults: 6 },
]

// ---------- System instructions ----------

export const SEED_INSTRUCTIONS: Instruction[] = [
  { key: 'clustering', title: 'How the system groups questions', kind: 'System', body: 'Group patient conversations by the underlying question a patient is really asking, not the exact words they use. Merge paraphrases of the same concern into one topic (e.g. “will it hurt” and “is it painful” are one cluster). Keep clinically distinct questions separate even when they sound similar. Only surface a cluster as an opportunity once it reaches at least 15 conversations, and rank surfaced clusters by how often they come up, how anxious patients sound, and whether we already have content covering them.' },
  { key: 'voice', title: 'Overall content voice & rules', kind: 'System', body: 'Write in a warm, plain-spoken voice as if the treating clinician is speaking directly to one patient. Reassure without overpromising. Never state a claim that is not supported by the approved brief. Avoid jargon; when a clinical term is unavoidable, explain it in one short phrase. Always close with a gentle invitation to book a consultation.' },
  { key: 'blog', title: 'Blog article', kind: 'Content format', body: 'Long-form and skimmable. Open with the patient’s worry in their own words, use descriptive H2s, and expand each claim into a short paragraph. 600–900 words. Close with a consultation CTA.' },
  { key: 'linkedin', title: 'LinkedIn post', kind: 'Content format', body: 'Professional but human. Frame it as something the practice sees often, then answer it in 2–3 short paragraphs. No hashtag spam. One clear takeaway.' },
  { key: 'gbp', title: 'Google Business Profile post', kind: 'Content format', body: 'Under 300 characters, local and action-oriented. Lead with the single most reassuring point, then a clear nudge to book. Written for someone searching “near me”.' },
  { key: 'instagram', title: 'Instagram carousel', kind: 'Content format', body: '4–5 slides. Slide 1 is the question in the patient’s words, the middle slides answer it in bites, and the final slide is the CTA. Punchy, low text density, one idea per slide.' },
]

// ---------- People ----------

export const CLINICIAN = { name: 'Dr. M. Okafor', initials: 'MO' }
export const CONTENT_MANAGER = { name: 'Maya Chen', initials: 'MC' }
