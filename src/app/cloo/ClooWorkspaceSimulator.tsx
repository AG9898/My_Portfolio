"use client"

import {
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import { motion, useReducedMotion } from "framer-motion"
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
const MAX_TABS = 4
const MAX_PANES = 4

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

type SplitDirection = "vertical" | "horizontal"
type FocusDirection = "left" | "down" | "up" | "right"

interface PaneState {
  id: string
  label: string
  transcript: TranscriptEntry[]
}

interface TabState {
  id: string
  label: string
  panes: PaneState[]
  focusedPaneId: string
  zoomedPaneId: string | null
  layout: SplitDirection | "grid"
}

interface WorkspaceState {
  tabs: TabState[]
  activeTabId: string
  detached: boolean
  prefixArmed: boolean
  notice: string
  nextPaneNumber: number
  nextTabNumber: number
}

type WorkspaceAction =
  | { type: "split"; direction: SplitDirection }
  | { type: "focus"; direction: FocusDirection }
  | { type: "selectPane"; paneId: string }
  | { type: "toggleZoom" }
  | { type: "createTab" }
  | { type: "cycleTab"; direction: "next" | "previous" }
  | { type: "selectTab"; tabId: string }
  | { type: "detach" }
  | { type: "reattach" }
  | { type: "setPrefix"; armed: boolean }
  | { type: "setNotice"; notice: string }
  | { type: "appendTranscript"; entries: readonly TranscriptEntry[] }
  | { type: "clearTranscript" }
  | { type: "reset" }

interface PrefixControl {
  label: string
  keyLabel: string
  action: WorkspaceAction
}

const PREFIX_CONTROLS: readonly PrefixControl[] = [
  {
    label: "Split pane vertically",
    keyLabel: "C-b %",
    action: { type: "split", direction: "vertical" },
  },
  {
    label: "Split pane horizontally",
    keyLabel: 'C-b "',
    action: { type: "split", direction: "horizontal" },
  },
  {
    label: "Focus pane left",
    keyLabel: "C-b h / left",
    action: { type: "focus", direction: "left" },
  },
  {
    label: "Focus pane down",
    keyLabel: "C-b j / down",
    action: { type: "focus", direction: "down" },
  },
  {
    label: "Focus pane up",
    keyLabel: "C-b k / up",
    action: { type: "focus", direction: "up" },
  },
  {
    label: "Focus pane right",
    keyLabel: "C-b l / right",
    action: { type: "focus", direction: "right" },
  },
  {
    label: "Toggle focused pane zoom",
    keyLabel: "C-b z",
    action: { type: "toggleZoom" },
  },
  {
    label: "Create tab",
    keyLabel: "C-b c",
    action: { type: "createTab" },
  },
  {
    label: "Select previous tab",
    keyLabel: "C-b p",
    action: { type: "cycleTab", direction: "previous" },
  },
  {
    label: "Select next tab",
    keyLabel: "C-b n",
    action: { type: "cycleTab", direction: "next" },
  },
  {
    label: "Detach simulated client",
    keyLabel: "C-b d",
    action: { type: "detach" },
  },
]

function cloneInitialTranscript(): TranscriptEntry[] {
  return CLOO_INITIAL_TRANSCRIPT.map((entry) => ({ ...entry }))
}

function createInitialWorkspace(): WorkspaceState {
  return {
    tabs: [
      {
        id: "tab-1",
        label: "project",
        panes: [
          {
            id: "pane-1",
            label: "project",
            transcript: cloneInitialTranscript(),
          },
        ],
        focusedPaneId: "pane-1",
        zoomedPaneId: null,
        layout: "vertical",
      },
    ],
    activeTabId: "tab-1",
    detached: false,
    prefixArmed: false,
    notice: "Ready. Type help or press C-b for workspace controls.",
    nextPaneNumber: 2,
    nextTabNumber: 2,
  }
}

function getActiveTab(state: WorkspaceState) {
  return state.tabs.find((tab) => tab.id === state.activeTabId) ?? state.tabs[0]
}

function updateActiveTab(
  state: WorkspaceState,
  update: (tab: TabState) => TabState,
): WorkspaceState {
  return {
    ...state,
    tabs: state.tabs.map((tab) =>
      tab.id === state.activeTabId ? update(tab) : tab,
    ),
  }
}

function getNeighborPaneId(tab: TabState, direction: FocusDirection) {
  const currentIndex = tab.panes.findIndex(
    (pane) => pane.id === tab.focusedPaneId,
  )
  const columnCount =
    tab.layout === "horizontal"
      ? 1
      : tab.layout === "vertical"
        ? tab.panes.length
        : 2
  const currentRow = Math.floor(currentIndex / columnCount)
  const currentColumn = currentIndex % columnCount
  const targetRow =
    currentRow + (direction === "down" ? 1 : direction === "up" ? -1 : 0)
  const targetColumn =
    currentColumn +
    (direction === "right" ? 1 : direction === "left" ? -1 : 0)
  const targetIndex = targetRow * columnCount + targetColumn

  if (
    targetRow < 0 ||
    targetColumn < 0 ||
    targetColumn >= columnCount ||
    targetIndex < 0 ||
    targetIndex >= tab.panes.length
  ) {
    return tab.focusedPaneId
  }
  return tab.panes[targetIndex].id
}

function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  switch (action.type) {
    case "split": {
      const activeTab = getActiveTab(state)
      if (activeTab.panes.length >= MAX_PANES) {
        return {
          ...state,
          prefixArmed: false,
          notice: `Pane limit reached (${MAX_PANES}).`,
        }
      }

      const paneNumber = state.nextPaneNumber
      const pane: PaneState = {
        id: `pane-${paneNumber}`,
        label: `shell-${paneNumber}`,
        transcript: [
          {
            id: `pane-${paneNumber}-ready`,
            kind: "system",
            text: "Simulated shell ready. Type help to inspect the project.",
          },
        ],
      }
      const nextState = updateActiveTab(state, (tab) => ({
        ...tab,
        panes: [...tab.panes, pane],
        focusedPaneId: pane.id,
        zoomedPaneId: null,
        layout: tab.panes.length === 1 ? action.direction : "grid",
      }))
      return {
        ...nextState,
        nextPaneNumber: paneNumber + 1,
        prefixArmed: false,
        notice: `${action.direction} split created; ${pane.label} focused.`,
      }
    }
    case "focus": {
      const activeTab = getActiveTab(state)
      const paneId = getNeighborPaneId(activeTab, action.direction)
      return {
        ...updateActiveTab(state, (tab) => ({
          ...tab,
          focusedPaneId: paneId,
          zoomedPaneId: tab.zoomedPaneId ? paneId : null,
        })),
        prefixArmed: false,
        notice:
          paneId === activeTab.focusedPaneId
            ? `No pane ${action.direction}.`
            : `Focused pane ${action.direction}.`,
      }
    }
    case "selectPane":
      return {
        ...updateActiveTab(state, (tab) =>
          tab.panes.some((pane) => pane.id === action.paneId)
            ? {
                ...tab,
                focusedPaneId: action.paneId,
                zoomedPaneId: tab.zoomedPaneId ? action.paneId : null,
              }
            : tab,
        ),
        prefixArmed: false,
        notice: "Pane focused.",
      }
    case "toggleZoom": {
      const activeTab = getActiveTab(state)
      const zooming = activeTab.zoomedPaneId !== activeTab.focusedPaneId
      return {
        ...updateActiveTab(state, (tab) => ({
          ...tab,
          zoomedPaneId: zooming ? tab.focusedPaneId : null,
        })),
        prefixArmed: false,
        notice: zooming ? "Focused pane zoomed." : "Pane zoom cleared.",
      }
    }
    case "createTab": {
      if (state.tabs.length >= MAX_TABS) {
        return {
          ...state,
          prefixArmed: false,
          notice: `Tab limit reached (${MAX_TABS}).`,
        }
      }

      const tabNumber = state.nextTabNumber
      const paneNumber = state.nextPaneNumber
      const paneId = `pane-${paneNumber}`
      const tab: TabState = {
        id: `tab-${tabNumber}`,
        label: `shell-${tabNumber}`,
        panes: [
          {
            id: paneId,
            label: `shell-${paneNumber}`,
            transcript: [
              {
                id: `tab-${tabNumber}-ready`,
                kind: "system",
                text: "New simulated tab ready. Type help for local commands.",
              },
            ],
          },
        ],
        focusedPaneId: paneId,
        zoomedPaneId: null,
        layout: "vertical",
      }
      return {
        ...state,
        tabs: [...state.tabs, tab],
        activeTabId: tab.id,
        nextTabNumber: tabNumber + 1,
        nextPaneNumber: paneNumber + 1,
        prefixArmed: false,
        notice: `${tab.label} created and selected.`,
      }
    }
    case "cycleTab": {
      const activeIndex = state.tabs.findIndex(
        (tab) => tab.id === state.activeTabId,
      )
      const offset = action.direction === "next" ? 1 : -1
      const nextIndex =
        (activeIndex + offset + state.tabs.length) % state.tabs.length
      return {
        ...state,
        activeTabId: state.tabs[nextIndex].id,
        prefixArmed: false,
        notice: `${state.tabs[nextIndex].label} selected.`,
      }
    }
    case "selectTab":
      return state.tabs.some((tab) => tab.id === action.tabId)
        ? {
            ...state,
            activeTabId: action.tabId,
            prefixArmed: false,
            notice: "Tab selected.",
          }
        : state
    case "detach":
      return {
        ...state,
        detached: true,
        prefixArmed: false,
        notice: "Simulated client detached; workspace state preserved.",
      }
    case "reattach":
      return {
        ...state,
        detached: false,
        prefixArmed: false,
        notice: "Simulated client reattached; workspace restored.",
      }
    case "setPrefix":
      return {
        ...state,
        prefixArmed: action.armed,
        notice: action.armed
          ? "Prefix armed. Press one supported workspace key."
          : state.notice,
      }
    case "setNotice":
      return { ...state, prefixArmed: false, notice: action.notice }
    case "appendTranscript":
      return updateActiveTab(state, (tab) => ({
        ...tab,
        panes: tab.panes.map((pane) =>
          pane.id === tab.focusedPaneId
            ? {
                ...pane,
                transcript: [...pane.transcript, ...action.entries].slice(
                  -MAX_TRANSCRIPT_ENTRIES,
                ),
              }
            : pane,
        ),
      }))
    case "clearTranscript":
      return updateActiveTab(state, (tab) => ({
        ...tab,
        panes: tab.panes.map((pane) =>
          pane.id === tab.focusedPaneId ? { ...pane, transcript: [] } : pane,
        ),
      }))
    case "reset":
      return createInitialWorkspace()
  }
}

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

