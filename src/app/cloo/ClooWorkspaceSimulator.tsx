"use client"

import { useId, useRef, useState, type KeyboardEvent } from "react"
import {
  CLOO_COMMAND_ORDER,
  CLOO_COMMANDS,
  CLOO_INITIAL_TRANSCRIPT,
  CLOO_LINKS,
  CLOO_PROJECT,
  type ClooCommandName,
  type ClooTranscriptEntry,
} from "./clooData"

const MAX_TRANSCRIPT_ENTRIES = 80
const MAX_COMMAND_HISTORY = 30
const MAX_INPUT_LENGTH = 120

interface LinkTranscriptEntry {
  id: string
  kind: "link"
  text: string
  href: string
}

interface ErrorTranscriptEntry {
  id: string
  kind: "error"
  text: string
}

type TranscriptEntry =
  | ClooTranscriptEntry
  | LinkTranscriptEntry
  | ErrorTranscriptEntry

function isCommandName(value: string): value is ClooCommandName {
  return (CLOO_COMMAND_ORDER as readonly string[]).includes(value)
}

function getCommonPrefix(values: readonly string[]) {
  if (values.length === 0) return ""

  return values.slice(1).reduce((prefix, value) => {
    let length = 0
    while (length < prefix.length && prefix[length] === value[length]) {
      length += 1
    }
    return prefix.slice(0, length)
  }, values[0])
}

function getGithubHref() {
  try {
    const url = new URL(CLOO_LINKS.github.href)
    return url.protocol === "https:" && url.hostname === "github.com"
      ? url.toString()
      : null
  } catch {
    return null
  }
}

const GITHUB_HREF = getGithubHref()

