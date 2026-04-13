import React, { useState, useEffect } from 'react'

const Topbar = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [isPaused, setIsPaused] = useState(false)

  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState({
    days: 99,
    hours: 15,
    minutes: 12,
    seconds: 41
  })

  // Set target date (99 days from now for demonstration, or any specific date)
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 99);
    targetDate.setHours(targetDate.getHours() + 15);
    targetDate.setMinutes(targetDate.getMinutes() + 12);
    targetDate.setSeconds(targetDate.getSeconds() + 41);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const messages = [
    {
      text: `Today deal sale off 70%. End in ${timeLeft.days} days ${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}. Hurry Up →`,
      link: "#"
    },
    { text: "Welcome to our store", link: "#" },
    { text: "Free shipping on orders over $50", link: "#" }
  ]

  const handleNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % messages.length)
  }, [messages.length])

  const handlePrev = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length)
  }, [messages.length])

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext()
    }, 3000)

    return () => clearInterval(interval)
  }, [handleNext, isPaused])

  // Swipe threshold
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches ? e.targetTouches[0].clientX : e.clientX)
    setIsPaused(true)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches ? e.targetTouches[0].clientX : e.clientX)
  }

  const onTouchEnd = () => {
    setIsPaused(false)
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* TOP LINE BAR  */}
      <div
        className="bg-[#e01e5a] text-white relative overflow-hidden h-10 select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="relative h-full w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onTouchStart}
          onMouseMove={onTouchMove}
          onMouseUp={onTouchEnd}
        >
          {messages.map((message, index) => {
            let position = "translate-x-full opacity-0"
            if (index === currentIndex) {
              position = "translate-x-0 opacity-100"
            } else if (
              index === (currentIndex - 1 + messages.length) % messages.length
            ) {
              position = "-translate-x-full opacity-0"
            }

            return (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform ${position} ${index !== currentIndex ? "pointer-events-none" : ""}`}
              >
                <a
                  href={message.link}
                  className="text-sm font-medium hover:underline text-center px-10"
                  onClick={(e) => isPaused && e.preventDefault()} // Prevent click if dragging
                >
                  {message.text}
                </a>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 transition-colors flex items-center gap-1 text-xs z-20 bg-[#e01e5a] pl-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span className="hidden sm:inline">close</span>
        </button>
      </div>
    </>
  )
}

export default Topbar