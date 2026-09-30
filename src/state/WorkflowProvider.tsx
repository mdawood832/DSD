import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode, type RefObject } from 'react'
import { CLINICIAN } from '../data/content'
import type { Channel, Evidence, Screen } from '../types'
import { initialState, reducer, type WorkflowState } from './reducer'

const TOAST_MS = 3600
const INGEST_STEPS = 4
const INGEST_STEP_MS = 1050
const INGEST_FINISH_MS = 950
const PUBLISHER_HANDOFF_MS = 650

function useWorkflowActions(dispatch: React.Dispatch<Parameters<typeof reducer>[1]>, scrollRef: RefObject<HTMLDivElement | null>) {
  const timers = useRef<number[]>([])
  const ingestTimers = useRef<number[]>([])

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      ingestTimers.current.forEach(clearTimeout)
    },
    [],
  )

  return useMemo(() => {
    const later = (fn: () => void, ms: number, bucket = timers) => {
      bucket.current.push(window.setTimeout(fn, ms))
    }
    const toast = (message: string) => dispatch({ type: 'showToast', message })
    const clearIngestTimers = () => {
      ingestTimers.current.forEach(clearTimeout)
      ingestTimers.current = []
    }

    return {
      toggleRole: () => dispatch({ type: 'toggleRole' }),
      navigate: (screen: Screen) => dispatch({ type: 'navigate', screen }),

      startIngest: (files: number) => {
        clearIngestTimers()
        dispatch({ type: 'ingestStart', files })
        const advance = (step: number) => {
          if (step <= INGEST_STEPS) {
            dispatch({ type: 'ingestStep', step })
            later(() => advance(step + 1), INGEST_STEP_MS, ingestTimers)
          } else {
            later(() => dispatch({ type: 'ingestDone' }), INGEST_FINISH_MS, ingestTimers)
          }
        }
        later(() => advance(1), INGEST_STEP_MS, ingestTimers)
      },
      resetIngest: () => {
        clearIngestTimers()
        dispatch({ type: 'ingestReset' })
      },

      openStudio: (id: string) => dispatch({ type: 'openStudio', id }),
      togglePlanChannel: (id: string, channel: Channel) => dispatch({ type: 'togglePlanChannel', id, channel }),
      generateAssets: (id: string) => {
        dispatch({ type: 'generateAssets', id })
        toast('Generated assets from the approved knowledge brief.')
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      },
      updateAsset: (id: string, channel: Channel, body: string) => {
        dispatch({ type: 'updateAsset', id, channel, body })
        toast('Asset updated.')
      },
      sendToPublisher: (id: string) => {
        dispatch({ type: 'sendToPublisher', id })
        toast('Sent to the publisher as drafts.')
        later(() => {
          dispatch({ type: 'setPubTab', tab: 'content' })
          dispatch({ type: 'navigate', screen: 'publisher', keepToast: true })
          if (scrollRef.current) scrollRef.current.scrollTop = 0
        }, PUBLISHER_HANDOFF_MS)
      },
      setPubTab: (tab: WorkflowState['pubTab']) => dispatch({ type: 'setPubTab', tab }),

      selectReview: (id: string) => dispatch({ type: 'selectReview', id }),
      saveAnswer: (id: string, text: string) => {
        dispatch({ type: 'saveAnswer', id, text })
        toast('Answer updated before approval.')
      },
      toggleClaimVerified: (key: string) => dispatch({ type: 'toggleClaimVerified', key }),
      toggleDismissEvidence: (key: string) => dispatch({ type: 'toggleDismissEvidence', key }),
      addEvidence: (claimKey: string, evidence: Evidence) => {
        dispatch({ type: 'addEvidence', claimKey, evidence })
        toast('Your resource was added to this statement.')
      },
      removeEvidence: (claimKey: string, index: number) => dispatch({ type: 'removeEvidence', claimKey, index }),
      approve: (id: string) => {
        dispatch({ type: 'approve', id, approvedBy: CLINICIAN.name })
        toast('Approved, now the trusted clinical source of truth.')
      },

      saveInstruction: (key: string, title: string, body: string) => {
        dispatch({ type: 'saveInstruction', key, title, body })
        toast('Instructions saved.')
      },
      addInstruction: (key: string) => dispatch({ type: 'addInstruction', key }),
      deleteInstruction: (key: string) => {
        dispatch({ type: 'deleteInstruction', key })
        toast('Format removed.')
      },

      hideToast: (id: number) => dispatch({ type: 'hideToast', id }),
    }
  }, [dispatch, scrollRef])
}

export type WorkflowActions = ReturnType<typeof useWorkflowActions>

interface WorkflowContextValue {
  state: WorkflowState
  actions: WorkflowActions
  /** The scrolling content pane, so actions can reset its scroll position. */
  scrollRef: RefObject<HTMLDivElement | null>
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null)

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const scrollRef = useRef<HTMLDivElement>(null)
  const actions = useWorkflowActions(dispatch, scrollRef)

  // Auto-dismiss the current toast.
  const toastId = state.toast?.id
  useEffect(() => {
    if (toastId == null) return
    const t = window.setTimeout(() => actions.hideToast(toastId), TOAST_MS)
    return () => clearTimeout(t)
  }, [toastId, actions])

  const value = useMemo(() => ({ state, actions, scrollRef }), [state, actions])
  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>
}

export function useWorkflow() {
  const ctx = useContext(WorkflowContext)
  if (!ctx) throw new Error('useWorkflow must be used inside <WorkflowProvider>')
  return ctx
}
