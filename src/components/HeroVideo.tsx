const YOUTUBE_VIDEO_ID = "eNzG0-Jcd3A";

const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}`);
embedUrl.searchParams.set("autoplay", "1");
embedUrl.searchParams.set("mute", "1");
embedUrl.searchParams.set("loop", "1");
embedUrl.searchParams.set("controls", "0");
embedUrl.searchParams.set("rel", "0");
embedUrl.searchParams.set("modestbranding", "1");
embedUrl.searchParams.set("playsinline", "1");
embedUrl.searchParams.set("playlist", YOUTUBE_VIDEO_ID);
embedUrl.searchParams.set("cc_load_policy", "0");
embedUrl.searchParams.set("iv_load_policy", "3");

export default function HeroVideo() {
  return (
    <section className="relative flex h-[70vh] w-full items-center justify-center overflow-hidden bg-brand md:h-[80vh]">
      <iframe
        src={embedUrl.toString()}
        title="BreadBreakers background video"
        allow="autoplay; encrypted-media; picture-in-picture"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
      />
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
