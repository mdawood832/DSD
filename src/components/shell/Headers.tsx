import { IconBell, IconBook, IconPhone, IconSend } from '../icons'
import './shell.css'

/** Growth Hub's global top bar. Clicking the avatar switches between the two demo roles. */
export function TopBar({ initials, toggleTitle, onToggleRole }: { initials: string; toggleTitle: string; onToggleRole: () => void }) {
  return (
    <header className="gh-topbar">
      <span className="gh-topbar-call">
        <IconPhone size={16} color="#fff" />
      </span>
      <span className="gh-topbar-bell">
        <IconBell size={17} color="#f97316" />
        <span className="gh-topbar-bell-dot" />
      </span>
      <button className="gh-topbar-avatar" title={toggleTitle} onClick={onToggleRole}>
        {initials}
      </button>
    </header>
  )
}

export interface FeatureTab {
  label: string
  active: boolean
  badge?: number
  onClick: () => void
}

/** The Knowledge feature's header and sub-navigation. */
export function FeatureHeader({ subtitle, transcriptCount, tabs }: { subtitle: string; transcriptCount: string; tabs: FeatureTab[] }) {
  return (
    <div className="feature-header">
      <div className="feature-header-row">
        <div className="feature-title-group">
          <span className="feature-icon">
            <IconBook size={19} color="#2f7e87" />
          </span>
          <div>
            <div className="feature-title">Knowledge Workflow</div>
            <div className="feature-sub">{subtitle}</div>
          </div>
        </div>
        <div className="feature-cycle">
          <span className="feature-cycle-dot" />
          <span>{transcriptCount} transcripts this cycle</span>
        </div>
      </div>
      <nav className="feature-tabs">
        {tabs.map((tab) => (
          <button key={tab.label} className="feature-tab" style={{ color: tab.active ? '#2f7e87' : '#43555a' }} onClick={tab.onClick}>
            {tab.label}
            {tab.badge ? <span className="feature-tab-badge">{tab.badge}</span> : null}
            {tab.active && <span className="feature-tab-underline" />}
          </button>
        ))}
      </nav>
    </div>
  )
}

export function MarketingHeader() {
  return (
    <div className="feature-header marketing">
      <div className="feature-title-group">
        <span className="feature-icon">
          <IconSend size={19} color="#2f7e87" />
        </span>
        <div>
          <div className="feature-title">Marketing</div>
          <div className="feature-sub">Publish approved knowledge across every channel</div>
        </div>
      </div>
    </div>
  )
}
