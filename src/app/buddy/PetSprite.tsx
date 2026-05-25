"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { PET_ANIMATION_STATES } from "./buddyData"

// Spritesheet layout constants
const COLUMNS = 8
const ROWS = 9

type PetState = keyof typeof PET_ANIMATION_STATES

interface PetSpriteProps {
  state: PetState | string
}

function getStateData(state: string) {
  return PET_ANIMATION_STATES[state] ?? PET_ANIMATION_STATES["idle"]
}

function frameToBackground(col: number, row: number): string {
  const xPct = (col / (COLUMNS - 1)) * 100
  const yPct = (row / (ROWS - 1)) * 100
  return `${xPct}% ${yPct}%`
}

export default function PetSprite({ state }: PetSpriteProps) {
  const prefersReduced = useReducedMotion()

  // For reduced-motion: static first frame of idle
  if (prefersReduced) {
    const idleState = PET_ANIMATION_STATES["idle"]
    const firstFrame = idleState.frames[0]
    const bgPos = frameToBackground(firstFrame.col, firstFrame.row)
    return (
      <div
        style={{
          width: 192,
          height: 208,
          backgroundImage: "url(/buddy/spritesheet.webp)",
          backgroundSize: `${COLUMNS * 100}% ${ROWS * 100}%`,
          backgroundPosition: bgPos,
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
        aria-label="Pet sprite (animation paused)"
        role="img"
      />
    )
  }

  return <AnimatedSprite state={state} />
}

function AnimatedSprite({ state }: { state: string }) {
  const stateData = getStateData(state)
  const [frameIdx, setFrameIdx] = useState(0)

  // Track current state and frame idx in refs to avoid stale closures in rAF
  const frameIdxRef = useRef(0)
  const stateRef = useRef(state)
  const rafRef = useRef<number | null>(null)
  const lastTimestampRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)

  useEffect(() => {
    // When state changes, reset to frame 0
    stateRef.current = state
    frameIdxRef.current = 0
    setFrameIdx(0)
    lastTimestampRef.current = null
    elapsedRef.current = 0

    const data = getStateData(state)

    function tick(timestamp: number) {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp
      }
      const delta = timestamp - lastTimestampRef.current
      lastTimestampRef.current = timestamp
      elapsedRef.current += delta

      const currentFrameIdx = frameIdxRef.current
      const frames = data.frames
      const frameDuration = frames[currentFrameIdx]?.ms ?? 120

      if (elapsedRef.current >= frameDuration) {
        elapsedRef.current = 0
        const nextIdx = currentFrameIdx + 1

        if (nextIdx >= frames.length) {
          if (data.once) {
            // Stay on last frame — don't loop
            return
          }
          frameIdxRef.current = 0
          setFrameIdx(0)
        } else {
          frameIdxRef.current = nextIdx
          setFrameIdx(nextIdx)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [state])

  const currentData = getStateData(state)
  const safeIdx = Math.min(frameIdx, currentData.frames.length - 1)
  const frame = currentData.frames[safeIdx]
  const bgPos = frameToBackground(frame.col, frame.row)

  return (
    <div
      style={{
        width: 192,
        height: 208,
        backgroundImage: "url(/buddy/spritesheet.webp)",
        backgroundSize: `${COLUMNS * 100}% ${ROWS * 100}%`,
        backgroundPosition: bgPos,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
      }}
      aria-label={`Pet sprite — ${state}`}
      role="img"
    />
  )
}
