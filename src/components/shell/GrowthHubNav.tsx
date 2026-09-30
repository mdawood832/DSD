import type { ComponentType } from 'react'
import {
  IconBars,
  IconBolt,
  IconBook,
  IconBrowser,
  IconCalendars,
  IconCard,
  IconContacts,
  IconConversations,
  IconGear,
  IconGrid,
  IconLaunchpad,
  IconMedia,
  IconPin,
  IconPipeline,
  IconPlayCircle,
  IconSearch,
  IconSend,
  IconShield,
  IconSparkle,
  IconStar,
  IconUpDown,
  type IconProps,
} from '../icons'
import './shell.css'

interface NavItemProps {
  icon: ComponentType<IconProps>
  label: string
  active?: boolean
  badge?: string
  onClick?: () => void
}

function NavItem({ icon: Icon, label, active, badge, onClick }: NavItemProps) {
  return (
    <div className={'gh-nav-item' + (active ? ' is-active' : '')} onClick={onClick} role={onClick ? 'button' : undefined}>
      <Icon size={17} />
      <span className="gh-nav-label">{label}</span>
      {badge && <span className="gh-nav-badge">{badge}</span>}
    </div>
  )
}

/**
 * The host CRM's left navigation. This is mock context for the prototype;
 * in production the CRM renders this and the Knowledge feature lives in the content area.
 */
export function GrowthHubNav({ activeSection, onKnowledge, onMarketing }: { activeSection: 'knowledge' | 'marketing'; onKnowledge: () => void; onMarketing: () => void }) {
  return (
    <aside className="gh-nav">
      <div className="gh-brand">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
          <rect x="2.5" y="7.5" width="11" height="11" rx="2.5" stroke="#2f7e87" strokeWidth="2.4" />
          <rect x="9.5" y="2.5" width="13.5" height="13.5" rx="3" fill="#1b2733" stroke="#d6e3e4" strokeWidth="2.4" />
        </svg>
        <span>Growth Hub</span>
      </div>

      <div className="gh-top">
        <div className="gh-account">
          <span className="gh-account-icon">
            <IconPin size={13} color="#fff" />
          </span>
          <div className="gh-account-text">
            <div className="gh-account-name">Tanglewood Dental …</div>
            <div className="gh-account-loc">Houston, Texas</div>
          </div>
          <IconUpDown size={13} color="#8295a6" />
        </div>
        <div className="gh-search-row">
          <div className="gh-search">
            <IconSearch size={14} color="#8295a6" sw={1.7} />
            <span className="gh-search-label">Search</span>
            <span className="gh-kbd">⌘K</span>
          </div>
          <button className="gh-quick" aria-label="Quick actions">
            <IconBolt size={15} color="#fff" />
          </button>
        </div>
      </div>

      <div className="gh-items">
        <NavItem icon={IconLaunchpad} label="Launchpad" />
        <NavItem icon={IconGrid} label="Dashboard" />
        <NavItem icon={IconConversations} label="Conversations" />
        <NavItem icon={IconBook} label="Knowledge" badge="NEW" active={activeSection === 'knowledge'} onClick={onKnowledge} />
        <NavItem icon={IconSend} label="Marketing" active={activeSection === 'marketing'} onClick={onMarketing} />
        <NavItem icon={IconCalendars} label="Calendars" />
        <NavItem icon={IconContacts} label="Contacts" />
        <NavItem icon={IconPipeline} label="Opportunities" />
        <NavItem icon={IconCard} label="Payments" />
        <div className="gh-divider" />
        <NavItem icon={IconSparkle} label="AI Agents" />
        <NavItem icon={IconPlayCircle} label="Automation" />
        <NavItem icon={IconBrowser} label="Sites" />
        <NavItem icon={IconShield} label="Memberships" />
        <NavItem icon={IconMedia} label="Media Storage" />
        <NavItem icon={IconStar} label="Reputation" />
        <NavItem icon={IconBars} label="Reporting" />
      </div>

      <div className="gh-bottom">
        <NavItem icon={IconGrid} label="App Marketplace" />
        <NavItem icon={IconGear} label="Settings" />
      </div>
    </aside>
  )
}
