'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowUpRight, Sparkles, Circle } from 'lucide-react'
import Link from 'next/link'

export type HomeProject = {
  n: string
  t: string
  s: string
  y: string
  c: string
  slug: string
}

export default function HomeClient({ projects }: { projects: HomeProject[] }) {
  const [t, setT] = useState(0)
  const [mx, setMx] = useState(0)
  const [my, setMy] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const handler = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    let r: number
    const tick = () => {
      setT((v) => v + 0.012)
      r = requestAnimationFrame(tick)
    }
    r = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(r)
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    const fn = (e: MouseEvent) => {
      if (!ref.current) return
      const b = ref.current.getBoundingClientRect()
      setMx(((e.clientX - b.left) / b.width) * 2 - 1)
      setMy(((e.clientY - b.top) / b.height) * 2 - 1)
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [reduceMotion])

  return (
    <div ref={ref} className="min-h-screen w-full bg-black text-white overflow-hidden relative font-sans">
      {/* grain */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.07] z-50 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* gradient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute rounded-full blur-3xl opacity-40"
          style={{
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
            left: `${30 + mx * 8}%`,
            top: `${10 + my * 6}%`,
            transform: `translate(-50%,-50%) scale(${1 + Math.sin(t) * 0.05})`,
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-30"
          style={{
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, var(--color-violet) 0%, transparent 70%)',
            right: `${20 - mx * 8}%`,
            bottom: `${10 - my * 6}%`,
            transform: `translate(50%,50%) scale(${1 + Math.cos(t * 0.8) * 0.05})`,
          }}
        />
      </div>

      {/* nav */}
      <nav className="relative z-40 flex items-center justify-between px-8 md:px-14 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <div
              className="absolute inset-0 rounded-full border-2 border-white"
              style={{ transform: `rotate(${t * 60}deg)` }}
            />
            <div
              className="absolute inset-2 rounded-full bg-white"
              style={{ transform: `scale(${0.7 + Math.sin(t * 2) * 0.3})` }}
            />
          </div>
          <span className="font-bold tracking-tight text-lg">GRAVITY/OD</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm tracking-wide">
          <Link href="/work" className="hover:text-white/60 transition">WORK</Link>
          <Link href="/journal" className="hover:text-white/60 transition">JOURNAL</Link>
          <Link href="/about" className="hover:text-white/60 transition">ABOUT</Link>
          <Link href="/contact" className="hover:text-white/60 transition">CONTACT</Link>
        </div>
        <div className="flex items-center gap-2 text-xs tracking-widest text-white/60">
          <Circle className="w-2 h-2 fill-green-400 text-green-400" />
          AVAILABLE Q3
        </div>
      </nav>

      {/* hero */}
      <section className="relative z-10 px-8 md:px-14 pt-12 md:pt-20 pb-32">
        <div className="flex items-start justify-between mb-4 text-xs tracking-widest text-white/50">
          <span>PORTFOLIO / 2026</span>
          <span>ORANGE, CA — 34.0°N</span>
        </div>

        <h1
          className="font-black leading-[0.85] tracking-tighter"
          style={{ fontSize: 'clamp(3rem, 11vw, 11rem)' }}
        >
          <span className="block">DESIGN</span>
          <span className="block italic font-serif text-accent">that bends</span>
          <span className="block">
            {'gravity'.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block"
                style={{ transform: `translateY(${Math.sin(t + i * 0.3) * 4}px)` }}
              >
                {char}
              </span>
            ))}
            <span className="text-white/30">.</span>
          </span>
        </h1>

        <div className="mt-12 grid md:grid-cols-3 gap-8 items-end">
          <p className="md:col-span-2 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            Independent design & engineering studio building considered digital products. Sites, systems, and the occasional weird experiment — all crafted from the markup up.
          </p>
          <div className="flex flex-col items-start md:items-end gap-2">
            <Link
              href="/contact"
              className="group flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-accent hover:text-white transition-all"
            >
              START A PROJECT
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ticker (CSS animation, not React state) */}
      <div className="relative z-10 border-y border-white/10 py-5 overflow-hidden bg-black/40 backdrop-blur">
        <div className="flex gap-12 whitespace-nowrap animate-marquee">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 text-2xl md:text-3xl font-bold tracking-tight">
              <span>BRAND IDENTITY</span>
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="italic font-serif">web design</span>
              <Sparkles className="w-5 h-5 text-lime" />
              <span>HEADLESS CMS</span>
              <Sparkles className="w-5 h-5 text-violet" />
              <span className="italic font-serif">motion</span>
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
          ))}
        </div>
      </div>

      {/* work */}
      <section className="relative z-10 px-8 md:px-14 py-24">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="text-sm tracking-widest text-white/60">
            SELECTED WORK / {String(projects.length).padStart(2, '0')}
          </h2>
          <Link href="/work" className="text-sm tracking-widest hover:text-accent transition flex items-center gap-1">
            VIEW ARCHIVE <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="group relative py-8 md:py-10 cursor-pointer transition-all block"
              style={{ paddingLeft: hover === i ? '2rem' : '0' }}
            >
              <div
                className="absolute inset-y-0 left-0 w-1 transition-all"
                style={{
                  background: p.c,
                  transform: `scaleY(${hover === i ? 1 : 0})`,
                  transformOrigin: 'top',
                }}
              />
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 text-xs tracking-widest text-white/40">{p.n}</div>
                <div className="col-span-6 md:col-span-5">
                  <h3
                    className="font-black tracking-tighter transition-colors"
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 4rem)',
                      color: hover === i ? p.c : 'white',
                    }}
                  >
                    {p.t}
                  </h3>
                </div>
                <div className="col-span-3 text-sm text-white/60 hidden md:block">{p.s}</div>
                <div className="col-span-2 text-xs tracking-widest text-white/40 text-right">{p.y}</div>
                <div className="col-span-1 flex justify-end">
                  <ArrowUpRight
                    className="w-5 h-5 transition-transform group-hover:rotate-45"
                    style={{ color: hover === i ? p.c : 'white' }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* about */}
      <section className="relative z-10 px-8 md:px-14 py-24 border-t border-white/10">
        <div className="grid md:grid-cols-12 gap-8">
          <h2 className="md:col-span-3 text-sm tracking-widest text-white/60">ABOUT / 01</h2>
          <div className="md:col-span-9 max-w-3xl space-y-6 text-lg md:text-xl text-white/80 leading-relaxed">
            <p>
              I'm Matt — a designer-engineer hybrid based in Orange, California. I run GravityOverdose as a one-person studio, taking on a small number of projects each year where craft and outcome matter equally.
            </p>
            <p className="italic font-serif text-white/60">
              Built from the markup up. Opinionated about typography, motion, and CMS structure. Quiet about everything else.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-8 md:px-14 py-32 border-t border-white/10 text-center">
        <h2
          className="font-black tracking-tighter leading-[0.9] mx-auto max-w-5xl"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
        >
          Have a project that <span className="italic font-serif text-accent">needs gravity</span>?
        </h2>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-3 mt-12 bg-accent text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-all"
        >
          GET IN TOUCH
          <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
        </Link>
      </section>

      {/* footer */}
      <footer className="relative z-10 px-8 md:px-14 py-12 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs tracking-widest text-white/40">
        <span>© {new Date().getFullYear()} GRAVITYOVERDOSE · ORANGE, CA</span>
        <div className="flex gap-6">
          <a href="mailto:hello@gravityoverdose.com" className="hover:text-white transition">EMAIL</a>
          <a href="https://github.com/matthewdbaldwin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GITHUB</a>
          <Link href="/admin" className="hover:text-white transition">CMS</Link>
        </div>
      </footer>
    </div>
  )
}
