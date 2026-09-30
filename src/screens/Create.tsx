import { IconChevronRight } from '../components/icons'
import { PRIORITY_STYLE, SIGNAL_BARS, type ScoredTopic } from '../lib/scoring'
import { useWorkflow } from '../state/WorkflowProvider'
import './Create.css'

const RING_R = 20
const RING_C = 2 * Math.PI * RING_R

function ScoreRing({ score, color }: { score: number; color: string }) {
  return (
    <div className="score-ring">
      <svg width="50" height="50" viewBox="0 0 50 50" aria-hidden="true">
        <circle cx="25" cy="25" r={RING_R} fill="none" stroke="#eef2f2" strokeWidth="4.5" />
        <circle
          cx="25"
          cy="25"
          r={RING_R}
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={`${((score / 100) * RING_C).toFixed(1)} ${RING_C.toFixed(1)}`}
          transform="rotate(-90 25 25)"
        />
      </svg>
      <div className="score-ring-value">{score}</div>
    </div>
  )
}

function OpportunityCard({ topic, onOpen }: { topic: ScoredTopic; onOpen: () => void }) {
  return (
    <div className="opp-card" role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => e.key === 'Enter' && onOpen()}>
      <ScoreRing score={topic.score} color={PRIORITY_STYLE[topic.pri].ring} />
      <div className="opp-main">
        <div className="opp-title">{topic.title}</div>
        <div className="opp-why">{topic.why}</div>
        <div className="opp-meta">
          <span>
            <b>{topic.cluster}</b> conversations
          </span>
          <span>
            Audience: <b>{topic.audience}</b>
          </span>
          <span>{topic.existing}</span>
        </div>
      </div>
      <div className="opp-signals">
        {SIGNAL_BARS.map((bar) => {
          const v = topic.sig[bar.key]
          return (
            <div className="signal-row" key={bar.key}>
              <span className="signal-label">{bar.label}</span>
              <div className="signal-track">
                <div className="signal-fill" style={{ width: v + '%', background: bar.color }} />
              </div>
              <span className="signal-val" style={{ color: v >= 72 ? '#2f4045' : '#8a9a9e' }}>
                {v}
              </span>
            </div>
          )
        })}
      </div>
      <IconChevronRight size={16} color="#c3cfcf" style={{ flexShrink: 0 }} />
    </div>
  )
}

export function Create({ queue }: { queue: ScoredTopic[] }) {
  const { actions } = useWorkflow()
  return (
    <div className="screen create">
      <div className="create-head">
        <h2>Open a topic to create and publish its content</h2>
        <div className="create-count">
          <span>{queue.length} knowledge opportunities</span>
          <span className="dot-sep" />
          <span>Sorted by priority score</span>
        </div>
      </div>
      <p className="create-hint">Approved knowledge ranked by composite priority. Open one to see its recommended content plan.</p>

      <div className="opp-list">
        {queue.map((t) => (
          <OpportunityCard key={t.id} topic={t} onOpen={() => actions.openStudio(t.id)} />
        ))}
      </div>
    </div>
  )
}
