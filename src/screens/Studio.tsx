import { useState } from 'react'
import { IconArrowRight, IconBulb, IconChevronLeft, IconInfo, IconLock, IconPlus, IconShieldCheck } from '../components/icons'
import { chStyle } from '../data/content'
import { initialsOf } from '../lib/scoring'
import { useWorkflow } from '../state/WorkflowProvider'
import type { Channel, PlanItem, PlanTier, Topic } from '../types'
import './Studio.css'

const ROLE_STYLE: Record<PlanTier, { color: string; bg: string }> = {
  high: { color: '#2c6a72', bg: '#e7f1f2' },
  support: { color: '#8a6d2e', bg: '#f6f0e2' },
  low: { color: '#7f9094', bg: '#f1f5f5' },
}

const PHASES = ['Plan content', 'Generate', 'Review & queue']

/** The editorial reasoning shown above the plan, derived from the topic's signals. */
function planStrategy(t: Topic): string {
  const { 'Content gap': gap, Anxiety: anx, Complexity: cx, 'Search demand': sd } = t.sig
  const lead =
    cx >= 55 || gap >= 70
      ? 'This topic needs room to explain, so long-form formats carry the substance'
      : 'This is a quick-answer topic, so concise formats lead and social amplifies'
  const mid =
    anx >= 70
      ? ', while video adds the human reassurance an anxious patient needs'
      : sd >= 70
        ? ', while search-facing formats capture the demand'
        : ', while lighter formats extend the reach'
  return lead + mid + '. Lower-priority channels are held back to avoid repeating content that ran recently.'
}

function TrustBar({ topic }: { topic: Topic }) {
  const claimsVerified = topic.claims?.length || topic.sources?.length || 0
  return (
    <div className="trust-bar">
      <span className="trust-lead">
        <span className="trust-lead-icon">
          <IconShieldCheck size={15} />
        </span>
        <span className="trust-lead-text">Based on an approved clinical brief</span>
      </span>
      <span className="trust-divider" />
      <span className="trust-approver">
        <span className="trust-avatar">{initialsOf(topic.approvedBy)}</span>
        <span className="trust-approver-text">
          <span className="trust-kicker">Approved by</span>
          <span className="trust-name">{topic.approvedBy}</span>
        </span>
      </span>
      <span className="trust-stat">
        <span className="trust-num">{topic.cluster}</span>
        <span className="trust-unit">source conversations</span>
      </span>
      <span className="trust-stat">
        <span className="trust-num verified">{claimsVerified}</span>
        <span className="trust-unit">claims verified</span>
      </span>
      <span className="trust-stat trust-date">
        <span className="trust-unit">Approved</span>
        <span className="trust-date-value">{topic.approvedDate}</span>
      </span>
    </div>
  )
}

function PhaseIndicator({ activeIdx }: { activeIdx: number }) {
  return (
    <div className="phases">
      {PHASES.map((label, i) => {
        const done = i < activeIdx
        const active = i === activeIdx
        return (
          <div className="phase" key={label}>
            <div className="phase-inner">
              <span
                className="phase-dot"
                style={{ background: done ? '#3c7a64' : active ? '#2f7e87' : '#e7eded', color: done || active ? '#fff' : '#9aa9ad' }}
              >
                {i + 1}
              </span>
              <span className="phase-label" style={{ color: active ? '#2f4045' : done ? '#5f7177' : '#a7b3b6' }}>
                {label}
              </span>
            </div>
            {i < PHASES.length - 1 && <span className="phase-connector" />}
          </div>
        )
      })}
    </div>
  )
}

function PlanCard({ item, onToggle }: { item: PlanItem; onToggle: () => void }) {
  const low = !item.recommended
  const role = ROLE_STYLE[item.tier]
  return (
    <div className={'plan-card' + (low ? ' is-low' : '')} style={{ borderColor: item.enabled ? '#cfe0e2' : '#eceeee' }}>
      <div className="plan-card-body">
        <div className="plan-card-head">
          <span className="plan-channel">{item.channel}</span>
          <span className="plan-role" style={{ color: role.color, background: role.bg }}>
            {item.role}
          </span>
        </div>
        <div className="plan-driver">
          {low ? <IconInfo size={13} color="#a08442" style={{ flexShrink: 0 }} /> : <IconBulb size={13} color="#2f7e87" style={{ flexShrink: 0 }} />}
          <span>{item.driver}</span>
        </div>
        <div className="plan-reason">{item.reason}</div>
      </div>
      <button
        className="toggle"
        role="switch"
        aria-checked={item.enabled}
        aria-label={item.channel}
        onClick={onToggle}
        style={{ background: item.enabled ? '#2f7e87' : '#cdd8d8' }}
      >
        <span className="toggle-knob" style={{ left: item.enabled ? 20 : 3 }} />
      </button>
    </div>
  )
}