function getPrefixAction(key: string): WorkspaceAction | null {
  const normalized = key.length === 1 ? key.toLowerCase() : key
  const actions: Record<string, WorkspaceAction> = {
    "%": { type: "split", direction: "vertical" },
    '"': { type: "split", direction: "horizontal" },
    h: { type: "focus", direction: "left" },
    ArrowLeft: { type: "focus", direction: "left" },
    j: { type: "focus", direction: "down" },
    ArrowDown: { type: "focus", direction: "down" },
    k: { type: "focus", direction: "up" },
    ArrowUp: { type: "focus", direction: "up" },
    l: { type: "focus", direction: "right" },
    ArrowRight: { type: "focus", direction: "right" },
    z: { type: "toggleZoom" },
    c: { type: "createTab" },
    n: { type: "cycleTab", direction: "next" },
    p: { type: "cycleTab", direction: "previous" },
    d: { type: "detach" },
  }
  return actions[normalized] ?? null
}

const GITHUB_HREF = getGithubHref()

export default function ClooWorkspaceSimulator() {
  const idBase = useId()
  const hintId = `${idBase}-hint`
  const rootRef = useRef<HTMLElement>(null)
  const entrySequence = useRef(0)
  const historyDraft = useRef("")
  const isComposing = useRef(false)
  const reduceMotion = useReducedMotion() ?? false
  const [workspace, dispatch] = useReducer(
    workspaceReducer,
    undefined,
    createInitialWorkspace,
  )
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyCursor, setHistoryCursor] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState({ id: 0, message: "" })
  const [isDesktopVisible, setIsDesktopVisible] = useState(false)
  const [isNarrow, setIsNarrow] = useState(true)

  const activeTab = getActiveTab(workspace)
  const focusedPane =
    activeTab.panes.find((pane) => pane.id === activeTab.focusedPaneId) ??
    activeTab.panes[0]
  const shouldAnimate = isDesktopVisible && !reduceMotion

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)")
    const updateDesktopVisibility = () => {
      setIsDesktopVisible(desktopQuery.matches)
      if (
        !desktopQuery.matches &&
        rootRef.current?.contains(document.activeElement)
      ) {
        ;(document.activeElement as HTMLElement).blur()
      }
    }

    updateDesktopVisibility()
    desktopQuery.addEventListener("change", updateDesktopVisibility)
    return () =>
      desktopQuery.removeEventListener("change", updateDesktopVisibility)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setIsNarrow(width < 560 || height < 360)
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  function nextEntryId() {
    entrySequence.current += 1
    return `command-result-${entrySequence.current}`
  }

  function announce(message: string) {
    if (!isDesktopVisible) return
    setAnnouncement((current) => ({ id: current.id + 1, message }))
  }

  function appendEntries(entries: readonly TranscriptEntry[]) {
    dispatch({ type: "appendTranscript", entries })
  }

  function restoreInitialWorkspace() {
    entrySequence.current = 0
    historyDraft.current = ""
    dispatch({ type: "reset" })
    setInput("")
    setHistory([])
    setHistoryCursor(null)
  }

  function performWorkspaceAction(action: WorkspaceAction, label: string) {
    if (!isDesktopVisible) return
    dispatch(action)
    announce(label)
  }

  function runCommand(rawInput: string) {
    if (!isDesktopVisible) return
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
      dispatch({ type: "clearTranscript" })
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
    if (
      !isDesktopVisible ||
      isComposing.current ||
      event.nativeEvent.isComposing
    ) {
      return
    }

    if (workspace.prefixArmed) {
      const action =
        event.ctrlKey || event.altKey || event.metaKey
          ? null
          : getPrefixAction(event.key)
      if (action) {
        event.preventDefault()
        performWorkspaceAction(action, `Workspace action ${event.key} completed.`)
      } else {
        dispatch({
          type: "setNotice",
          notice: `Unsupported prefix key "${event.key}". Type help for supported controls.`,
        })
        announce("Unsupported prefix key. Keyboard returned to the command input.")
      }
      return
    }

    if (
      event.ctrlKey &&
      !event.altKey &&
      !event.metaKey &&
      event.key.toLowerCase() === "b"
    ) {
      event.preventDefault()
      dispatch({ type: "setPrefix", armed: true })
      announce("Cloo prefix armed.")
      return
    }

    if (
      event.ctrlKey &&
      !event.altKey &&
      !event.metaKey &&
      event.key.toLowerCase() === "l"
    ) {
      event.preventDefault()
      dispatch({ type: "clearTranscript" })
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

  function renderTranscript(pane: PaneState) {
    if (pane.transcript.length === 0) {
      return (
        <li className="text-cloo-muted">
          Transcript cleared. Type help to continue.
        </li>
      )
    }

    return pane.transcript.map((entry) => {
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
        <li
          key={entry.id}
          className={`whitespace-pre-wrap break-words ${entryClass}`}
        >
          {entry.kind === "command" && (
            <span
              className="mr-2 select-none text-cloo-success"
              aria-hidden="true"
            >
              $
            </span>
          )}
          {entry.text}
        </li>
      )
    })
  }

  const paneGridClass =
    activeTab.panes.length <= 1 || isNarrow || activeTab.zoomedPaneId
      ? "grid-cols-1 grid-rows-1"
      : activeTab.layout === "horizontal"
        ? "grid-cols-1 grid-rows-2"
        : activeTab.layout === "vertical"
          ? "grid-cols-2 grid-rows-1"
          : "grid-cols-2 grid-rows-2"

  return (
    <section
      ref={rootRef}
      className="flex h-full min-h-[200px] flex-col overflow-hidden bg-cloo-frame font-mono text-cloo-text"
      aria-label={`${CLOO_PROJECT.name} interactive product simulation workspace`}
      aria-hidden={!isDesktopVisible}
      data-layout={isNarrow ? "focused-pane" : "multipane"}
      data-simulator-active={isDesktopVisible ? "true" : "false"}
    >
      {workspace.detached ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <div>
            <p className="text-sm font-semibold text-cloo-warning">
              ! Simulated client detached
            </p>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-cloo-muted">
              Tabs, panes, transcripts, focus, and zoom are preserved locally. No
              live process or network session is running.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              disabled={!isDesktopVisible}
              onClick={() =>
                performWorkspaceAction(
                  { type: "reattach" },
                  "Simulated client reattached.",
                )
              }
              className="rounded border border-cloo-accent bg-cloo-raised px-3 py-2 text-xs font-semibold text-cloo-primary hover:bg-cloo-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloo-accent disabled:pointer-events-none"
            >
              Reattach
            </button>
            <button
              type="button"
              disabled={!isDesktopVisible}
              onClick={() => {
                restoreInitialWorkspace()
                announce("Simulated workspace reset to its initial state.")
              }}
              className="rounded border border-cloo-border bg-cloo-surface px-3 py-2 text-xs font-semibold text-cloo-text hover:border-cloo-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloo-accent disabled:pointer-events-none"
            >
              Reset workspace
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            className="flex h-8 shrink-0 items-end gap-1 overflow-x-auto border-b border-cloo-border bg-cloo-surface px-2 pt-1"
            role="tablist"
            aria-label="Workspace tabs"
          >
            <span className="mb-1.5 mr-1 shrink-0 text-[10px] font-semibold text-cloo-accent">
              session: portfolio
            </span>
            {workspace.tabs.map((tab, index) => {
              const selected = tab.id === workspace.activeTabId
              const tabDomId = `${idBase}-${tab.id}`
              const panelDomId = `${idBase}-${tab.focusedPaneId}`
              return (
                <button
                  key={tab.id}
                  id={tabDomId}
                  type="button"
                  role="tab"
                  disabled={!isDesktopVisible}
                  aria-selected={selected}
                  aria-controls={panelDomId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() =>
                    performWorkspaceAction(
                      { type: "selectTab", tabId: tab.id },
                      `${tab.label} selected.`,
                    )
                  }
                  className={`h-7 shrink-0 rounded-t border border-b-0 px-2 text-[11px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cloo-accent disabled:pointer-events-none ${
                    selected
                      ? "border-cloo-border bg-cloo-raised text-cloo-primary"
                      : "border-transparent text-cloo-muted hover:text-cloo-primary"
                  }`}
                >
                  {selected ? "> " : ""}
                  {index + 1}: {tab.label}
                </button>
              )
            })}
          </div>

          <div
            className="flex h-8 shrink-0 items-center gap-1 overflow-x-auto border-b border-cloo-border bg-cloo-raised px-2"
            aria-label="Clickable Cloo prefix controls"
          >
            {PREFIX_CONTROLS.map((control) => (
              <button
                key={control.keyLabel}
                type="button"
                disabled={!isDesktopVisible}
                aria-label={`${control.label} (${control.keyLabel})`}
                title={`${control.label} (${control.keyLabel})`}
                onClick={() =>
                  performWorkspaceAction(control.action, control.label)
                }
                className="shrink-0 rounded border border-cloo-border bg-cloo-surface px-1.5 py-0.5 text-[10px] text-cloo-text hover:border-cloo-accent hover:text-cloo-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cloo-accent disabled:pointer-events-none"
              >
                {control.keyLabel}
              </button>
            ))}
            <button
              type="button"
              disabled={!isDesktopVisible}
              onClick={() => {
                restoreInitialWorkspace()
                announce("Simulated workspace reset to its initial state.")
              }}
              className="shrink-0 rounded border border-cloo-border bg-cloo-surface px-1.5 py-0.5 text-[10px] text-cloo-text hover:border-cloo-accent hover:text-cloo-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cloo-accent disabled:pointer-events-none"
            >
              Reset
            </button>
          </div>

          <div
            className={`grid min-h-0 flex-1 gap-1 bg-cloo-frame p-1 ${paneGridClass}`}
          >
            {activeTab.panes.map((pane) => {
              const focused = pane.id === activeTab.focusedPaneId
              const visible =
                !activeTab.zoomedPaneId && !isNarrow
                  ? true
                  : focused
              const paneDomId = `${idBase}-${pane.id}`
              const tabDomId = `${idBase}-${activeTab.id}`
              const transcriptId = `${paneDomId}-transcript`
              const inputId = `${paneDomId}-input`

              return (
                <motion.section
                  key={pane.id}
                  id={paneDomId}
                  role="tabpanel"
                  aria-labelledby={tabDomId}
                  aria-label={`${pane.label} pane, ${focused ? "focused" : "not focused"}${
                    activeTab.zoomedPaneId === pane.id ? ", zoomed" : ""
                  }`}
                  layout={shouldAnimate}
                  transition={
                    shouldAnimate
                      ? { layout: { duration: 0.14, ease: "easeOut" } }
                      : { duration: 0 }
                  }
                  className={`${
                    visible ? "flex" : "hidden"
                  } min-h-0 flex-col border bg-cloo-surface ${
                    focused ? "border-cloo-accent" : "border-cloo-border"
                  }`}
                >
                  <header
                    className={`flex h-6 shrink-0 items-center justify-between border-b px-2 text-[10px] ${
                      focused
                        ? "border-cloo-accent bg-cloo-raised"
                        : "border-cloo-border bg-cloo-surface"
                    }`}
                  >
                    <button
                      type="button"
                      disabled={!isDesktopVisible || focused}
                      onClick={() =>
                        performWorkspaceAction(
                          { type: "selectPane", paneId: pane.id },
                          `${pane.label} focused.`,
                        )
                      }
                      className="font-semibold text-cloo-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cloo-accent disabled:cursor-default"
                    >
                      {focused ? ">" : "-"} {pane.label}
                    </button>
                    <span className={focused ? "text-cloo-success" : "text-cloo-muted"}>
                      {activeTab.zoomedPaneId === pane.id
                        ? "* zoomed | focused"
                        : focused
                          ? "- quiet | focused"
                          : "- quiet"}
                    </span>
                  </header>

                  <ol
                    id={transcriptId}
                    className="min-h-0 flex-1 select-text space-y-1 overflow-y-auto px-2 py-2 text-xs leading-relaxed selection:bg-cloo-accent/30 selection:text-cloo-primary"
                    aria-label={`${pane.label} command transcript`}
                  >
                    {renderTranscript(pane)}
                  </ol>

                  {focused && (
                    <form
                      className="flex shrink-0 items-center gap-2 border-t border-cloo-border px-2 py-1.5"
                      onSubmit={(event) => {
                        event.preventDefault()
                        if (isComposing.current) return
                        runCommand(input)
                      }}
                    >
                      <label
                        htmlFor={inputId}
                        className="shrink-0 text-xs text-cloo-success"
                      >
                        cloo&gt;
                      </label>
                      <input
                        id={inputId}
                        type="text"
                        value={input}
                        maxLength={MAX_INPUT_LENGTH}
                        disabled={!isDesktopVisible}
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        enterKeyHint="send"
                        aria-controls={transcriptId}
                        aria-describedby={hintId}
                        aria-label={`${pane.label} Cloo project command`}
                        onChange={(event) => {
                          if (!isDesktopVisible) return
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
                        className="min-w-0 flex-1 bg-transparent text-xs text-cloo-primary caret-cloo-accent outline-none placeholder:text-cloo-muted focus-visible:ring-1 focus-visible:ring-cloo-accent disabled:pointer-events-none"
                        placeholder="help"
                      />
                      <button
                        type="submit"
                        disabled={!isDesktopVisible}
                        className="rounded border border-cloo-border bg-cloo-raised px-2 py-0.5 text-[10px] font-semibold text-cloo-primary hover:border-cloo-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloo-accent disabled:pointer-events-none"
                      >
                        Run
                      </button>
                    </form>
                  )}
                </motion.section>
              )
            })}
          </div>
        </>
      )}

      <footer className="flex h-7 shrink-0 items-center justify-between gap-2 border-t border-cloo-border bg-cloo-surface px-2 text-[10px] font-semibold">
        <span className="min-w-0 truncate text-cloo-primary">
          portfolio &gt; {workspace.tabs.findIndex((tab) => tab.id === activeTab.id) + 1}:
          {activeTab.label} | {focusedPane.label}
        </span>
        <span className="min-w-0 truncate text-right text-cloo-muted">
          {workspace.detached
            ? "! detached"
            : workspace.prefixArmed
              ? "! prefix armed"
              : `${isNarrow ? "focused-pane" : `${activeTab.panes.length} panes`} | ${workspace.notice}`}
        </span>
      </footer>

      <p id={hintId} className="sr-only">
        Enter runs a finite local command. Up and Down browse history, Tab completes
        commands, Control L clears this pane, and Control B arms one workspace action.
      </p>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement.message && (
          <span key={announcement.id}>{announcement.message}</span>
        )}
      </div>
    </section>
  )
}
