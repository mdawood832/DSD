import { useState } from 'react'
import { IconChat, IconCheck, IconChevronDown, IconClock, IconClose, IconExternal, IconPencil, IconPerson, IconPlus, IconShieldAlert, PathIcon } from '../components/icons'
import { claimKey, EVIDENCE_KINDS, evidenceForClaim, kindCounts, TRUST_GROUPS, type EvidenceItem } from '../lib/evidence'
import { PRIORITY_STYLE, reviewMinutes, type ScoredTopic } from '../lib/scoring'
import { useWorkflow } from '../state/WorkflowProvider'
import type { Claim } from '../types'
import './Review.css'

function ReviewQueue({ queue, currentId }: { queue: ScoredTopic[]; currentId: string }) {
  const { actions } = useWorkflow()
  return (
    <div className="review-queue">
      <div className="review-queue-label">Awaiting you · {queue.length}</div>
      <div className="review-queue-list">
        {queue.map((t) => {
          const p = PRIORITY_STYLE[t.pri]
          const selected = t.id === currentId
          return (
            <div
              key={t.id}
              className="queue-card"
              role="button"
              tabIndex={0}
              aria-current={selected}
              style={{ background: selected ? '#eef5f6' : '#ffffff', borderColor: selected ? '#2f7e87' : '#e7eded' }}
              onClick={() => actions.selectReview(t.id)}
              onKeyDown={(e) => e.key === 'Enter' && actions.selectReview(t.id)}
            >
              <div className="queue-card-top" style={{ color: p.color }}>
                <span className="queue-card-pri">{p.label} priority</span>
                <span className="queue-card-score">{t.score}</span>
              </div>
              <div className="queue-card-title">{t.title}</div>
              <div className="queue-card-time">
                <IconClock size={12} />~{reviewMinutes(t)} min review
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EvidenceRow({ item, onDismiss, onRemove }: { item: EvidenceItem; onDismiss?: () => void; onRemove?: () => void }) {
  const kind = EVIDENCE_KINDS[item.kind]
  const isCitation = 'evidence' in item
  const dismissed = isCitation && item.dismissed
  const byClinician = isCitation && item.addedIndex != null

  return (
    <div className="ev-row" style={{ borderLeftColor: kind.color, opacity: dismissed ? 0.5 : 1 }}>
      <div className="ev-row-head">
        <span className="ev-kind" style={{ color: kind.color, background: kind.bg }}>
          <PathIcon d={kind.icon} size={10} sw={1.7} />
          {kind.label}
        </span>
        {byClinician && <span className="ev-added">Added by you</span>}
        <span className="ev-spacer" />
        {onDismiss && (
          <button className="ev-dismiss" onClick={onDismiss}>
            {dismissed ? 'Restore' : 'Not applicable'}
          </button>
        )}
        {onRemove && (
          <button className="ev-remove" title="Remove" onClick={onRemove}>
            <IconClose size={13} />
          </button>
        )}
      </div>

      {item.kind === 'transcript' && (
        <div className="ev-transcript">
          <div className="ev-line">
            <span className="ev-speaker">Patient</span>
            <span className="ev-quote patient">“{item.excerpt.patient}”</span>
          </div>
          <div className="ev-line">
            <span className="ev-speaker provider">Provider</span>
            <span className="ev-quote">“{item.excerpt.clinician}”</span>
          </div>
        </div>
      )}

      {item.kind === 'provider' && <div className="ev-note">{item.note}</div>}

      {isCitation && (
        <a className="ev-citation" href={item.url ?? undefined} target="_blank" rel="noopener noreferrer">
          <div className="ev-cite-row">
            <span className="ev-cite">{item.evidence.cite}</span>
            {item.url && <IconExternal size={12} color="#2f7e87" style={{ flexShrink: 0 }} />}
          </div>
          {item.evidence.detail && (
            <div className="ev-detail" style={{ textDecoration: dismissed ? 'line-through' : 'none' }}>
              {item.evidence.detail}
            </div>
          )}
        </a>
      )}
    </div>
  )
}

interface ClaimCardProps {
  topic: ScoredTopic
  claim: Claim
  index: number
  open: boolean
  onToggleOpen: () => void
  adding: boolean
  onStartAdd: () => void
  onCancelAdd: () => void
}

function ClaimCard({ topic, claim, index, open, onToggleOpen, adding, onStartAdd, onCancelAdd }: ClaimCardProps) {
  const { state, actions } = useWorkflow()
  const [source, setSource] = useState('')
  const [cite, setCite] = useState('')
  const key = claimKey(topic.id, index)
  const verified = !!state.verifiedClaims[key]
  const items = evidenceForClaim(topic, claim, index, state.dismissedEvidence, state.addedEvidence)
  const groups = TRUST_GROUPS.map((g) => ({ ...g, items: items.filter((it) => g.kinds.includes(it.kind)) })).filter((g) => g.items.length)

  const saveResource = () => {
    const s = source.trim()
    const c = cite.trim()
    if (!s && !c) return
    actions.addEvidence(key, { source: s || 'Resource', cite: c })
    setSource('')
    setCite('')
    onCancelAdd()
  }

  return (
    <div
      className="claim-card"
      style={{
        borderColor: verified ? '#b6d8c4' : open ? '#cfe0e2' : '#e8eded',
        background: verified ? '#f4faf6' : open ? '#f8fbfb' : '#ffffff',
        maxHeight: verified ? 62 : 2000,
      }}
    >
      <div className="claim-head" style={{ padding: verified ? '11px 18px' : '16px 18px' }}>
        <button
          className="claim-check"
          title={verified ? 'Verified' : 'Verify this claim'}
          aria-pressed={verified}
          onClick={() => {
            if (!verified && open) onToggleOpen()
            actions.toggleClaimVerified(key)
          }}
          style={{ borderColor: verified ? '#3c7a64' : '#c8d4d4', background: verified ? '#3c7a64' : '#ffffff' }}
        >
          <IconCheck size={13} color="#fff" sw={2.4} style={{ opacity: verified ? 1 : 0 }} />
        </button>
        <div className="claim-main">
          <div className="claim-label">{claim.label}</div>
          <div
            className="claim-meta"
            style={{ maxHeight: verified ? 0 : 44, opacity: verified ? 0 : 1, marginTop: verified ? 0 : 10 }}
          >
            {kindCounts(items).map(({ kind, count }) => {
              const k = EVIDENCE_KINDS[kind]
              return (
                <span className="claim-chip" key={kind} style={{ color: k.color, background: k.bg }}>
                  <PathIcon d={k.icon} size={11} />
                  {k.label}
                  <span className="claim-chip-count">{count}</span>
                </span>
              )
            })}
            <button className="claim-toggle" onClick={onToggleOpen} aria-expanded={open}>
              {open ? 'Hide evidence' : 'View evidence'}
              <IconChevronDown size={11} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="claim-evidence">
          {groups.map((g) => (
            <div className="ev-group" key={g.label}>
              <div className="ev-group-head">
                <span className="ev-group-label" style={{ color: g.color }}>
                  {g.label}
                </span>
                <span className="ev-group-hint">· {g.hint}</span>
              </div>
              {g.items.map((it, i) => (
                <EvidenceRow
                  key={i}
                  item={it}
                  onDismiss={'dismissKey' in it && it.dismissKey ? () => actions.toggleDismissEvidence(it.dismissKey!) : undefined}
                  onRemove={'addedIndex' in it && it.addedIndex != null ? () => actions.removeEvidence(key, it.addedIndex!) : undefined}
                />
              ))}
            </div>
          ))}

          {adding ? (
            <div className="add-form">
              <div className="add-form-title">Add a resource that supports, or challenges, this statement</div>
              <input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Source (e.g. PubMed, Cochrane, your clinical note)"
                className="add-input"
              />
              <input value={cite} onChange={(e) => setCite(e.target.value)} placeholder="Citation, DOI, or URL" className="add-input" />
              <div className="add-actions">
                <button className="btn btn-primary add-btn" onClick={saveResource}>
                  Add resource
                </button>
                <button className="btn btn-secondary add-btn" onClick={onCancelAdd}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button className="add-evidence" onClick={onStartAdd}>
              <IconPlus size={13} />
              Add your own evidence
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function ReviewBrief({ topic }: { topic: ScoredTopic }) {
  const { state, actions } = useWorkflow()
  const [editing, setEditing] = useState(false)
  const [answerDraft, setAnswerDraft] = useState('')
  const [openClaim, setOpenClaim] = useState<number | null>(null)
  const [addingFor, setAddingFor] = useState<number | null>(null)

  const pri = PRIORITY_STYLE[topic.pri]
  const answer = state.answerEdits[topic.id] ?? topic.answer
  const claims = topic.claims ?? []
  const claimTotal = claims.length
  const verifiedCount = claims.filter((_, i) => state.verifiedClaims[claimKey(topic.id, i)]).length
  const canApprove = claimTotal > 0 && verifiedCount === claimTotal

  const startEdit = () => {
    setAnswerDraft(answer)
    setEditing(true)
  }

  return (
    <div className="brief">
      <div className="brief-head">
        <div className="brief-tags">
          <span className="brief-pri" style={{ color: pri.color, background: pri.bg }}>
            {pri.label} priority
          </span>
          <span className="brief-tag">
            <IconChat size={12} />
            {topic.cluster} patient conversations
          </span>
          <span className="brief-tag-sep" />
          <span className="brief-tag">
            <IconPerson size={12} />
            {topic.audience}
          </span>
        </div>
        <div className="brief-kicker">Patient question</div>
        <h1 className="brief-title">{topic.title}</h1>
      </div>

      <div className="brief-answer">
        <div className="brief-answer-head">
          <span className="brief-answer-label">
            <IconPerson size={11} />
            Provider's answer · reference only
          </span>
          {!editing && (
            <button className="brief-refine" onClick={startEdit}>
              <IconPencil size={12} /> Refine wording
            </button>
          )}
        </div>
        {editing ? (
          <>
            <textarea className="brief-textarea" value={answerDraft} onChange={(e) => setAnswerDraft(e.target.value)} />
            <div className="brief-edit-actions">
              <button
                className="btn btn-primary brief-edit-btn"
                onClick={() => {
                  actions.saveAnswer(topic.id, answerDraft)
                  setEditing(false)
                }}
              >
                Save changes
              </button>
              <button className="btn btn-ghost brief-edit-btn" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p className="brief-answer-text">{answer}</p>
        )}
      </div>

      <div className="claims">
        <div className="claims-head">
          <div className="claims-heading">
            <h2>
              <span className="claims-icon">
                <IconShieldAlert size={18} />
              </span>
              Medical claims to verify
            </h2>
            <p>This is your task. Each statement carries clinical risk, check it against its evidence. Your judgment is the source of truth.</p>
          </div>
          <div className="claims-progress">
            <div className="claims-progress-num" style={{ color: canApprove ? '#3c7a64' : '#9a7426' }}>
              {verifiedCount}/{claimTotal}
            </div>
            <div className="claims-progress-label">verified</div>
          </div>
        </div>

        <div className="claims-list">
          {claims.map((c, i) => (
            <ClaimCard
              key={i}
              topic={topic}
              claim={c}
              index={i}
              open={openClaim === i}
              onToggleOpen={() => setOpenClaim((o) => (o === i ? null : i))}
              adding={addingFor === i}
              onStartAdd={() => setAddingFor(i)}
              onCancelAdd={() => setAddingFor(null)}
            />
          ))}
        </div>
      </div>

      <div className="brief-actions">
        <div className="brief-actions-row">
          <button
            className="approve-btn"
            disabled={!canApprove}
            onClick={() => actions.approve(topic.id)}
            style={{ background: canApprove ? '#3c7a64' : '#b9cdc5', cursor: canApprove ? 'pointer' : 'not-allowed' }}
          >
            <IconCheck size={15} sw={1.9} /> Approve as source of truth
          </button>
          <button className="btn btn-secondary improve-btn" onClick={startEdit}>
            Edit &amp; improve
          </button>
        </div>
        <p className="brief-hint">
          {canApprove
            ? 'All claims verified, this becomes the organization’s trusted clinical source of truth.'
            : `Verify all ${claimTotal} claims above to approve.`}{' '}
          Your responsibility ends here, you won't review blogs, videos, or social posts.
        </p>
      </div>
    </div>
  )
}

export function Review({ queue }: { queue: ScoredTopic[] }) {
  const { state } = useWorkflow()
  const current = queue.find((t) => t.id === state.reviewId) ?? queue[0]

  if (!current) {
    return (
      <div className="screen review">
        <div className="caught-up">
          <div className="caught-up-icon">
            <IconCheck size={24} color="#4f8a6b" sw={1.7} />
          </div>
          <h2>You're all caught up</h2>
          <p>
            Every knowledge brief requiring your clinical expertise has been reviewed. We'll email you when the next one is ready, no need
            to keep this open.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="screen review">
      <div className="review-grid">
        <ReviewQueue queue={queue} currentId={current.id} />
        <ReviewBrief key={current.id} topic={current} />
      </div>
    </div>
  )
}
