import { draftsFromTopic, genAssets, SEED_DRAFTS, SEED_INSTRUCTIONS, seedTopics } from '../data/content'
import { scoreOf } from '../lib/scoring'
import type { Channel, Evidence, Instruction, PublisherDraft, Role, Screen, Topic } from '../types'

export type IngestPhase = 'idle' | 'processing' | 'done'

export interface Toast {
  id: number
  message: string
}

export interface WorkflowState {
  role: Role
  screen: Screen
  topics: Topic[]

  ingestPhase: IngestPhase
  ingestStep: number
  ingestFiles: number
  ingestCount: number

  studioId: string
  studioStep: 'plan' | 'assets'

  reviewId: string
  /** Clinician rewrites of a topic's answer, by topic id. */
  answerEdits: Record<string, string>
  /** Verified claims, keyed `${topicId}:${claimIndex}`. */
  verifiedClaims: Record<string, boolean>
  /** Evidence marked "not applicable", keyed `${claimKey}:${evidenceIndex}`. */
  dismissedEvidence: Record<string, boolean>
  /** Evidence the clinician added, by claim key. */
  addedEvidence: Record<string, Evidence[]>

  pubTab: 'content' | 'stats'
  publisherDrafts: PublisherDraft[]

  instructions: Instruction[]

  toast: Toast | null
}

export const initialState: WorkflowState = {
  role: 'manager',
  screen: 'ingest',
  topics: seedTopics(),
  ingestPhase: 'idle',
  ingestStep: 0,
  ingestFiles: 6,
  ingestCount: 342,
  studioId: 'recovery',
  studioStep: 'assets',
  reviewId: 'pain',
  answerEdits: {},
  verifiedClaims: {},
  dismissedEvidence: {},
  addedEvidence: {},
  pubTab: 'content',
  publisherDrafts: SEED_DRAFTS,
  instructions: SEED_INSTRUCTIONS,
  toast: null,
}

export type Action =
  | { type: 'toggleRole' }
  | { type: 'navigate'; screen: Screen; keepToast?: boolean }
  | { type: 'ingestStart'; files: number }
  | { type: 'ingestStep'; step: number }
  | { type: 'ingestDone' }
  | { type: 'ingestReset' }
  | { type: 'openStudio'; id: string }
  | { type: 'togglePlanChannel'; id: string; channel: Channel }
  | { type: 'generateAssets'; id: string }
  | { type: 'updateAsset'; id: string; channel: Channel; body: string }
  | { type: 'sendToPublisher'; id: string }
  | { type: 'setPubTab'; tab: WorkflowState['pubTab'] }
  | { type: 'selectReview'; id: string }
  | { type: 'saveAnswer'; id: string; text: string }
  | { type: 'toggleClaimVerified'; key: string }
  | { type: 'toggleDismissEvidence'; key: string }
  | { type: 'addEvidence'; claimKey: string; evidence: Evidence }
  | { type: 'removeEvidence'; claimKey: string; index: number }
  | { type: 'approve'; id: string; approvedBy: string }
  | { type: 'saveInstruction'; key: string; title: string; body: string }
  | { type: 'addInstruction'; key: string }
  | { type: 'deleteInstruction'; key: string }
  | { type: 'showToast'; message: string }
  | { type: 'hideToast'; id: number }

const updateTopic = (topics: Topic[], id: string, fn: (t: Topic) => Topic) => topics.map((t) => (t.id === id ? fn(t) : t))

