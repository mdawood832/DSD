import { useMemo } from 'react'
import {
  IconArrowRightShort,
  IconCalendar,
  IconChevronDown,
  IconClockSmall,
  IconDots,
  IconDraftStar,
  IconFilterLines,
  IconFunnel,
  IconImage,
  IconList,
  IconPlus,
  IconSearch,
} from '../components/icons'
import { CLINICIAN, CONTENT_MANAGER, PERF_ROWS, SCHEDULED_POSTS, SOCIAL_ACCOUNTS, STAT_KPIS } from '../data/content'
import { truncate } from '../lib/scoring'
import { useWorkflow } from '../state/WorkflowProvider'
import type { Platform } from '../types'
import './Publisher.css'

interface PublisherRow {
  id: string
  caption: string
  platform: Platform
  type: string
  draft: boolean
  dateBig: string
  dateSub: string
  ownerTip: string
  audit: string
}

const truncCaption = (s: string) => truncate(s, 62, 60)

function useRows(): PublisherRow[] {
  const { state } = useWorkflow()
  return useMemo(() => {
    const drafts: PublisherRow[] = state.publisherDrafts.map((d) => ({
      id: d.id,
      caption: truncCaption(d.caption),
      platform: d.platform,
      type: d.type,
      draft: true,
      dateBig: 'Not scheduled',
      dateSub: 'Set a date to publish',
      ownerTip: `Owned by ${CONTENT_MANAGER.name} · approved by ${CLINICIAN.name}`,
      audit: `Approved by ${CLINICIAN.name} · drafted by ${CONTENT_MANAGER.name}`,
    }))
    const scheduled: PublisherRow[] = SCHEDULED_POSTS.map((p, i) => ({
      id: 'sch-' + i,
      caption: truncCaption(p.caption),
      platform: p.platform,
      type: 'Post composer',
      draft: false,
      dateBig: p.dateBig,
      dateSub: p.dateSub,
      ownerTip: `Scheduled by ${CONTENT_MANAGER.name}`,
      audit: `Scheduled by ${CONTENT_MANAGER.name}`,
    }))
    return [...drafts, ...scheduled]
  }, [state.publisherDrafts])
}

