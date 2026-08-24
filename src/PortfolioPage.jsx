import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { PROJECTS } from './config/portfolio.js'

function wrapIndex(index, length) {
  return ((index % length) + length) % length
}

function shortestOffset(index, rotation, length) {
  let offset = index - rotation
  while (offset > length / 2) offset -= length
  while (offset < -length / 2) offset += length
  return offset
}

const RADIUS = 300
const SPACING = 14
const VISIBLE_ITEMS = 6
const SCROLL_SPEED = 0.008
const DRAG_SPEED = 0.02
const CROSSFADE_DURATION = 0.45

function PortfolioPage() {
  const reduceMotion = useReducedMotion() ?? false
  const instanceId = useId()
  const itemCount = PROJECTS.length
  const [rotation, setRotation] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const stageRef = useRef(null)
  const rotationRef = useRef(0)
  const selectedRef = useRef(0)
  const velocityRef = useRef(0)
  const draggingRef = useRef(false)
  const dragOriginRef = useRef({ y: 0, rotation: 0 })
  const previousDragRotationRef = useRef(0)
  const frameRef = useRef(null)

  const commitRotation = useCallback(
    (nextRotation) => {
      rotationRef.current = nextRotation
      setRotation(nextRotation)
      const nextIndex = wrapIndex(Math.round(nextRotation), itemCount)
      if (nextIndex !== selectedRef.current) {
        selectedRef.current = nextIndex
        setSelectedIndex(nextIndex)
      }
    },
    [itemCount],
  )

  const runAnimation = useCallback(() => {
    if (frameRef.current !== null) return

    const tick = () => {
      let keepAnimating = false

      if (!draggingRef.current && Math.abs(velocityRef.current) > 0.0008) {
        commitRotation(rotationRef.current + velocityRef.current)
        velocityRef.current *= reduceMotion ? 0.8 : 0.9
        keepAnimating = true
      } else if (!draggingRef.current) {
        velocityRef.current = 0
        const target = Math.round(rotationRef.current)
        const delta = target - rotationRef.current
        if (Math.abs(delta) > 0.001 && !reduceMotion) {
          commitRotation(rotationRef.current + delta * 0.22)
          keepAnimating = true
        } else {
          commitRotation(target)
        }
      }

      if (keepAnimating) frameRef.current = requestAnimationFrame(tick)
      else frameRef.current = null
    }

    frameRef.current = requestAnimationFrame(tick)
  }, [commitRotation, reduceMotion])

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    },
    [],
  )

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const handleWheel = (event) => {
      if (event.ctrlKey || event.metaKey) return
      event.preventDefault()
      const delta = event.deltaY * SCROLL_SPEED
      commitRotation(rotationRef.current + delta)
      velocityRef.current = delta * 0.2
      runAnimation()
    }

    stage.addEventListener('wheel', handleWheel, { passive: false })
    return () => stage.removeEventListener('wheel', handleWheel)
  }, [commitRotation, runAnimation])

  const moveBy = (amount) => {
    velocityRef.current = 0
    commitRotation(rotationRef.current + amount)
    runAnimation()
  }

  const handlePointerDown = (event) => {
    if (!event.isPrimary || event.button !== 0) return
    draggingRef.current = true
    setIsDragging(true)
    velocityRef.current = 0
    dragOriginRef.current = { y: event.clientY, rotation: rotationRef.current }
    previousDragRotationRef.current = rotationRef.current
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return
    const distance = event.clientY - dragOriginRef.current.y
    const nextRotation = dragOriginRef.current.rotation - distance * DRAG_SPEED
    velocityRef.current = nextRotation - previousDragRotationRef.current
    previousDragRotationRef.current = nextRotation
    commitRotation(nextRotation)
  }

  const handlePointerEnd = (event) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    runAnimation()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      moveBy(1)
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      moveBy(-1)
    }
    if (event.key === 'Home') {
      event.preventDefault()
      velocityRef.current = 0
      commitRotation(rotationRef.current - selectedIndex)
      runAnimation()
    }
    if (event.key === 'End') {
      event.preventDefault()
      velocityRef.current = 0
      commitRotation(rotationRef.current + (itemCount - 1) - selectedIndex)
      runAnimation()
    }
  }

  const safeSelectedIndex = wrapIndex(selectedIndex, itemCount)
  const selectedItem = PROJECTS[safeSelectedIndex]

  return (
    <div className="portfolio-page">
      <div className="portfolio-toolbar">
        <a className="cv-back" href="#/">
          <span className="material-symbols-outlined">arrow_back</span>
          Kembali
        </a>
        <span className="portfolio-hint">Scroll / drag / arrow keys</span>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="portfolio-stage"
      >
        <div
          ref={stageRef}
          role="listbox"
          aria-label="Daftar project portfolio"
          aria-activedescendant={`${instanceId}-item-${safeSelectedIndex}`}
          tabIndex={0}
          className={`wheel-stage${isDragging ? ' dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onKeyDown={handleKeyDown}
        >
          <span aria-hidden="true" className="wheel-marker" />

          {PROJECTS.map((item, index) => {
            const offset = shortestOffset(index, rotation, itemCount)
            if (Math.abs(offset) > VISIBLE_ITEMS + 1) return null

            const angle = offset * SPACING
            const radians = (angle * Math.PI) / 180
            const x = -RADIUS * (1 - Math.cos(radians))
            const y = RADIUS * Math.sin(radians)
            const distance = Math.min(Math.abs(offset) / VISIBLE_ITEMS, 1)
            const opacity = Math.cos((distance * Math.PI) / 2)
            const scale = 1 - Math.min(Math.abs(offset) * 0.04, 0.45)
            const selected = Math.abs(offset) < 0.5

            return (
              <div
                id={`${instanceId}-item-${index}`}
                key={item.label}
                role="option"
                aria-selected={selected}
                className={`wheel-item${selected ? ' selected' : ''}`}
                style={{
                  opacity,
                  transform: `translate(${x}px, ${y}px) translateY(-50%) rotate(${angle}deg) scale(${scale})`,
                }}
              >
                {item.label}
              </div>
            )
          })}
        </div>

        <div className="project-panel">
          <div className="project-photo">
            <AnimatePresence initial={false} mode="sync">
              <motion.img
                key={`${safeSelectedIndex}-${selectedItem.image}`}
                src={selectedItem.image}
                alt={selectedItem.imageAlt ?? selectedItem.label}
                initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : CROSSFADE_DURATION }}
                className="project-photo-img"
                draggable={false}
              />
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={safeSelectedIndex}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
              className="project-info"
            >
              <h2 className="project-title">{selectedItem.label}</h2>
              <p className="project-summary">{selectedItem.summary}</p>
              <div className="project-tech">
                {selectedItem.tech.map((t) => (
                  <span key={t} className="tech-chip">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="project-counter">
            {safeSelectedIndex + 1} / {itemCount}
          </div>
        </div>
      </motion.div>

      <span className="sr-only" aria-live="polite">
        {selectedItem.label}, item {safeSelectedIndex + 1} of {itemCount}
      </span>
    </div>
  )
}

export default PortfolioPage
