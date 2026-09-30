import type { CSSProperties, ReactNode } from 'react'

export interface IconProps {
  size?: number
  color?: string
  sw?: number
  fill?: string
  style?: CSSProperties
  className?: string
}

/** Builds a stroked 16×16 (or custom viewBox) line icon. */
function icon(children: ReactNode, viewBox = 16, defaults: Partial<IconProps> = {}) {
  return function Icon({ size = 16, color = 'currentColor', sw = defaults.sw ?? 1.6, fill = defaults.fill, style, className }: IconProps) {
    const filled = fill != null
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${viewBox} ${viewBox}`}
        fill={filled ? (fill === 'currentColor' ? color : fill) : 'none'}
        stroke={filled ? undefined : color}
        strokeWidth={filled ? undefined : sw}
        style={style}
        className={className}
        aria-hidden="true"
      >
        {children}
      </svg>
    )
  }
}

// ---------- Growth Hub nav ----------
export const IconPin = icon(<><path d="M8 1.5c2.4 0 4.3 1.9 4.3 4.3 0 3.1-4.3 8.2-4.3 8.2S3.7 8.9 3.7 5.8C3.7 3.4 5.6 1.5 8 1.5z" /><circle cx="8" cy="5.8" r="1.5" /></>)
export const IconUpDown = icon(<path d="M5 6.5l3-3 3 3M5 9.5l3 3 3-3" />)
export const IconSearch = icon(<><circle cx="7" cy="7" r="4.5" /><path d="M11 11l3 3" /></>)
export const IconBolt = icon(<path d="M9 1L3.5 9H7l-1 6 6.5-8.5H8.5z" />, 16, { fill: 'currentColor' })
export const IconLaunchpad = icon(<><circle cx="8" cy="8" r="6" /><path d="M8 11V5.5M5.7 7.5L8 5.2l2.3 2.3" /></>)
export const IconGrid = icon(<><rect x="2" y="2" width="5" height="5" rx="1.2" /><rect x="9" y="2" width="5" height="5" rx="1.2" /><rect x="2" y="9" width="5" height="5" rx="1.2" /><rect x="9" y="9" width="5" height="5" rx="1.2" /></>)
export const IconConversations = icon(<path d="M2.5 4.2h11v7h-6.2L4 13.3v-2.1H2.5z" />)
export const IconBook = icon(<path d="M8 4.2C7 3.3 5.5 3 3 3v8.2c2.5 0 4 .3 5 1.2M8 4.2C9 3.3 10.5 3 13 3v8.2c-2.5 0-4 .3-5 1.2M8 4.2v8.2" />)
export const IconSend = icon(<><path d="M14 2L2 7l4.5 1.8L8.5 13z" /><path d="M6.5 8.8L14 2" /></>)
export const IconCalendars = icon(<><rect x="2.5" y="3" width="11" height="10.5" rx="1.5" /><path d="M2.5 6.3h11M5.5 1.5v3M10.5 1.5v3" /></>)
export const IconContacts = icon(<><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><circle cx="6" cy="6.5" r="1.6" /><path d="M3.5 12c.6-2 4.4-2 5 0M10 5.5h2.5M10 8h2.5" /></>)
export const IconPipeline = icon(<><circle cx="4.5" cy="4" r="1.8" /><circle cx="11.5" cy="8.5" r="1.8" /><circle cx="4.5" cy="12.5" r="1.8" /><path d="M4.5 5.8v5M6.3 4h3.5M6.3 12.2h3.5" /></>)
export const IconCard = icon(<><rect x="2" y="4" width="12" height="8" rx="1.5" /><path d="M2 6.8h12" /></>)
export const IconSparkle = icon(<><path d="M8 1.5l1.2 3.1L12.3 5.8 9.2 7 8 10 6.8 7 3.7 5.8 6.8 4.6z" /><path d="M12.5 10.5l.6 1.5 1.4.6-1.4.6-.6 1.5-.6-1.5-1.4-.6 1.4-.6z" /></>, 16, { sw: 1.5 })
export const IconPlayCircle = icon(<><circle cx="8" cy="8" r="6" /><path d="M6.5 5.5l4 2.5-4 2.5z" /></>)
export const IconBrowser = icon(<><rect x="2.5" y="3" width="11" height="10" rx="1.5" /><path d="M2.5 6h11" /></>)
export const IconShield = icon(<path d="M8 1.8l4.3 1.9v3.1c0 3-2 5-4.3 6-2.3-1-4.3-3-4.3-6V3.7z" />)
export const IconMedia = icon(<><rect x="2.5" y="3" width="11" height="10" rx="1.5" /><circle cx="6" cy="6.5" r="1.3" /><path d="M3 11.5l3-2.4 2.5 1.8 2-1.4 2.5 2" /></>)
export const IconStar = icon(<path d="M8 2l1.7 3.9 4.3.4-3.2 2.8 1 4.2L8 11.7 4.2 13.3l1-4.2L2 6.3l4.3-.4z" />, 16, { sw: 1.5 })
export const IconBars = icon(<path d="M2.5 13.5V8.5M7 13.5V3M11.5 13.5V6.5" />, 16, { sw: 1.7 })
export const IconGear = icon(<><circle cx="8" cy="8" r="2.2" /><path d="M8 1.5v2.2M8 12.3v2.2M1.5 8h2.2M12.3 8h2.2M3.6 3.6l1.6 1.6M10.8 10.8l1.6 1.6M12.4 3.6l-1.6 1.6M5.2 10.8l-1.6 1.6" /></>, 16, { sw: 1.5 })
export const IconPhone = icon(<path d="M5.4 2.4c.4 1 .7 2 .7 2L5 6c.8 1.6 2.4 3.2 4 4l1.6-1.1s1 .3 2 .7c.4.1.5.5.5.9v1.9c0 .6-.5 1-1.1 1C6.4 13.4 2.6 9.6 2.4 3.6 2.4 3 2.8 2.4 3.4 2.4z" />, 16, { fill: 'currentColor' })
export const IconBell = icon(<><path d="M4 6.5a4 4 0 018 0c0 3 1 4 1 4H3s1-1 1-4z" /><path d="M6.4 13a1.6 1.6 0 003.2 0" /></>)

// ---------- General ----------
export const IconCheck = icon(<path d="M3 8.5l3 3 7-7.5" />)
export const IconArrowRight = icon(<path d="M3 8h9M8.5 4l4 4-4 4" />, 16, { sw: 1.9 })
export const IconArrowRightShort = icon(<path d="M2 8h9M8 4l4 4-4 4" />, 16, { sw: 1.7 })
export const IconPlus = icon(<path d="M8 3v10M3 8h10" />, 16, { sw: 1.9 })
export const IconChevronLeft = icon(<path d="M10 3L5 8l5 5" />, 16, { sw: 1.8 })
export const IconChevronRight = icon(<path d="M6 3l5 5-5 5" />, 16, { sw: 1.8 })
export const IconChevronDown = icon(<path d="M4 6l4 4 4-4" />, 16, { sw: 2 })
export const IconClose = icon(<path d="M4 4l8 8M12 4l-8 8" />, 16, { sw: 1.7 })
export const IconPencil = icon(<path d="M11 2l3 3-8 8H3v-3z" />, 16, { sw: 1.8 })
export const IconClock = icon(<><circle cx="8" cy="8" r="6" /><path d="M8 5v3.2l2 1.4" /></>, 16, { sw: 1.7 })
export const IconClockSmall = icon(<><circle cx="8" cy="8" r="6" /><path d="M8 5v3.3l2 1.2" /></>)
export const IconPerson = icon(<><circle cx="8" cy="5.5" r="2.5" /><path d="M3.5 13c0-2.2 2-3.6 4.5-3.6s4.5 1.4 4.5 3.6" /></>)
export const IconChat = icon(<path d="M2.5 3.5h11v7h-6.5L4 13v-2.5H2.5z" />)
export const IconShieldCheck = icon(<><path d="M8 1.8l4.5 2v3.3c0 3.2-2.1 5.3-4.5 6.3-2.4-1-4.5-3.1-4.5-6.3V3.8z" /><path d="M6 8l1.5 1.5L10.5 6" strokeWidth="1.7" /></>, 16, { sw: 1.5 })
export const IconShieldCheckAlt = icon(<><path d="M8 1.8l4.3 1.9v3.1c0 3-2 5-4.3 6-2.3-1-4.3-3-4.3-6V3.7z" /><path d="M6 8l1.5 1.5L10.5 6" strokeWidth="1.8" /></>)
export const IconShieldAlert = icon(<><path d="M8 1.6l6 3v3.2c0 3.7-2.5 6-6 7.6-3.5-1.6-6-3.9-6-7.6V4.6z" /><path d="M8 5.4v3.3" /><circle cx="8" cy="11" r=".3" fill="currentColor" /></>, 16, { sw: 1.7 })
export const IconLock = icon(<><rect x="3.3" y="7" width="9.4" height="6.7" rx="1.4" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" /></>, 16, { sw: 1.7 })
export const IconBulb = icon(<><path d="M6 12.5h4M6.5 14.5h3" /><path d="M8 1.5a4.5 4.5 0 00-2.7 8.1c.4.3.7.8.7 1.4h4c0-.6.3-1.1.7-1.4A4.5 4.5 0 008 1.5z" /></>, 16, { sw: 1.5 })
export const IconInfo = icon(<><circle cx="8" cy="8" r="6" /><path d="M8 5.2v3.3M8 10.6v.1" /></>, 16, { sw: 1.5 })
export const IconExternal = icon(<><path d="M6 3H3.5v9.5H13V10" /><path d="M9 3h4v4" /><path d="M13 3l-6 6" /></>, 16, { sw: 1.7 })
export const IconDocCheck = icon(<><path d="M4 2.5h6l2.5 2.5v9h-8.5z" /><path d="M6 8l1.3 1.3L10 6.6" /></>)
export const IconLink = icon(<path d="M6.5 9.5l3-3M5 8l-2 2a2.1 2.1 0 003 3l2-2M11 8l2-2a2.1 2.1 0 00-3-3l-2 2" />)
export const IconFormat = icon(<><rect x="2.5" y="2.5" width="11" height="11" rx="2" /><path d="M5 6h6M5 8.5h6M5 11h3.5" /></>)
export const IconFilterLines = icon(<path d="M2 4h12M4 8h8M6 12h4" />, 16, { sw: 1.7 })
export const IconFunnel = icon(<path d="M2 3h12l-4.5 5.5V13L6.5 11.5V8.5z" />, 16, { sw: 1.7 })
export const IconCalendar = icon(<><rect x="2" y="3" width="12" height="11" rx="1.5" /><path d="M2 6h12M5 1.5v3M11 1.5v3" /></>)
export const IconList = icon(<path d="M5 4h9M5 8h9M5 12h9M2 4h.01M2 8h.01M2 12h.01" />, 16, { sw: 1.8 })
export const IconImage = icon(<><rect x="2" y="3" width="12" height="10" rx="1.5" /><circle cx="6" cy="7" r="1.2" /><path d="M4 12l3-3 2 2 2-2 1 1" /></>, 16, { sw: 1.4 })
export const IconDraftStar = icon(<path d="M8 2l1.8 3.9 4.2.5-3.1 2.9.9 4.2L8 11.8 4.3 13.4l.9-4.2L2 6.3l4.2-.5z" />, 16, { sw: 1.8 })
export const IconDots = icon(<><circle cx="8" cy="3" r="1.4" /><circle cx="8" cy="8" r="1.4" /><circle cx="8" cy="13" r="1.4" /></>, 16, { fill: 'currentColor' })

// 24px icons (Transcripts screen)
export const IconSync = icon(<path d="M20 11a8 8 0 10-2.3 5.7M20 5v4h-4" strokeLinecap="round" strokeLinejoin="round" />, 24, { sw: 1.7 })
export const IconUpload = icon(<><path d="M12 15V4M8 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" strokeLinecap="round" strokeLinejoin="round" /></>, 24, { sw: 1.8 })

/** A single-path icon whose path data comes from data (evidence kinds). */
export function PathIcon({ d, size = 11, sw = 1.6, color = 'currentColor' }: { d: string; size?: number; sw?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth={sw} aria-hidden="true">
      <path d={d} />
    </svg>
  )
}
