import type { Metadata } from "next";
import { links } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donate | BreadBreakers",
};

const impactTiers = [
  "12 dollars buys one person's dinner at a BreadBreakers event.",
  "30 dollars allows us to maintain our website and advertising for one month.",
  "150 dollars is the facility rental fee for one community dinner.",
];

export default function DonatePage() {
  return (
    <section className="bg-sand px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-6 text-lg leading-relaxed text-brown-dark md:text-xl">
          <p className="text-justify">
            BreadBreakers, an initiative by Restoration United Methodist Church
            in Reston, VA, is a religiously inclusive community. We are a
            collaboration between people of all faiths and stripes. Our
            leadership, volunteer team, and community include people who attend
            Restoration and people who don&apos;t.
          </p>
          <p className="text-justify">
            Currently, the best way to donate is by clicking the button below,
            which will redirect you Restoration&apos;s Push Pay where you can
            donate to a specific BreadBreakers fund. Whatever you donate is
            only used for BreadBreakers activities, not other church activities.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={links.donate}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-brand px-8 py-3 text-lg font-semibold text-cream transition-opacity hover:opacity-90"
          >
            Donate
          </a>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {impactTiers.map((tier) => (
            <p
              key={tier}
              className="rounded-full border border-brown/15 bg-white px-6 py-5 text-center text-sm leading-relaxed text-brown-dark md:text-base"
            >
              {tier}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