function ContentTab() {
  const rows = useRows()
  const draftCount = rows.filter((r) => r.draft).length

  return (
    <>
      <div className="pub-toolbar">
        <button className="pub-tool">
          <IconFilterLines size={13} color="#7f9094" />
          Filter views: <b>All</b>
        </button>
        <button className="pub-tool">
          <IconFunnel size={13} color="#7f9094" />
          Filters
        </button>
        <div className="pub-date">
          <IconCalendar size={13} color="#7f9094" />
          07 / 01 / 2026
        </div>
        <span className="pub-arrow">→</span>
        <div className="pub-date">
          <IconCalendar size={13} color="#7f9094" />
          07 / 31 / 2026
        </div>

        <div className="pub-accounts">
          <div className="pub-account-stack">
            {SOCIAL_ACCOUNTS.map((acc) => (
              <span key={acc.name} title={acc.name} className="pub-account" style={{ background: acc.color }}>
                {acc.ini}
              </span>
            ))}
          </div>
          <span className="pub-accounts-label">All accounts</span>
          <IconChevronDown size={12} color="#7f9094" />
        </div>

        <div className="pub-spacer" />

        <div className="pub-viewswitch">
          <span className="pub-view is-active">
            <IconList size={14} color="#2f7e87" />
          </span>
          <span className="pub-view">
            <IconCalendar size={14} color="#9fb0b0" />
          </span>
        </div>
        <div className="pub-search">
          <IconSearch size={14} color="#9fb0b0" sw={1.7} />
          <span>Search by caption (min 3 chars)</span>
        </div>
      </div>

      <div className="pub-table">
        <div className="pub-grid pub-table-head">
          <span className="pub-checkbox" />
          <span>Caption</span>
          <span>Media</span>
          <span>Status</span>
          <span>Type</span>
          <span>Date</span>
          <span>Owner</span>
          <span />
        </div>

        {draftCount > 0 && (
          <div className="pub-draft-banner">
            <IconDraftStar size={14} color="#9a7426" />
            <span>
              <b>{draftCount} drafts from Content Studio</b>
            </span>
          </div>
        )}

        {rows.map((row) => (
          <div className={'pub-grid pub-row' + (row.draft ? ' is-draft' : '')} key={row.id}>
            <span className="pub-checkbox" />
            <div className="pub-caption">
              <div className="pub-caption-text">{row.caption}</div>
              <div className="pub-audit">
                <IconClockSmall size={11} color="#a9b7b7" />
                {row.audit}
              </div>
            </div>
            <span className="pub-media">
              <IconImage size={18} color="#a9b7b7" />
            </span>
            <span className={'pub-status' + (row.draft ? ' is-draft' : '')}>
              <IconCalendar size={12} sw={1.7} />
              {row.draft ? 'Draft' : 'Scheduled'}
            </span>
            <span className="pub-type">{row.type}</span>
            <span>
              <span className="pub-date-big">{row.dateBig}</span>
              <span className="pub-date-sub">{row.dateSub}</span>
            </span>
            <span className="pub-owner" title={row.ownerTip}>
              <span className="pub-owner-avatar">{CONTENT_MANAGER.initials}</span>
              <span className="pub-owner-platform" title={row.platform.name} style={{ background: row.platform.color }}>
                {row.platform.ini}
              </span>
            </span>
            <span className="pub-more">
              <IconDots size={16} />
            </span>
          </div>
        ))}

        <div className="pub-footer">
          <span className="pub-muted">
            1 to {rows.length} of {rows.length} results
          </span>
          <div className="pub-pagination">
            <span className="pub-muted">Rows per page</span>
            <span className="pub-perpage">
              25
              <IconChevronDown size={11} color="#7f9094" />
            </span>
            <div className="pub-pages">
              <span className="pub-prev">Previous</span>
              <span className="pub-page">1</span>
              <span className="pub-next">Next</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const consultStyle = (n: number) => (n >= 18 ? ['#bf5a30', '#f7ece6'] : n >= 12 ? ['#9a7426', '#f6f0e2'] : ['#5f7177', '#eef2f2'])

function StatsTab() {
  return (
    <div className="stats">
      <div className="stats-intro">
        <div>
          <div className="stats-title">Content performance</div>
          <div className="stats-sub">
            How published content is performing by knowledge brief, and how those results feed back into what gets prioritized next.
          </div>
        </div>
        <div className="pub-date">
          <IconCalendar size={13} color="#7f9094" />
          Last 30 days
        </div>
      </div>

      <div className="kpi-grid">
        {STAT_KPIS.map((kpi) => (
          <div className="kpi" key={kpi.label}>
            <div className="kpi-head">
              <span className="kpi-icon" style={{ background: kpi.iconBg, color: kpi.iconColor }}>
                {kpi.glyph}
              </span>
              <span className="kpi-label">{kpi.label}</span>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-delta">
              {kpi.delta} <span>vs. prior 30d</span>
            </div>
          </div>
        ))}
      </div>

      <div className="perf">
        <div className="perf-title-row">
          <span className="perf-title">Performance by knowledge brief</span>
          <span className="perf-rank">Ranked by consults booked</span>
        </div>
        <div className="perf-grid perf-head">
          <span>Source brief</span>
          <span>Views</span>
          <span>Search lift</span>
          <span>Engagement</span>
          <span>Consults booked</span>
        </div>
        {PERF_ROWS.map((p) => {
          const [color, bg] = consultStyle(p.consults)
          return (
            <div className="perf-grid perf-row" key={p.topic}>
              <div className="perf-topic-cell">
                <div className="perf-topic">{p.topic}</div>
                <div className="perf-channels">{p.channels}</div>
                {p.followUp && (
                  <div className="perf-followup">
                    <IconArrowRightShort size={13} color="#2c6a72" style={{ flexShrink: 0 }} />
                    <span>
                      <b>Recommended follow-up:</b> {p.followUp}
                    </span>
                  </div>
                )}
              </div>
              <span className="perf-num">{p.views}</span>
              <span className="perf-num search">{p.search}</span>
              <span className="perf-num engage">{p.engage}</span>
              <span className="perf-num">
                <span className="perf-consults" style={{ color, background: bg }}>
                  {p.consults}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Publisher() {
  const { state, actions } = useWorkflow()
  const isStats = state.pubTab === 'stats'

  return (
    <div className="screen publisher">
      <div className="pub-header">
        <div className="pub-tabs">
          <button className={'pub-tab' + (!isStats ? ' is-active' : '')} onClick={() => actions.setPubTab('content')}>
            Content
            {!isStats && <span className="feature-tab-underline" />}
          </button>
          <button className={'pub-tab' + (isStats ? ' is-active' : '')} onClick={() => actions.setPubTab('stats')}>
            Statistics
            {isStats && <span className="feature-tab-underline" />}
          </button>
          <button className="pub-tab">Social Listening</button>
          <button className="pub-tab">Settings</button>
        </div>
        <div className="pub-header-actions">
          <button className="btn btn-secondary pub-header-btn">
            <IconPlus size={13} />
            Socials
          </button>
          <button className="btn btn-primary pub-header-btn">
            <IconPlus size={13} />
            New Post
          </button>
        </div>
      </div>

      {isStats ? <StatsTab /> : <ContentTab />}
    </div>
  )
}
