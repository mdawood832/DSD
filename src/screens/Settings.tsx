import { useState } from 'react'
import { IconChevronLeft, IconChevronRight, IconConversations, IconFormat, IconPlus } from '../components/icons'
import { truncate } from '../lib/scoring'
import { useWorkflow } from '../state/WorkflowProvider'
import type { Instruction } from '../types'
import './Settings.css'

function InstructionRow({ item, variant, onOpen }: { item: Instruction; variant: 'system' | 'format'; onOpen: () => void }) {
  return (
    <div className="instr-row" role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => e.key === 'Enter' && onOpen()}>
      <span className={'instr-icon ' + variant}>{variant === 'system' ? <IconConversations size={18} /> : <IconFormat size={18} />}</span>
      <div className="instr-text">
        <div className="instr-title">{item.title || 'Untitled format'}</div>
        <div className="instr-preview">{item.body ? truncate(item.body, 135) : 'No instructions yet. Tap to write them.'}</div>
      </div>
      <IconChevronRight size={16} color="#c3cfcf" style={{ flexShrink: 0 }} />
    </div>
  )
}

export function Settings() {
  const { state, actions } = useWorkflow()
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const open = (item: Instruction) => {
    setOpenKey(item.key)
    setTitle(item.title)
    setBody(item.body)
  }
  const addFormat = () => {
    const key = 'fmt-' + Date.now()
    actions.addInstruction(key)
    setOpenKey(key)
    setTitle('')
    setBody('')
  }

  const current = state.instructions.find((i) => i.key === openKey)

  if (current) {
    const isSystem = current.kind === 'System'
    return (
      <div className="screen settings">
        <button className="instr-back" onClick={() => setOpenKey(null)}>
          <IconChevronLeft size={14} sw={1.9} />
          All instructions
        </button>

        <div className="instr-editor">
          {isSystem ? (
            <>
              <h2 className="instr-editor-title">{current.title}</h2>
              <div className="instr-editor-sub">System instruction · applies across the whole workflow.</div>
            </>
          ) : (
            <>
              <label className="instr-label" htmlFor="instr-title">
                Format name
              </label>
              <input
                id="instr-title"
                className="instr-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Instagram carousel"
              />
            </>
          )}

          <label className="instr-label" htmlFor="instr-body">
            Instructions
          </label>
          <textarea
            id="instr-body"
            className="instr-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write the instructions the system should follow…"
          />

          <div className="instr-actions">
            {isSystem ? (
              <span />
            ) : (
              <button
                className="instr-delete"
                onClick={() => {
                  actions.deleteInstruction(current.key)
                  setOpenKey(null)
                }}
              >
                Delete format
              </button>
            )}
            <div className="instr-actions-right">
              <button className="btn btn-secondary instr-btn" onClick={() => setOpenKey(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary instr-btn"
                onClick={() => {
                  actions.saveInstruction(current.key, title, body)
                  setOpenKey(null)
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const system = state.instructions.filter((i) => i.kind === 'System')
  const formats = state.instructions.filter((i) => i.kind !== 'System')

  return (
    <div className="screen settings">
      <div className="settings-intro">
        <h2>System instructions</h2>
        <p>You control how the system behaves, no engineering required. Open any item to read, edit, and save its written instructions.</p>
      </div>

      <div className="settings-group-label">System</div>
      <div className="instr-list system">
        {system.map((i) => (
          <InstructionRow key={i.key} item={i} variant="system" onOpen={() => open(i)} />
        ))}
      </div>

      <div className="settings-group-label">Content formats</div>
      <div className="instr-list">
        {formats.map((i) => (
          <InstructionRow key={i.key} item={i} variant="format" onOpen={() => open(i)} />
        ))}
      </div>

      <button className="instr-add" onClick={addFormat}>
        <IconPlus size={15} sw={2} />
        Add another format
      </button>
    </div>
  )
}
