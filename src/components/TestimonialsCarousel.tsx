import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/site-data";

const AUTOPLAY_MS = 6000;

export function TestimonialsCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const total = TESTIMONIALS.length;
  const testimonial = TESTIMONIALS[i];
  const go = (n: number) => setI((n + total) % total);
  const next = () => setI((x) => (x + 1) % total);
  const prev = () => setI((x) => (x - 1 + total) % total);

  useEffect(() => {
    if (paused || total <= 1) return;

    const id = window.setInterval(() => {
      setI((x) => (x + 1) % total);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [paused, total]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;

    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchX.current = null;
  };

  return (
    <div
      className="relative max-w-3xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <div className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12 min-h-[340px]">
        <article key={i} className="animate-testimonial-in">
          <div className="flex items-center gap-1 mb-5 text-[hsl(45,100%,55%)]">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className="size-4 fill-current" />
            ))}
          </div>
          <blockquote className="text-xl sm:text-2xl leading-relaxed font-display">
            "{testimonial.quote}"
          </blockquote>
          <div className="mt-7 flex items-center gap-4">
            <div
              aria-hidden
              className="size-12 rounded-full gradient-brand grid place-items-center text-background font-semibold text-sm"
            >
              {testimonial.initials}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{testimonial.name}</div>
              <div className="text-sm text-muted-foreground">
                {testimonial.role} - {testimonial.business}
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Result</div>
              <div className="text-sm font-medium text-gradient">{testimonial.result}</div>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="size-10 rounded-full border border-border bg-card/60 hover:bg-card grid place-items-center transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex items-center gap-2" role="tablist">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={idx === i}
              aria-label={`Go to testimonial ${idx + 1}`}
              onClick={() => go(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === i
                  ? "w-8 bg-foreground"
                  : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next testimonial"
          className="size-10 rounded-full border border-border bg-card/60 hover:bg-card grid place-items-center transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
