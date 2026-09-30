import { useWorkflow } from '../state/WorkflowProvider'
import { IconCheck } from './icons'
import './Toast.css'

export function Toast() {
  const { state } = useWorkflow()
  if (!state.toast) return null
  return (
    <div className="toast-anchor" role="status" aria-live="polite">
      {/* keyed so a new toast restarts the animation */}
      <div className="toast" key={state.toast.id}>
        <span className="toast-icon">
          <IconCheck size={12} color="#fff" sw={2.4} />
        </span>
        <span className="toast-text">{state.toast.message}</span>
      </div>
    </div>
  )
}
