import React, { useEffect, useRef, useState } from "react"
import { ArrowDown, Eye } from "lucide-react"
import { animate, stagger } from "animejs"
import { Link } from "react-router-dom"

// 1. Attendance Data
const ATTENDANCE_METHODS = [
  {
    id: "meth_1",
    title: "Face Recognition",
    handle: "face-recognition",
    thumbnail: "/features/face-recognition.jpg",
    description: "Fast AI face matching mapped against enrolled biometric profiles. Sub-second verification without manual effort.",
    collection: {
      title: "Core Feature"
    },
    price: "Instant",
    colors: [],
    sizes: []
  },
  {
    id: "meth_2",
    title: "Dynamic QR",
    handle: "dynamic-qr",
    thumbnail: "/features/dynamic-qr.jpg",
    description: "Time-rotating QR codes projected by teachers to prevent proxy scanning. Perfect for smartboard equipped classes.",
    collection: {
      title: "Core Feature"
    },
    price: "Secure",
    colors: [],
    sizes: []
  },
  {
    id: "meth_3",
    title: "Secure OTP",
    handle: "secure-otp",
    thumbnail: "/features/secure-otp.jpg",
    description: "Time-bound One Time Passwords for fast marking in large classrooms, bridging the gap when hardware is limited.",
    collection: {
      title: "Core Feature"
    },
    price: "Scalable",
    colors: [],
    sizes: []
  },
  {
    id: "meth_4",
    title: "Manual Override",
    handle: "manual-override",
    thumbnail: "/features/manual-override.jpg",
    description: "Granular control for faculty to adjust attendance for exceptions and late arrivals with full audit logging.",
    collection: {
      title: "Admin Control"
    },
    price: "Flexible",
    colors: [],
    sizes: []
  }
]

