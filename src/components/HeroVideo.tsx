import { images } from "@/lib/site";

export default function HeroVideo() {
  return (
    <section className="relative flex h-[70vh] w-full items-center justify-center overflow-hidden bg-brand md:h-[80vh]">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      >
        <source src={images.heroVideo} type="video/mp4" />
      </video>
      <div className="relative z-10 px-6 text-center">
        <h1 className="text-3xl font-bold leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
          Rebuilding the Town Square,
          <br />
          One Table at a Time
        </h1>
      </div>
    </section>
  );
}
