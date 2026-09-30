import { useMemo } from 'react'
import { GrowthHubNav } from './components/shell/GrowthHubNav'
import { FeatureHeader, MarketingHeader, TopBar, type FeatureTab } from './components/shell/Headers'
import { Toast } from './components/Toast'
import { CLINICIAN, CONTENT_MANAGER } from './data/content'
import { scoreTopic } from './lib/scoring'
import { Create } from './screens/Create'
import { Library } from './screens/Library'
import { Publisher } from './screens/Publisher'
import { Review } from './screens/Review'
import { Settings } from './screens/Settings'
import { Studio } from './screens/Studio'
import { Transcripts } from './screens/Transcripts'
import { useWorkflow } from './state/WorkflowProvider'
import type { Screen } from './types'
import './App.css'

const SUBTITLES: Record<Exclude<Screen, 'publisher' | 'review'>, string> = {
  ingest: 'Add this cycle’s conversations, the system clusters and prioritizes opportunities',
  feed: 'Clinician-approved knowledge, prioritized for content production',
  studio: 'Turn one approved brief into consistent multi-channel content',
  library: 'Clinician-approved knowledge, prioritized for content production',
  config: 'Configure how the system groups, writes, and formats knowledge for your brand',
}

export default function App() {
  const { state, actions, scrollRef } = useWorkflow()
  const { role, screen } = state
  const isClinician = role === 'clinician'

  const { reviewQueue, contentQueue, briefs } = useMemo(() => {
    const scored = state.topics.map(scoreTopic)
    const byScore = (a: { score: number }, b: { score: number }) => b.score - a.score
    const inStatus = (...s: string[]) => scored.filter((t) => s.includes(t.status))
    return {
      reviewQueue: inStatus('clinical_review').sort(byScore),
      contentQueue: inStatus('approved', 'planned', 'published').sort(byScore),
      briefs: [...inStatus('approved'), ...inStatus('planned'), ...inStatus('published')],
    }
  }, [state.topics])

  const studioTopic = state.topics.find((t) => t.id === state.studioId) ?? briefs[0]

  const subtitle =
    screen === 'review'
      ? isClinician
        ? 'Verify medical accuracy, approve or improve each brief'
        : 'Recommendations in clinical approval'
      : screen === 'publisher'
        ? ''
        : SUBTITLES[screen]

  const go = (s: Screen) => () => actions.navigate(s)
  const tabs: FeatureTab[] = isClinician
    ? [
        { label: 'Review', active: screen === 'review', badge: reviewQueue.length, onClick: go('review') },
        { label: 'Library', active: screen === 'library', onClick: go('library') },
      ]
    : [
        { label: 'Create', active: screen === 'feed' || screen === 'studio', onClick: go('feed') },
        { label: 'Library', active: screen === 'library', onClick: go('library') },
        { label: 'Transcripts', active: screen === 'ingest', onClick: go('ingest') },
        { label: 'Settings', active: screen === 'config', onClick: go('config') },
      ]

  const identity = isClinician ? CLINICIAN : CONTENT_MANAGER

  return (
    <div className="app">
      <GrowthHubNav
        activeSection={screen === 'publisher' ? 'marketing' : 'knowledge'}
        onKnowledge={go(isClinician ? 'review' : 'feed')}
        onMarketing={go('publisher')}
      />

      <main className="app-main">
        <TopBar
          initials={identity.initials}
          toggleTitle={isClinician ? 'Switch to Content Mgr' : 'Switch to Clinician'}
          onToggleRole={actions.toggleRole}
        />

        {screen === 'publisher' ? <MarketingHeader /> : <FeatureHeader subtitle={subtitle} transcriptCount="1,284" tabs={tabs} />}

        <div className="app-scroll" ref={scrollRef}>
          {screen === 'ingest' && <Transcripts reviewQueue={reviewQueue} />}
          {screen === 'feed' && <Create queue={contentQueue} />}
          {screen === 'studio' && studioTopic && <Studio topic={studioTopic} />}
          {screen === 'publisher' && <Publisher />}
          {screen === 'review' && <Review queue={reviewQueue} />}
          {screen === 'library' && <Library briefs={briefs} canOpen={!isClinician} />}
          {screen === 'config' && <Settings />}
        </div>
      </main>

      <Toast />
    </div>
  )
}
