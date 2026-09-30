import { IconChevronDown, IconConversations, IconDocCheck, IconFilterLines, IconLink, IconSearch, IconShieldCheckAlt } from '../components/icons'
import { CHANNEL_SHORT } from '../data/content'
import { initialsOf, STATUS_STYLE, truncate } from '../lib/scoring'
import { useWorkflow } from '../state/WorkflowProvider'
import type { Topic } from '../types'
import './Library.css'

function BriefCard({ topic, onOpen }: { topic: Topic; onOpen?: () => void }) {
  const status = STATUS_STYLE[topic.status]
  const assets = topic.assets ?? []
  const claimEvidence = (topic.claims ?? []).flatMap((c) => c.evidence)
  const evidenceCount = (claimEvidence.length ? claimEvidence : (topic.sources ?? [])).length

  return (
    <div
      className={'lib-card' + (onOpen ? ' is-clickable' : '')}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen?.()}
    >
      <div className="lib-card-banner">
        <IconShieldCheckAlt size={13} color="#2c6a72" />
        <span className="lib-card-verified">Clinician-verified</span>
        <span className="lib-spacer" />
        <span className="lib-card-status" style={{ color: status.color, background: status.bg }}>
          {status.label}
        </span>
      </div>

      <div className="lib-card-body">
        <h3>{topic.title}</h3>
        <div className="lib-card-audience">For {topic.audience}</div>
        <p className="lib-card-answer">“{truncate(topic.answer, 150)}”</p>
      </div>

      <div className="lib-card-stats">
        <div className="lib-card-stat">
          <div className="lib-card-stat-top">
            <IconConversations size={13} color="#8aa0a3" />
            <span className="lib-card-stat-big">{topic.cluster}</span>
          </div>
          <div className="lib-card-stat-label">source conversations</div>
        </div>
        <div className="lib-card-stat">
          <div className="lib-card-stat-top">
            <IconDocCheck size={13} color="#8aa0a3" />
            <span className="lib-card-stat-mid">{evidenceCount > 0 ? evidenceCount + ' cited' : 'Verified'}</span>
          </div>
          <div className="lib-card-stat-label">clinical evidence</div>
        </div>
      </div>

      <div className="lib-card-approver">
        <span className="lib-card-avatar">{initialsOf(topic.approvedBy)}</span>
        <div className="lib-card-approver-text">
          <div className="lib-muted">Approved by</div>
          <div className="lib-card-approver-name">{topic.approvedBy ?? 'Pending'}</div>
        </div>
        <span className="lib-card-updated">
          <span className="lib-muted">Updated</span>
          <span className="lib-card-updated-date">{topic.approvedDate ?? '–'}</span>
        </span>
      </div>

      <div className="lib-card-assets">
        <div className="lib-card-assets-head">
          <IconLink size={12} color="#8aa0a3" />
          <span>{assets.length > 0 ? `${assets.length} linked asset${assets.length === 1 ? '' : 's'}` : 'Linked assets'}</span>
        </div>
        {assets.length > 0 ? (
          <div className="lib-chips">
            {assets.map((a) => (
              <span className="lib-chip" key={a.channel}>
                <span className="lib-chip-dot" style={{ background: a.status === 'published' ? '#3c7a64' : '#c2a24a' }} />
                {CHANNEL_SHORT[a.channel]}
              </span>
            ))}
          </div>
        ) : (
          <span className="lib-empty">Ready to produce. No assets generated yet.</span>
        )}
      </div>
    </div>
  )
}

/** Clinicians can browse the library but don't open briefs into Content Studio. */
export function Library({ briefs, canOpen }: { briefs: Topic[]; canOpen: boolean }) {
  const { actions } = useWorkflow()
  const stats = [
    { value: briefs.length, label: 'Approved knowledge briefs' },
    { value: briefs.filter((b) => b.status === 'published').length, label: 'Published to channels' },
    { value: briefs.reduce((n, b) => n + b.cluster, 0), label: 'Patient conversations covered' },
  ]

  return (
    <div className="screen library">
      <div className="lib-lead">
        <div className="lib-lead-text">
          <div className="lib-lead-pill">
            <IconShieldCheckAlt size={14} color="#8ed0d6" />
            <span>Clinical source of truth</span>
          </div>
          <h2>Knowledge Library</h2>
          <p>Clinically verified briefs, ready to reuse for content across any channel.</p>
        </div>
        <div className="lib-stats">
          {stats.map((s) => (
            <div className="lib-stat" key={s.label}>
              <div className="lib-stat-value">{s.value}</div>
              <div className="lib-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="lib-toolbar">
        <div className="lib-search">
          <IconSearch size={14} color="#9fb0b0" sw={1.7} />
          <span>Search briefs by question or topic</span>
        </div>
        <div className="lib-filter">
          <IconFilterLines size={13} color="#7f9094" />
          <span className="lib-filter-label">Filter:</span>
          <span className="lib-filter-value">All briefs</span>
          <IconChevronDown size={12} color="#7f9094" />
        </div>
      </div>

      <div className="lib-grid">
        {briefs.map((b) => (
          <BriefCard key={b.id} topic={b} onOpen={canOpen ? () => actions.openStudio(b.id) : undefined} />
        ))}
      </div>
    </div>
  )
}
