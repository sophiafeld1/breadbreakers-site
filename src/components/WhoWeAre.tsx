import Link from "next/link";

export default function WhoWeAre() {
  return (
    <section className="bg-sand px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-bold text-brown-dark md:text-6xl">
          Who We Are
        </h2>
        <p className="text-lg leading-relaxed text-brown md:text-xl">
          In BreadBreakers, we use the ancient space of the dining table to build
          communities where people can{" "}
          <span className="font-bold italic">hear</span>, be{" "}
          <span className="font-bold italic">heard</span>, and{" "}
          <span className="font-bold italic">know</span> one another.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-brown md:text-xl">
          In a time of isolation and division, we&apos;re a neighborhood that
          spans difference, a haven of human togetherness, and a movement for
          compassionate discourse. Whether breaking bread at the dinner table or
          gathering in one of a dozen other ways, we rely on curiosity and human
          connection to work together toward a more whole world.
        </p>
        <div className="mt-8">
          <Link
            href="/events"
            className="inline-block rounded-full bg-[#c0532a] px-8 py-3 text-base font-bold text-white shadow-md shadow-[#c0532a]/30 transition-all hover:bg-[#a8461f] hover:shadow-lg"
          >
            Sign up or get involved
          </Link>
        </div>
      </div>
    </section>
  );
}
