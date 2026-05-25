import { useCallback, useEffect, useRef, useState } from "react"
import { RotateCcw } from "lucide-react"
import { BUDDY_BANNER, BUDDY_TAGLINE, TERMINAL_SCRIPT } from "./buddyData"

interface TerminalSimulatorProps {
  onStateChange: (state: string) => void
}

// Timing constants (ms)
const CHAR_DELAY = 60
const POST_COMMAND_PAUSE = 400
const OUTPUT_LINE_DELAY = 80
const INTER_COMMAND_PAUSE = 600

interface TerminalLine {
  kind: "banner" | "tagline" | "prompt" | "command" | "output" | "blank"
  text: string
  /** For "command" lines: how many chars are currently visible */
  visibleChars?: number
}

export default function TerminalSimulator({ onStateChange }: TerminalSimulatorProps) {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [done, setDone] = useState(false)
  const [replayKey, setReplayKey] = useState(0)

  // Ref so the async loop can be cancelled cleanly on unmount or replay
  const cancelledRef = useRef(false)

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      const t = setTimeout(resolve, ms)
      // Attach to cancelledRef check via returned token — simple approach: just let it resolve
      void t
    })

  const appendLine = useCallback((line: TerminalLine) => {
    setLines((prev) => [...prev, line])
  }, [])

  const updateLastLine = useCallback((updater: (prev: TerminalLine) => TerminalLine) => {
    setLines((prev) => {
      if (prev.length === 0) return prev
      const updated = [...prev]
      updated[updated.length - 1] = updater(updated[updated.length - 1])
      return updated
    })
  }, [])

  useEffect(() => {
    cancelledRef.current = false
    setLines([])
    setDone(false)

    async function run() {
      // 1. Render banner lines
      for (const bannerLine of BUDDY_BANNER.split("\n")) {
        if (cancelledRef.current) return
        appendLine({ kind: "banner", text: bannerLine })
        await sleep(40)
      }

      if (cancelledRef.current) return
      appendLine({ kind: "tagline", text: BUDDY_TAGLINE })
      await sleep(300)

      // 2. Step through script entries
      for (const entry of TERMINAL_SCRIPT) {
        if (cancelledRef.current) return

        // Show prompt + start typing command
        appendLine({ kind: "command", text: entry.command, visibleChars: 0 })

        // Typewriter: reveal one character at a time
        for (let i = 1; i <= entry.command.length; i++) {
          if (cancelledRef.current) return
          await sleep(CHAR_DELAY)
          const chars = i
          updateLastLine((prev) => ({ ...prev, visibleChars: chars }))
        }

        if (cancelledRef.current) return
        await sleep(POST_COMMAND_PAUSE)

        // Reveal output lines
        for (const outputLine of entry.output) {
          if (cancelledRef.current) return
          appendLine({ kind: outputLine === "" ? "blank" : "output", text: outputLine })
          await sleep(OUTPUT_LINE_DELAY)
        }

        if (cancelledRef.current) return
        // Notify parent of state change after all output is shown
        onStateChange(entry.petState)

        await sleep(INTER_COMMAND_PAUSE)
      }

      if (!cancelledRef.current) {
        setDone(true)
      }
    }

    run()

    return () => {
      cancelledRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayKey])

  function handleReplay() {
    setReplayKey((k) => k + 1)
    onStateChange("idle")
  }

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden font-mono text-xs leading-relaxed"
      style={{ background: "rgba(0,0,0,0.82)" }}
    >
      {/* Terminal bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="ml-3 text-white/40 text-[10px] tracking-wide">buddy — zsh</span>
      </div>

      {/* Content area */}
      <div className="px-4 py-3 space-y-0.5 min-h-[220px]">
        {lines.map((line, idx) => {
          if (line.kind === "banner") {
            return (
              <div key={idx} style={{ color: "#f97316", whiteSpace: "pre" }}>
                {line.text}
              </div>
            )
          }
          if (line.kind === "tagline") {
            return (
              <div key={idx} className="text-orange-400/70 mb-2" style={{ whiteSpace: "pre" }}>
                {line.text}
              </div>
            )
          }
          if (line.kind === "blank") {
            return <div key={idx} className="h-1" />
          }
          if (line.kind === "command") {
            const visible = line.visibleChars ?? line.text.length
            const displayed = line.text.slice(0, visible)
            const cursor = visible < line.text.length
            return (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-green-400 select-none">$</span>
                <span className="text-white">
                  {displayed}
                  {cursor && (
                    <span
                      className="inline-block w-1.5 h-3.5 bg-white/70 align-middle ml-px animate-pulse"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </div>
            )
          }
          if (line.kind === "output") {
            return (
              <div key={idx} className="text-white/55 pl-4 whitespace-pre-wrap">
                {line.text}
              </div>
            )
          }
          return null
        })}

        {/* Blinking cursor at bottom when idle/not done */}
        {!done && lines.length === 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-green-400 select-none">$</span>
            <span
              className="inline-block w-1.5 h-3.5 bg-white/70 align-middle animate-pulse"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* Replay button */}
      {done && (
        <div className="px-4 pb-3 flex justify-end">
          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 text-white/50 hover:text-white/90 transition-colors text-[11px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded px-2 py-1"
            aria-label="Replay terminal demo"
          >
            <RotateCcw size={12} />
            <span>Replay</span>
          </button>
        </div>
      )}
    </div>
  )
}