export default function ClooWorkspaceSimulator() {
  const inputId = useId()
  const transcriptId = useId()
  const hintId = useId()
  const tabId = useId()
  const paneId = useId()
  const entrySequence = useRef(0)
  const historyDraft = useRef("")
  const isComposing = useRef(false)
  const [transcript, setTranscript] = useState<TranscriptEntry[]>(() =>
    CLOO_INITIAL_TRANSCRIPT.map((entry) => ({ ...entry })),
  )
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyCursor, setHistoryCursor] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState({ id: 0, message: "" })

  function nextEntryId() {
    entrySequence.current += 1
    return `command-result-${entrySequence.current}`
  }

  function announce(message: string) {
    setAnnouncement((current) => ({ id: current.id + 1, message }))
  }

  function appendEntries(entries: readonly TranscriptEntry[]) {
    setTranscript((current) =>
      [...current, ...entries].slice(-MAX_TRANSCRIPT_ENTRIES),
    )
  }

  function restoreInitialWorkspace() {
    entrySequence.current = 0
    historyDraft.current = ""
    setTranscript(CLOO_INITIAL_TRANSCRIPT.map((entry) => ({ ...entry })))
    setInput("")
    setHistory([])
    setHistoryCursor(null)
  }

  function runCommand(rawInput: string) {
    const submitted = rawInput.trim()
    if (!submitted) return

    const normalized = submitted.toLowerCase()
    setInput("")
    setHistory((current) =>
      [...current, submitted].slice(-MAX_COMMAND_HISTORY),
    )
    setHistoryCursor(null)
    historyDraft.current = ""

    if (!isCommandName(normalized)) {
      appendEntries([
        { id: nextEntryId(), kind: "command", text: submitted },
        {
          id: nextEntryId(),
          kind: "error",
          text: `Unknown command "${submitted}". Type "help" for the local command list.`,
        },
      ])
      announce("Unknown local command. Type help for the command list.")
      return
    }

    const command = CLOO_COMMANDS[normalized]
    if (command.result.kind === "clear") {
      setTranscript([])
      announce("Focused pane transcript cleared.")
      return
    }

    if (command.result.kind === "reset") {
      restoreInitialWorkspace()
      announce("Simulated workspace reset to its initial state.")
      return
    }

    const entries: TranscriptEntry[] = [
      { id: nextEntryId(), kind: "command", text: submitted },
      ...command.result.lines.map(
        (line): TranscriptEntry => ({
          id: nextEntryId(),
          kind: "output",
          text: line,
        }),
      ),
    ]

    if (command.result.kind === "link") {
      entries.push(
        GITHUB_HREF
          ? {
              id: nextEntryId(),
              kind: "link",
              text: CLOO_LINKS[command.result.linkId].label,
              href: GITHUB_HREF,
            }
          : {
              id: nextEntryId(),
              kind: "error",
              text: "The configured source link is unavailable.",
            },
      )
    }

    appendEntries(entries)
    announce(`${command.name} command completed.`)
  }

  function completeInput() {
    const value = input.trimStart().toLowerCase()
    if (!value || value.includes(" ")) return false

    const matches = CLOO_COMMAND_ORDER.filter((command) =>
      command.startsWith(value),
    )
    const completion = matches.length === 1 ? matches[0] : getCommonPrefix(matches)
    if (completion.length > value.length) {
      setInput(completion)
      setHistoryCursor(null)
      return true
    }
    return false
  }

  function moveThroughHistory(direction: "up" | "down") {
    if (history.length === 0) return

    if (direction === "up") {
      const nextCursor =
        historyCursor === null
          ? history.length - 1
          : Math.max(0, historyCursor - 1)
      if (historyCursor === null) historyDraft.current = input
      setHistoryCursor(nextCursor)
      setInput(history[nextCursor])
      return
    }

    if (historyCursor === null) return
    if (historyCursor < history.length - 1) {
      const nextCursor = historyCursor + 1
      setHistoryCursor(nextCursor)
      setInput(history[nextCursor])
      return
    }

    setHistoryCursor(null)
    setInput(historyDraft.current)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (isComposing.current || event.nativeEvent.isComposing) return

    if (event.ctrlKey && !event.altKey && !event.metaKey && event.key.toLowerCase() === "l") {
      event.preventDefault()
      setTranscript([])
      announce("Focused pane transcript cleared.")
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      runCommand(input)
      return
    }

    if (event.key === "Tab") {
      if (!event.shiftKey && completeInput()) event.preventDefault()
      return
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      if (history.length === 0) return
      event.preventDefault()
      moveThroughHistory(event.key === "ArrowUp" ? "up" : "down")
    }
  }

  return (
    <section
      className="flex h-full min-h-[200px] flex-col overflow-hidden bg-cloo-frame font-mono text-cloo-text"
      aria-label={`${CLOO_PROJECT.name} interactive product simulation workspace`}
    >
      <div
        className="flex h-10 shrink-0 items-end gap-1 border-b border-cloo-border bg-cloo-surface px-2 pt-2"
        role="tablist"
        aria-label="Workspace tabs"
      >
        <span className="mb-2 mr-2 text-[11px] font-semibold text-cloo-accent">
          session: portfolio
        </span>
        <button
          id={tabId}
          type="button"
          role="tab"
          aria-selected="true"
          aria-controls={paneId}
          className="h-8 rounded-t border border-b-0 border-cloo-border bg-cloo-raised px-3 text-xs font-semibold text-cloo-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cloo-accent"
        >
          &gt; 1: project
        </button>
      </div>

      <div className="min-h-0 flex-1 bg-cloo-frame p-2">
        <section
          id={paneId}
          role="tabpanel"
          aria-labelledby={tabId}
          className="flex h-full min-h-0 flex-col border border-cloo-accent bg-cloo-surface"
        >
          <header className="flex h-7 shrink-0 items-center justify-between border-b border-cloo-accent bg-cloo-raised px-2 text-[11px]">
            <span className="font-semibold text-cloo-primary">&gt; 1 project</span>
            <span className="text-cloo-success">- quiet | focused</span>
          </header>

          <ol
            id={transcriptId}
            className="min-h-0 flex-1 select-text space-y-1 overflow-y-auto px-3 py-3 text-xs leading-relaxed selection:bg-cloo-accent/30 selection:text-cloo-primary"
            aria-label="Project command transcript"
          >
            {transcript.length === 0 ? (
              <li className="text-cloo-muted">Transcript cleared. Type help to continue.</li>
            ) : (
              transcript.map((entry) => {
                if (entry.kind === "link") {
                  return (
                    <li key={entry.id} className="pl-4">
                      <a
                        href={entry.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cloo-info underline decoration-cloo-info/50 underline-offset-2 hover:text-cloo-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloo-accent"
                      >
                        {entry.text}
                      </a>
                    </li>
                  )
                }

                const entryClass =
                  entry.kind === "system"
                    ? "text-cloo-muted"
                    : entry.kind === "command"
                      ? "text-cloo-primary"
                      : entry.kind === "error"
                        ? "text-cloo-error"
                        : "pl-4 text-cloo-text"

                return (
                  <li key={entry.id} className={`whitespace-pre-wrap break-words ${entryClass}`}>
                    {entry.kind === "command" && (
                      <span className="mr-2 select-none text-cloo-success" aria-hidden="true">
                        $
                      </span>
                    )}
                    {entry.text}
                  </li>
                )
              })
            )}
          </ol>

          <form
            className="flex shrink-0 items-center gap-2 border-t border-cloo-border px-3 py-2"
            onSubmit={(event) => {
              event.preventDefault()
              if (isComposing.current) return
              runCommand(input)
            }}
          >
            <label htmlFor={inputId} className="shrink-0 text-xs text-cloo-success">
              cloo&gt;
            </label>
            <input
              id={inputId}
              type="text"
              value={input}
              maxLength={MAX_INPUT_LENGTH}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="send"
              aria-controls={transcriptId}
              aria-describedby={hintId}
              aria-label="Cloo project command"
              onChange={(event) => {
                setInput(event.target.value)
                setHistoryCursor(null)
                historyDraft.current = event.target.value
              }}
              onCompositionStart={() => {
                isComposing.current = true
              }}
              onCompositionEnd={() => {
                isComposing.current = false
              }}
              onKeyDown={handleKeyDown}
              className="min-w-0 flex-1 bg-transparent text-xs text-cloo-primary caret-cloo-accent outline-none placeholder:text-cloo-muted focus-visible:ring-1 focus-visible:ring-cloo-accent"
              placeholder="help"
            />
            <button
              type="submit"
              className="rounded border border-cloo-border bg-cloo-raised px-2 py-1 text-[11px] font-semibold text-cloo-primary hover:border-cloo-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloo-accent"
            >
              Run
            </button>
          </form>
          <p id={hintId} className="sr-only">
            Enter runs a finite local command. Up and Down browse history, Tab completes commands,
            and Control L clears this pane.
          </p>
        </section>
      </div>

      <footer className="flex h-7 shrink-0 items-center justify-between gap-3 border-t border-cloo-border bg-cloo-surface px-2 text-[11px] font-semibold">
        <span className="truncate text-cloo-primary">portfolio &gt; 1:project</span>
        <span className="shrink-0 text-cloo-muted">0! | prefix C-b</span>
      </footer>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement.message && (
          <span key={announcement.id}>{announcement.message}</span>
        )}
      </div>
    </section>
  )
}