export function reducer(state: WorkflowState, action: Action): WorkflowState {
  switch (action.type) {
    case 'toggleRole': {
      const toClinician = state.role === 'manager'
      return { ...state, role: toClinician ? 'clinician' : 'manager', screen: toClinician ? 'review' : 'feed', toast: null }
    }
    case 'navigate':
      return { ...state, screen: action.screen, toast: action.keepToast ? state.toast : null }

    case 'ingestStart':
      return { ...state, screen: 'ingest', ingestPhase: 'processing', ingestStep: 0, ingestFiles: action.files }
    case 'ingestStep':
      return { ...state, ingestStep: action.step }
    case 'ingestDone':
      return { ...state, ingestPhase: 'done' }
    case 'ingestReset':
      return { ...state, ingestPhase: 'idle', ingestStep: 0 }

    case 'openStudio': {
      const t = state.topics.find((o) => o.id === action.id)
      return { ...state, screen: 'studio', studioId: action.id, studioStep: t?.status === 'approved' ? 'plan' : 'assets', toast: null }
    }
    case 'togglePlanChannel':
      return {
        ...state,
        topics: updateTopic(state.topics, action.id, (t) => ({
          ...t,
          plan: t.plan.map((p) => (p.channel === action.channel ? { ...p, enabled: !p.enabled } : p)),
        })),
      }
    case 'generateAssets':
      return {
        ...state,
        studioStep: 'assets',
        topics: updateTopic(state.topics, action.id, (t) => {
          const enabled = t.plan.filter((p) => p.enabled).map((p) => p.channel)
          return { ...t, status: 'planned', assets: genAssets(t, enabled, 'draft') }
        }),
      }
    case 'updateAsset':
      return {
        ...state,
        topics: updateTopic(state.topics, action.id, (t) => ({
          ...t,
          assets: (t.assets ?? []).map((a) => (a.channel === action.channel ? { ...a, body: action.body } : a)),
        })),
      }
    case 'sendToPublisher': {
      const topic = state.topics.find((t) => t.id === action.id)
      if (!topic) return state
      return {
        ...state,
        publisherDrafts: [...draftsFromTopic(topic), ...state.publisherDrafts],
        topics: updateTopic(state.topics, action.id, (t) => ({
          ...t,
          status: 'published',
          assets: (t.assets ?? []).map((a) => ({ ...a, status: 'published' })),
          metrics: t.metrics ?? { views: '1.2k', search: '+18%', engage: '140', consults: '5' },
        })),
      }
    }
    case 'setPubTab':
      return { ...state, pubTab: action.tab }

    case 'selectReview':
      return { ...state, screen: 'review', reviewId: action.id, toast: null }
    case 'saveAnswer':
      return { ...state, answerEdits: { ...state.answerEdits, [action.id]: action.text } }
    case 'toggleClaimVerified':
      return { ...state, verifiedClaims: { ...state.verifiedClaims, [action.key]: !state.verifiedClaims[action.key] } }
    case 'toggleDismissEvidence':
      return { ...state, dismissedEvidence: { ...state.dismissedEvidence, [action.key]: !state.dismissedEvidence[action.key] } }
    case 'addEvidence':
      return {
        ...state,
        addedEvidence: { ...state.addedEvidence, [action.claimKey]: [...(state.addedEvidence[action.claimKey] ?? []), action.evidence] },
      }
    case 'removeEvidence':
      return {
        ...state,
        addedEvidence: {
          ...state.addedEvidence,
          [action.claimKey]: (state.addedEvidence[action.claimKey] ?? []).filter((_, i) => i !== action.index),
        },
      }
    case 'approve': {
      const topics = updateTopic(state.topics, action.id, (t) => ({
        ...t,
        answer: state.answerEdits[t.id] ?? t.answer,
        status: 'approved',
        approvedBy: action.approvedBy,
        approvedDate: 'Today',
      }))
      // Move on to the top of the remaining queue.
      const next = topics.filter((t) => t.status === 'clinical_review').sort((a, b) => scoreOf(b) - scoreOf(a))[0]
      return { ...state, topics, reviewId: next ? next.id : state.reviewId }
    }

    case 'saveInstruction':
      return {
        ...state,
        instructions: state.instructions.map((i) =>
          i.key === action.key ? { ...i, body: action.body, title: action.title || i.title || 'Untitled format' } : i,
        ),
      }
    case 'addInstruction':
      return { ...state, instructions: [...state.instructions, { key: action.key, title: '', kind: 'Content format', body: '' }] }
    case 'deleteInstruction':
      return { ...state, instructions: state.instructions.filter((i) => i.key !== action.key) }

    case 'showToast':
      return { ...state, toast: { id: (state.toast?.id ?? 0) + 1, message: action.message } }
    case 'hideToast':
      return state.toast?.id === action.id ? { ...state, toast: null } : state
  }
}
