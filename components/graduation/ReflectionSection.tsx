import Image from "next/image";
import { about, reflection } from "@/components/graduation/site-config";
import { ScrollReveal } from "@/components/graduation/ScrollReveal";

export function ReflectionSection() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="font-display text-center text-3xl font-semibold text-[var(--ocean-950)] md:text-4xl">
            {reflection.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-[var(--ocean-700)]">
            {reflection.lead}
          </p>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal
            className="relative order-1 min-h-[280px] md:min-h-[360px] lg:min-h-0"
            delayMs={80}
          >
            <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-[var(--ocean-300)]/40 shadow-[0_28px_60px_-28px_rgba(15,39,68,0.45)] lg:max-w-none">
              <Image
                src={reflection.imageSrc}
                alt={reflection.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[var(--ocean-950)]/25 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          </ScrollReveal>

          <ScrollReveal className="order-2 flex" delayMs={140} variant="left">
            <div className="reflection-paper flex w-full flex-col rounded-2xl border border-[var(--gold-soft)] bg-[#fdfbf7] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_50px_-24px_rgba(15,39,68,0.2)] md:p-10">
              <div
                className="font-display text-lg font-medium italic text-[var(--ocean-800)] md:text-xl"
                aria-hidden
              >
                —
              </div>
              <div className="mt-6 space-y-6">
                {reflection.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-[0.98rem] leading-[1.85] text-[var(--ocean-900)]/92 md:text-[1.02rem]"
                  >
                    {p}
                  </p>
                ))}
              </div>
              <p className="mt-10 font-display text-right text-lg text-[var(--ocean-700)]">
                — {about.name}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
