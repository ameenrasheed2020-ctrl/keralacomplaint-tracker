import { useState, useEffect, useRef } from 'react'

let instanceId = 0

const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
  const id = useRef(++instanceId)
  const storageKey = `kct_counter_${id.current}`

  const [count, setCount] = useState(() => {
    return sessionStorage.getItem(storageKey) ? end : 0
  })
  const ref = useRef(null)
  const counted = useRef(
    sessionStorage.getItem(storageKey) === '1',
  )

  useEffect(() => {
    if (counted.current) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const start = performance.now()

          const animate = (now) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(animate)
          }

          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  useEffect(() => {
    if (count === end && end > 0) {
      sessionStorage.setItem(storageKey, '1')
    }
  }, [count, end, storageKey])

  return <span ref={ref}>{count}{suffix}</span>
}

export default AnimatedCounter
