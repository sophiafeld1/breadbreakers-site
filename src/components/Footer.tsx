import Image from "next/image";
import Link from "next/link";
import { images, links } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-brown/25 bg-sand px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <Image
              src={images.facebookIcon}
              alt="Facebook"
              width={40}
              height={40}
              className="h-20 w-20"
            />
          </Link>
          <Link
            href={links.meetup}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Meetup"
          >
            <Image
              src={images.meetupLogo}
              alt="Meetup"
              width={80}
              height={32}
              className="h-16 w-auto"
            />
          </Link>
        </div>
        <div className="text-center text-brown md:flex-1">
          <Link
            href={links.email}
            className="text-lg hover:underline"
          >
            breadbreakersinfo@gmail.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
