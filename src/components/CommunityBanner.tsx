import Image from "next/image";
import Link from "next/link";
import { images, links } from "@/lib/site";

export default function CommunityBanner() {
  return (
    <section className="bg-brand px-6 py-16 md:py-20">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={images.communityPhoto}
            alt="BreadBreakers community dinner"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="text-center text-cream md:text-left">
          <p className="text-lg leading-relaxed md:text-xl">
            BreadBreakers, an initiative by{" "}
            <Link
              href={links.restorationChurch}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              Restoration United Methodist Church
            </Link>{" "}
            in Reston, VA, is a religiously inclusive community. We are a
            collaboration between people of all faiths and stripes.
          </p>
          <p className="mt-6 text-lg leading-relaxed md:text-xl">
            Our leadership, volunteer team, and community include people who
            attend Restoration and people who don&apos;t.
          </p>
        </div>
      </div>
    </section>
  );
}
