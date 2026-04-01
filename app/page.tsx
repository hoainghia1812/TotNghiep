import { EnvelopeHero } from "@/components/graduation/EnvelopeHero";
import { InvitationSection } from "@/components/graduation/InvitationSection";
import { AboutSection } from "@/components/graduation/AboutSection";
import { ReflectionSection } from "@/components/graduation/ReflectionSection";
import { RSVPGuestbook } from "@/components/graduation/RSVPGuestbook";
import { EventMap } from "@/components/graduation/EventMap";

export default function Home() {
  return (
    <>
      <EnvelopeHero />
      <main className="relative">
        <InvitationSection />
        <AboutSection />
        <ReflectionSection />
        <RSVPGuestbook />
        <EventMap />
        <footer className="border-t border-[var(--ocean-300)]/50 bg-[var(--ocean-950)] px-5 py-10 text-center text-sm text-white/55">
          <p className="font-display text-base text-white/75">Cảm ơn bạn đã đồng hành.</p>
          <p className="mt-2">Thiết kế cho Lễ Tốt Nghiệp — với tông Ocean Blue &amp; Mint.</p>
        </footer>
      </main>
    </>
  );
}
