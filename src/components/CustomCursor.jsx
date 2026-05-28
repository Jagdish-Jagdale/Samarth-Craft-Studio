import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  useEffect(() => {
    const handleMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const handleEnter = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '60px'
        ringRef.current.style.height = '60px'
        ringRef.current.style.borderColor = '#c9982a'
      }
    }

    const handleLeave = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '40px'
        ringRef.current.style.height = '40px'
      }
    }

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.left = pos.current.x - 6 + 'px'
        dotRef.current.style.top = pos.current.y - 6 + 'px'
      }
      if (ringRef.current) {
        ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
        ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12
        ringRef.current.style.left = ringPos.current.x - 20 + 'px'
        ringRef.current.style.top = ringPos.current.y - 20 + 'px'
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMove)
    document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
      el.addEventListener('mouseenter', handleEnter)
      el.addEventListener('mouseleave', handleLeave)
    })

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="custom-cursor hidden md:block" />
      <div ref={ringRef} className="custom-cursor-ring hidden md:block" />
    </>
  )
}
