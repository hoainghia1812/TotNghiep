import { timelineItems } from "@/components/graduation/site-config";
import { ScrollReveal } from "@/components/graduation/ScrollReveal";

export function JourneyTimeline() {
  return (
    <section className="bg-[var(--ocean-950)] px-5 py-20 text-[var(--cream)] md:px-10 md:py-28">
      <div className="mx-auto max-w-2xl">
        <ScrollReveal>
          <h2 className="font-display text-center text-3xl font-semibold md:text-4xl">
            Chặng đường
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-sm text-white/65">
            Những mốc son nhỏ bé — ghép lại thành một hành trình đáng nhớ.
          </p>
        </ScrollReveal>

        <div className="relative mt-16 md:mt-20">
          <div
            className="absolute left-[0.6rem] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--mint-400)] via-[var(--ocean-400)] to-[var(--ocean-700)]/40 md:left-1/2 md:-ml-px"
            aria-hidden
          />

          <ul className="space-y-12 md:space-y-14">
            {timelineItems.map((item, i) => (
              <li
                key={item.title}
                className="relative grid grid-cols-1 gap-2 pl-10 md:grid-cols-2 md:gap-10 md:pl-0"
              >
                <div
                  className="absolute left-0 top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--gold)] bg-[var(--ocean-900)] shadow-[0_0_0_5px_rgba(10,22,40,0.45)] md:left-1/2 md:-ml-2.5"
                  aria-hidden
                >
                  <span className="h-2 w-2 rounded-full bg-[var(--mint-400)]" />
                </div>

                <ScrollReveal
                  variant={i % 2 === 0 ? "left" : "right"}
                  className={`md:col-span-1 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"}`}
                  delayMs={i * 90}
                >
                  <span className="font-display text-3xl font-semibold text-[var(--mint-300)]">
                    {item.year}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{item.text}</p>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
