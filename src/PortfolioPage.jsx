import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
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
const CROSSFADE_DURATION = 0.25
const CROSSFADE_EXIT_DURATION = 0.12
const MOBILE_BREAKPOINT = 860

function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches
      : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [breakpoint])
  return isMobile
}

function ProjectCard({ item, index = 0, total = 6 }) {
  const formattedIndex = (index + 1).toString().padStart(2, '0')
  const formattedTotal = total.toString().padStart(2, '0')

  return (
    <div className="project-card">
      <div className="project-card-media">
        <img src={item.image} alt={item.imageAlt ?? item.label} loading="lazy" draggable={false} />
        <div className="project-card-media-overlay" />
        <div className="project-card-index-badge">
          {formattedIndex} / {formattedTotal}
        </div>
      </div>
      <div className="project-card-text">
        <div className="project-card-header">
          <span className="project-card-eyebrow" style={{ color: item.background }}>
            {item.eyebrow ?? 'Project'}
          </span>
        </div>
        <h2 className="project-card-title">{item.label}</h2>
        <p className="project-card-summary">{item.summary}</p>
        <div className="project-card-tech">
          {item.tech.map((t) => (
            <span key={t} className="tech-chip">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function FlipCard({ item, index, total, progress, reduceMotion }) {
  const segment = 1 / Math.max(total, 1)
  const start = index * segment
  const end = Math.min(start + segment, 1)
  const entryStart = Math.max(0, start - segment)
  const entryEnd =
    index === 0 ? 0.0001 : Math.min(start, entryStart + segment * 0.7)
  const exitStart = start
  const exitEnd = end
  const stackedCardGap = Math.min(24, 72 / Math.max(total - 1, 1))
  const stackedOffset = index * stackedCardGap
  const restingOffset = Math.min(index * 12, 34)
  const restingScale = 1 - Math.min(index * 0.012, 0.035)

  const exitYPercent = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [0, 0] : [0, -118],
  )
  const exitStackOffset = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [0, 0] : [0, stackedOffset],
  )
  const exitY = useMotionTemplate`calc(${exitYPercent}% + ${exitStackOffset}px)`
  const rotateX = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [0, 0] : [0, 22],
  )
  const opacity = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [1, 0] : [1, 1],
  )
  const entryScale = useTransform(
    progress,
    [entryStart, entryEnd],
    index === 0 ? [1, 1] : [restingScale, 1],
  )
  const entryY = useTransform(
    progress,
    [entryStart, entryEnd],
    index === 0 ? [0, 0] : [restingOffset, 0],
  )

  return (
    <motion.article
      className="flip-card"
      style={{
        y: exitY,
        rotateX,
        opacity,
        zIndex: total - index,
        transformOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      <motion.div
        className="flip-card-inner"
        style={{
          y: entryY,
          scale: entryScale,
          transformOrigin: '50% 100%',
        }}
      >
        <ProjectCard item={item} index={index} total={total} />
      </motion.div>
    </motion.article>
  )
}

function FlipStack({ items, reduceMotion }) {
  const stackRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    mass: 0.8,
    restDelta: 0.0005,
  })
  const cardProgress = reduceMotion ? scrollYProgress : smoothProgress

  return (
    <div
      ref={stackRef}
      className="flip-stack"
      style={{ height: `${(items.length + 1) * 100}vh` }}
    >
      <div className="flip-stack-sticky">
        <div className="flip-stack-stage">
          {[...items].reverse().map((item, reverseIndex) => {
            const index = items.length - reverseIndex - 1
            return (
              <FlipCard
                key={item.label}
                item={item}
                index={index}
                total={items.length}
                progress={cardProgress}
                reduceMotion={reduceMotion}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function WheelCarousel({ items, selectedIndex, onSelect }) {
  const reduceMotion = useReducedMotion() ?? false
  const instanceId = useId()
  const itemCount = items.length
  const [rotation, setRotation] = useState(selectedIndex)
  const [isDragging, setIsDragging] = useState(false)
  const stageRef = useRef(null)
  const rotationRef = useRef(selectedIndex)
  const selectedRef = useRef(selectedIndex)
  const velocityRef = useRef(0)
  const draggingRef = useRef(false)
  const dragOriginRef = useRef({ y: 0, rotation: selectedIndex })
  const previousDragRotationRef = useRef(selectedIndex)
  const frameRef = useRef(null)

  const commitRotation = useCallback(
    (nextRotation) => {
      rotationRef.current = nextRotation
      setRotation(nextRotation)
      const nextIndex = wrapIndex(Math.round(nextRotation), itemCount)
      if (nextIndex !== selectedRef.current) {
        selectedRef.current = nextIndex
        onSelect(nextIndex)
      }
    },
    [itemCount, onSelect],
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
      commitRotation(rotationRef.current - selectedRef.current)
      runAnimation()
    }
    if (event.key === 'End') {
      event.preventDefault()
      velocityRef.current = 0
      commitRotation(rotationRef.current + (itemCount - 1) - selectedRef.current)
      runAnimation()
    }
  }

  const safeSelectedIndex = wrapIndex(selectedIndex, itemCount)

  return (
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

      {items.map((item, index) => {
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
  )
}

function PortfolioPage() {
  const reduceMotion = useReducedMotion() ?? false
  const isMobile = useIsMobile()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const safeSelectedIndex = wrapIndex(selectedIndex, PROJECTS.length)
  const selectedItem = PROJECTS[safeSelectedIndex]

  const onSelect = useCallback((index) => {
    setSelectedIndex(index)
  }, [])

  if (isMobile) {
    return (
      <div className="portfolio-page">
        <div className="portfolio-toolbar">
          <a className="cv-back" href="#/">
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali
          </a>
          <span className="portfolio-hint">Scroll ke bawah</span>
        </div>

        <FlipStack items={PROJECTS} reduceMotion={reduceMotion} />

        <section className="flip-stack-end">
          <p>— Selesai —</p>
        </section>
      </div>
    )
  }

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
        <WheelCarousel
          items={PROJECTS}
          selectedIndex={safeSelectedIndex}
          onSelect={onSelect}
        />

        <div className="project-panel">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={safeSelectedIndex}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: reduceMotion ? 0 : CROSSFADE_EXIT_DURATION },
              }}
              transition={{ duration: reduceMotion ? 0 : CROSSFADE_DURATION }}
              className="project-panel-card"
            >
              <ProjectCard item={selectedItem} index={safeSelectedIndex} total={PROJECTS.length} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default PortfolioPage