function PlanStep({ topic }: { topic: Topic }) {
  const { actions } = useWorkflow()
  const high = topic.plan.filter((p) => p.recommended)
  const low = topic.plan.filter((p) => !p.recommended)
  const enabledCount = topic.plan.filter((p) => p.enabled).length
  const toggle = (ch: Channel) => () => actions.togglePlanChannel(topic.id, ch)

  return (
    <>
      <div className="step-head">
        <h2>Recommended content plan</h2>
        <p>The system recommends where this topic earns its keep. You make the final editorial call, toggle channels on or off.</p>
      </div>

      <div className="strategy">
        <span className="strategy-icon">
          <IconBulb size={16} />
        </span>
        <div>
          <div className="strategy-kicker">STRATEGY</div>
          <div className="strategy-text">{planStrategy(topic)}</div>
        </div>
      </div>

      <div className="plan-group-head">
        <span className="plan-group-dot" style={{ background: '#2f7e87' }} />
        <span className="plan-group-title">High-value formats</span>
        <span className="plan-group-hint">where this topic works hardest</span>
      </div>
      <div className="plan-grid">
        {high.map((p) => (
          <PlanCard key={p.channel} item={p} onToggle={toggle(p.channel)} />
        ))}
      </div>

      {low.length > 0 && (
        <>
          <div className="plan-group-head is-low">
            <span className="plan-group-dot" style={{ background: '#c3cfcf' }} />
            <span className="plan-group-title">Lower priority right now</span>
            <span className="plan-group-hint">off by default · turn on if you disagree</span>
          </div>
          <div className="plan-grid">
            {low.map((p) => (
              <PlanCard key={p.channel} item={p} onToggle={toggle(p.channel)} />
            ))}
          </div>
        </>
      )}

      <div className="plan-footer">
        <div className="plan-footer-text">
          <b>{enabledCount} assets</b> will be generated from this approved knowledge brief.
        </div>
        <button className="btn btn-primary plan-generate" onClick={() => actions.generateAssets(topic.id)} disabled={enabledCount === 0}>
          <IconPlus size={14} /> Generate {enabledCount} assets
        </button>
      </div>
    </>
  )
}

function AssetsStep({ topic }: { topic: Topic }) {
  const { actions } = useWorkflow()
  const [editing, setEditing] = useState<Channel | null>(null)
  const [draft, setDraft] = useState('')
  const assets = topic.assets ?? []
  const draftCount = assets.filter((a) => a.status !== 'published').length

  return (
    <>
      <div className="step-head">
        <h2>Drafts in the clinician's voice</h2>
        <p>Each draft reframes the clinician's own answer for its channel, same voice, right length and tone. Edit before publishing.</p>
      </div>
      <div className="asset-list">
        {assets.map((a) => {
          const isPub = a.status === 'published'
          const isEditing = editing === a.channel
          const ch = chStyle(a.channel)
          return (
            <div className="asset-card" key={a.channel}>
              <div className="asset-head">
                <span className="asset-channel" style={{ color: ch.chColor, background: ch.chBg }}>
                  {a.channel}
                </span>
                <span className="asset-status" style={{ color: isPub ? '#3c7a64' : '#9a7426' }}>
                  <span className="asset-status-dot" style={{ background: isPub ? '#4f8a6b' : '#b08a3e' }} />
                  {isPub ? 'Published' : 'Draft'}
                </span>
                <div className="asset-actions">
                  {!isPub && !isEditing && (
                    <button
                      className="btn btn-secondary asset-edit"
                      onClick={() => {
                        setEditing(a.channel)
                        setDraft(a.body)
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
              {isEditing ? (
                <>
                  <textarea className="asset-textarea" value={draft} onChange={(e) => setDraft(e.target.value)} />
                  <div className="asset-edit-actions">
                    <button
                      className="btn btn-primary asset-save"
                      onClick={() => {
                        actions.updateAsset(topic.id, a.channel, draft)
                        setEditing(null)
                      }}
                    >
                      Save
                    </button>
                    <button className="btn btn-ghost asset-save" onClick={() => setEditing(null)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="asset-body">{a.body}</div>
              )}
            </div>
          )
        })}
      </div>
      {draftCount > 0 && (
        <div className="asset-send">
          <button className="btn btn-success asset-send-btn" onClick={() => actions.sendToPublisher(topic.id)}>
            Send {draftCount} to publishing queue
            <IconArrowRight size={15} />
          </button>
        </div>
      )}
    </>
  )
}

export function Studio({ topic }: { topic: Topic }) {
  const { state, actions } = useWorkflow()
  const isPlan = state.studioStep === 'plan'

  return (
    <div className="screen studio">
      <button className="studio-back" onClick={() => actions.navigate('feed')}>
        <IconChevronLeft size={14} /> Back to opportunities
      </button>

      <TrustBar topic={topic} />
      <PhaseIndicator activeIdx={isPlan ? 0 : 2} />

      <div className="source-card">
        <div className="source-card-head">
          <span className="source-card-icon">
            <IconShieldCheck size={16} />
          </span>
          <div className="source-card-heading">
            <div className="source-card-kicker">Clinician-approved source of truth</div>
            <div className="source-card-sub">Every asset below is generated from this brief and inherits its approval.</div>
          </div>
          <span className="source-card-lock">
            <IconLock size={11} />
            Locked
          </span>
        </div>
        <h1 className="source-card-title">{topic.title}</h1>
        <p className="source-card-answer">“{topic.answer}”</p>
      </div>

      {isPlan ? <PlanStep topic={topic} /> : <AssetsStep key={topic.id} topic={topic} />}
    </div>
  )
}
