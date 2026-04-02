import { about } from "@/components/graduation/site-config";
import { ScrollReveal } from "@/components/graduation/ScrollReveal";

export function AboutSection() {
  return (
    <section className="px-5 py-20 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] md:px-10 md:py-28">
      <div className="mx-auto min-w-0 max-w-3xl">
        <ScrollReveal>
          <h2 className="font-display text-center text-3xl font-semibold text-(--ocean-950) md:text-4xl">
            Về tôi
          </h2>
          <div className="mx-auto mt-4 h-px w-24 bg-linear-to-r from-transparent via-(--gold) to-transparent" />
        </ScrollReveal>

        <ScrollReveal className="mt-12" delayMs={120}>
          <div className="rounded-3xl border border-white/80 bg-linear-to-br from-white to-[#eef8f4] p-6 shadow-lg shadow-(--ocean-900)/10 sm:p-8 md:p-12">
            <p className="font-display text-2xl font-medium text-(--ocean-900)">{about.name}</p>
            <p className="mt-2 font-sans text-sm font-semibold uppercase tracking-wider text-(--mint-600)">
              {about.degree}
            </p>
            <p className="mt-6 whitespace-pre-line font-sans leading-relaxed text-(--ocean-800)/95">
              {about.bio}
            </p>
            <blockquote className="font-display mt-10 border-l-4 border-(--gold) pl-6 text-xl italic leading-snug text-(--ocean-800) md:text-2xl">
              “{about.quote}”
            </blockquote>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