// 2. Minimal Product Card Component
function MinimalProductCard({ product }: { product: typeof ATTENDANCE_METHODS[0] }) {
  const fullImageUrl = product.thumbnail ?? ""
  const cardRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    const card = cardRef.current
    if (!card) return

    const touch = e.touches[0]
    const rect = card.getBoundingClientRect()
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100

    card.style.setProperty("--reveal-x", `${String(x)}%`)
    card.style.setProperty("--reveal-y", `${String(y)}%`)
    setActive(true)
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    card.style.setProperty("--reveal-x", `${String(x)}%`)
    card.style.setProperty("--reveal-y", `${String(y)}%`)
    setActive(true)
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onMouseLeave={() => setActive(false)}
      className="group relative block w-full h-full bg-transparent overflow-hidden border border-border/30 hover:border-primary/50 transition-colors duration-700"
    >
      {/* Image Section */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        {/* Background: Grayscale Image */}
        {fullImageUrl && (
          <img
            src={fullImageUrl}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 ease-out"
          />
        )}

        {/* Foreground: Color Image (Clipped by circle) */}
        {fullImageUrl && (
          <div
            className="absolute inset-0 w-full h-full transition-all duration-1000 ease-out"
            style={{
              clipPath: `circle(${
                active ? "150%" : "0%"
              } at var(--reveal-x, 50%) var(--reveal-y, 50%))`,
              transition: "clip-path 2.8s cubic-bezier(0.15, 0.85, 0.35, 1)",
            }}
          >
            <img
              src={fullImageUrl}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        {/* Subtle dark gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      </div>

      {/* Typography Section */}
      <div className="flex flex-col items-center justify-center text-center p-3 sm:p-6 md:p-8 bg-transparent relative z-20">
        <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-[0.4em] mb-1 sm:mb-3 font-light">
          {product.collection?.title}
        </span>

        <h4 className="text-xs sm:text-sm md:text-base uppercase font-normal text-foreground mb-2 sm:mb-4 w-full line-clamp-2 transition-colors duration-500 tracking-widest">
          {product.title}
        </h4>

        <div className="flex items-center justify-center">
          <span className="text-[10px] sm:text-xs font-light tracking-[0.15em] text-foreground/80 group-hover:text-foreground transition-colors duration-500">
            {product.price}
          </span>
        </div>
      </div>

      {/* Decorative Architectural Corners */}
      <div className="absolute top-0 left-0 w-8 h-[1px] bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
      <div className="absolute top-0 left-0 w-[1px] h-8 bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
      <div className="absolute top-0 right-0 w-8 h-[1px] bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
      <div className="absolute top-0 right-0 w-[1px] h-8 bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
    </div>
  )
}

// 3. Product Hero Component
function ProductHero({ product, reversed = false }: { product: typeof ATTENDANCE_METHODS[0]; reversed?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const fullImageUrl = product.thumbnail ?? ""

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const mask = section.querySelector<HTMLElement>(".color-mask")

      let progress = 0

      if (window.innerWidth < 768) {
        const elementTop = rect.top
        const startReveal = windowHeight
        const endReveal = windowHeight * 0.25

        const totalDistance = startReveal - endReveal
        const currentDistance = startReveal - elementTop

        progress = currentDistance / totalDistance
      } else {
        if (rect.top <= 0) {
          const totalScrollableDistance = rect.height - windowHeight
          if (totalScrollableDistance > 0) {
            progress = Math.abs(rect.top) / totalScrollableDistance
          }
        }
      }

      progress = Math.min(Math.max(progress, 0), 1)

      if (mask) {
        if (window.innerWidth < 768) {
          mask.style.clipPath = `inset(0 ${100 - progress * 100}% 0 0)`
        } else {
          mask.style.clipPath = `inset(0 0 ${100 - progress * 100}% 0)`
        }
      }

      const revealSteps = section.querySelectorAll(".reveal-step")
      revealSteps.forEach((step) => {
        const startProgress = parseFloat(
          step.getAttribute("data-progress") || "0"
        )
        if (progress > startProgress) {
          step.classList.add("active")
        } else {
          step.classList.remove("active")
        }
      })
    }

    handleScroll()

    window.addEventListener("resize", handleScroll)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("resize", handleScroll)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      className="scroll-section relative h-auto md:h-[250vh] w-full group"
    >
      <div className="relative md:sticky md:top-0 md:left-0 w-full h-auto md:h-screen overflow-hidden bg-transparent">
        <div className="w-full h-auto md:h-full grid grid-cols-1 md:grid-cols-2">
          {/* Images Side */}
          <div
            className={`relative w-full flex items-center justify-center p-3 sm:p-8 md:p-0 max-w-[400px] sm:max-w-[480px] md:max-w-none mx-auto ${
              reversed ? "md:order-2" : ""
            }`}
          >
            <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-full overflow-hidden rounded-2xl md:rounded-none">
              {/* Background: Grayscale Image */}
              <div className="absolute inset-0 w-full h-full flex justify-center bg-transparent">
                {fullImageUrl && (
                  <img
                    src={fullImageUrl}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale brightness-110"
                  />
                )}
              </div>

              {/* Foreground: Color Image (Clipped by clipPath) */}
              <div
                className="color-mask absolute inset-0 w-full h-full flex justify-center will-change-[clip-path]"
                style={{ clipPath: "inset(0 0 100% 0)" }}
              >
                {fullImageUrl && (
                  <img
                    src={fullImageUrl}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div
            className={`flex items-center justify-center py-5 px-6 md:p-12 relative z-20 ${
              reversed ? "md:order-1" : ""
            }`}
          >
            <div className="max-w-sm md:max-w-md w-full flex flex-col gap-6 md:gap-10">
              {/* Step 1: Title & Price */}
              <div
                className="reveal-step transition-all duration-1000 ease-out opacity-0 translate-y-12 [&.active]:opacity-100 [&.active]:translate-y-0"
                data-progress="0.2"
              >
                <h2 className="text-lg sm:text-xl md:text-4xl font-semibold tracking-tight text-foreground mb-3">
                  {product.title}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-base sm:text-xl font-medium text-foreground">
                    {product.price}
                  </span>
                </div>
              </div>

              {/* Step 2: Description */}
              <div
                className="reveal-step transition-all duration-1000 ease-out opacity-0 translate-y-12 [&.active]:opacity-100 [&.active]:translate-y-0"
                data-progress="0.4"
              >
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground font-light text-justify pt-6 border-t border-border/50">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 4. Main Unified Mock Component
export function CinematicAttendanceSection() {
  const finalTitle = "FLEXIBLE ATTENDANCE"
  const finalSubtitle = "VERISYNC OS"
  const finalDescription = "VeriSync adapts to your classroom needs, ensuring attendance is recorded accurately and quickly."
  const finalButtonText = "Start System"

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const finalCollectionRef = useRef<HTMLDivElement>(null)
  const animeTriggered = useRef(false)

  useEffect(() => {
    if (!finalCollectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animeTriggered.current) {
          if (!finalCollectionRef.current) return
          animeTriggered.current = true
          
          animate(finalCollectionRef.current.querySelectorAll('.anime-card'), {
            translateY: [-200, 0],
            opacity: [0, 1],
            delay: stagger(150),
            duration: 1000,
            easing: 'easeOutElastic(1, .6)'
          })
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(finalCollectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleContainerScroll = () => {
      const indicator = scrollIndicatorRef.current
      const track = indicator?.parentElement
      if (!indicator || !track) return

      const maxScroll = container.scrollWidth - container.clientWidth
      if (maxScroll <= 0) {
        track.style.display = "none"
        return
      } else {
        track.style.display = "block"
      }

      const scrollPercentage =
        (Math.abs(container.scrollLeft) / maxScroll) * 100
      indicator.style.left = `${scrollPercentage * 0.666}%`
    }

    container.addEventListener("scroll", handleContainerScroll, {
      passive: true,
    })
    const timeoutId = setTimeout(handleContainerScroll, 100)

    window.addEventListener("resize", handleContainerScroll)

    return () => {
      container.removeEventListener("scroll", handleContainerScroll)
      window.removeEventListener("resize", handleContainerScroll)
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const gridItems = containerRef.current.querySelectorAll(
      ".grid-item, .reveal"
    )

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px",
    }

    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show", "active")
        }
      })
    }, observerOptions)

    gridItems.forEach((item) => {
      gridObserver.observe(item)
    })

    return () => {
      gridObserver.disconnect()
    }
  }, [])

  const mainTitleParts = finalTitle.split(" ")
  const mainTitleFirst = mainTitleParts[0]
  const mainTitleRest = mainTitleParts.slice(1).join(" ")

  return (
    <div
      ref={containerRef}
      className="bg-transparent text-foreground antialiased selection:bg-primary selection:text-primary-foreground w-full animate-fade-in"
    >
      {/* Intro Section - Cinematic Version */}
      <section className="relative h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden bg-transparent">

        {/* Light Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-muted-foreground/10 blur-[150px] rounded-full"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 -mt-16 md:-mt-32 w-full flex flex-col items-center justify-center">
          <div className="overflow-hidden mb-4 md:mb-6 w-full flex justify-center">
            <span
              className="block text-[9px] md:text-[10px] font-black text-muted-foreground uppercase reveal text-center tracking-[0.3em] md:tracking-[0.8em] ps-[0.3em] md:ps-[0.8em]"
              style={{ animationDelay: "0.2s" }}
            >
              {finalSubtitle}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-[6rem] lg:text-[8rem] font-black leading-[0.85] text-foreground w-full flex flex-col items-center justify-center text-center tracking-tighter">
            <div className="overflow-hidden w-full flex justify-center">
              <span
                className="block reveal text-center"
                style={{ animationDelay: "0.4s" }}
              >
                {mainTitleFirst}
              </span>
            </div>
            <div className="overflow-hidden mt-2 w-full flex justify-center">
              <span
                className="block italic font-light text-muted-foreground reveal text-center"
                style={{ animationDelay: "0.6s" }}
              >
                {mainTitleRest}
              </span>
            </div>
          </h1>

          <div className="mt-6 md:mt-12 overflow-hidden w-full flex justify-center">
            <p
              className="text-muted-foreground text-center text-sm md:text-base max-w-lg font-light leading-relaxed tracking-wide reveal"
              style={{ animationDelay: "0.8s" }}
            >
              {finalDescription}
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-8 md:bottom-12 flex flex-col items-center gap-4 reveal"
          style={{ animationDelay: "1.2s" }}
        >
          <div className="w-[1px] h-12 md:h-20 bg-foreground/10 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-transparent via-foreground/50 to-transparent animate-scroll-light"></div>
          </div>
          <span className="text-[9px] font-bold text-foreground/40 tracking-normal">
            SCROLL DOWN
          </span>
        </div>
      </section>

      {/* Products - Render ProductHero for each item */}
      {ATTENDANCE_METHODS.map((product, index) => (
        <ProductHero key={product.id} product={product} reversed={index % 2 !== 0} />
      ))}

      {/* Summary Horizontal Collection - Using the same items */}
      <div
        ref={finalCollectionRef}
        id="final-collection"
        className="bg-transparent w-full pt-12 pb-4 md:pt-16 md:pb-6 border-t border-border"
      >
        <div className="w-full max-w-7xl mx-auto px-2">
          <div className="flex items-end justify-between border-b border-border pb-4 mb-8">
            <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase block">
              OVERVIEW
            </span>
            <Link
              to="/login"
              className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase text-foreground hover:text-muted-foreground transition-colors"
            >
              <span className="tracking-[0.2em]">{finalButtonText}</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform -rotate-90 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Horizontal Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-8 pb-8 no-scrollbar snap-x snap-mandatory justify-start md:justify-center"
          >
            {ATTENDANCE_METHODS.map((product) => (
              <div
                key={product.id}
                className="anime-card grid-item group cursor-pointer w-[calc(50%-8px)] min-w-[calc(50%-8px)] max-w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] sm:min-w-[calc(33.333%-11px)] sm:max-w-[calc(33.333%-11px)] md:w-[300px] md:min-w-[300px] md:max-w-[320px] snap-center flex-shrink-0 opacity-0"
              >
                <MinimalProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Horizontal Scroll Progress Bar */}
          <div className="w-24 h-[2px] bg-foreground/10 mx-auto mt-2 rounded-full overflow-hidden relative">
            <div
              ref={scrollIndicatorRef}
              className="h-full bg-foreground w-8 rounded-full absolute left-0 transition-all duration-75"
              style={{ left: "0%" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
