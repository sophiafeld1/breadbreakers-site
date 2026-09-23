import type { Metadata } from "next";
import ImageSlideshow from "@/components/ImageSlideshow";
import { aboutSlideshowImages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Mission | BreadBreakers",
  description:
    "Building communities where people of all stripes can truly belong together.",
};

const ingredients = [
  {
    title: "Curiosity",
    description:
      "We restrain our instincts to \"win\" and instead immerse ourselves in each others' thoughts and stories. This takes intentional effort—but it shifts us from a posture of combat to one where deeper understanding is possible.",
  },
  {
    title: "Storytelling",
    description:
      "Our stories are the windows to our humanity. They are the fairy dust that brings the abstract to life, animating intellectualized discussions with real stakes, lived experience, and unignorable feeling.",
  },
  {
    title: "Compassion",
    description:
      "BreadBreakers is about opening hearts. Going beyond polite respect and practicing Agape Love— unconditional, nontransactional, indiscriminate between friend and foe—until it is no longer a discipline, but an instinct.",
  },
  {
    title: "The Personal",
    description:
      "Without this, our conversations \"could've been an email\" (or a book, or a news article, or a...) We're seeking deeper understanding of people as well as substance. Not just what you believe— why you believe it, how that connects with your story, identity, and decisions.",
  },
  {
    title: "Extravagant Grace",
    description:
      "Mistakes are assumed. We commit to growth and learning, not purity. Kindness is unearned, benefit of the doubt freely given. We greet conflict with open, honest conversation, and remember \"it could have been me\"; more often, \"it was me.\"",
  },
  {
    title: "Community",
    description:
      "The core of BreadBreakers is to get to know your community and build a stronger one around you.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <section className="bg-brand px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold text-cream md:text-5xl">
            What is BreadBreakers?
          </h1>
        </div>
      </section>

      <section className="bg-brand px-6 pb-16 md:pb-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-14">
          <ImageSlideshow
            images={[...aboutSlideshowImages]}
            className="aspect-[3/4] w-full md:min-h-[480px]"
          />
          <div className="text-cream">
            <h2 className="text-lg font-semibold leading-relaxed md:text-xl">
              Our Vision: To ignite a movement of compassion that brings new
              wholeness to our communities and discourse.
            </h2>
            <h2 className="mt-6 text-lg font-semibold leading-relaxed md:text-xl">
              Our Mission: Building communities where people of all stripes can
              truly belong together, authentically know one another, and
              productively discuss things that matter.
            </h2>
            <h3 className="mt-8 text-xl font-semibold md:text-2xl">
              Here&apos;s how it works:
            </h3>
            <blockquote className="mt-4 border-l-4 border-cream pl-4 text-lg leading-relaxed md:text-xl">
              For just two hours, multiple tables of people set aside the need to
              &quot;win&quot; and instead focus on sharing, listening, and
              connecting. Guided by experienced table hosts, we&apos;ll tell our
              stories, try to understand each other, and practice being in
              community with those with different views or backgrounds.
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-sand px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-brown-dark md:text-4xl">
            The Six Main Ingredients
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {ingredients.map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-white p-6 text-center shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="mb-3 text-xl font-bold text-brown-dark">
                  {item.title}
                </h3>
                <p className="leading-relaxed text-brown">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
