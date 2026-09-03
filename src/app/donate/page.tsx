import type { Metadata } from "next";
import Image from "next/image";
import { donateUrl, images } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donate | BreadBreakers",
  description:
    "Support BreadBreakers community dinners and help bring people together across difference.",
};

const impactTiers = [
  {
    amount: 12,
    title: "One seat at the table",
    description:
      "Covers a full meal for one guest at a BreadBreakers dinner — food, hospitality, and a place in the conversation.",
    image: images.eventPhoto,
    imageAlt: "Guests sharing a BreadBreakers community dinner",
  },
  {
    amount: 30,
    title: "Spread the word",
    description:
      "Helps us maintain our website and outreach for a month, so new neighbors can find their way to the table.",
    image: images.communityPhoto,
    imageAlt: "BreadBreakers community gathered together",
  },
  {
    amount: 150,
    title: "Host a whole dinner",
    description:
      "Covers the facility rental for one community dinner — the room where strangers become neighbors.",
    image: images.aboutMissionPhoto,
    imageAlt: "BreadBreakers community meal and conversation",
  },
];

export default function DonatePage() {
  return (
    <>
      <section className="relative min-h-[420px] overflow-hidden md:min-h-[520px]">
        <Image
          src={images.eventPhoto}
          alt="BreadBreakers community dinner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand/95 via-brand/70 to-brand/40" />
        <div className="relative flex min-h-[420px] flex-col items-center justify-end px-6 pb-14 pt-32 text-center md:min-h-[520px] md:pb-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cream/80">
            Support the movement
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-cream md:text-5xl">
            Your gift keeps the dinner table conversation going
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/95 md:text-xl">
            <span className="font-bold text-white">$12</span> provides one
            guest&apos;s meal at a BreadBreakers dinner — nourishing food and a
            night of real conversation.
          </p>
        </div>
      </section>

      <section className="bg-sand px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-5 text-lg leading-relaxed text-brown-dark">
            <p>
              BreadBreakers, an initiative by Restoration United Methodist
              Church in Reston, VA, is a religiously inclusive community. We are
              a collaboration between people of all faiths and stripes. Our
              leadership, volunteer team, and community include people who
              attend Restoration and people who don&apos;t.
            </p>
            <p>
              Donations go through Restoration&apos;s Pushpay to a dedicated
              BreadBreakers fund. Every dollar supports BreadBreakers activities
              — not other church programs.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href={donateUrl()}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#c0532a] px-10 py-4 text-lg font-bold text-white shadow-lg shadow-[#c0532a]/30 transition-all hover:bg-[#a8461f] hover:shadow-xl"
            >
              Donate now →
            </a>
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 pb-20 pt-4 md:pb-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-2xl font-bold text-brown-dark md:text-3xl">
            What your gift makes possible
          </h2>
          <p className="mb-10 text-center text-brown">
            Tap a card to donate that amount through Pushpay
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {impactTiers.map((tier) => (
              <a
                key={tier.amount}
                href={donateUrl(tier.amount)}
                target="_blank"
                rel="noreferrer"
                aria-label={`Donate $${tier.amount} — ${tier.title}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={tier.image}
                    alt={tier.imageAlt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 shadow-md">
                    <span className="text-2xl font-bold text-[#c0532a]">
                      ${tier.amount}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-brown-dark">
                    {tier.title}
                  </h3>
                  <p className="leading-relaxed text-brown">{tier.description}</p>
                  <p className="mt-4 text-sm font-semibold text-brand group-hover:underline">
                    Donate ${tier.amount} →
                  </p>
                </div>
              </a>
            ))}
          </div>

          <p className="mt-12 text-center text-brown">
            Any amount helps.{" "}
            <a
              href={donateUrl()}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand underline-offset-2 hover:underline"
            >
              Give what you can →
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
