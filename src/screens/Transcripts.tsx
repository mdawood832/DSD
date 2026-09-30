import { useState, type DragEvent } from 'react'
import { IconArrowRight, IconBook, IconCheck, IconSync, IconUpload } from '../components/icons'
import { CLINICIAN } from '../data/content'
import { PRIORITY_STYLE, type ScoredTopic } from '../lib/scoring'
import { useWorkflow } from '../state/WorkflowProvider'
import './Transcripts.css'

const STEP_LABELS = (count: number) => [
  'Transcribing ' + count + ' new conversations',
  'Clustering recurring patient questions',
  'Scoring frequency, anxiety & content-gap signals',
  'Ranking the strongest opportunities',
]

export function Transcripts({ reviewQueue }: { reviewQueue: ScoredTopic[] }) {
  const { state, actions } = useWorkflow()
  const { ingestPhase, ingestStep, ingestCount, ingestFiles } = state
  const [dragging, setDragging] = useState(false)

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    actions.startIngest(e.dataTransfer?.files?.length || ingestFiles)
  }

  return (
    <div className="screen transcripts">
      <div className="intake-eyebrow">
        <span>INTAKE</span>
        <span className="dot-sep" />
      </div>
      <h2 className="intake-title">This week’s transcripts are in</h2>
      <p className="intake-lede">
        Patient conversations sync automatically from your call system every week. The system clusters them into prioritized content
        opportunities, no manual upload required.
      </p>

      {ingestPhase === 'idle' && (
        <>
          <div className="sync-card">
            <span className="sync-icon">
              <IconSync size={26} color="#2f7e87" />
            </span>
            <div className="sync-body">
              <div className="sync-title-row">
                <span className="sync-title">Weekly transcripts synced</span>
                <span className="live-pill">
                  <span className="live-dot" />
                  Live
                </span>
              </div>
              <div className="sync-meta">
                ~{ingestCount} conversations · {ingestFiles} exports from your call system · synced Mon, Jun 30 at 7:00 AM
              </div>
            </div>
          </div>

          <div className="backup">
            <div className="backup-label">Backup · manual upload</div>
            <div
              className={'dropzone' + (dragging ? ' is-dragging' : '')}
              role="button"
              tabIndex={0}
              onClick={() => actions.startIngest(ingestFiles)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && actions.startIngest(ingestFiles)}
              onDrop={onDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setDragging(false)
              }}
            >
              <span className="dropzone-icon">
                <IconUpload size={19} color="#7a8d91" />
              </span>
              <div>
                <div className="dropzone-title">Need to add transcripts between syncs?</div>
                <div className="dropzone-hint">
                  Drag &amp; drop or <span className="dropzone-browse">browse</span> · .txt, .csv, .vtt exports
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {ingestPhase === 'processing' && (
        <div className="processing-card">
          <div className="processing-head">
            <span className="spinner" />
            <div>
              <div className="processing-title">The system is clustering and prioritizing the strongest content opportunities</div>
              <div className="processing-sub">
                Analyzing {ingestCount} conversations from {ingestFiles} exports
              </div>
            </div>
          </div>
          <div className="processing-steps">
            {STEP_LABELS(ingestCount).map((label, i) => {
              const n = i + 1
              const done = n < 4 ? ingestStep > n : false
              const active = ingestStep === n
              return (
                <div className="processing-step" key={label}>
                  <span
                    className="step-dot"
                    style={{ background: done ? '#3c7a64' : active ? '#2f7e87' : '#e7eded', color: done || active ? '#fff' : '#b7c4c4' }}
                  >
                    {done && <IconCheck size={12} sw={2.4} />}
                    {active && <span className="step-pulse" />}
                  </span>
                  <span style={{ fontWeight: active ? 600 : 500, color: done || active ? '#2f4045' : '#9fb0b0' }}>{label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {ingestPhase === 'done' && (
        <div className="done">
          <div className="done-banner">
            <span className="done-check">
              <IconCheck size={15} color="#fff" sw={2.4} />
            </span>
            <div>
              <div className="done-title">Found {reviewQueue.length} new content opportunities</div>
              <div className="done-sub">Clustered and prioritized from {ingestCount} conversations this cycle.</div>
            </div>
          </div>

          <div className="found-list">
            {reviewQueue.map((t) => {
              const p = PRIORITY_STYLE[t.pri]
              return (
                <div className="found-row" key={t.id}>
                  <span className="found-pri" style={{ color: p.color, background: p.bg }}>
                    {p.label}
                  </span>
                  <span className="found-title">{t.title}</span>
                  <span className="found-count">{t.cluster} conversations</span>
                </div>
              )
            })}
          </div>

          <div className="handoff-banner">
            <span className="handoff-icon">
              <IconBook size={16} sw={1.7} />
            </span>
            <div>
              <div className="handoff-title">Sent to {CLINICIAN.name} for clinical approval</div>
              <div className="handoff-sub">Each opportunity needs a clinician to confirm the source of truth before content is created.</div>
            </div>
          </div>

          <div className="done-actions">
            <button className="btn btn-primary done-btn" onClick={() => actions.navigate('feed')}>
              Go to opportunities
              <IconArrowRight size={15} />
            </button>
            <button className="btn btn-secondary done-btn" onClick={actions.resetIngest}>
              Add another batch
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
