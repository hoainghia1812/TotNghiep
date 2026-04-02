import { EnvelopeHero } from "@/components/graduation/EnvelopeHero";
import { InvitationSection } from "@/components/graduation/InvitationSection";
import { AboutSection } from "@/components/graduation/AboutSection";
import { RSVPGuestbook } from "@/components/graduation/RSVPGuestbook";

export default function Home() {
  return (
    <>
      <EnvelopeHero />
      <main className="relative min-w-0 overflow-x-hidden">
        <InvitationSection />
        <AboutSection />
        <RSVPGuestbook />
      </main>
    </>
  );
}
