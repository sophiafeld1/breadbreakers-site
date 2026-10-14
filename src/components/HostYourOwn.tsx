"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { images, links } from "@/lib/site";

type Tab = "come" | "train";

const processSteps = [
  {
    title: "We Meet You",
    description:
      "We don't just want to equip you — we want to know you. What's your story, your local context, and how can we support you?",
    background: "hsl(213, 32%, 88%)",
    lightText: false,
  },
  {
    title: "We Help You Build a Team",
    description:
      "It's hard to build a community alone! We'll help you identify and recruit the people who'll build it with you.",
    background: "hsl(212, 31%, 80%)",
    lightText: false,
  },
  {
    title: "We Train You",
    description:
      "How do you facilitate productive dialogue and create a space of intentional compassion? We'll teach you our method, which we've refined over several years and taught to dozens of table hosts.",
    background: "hsl(212, 31%, 68%)",
    lightText: false,
  },
  {
    title: "We Coach You — Through Launch and Beyond",
    description:
      "You make the community yours, and we'll be there to support you as you grow — whether that's with mentorship, how-to guides, or just an encouraging text. You're not just joining a movement — you're joining a community of communities, with people you can lean on all across the country.",
    background: "hsl(214, 34%, 48%)",
    lightText: true,
  },
];

export default function HostYourOwn() {
  const [activeTab, setActiveTab] = useState<Tab>("come");

  useEffect(() => {
    if (window.location.hash === "#start-a-chapter") {
      setActiveTab("train");
    }
  }, []);

  function selectTab(tab: Tab) {
    setActiveTab(tab);
    const hash = tab === "train" ? "#start-a-chapter" : "#we-come-to-you";
    window.history.replaceState(null, "", hash);
  }

  return (
    <>
      <section className="hyo-section">
        <div className="hyo-wrap">
          <h1 className="hyo-title">Host Your Own</h1>
          <p className="hyo-lede">
            Two ways to bring BreadBreakers to your community. Choose the path
            that fits you.
          </p>

          <div
            className="hyo-tabs"
            role="tablist"
            aria-label="Ways to host BreadBreakers"
          >
            <button
              type="button"
              className={`hyo-tab ${activeTab === "come" ? "is-active" : ""}`}
              role="tab"
              aria-selected={activeTab === "come"}
              aria-controls="hyo-panel-come"
              onClick={() => selectTab("come")}
            >
              We come to you and do it
            </button>
            <button
              type="button"
              className={`hyo-tab ${activeTab === "train" ? "is-active" : ""}`}
              role="tab"
              aria-selected={activeTab === "train"}
              aria-controls="hyo-panel-train"
              onClick={() => selectTab("train")}
            >
              We train you to start a chapter
            </button>
          </div>

          <div
            id="hyo-panel-come"
            className="hyo-panel"
            role="tabpanel"
            hidden={activeTab !== "come"}
          >
            <p className="hyo-sell">
              Want the experience without building it from scratch? We&apos;ll
              bring a BreadBreakers gathering to your community — and run it with
              you.
            </p>
            <ul className="hyo-values">
              <li>
                <h4>Wholeness</h4>
                <p>
                  Come as your whole self. Be heard, not managed — emotions,
                  values, and story all welcome at the table.
                </p>
              </li>
              <li>
                <h4>Community</h4>
                <p>
                  Strangers become neighbors. One shared meal turns a room of
                  individuals into people who know each other.
                </p>
              </li>
              <li>
                <h4>Fun &amp; engagement</h4>
                <p>
                  Real conversation people actually enjoy — warm, surprising, and
                  genuinely alive.
                </p>
              </li>
              <li>
                <h4>Healing the rift</h4>
                <p>
                  Bridge the divides that isolate us. Understanding grows across
                  difference, one table at a time.
                </p>
              </li>
            </ul>
            <p className="hyo-subhead">How it works</p>
            <ol className="hyo-steps">
              <li>
                <b>We show up.</b> Our team brings the BreadBreakers method — the
                format, the questions, the table hosting — to your space.
              </li>
              <li>
                <b>You invite.</b> Gather your people. You know your community
                best; we&apos;ll help you shape the guest list and the evening.
              </li>
              <li>
                <b>We help.</b> We host alongside you, guide the tables, and make
                sure the night works — so you can simply be part of it.
              </li>
            </ol>
            <div className="hyo-note">
              <b>There&apos;s a fee.</b> As a nonprofit, we ask for a contribution
              to cover our team&apos;s time and travel — and we work to keep it
              within reach. Reach out and we&apos;ll find something that fits your
              community.
            </div>
            <div className="hyo-cta">
              <a href={links.email}>Invite us to your community →</a>
            </div>
          </div>

          <div
            id="hyo-panel-train"
            className="hyo-panel"
            role="tabpanel"
            hidden={activeTab !== "train"}
          >
            <p className="hyo-sell">
              Ready to build something lasting? We&apos;ll train and support you
              to start a BreadBreakers community of your own.
            </p>
          </div>
        </div>
      </section>

      {activeTab === "train" && (
        <>
          <section className="bg-white px-6 py-12 md:py-16">
            <div className="mx-auto grid max-w-5xl items-stretch gap-0 overflow-hidden md:grid-cols-2">
              <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[420px]">
                <Image
                  src={images.hostYourOwnPhoto}
                  alt="BreadBreakers community gathering"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4 bg-brand px-6 py-10 text-center md:px-10 md:text-left">
                <h2 className="text-xl font-semibold leading-relaxed text-[#f8f5f5] md:text-2xl">
                  Do it with your faith congregation, your club, or just a few
                  neighbors
                </h2>
                <h2 className="text-xl font-semibold leading-relaxed text-[#f8f5f5] md:text-2xl">
                  You build the community — we coach you every step of the way
                </h2>
              </div>
            </div>
            <div className="hyo-cta mt-8">
              <a href={links.email}>
                Contact us here to learn more or get started
              </a>
            </div>
          </section>

          <section className="bg-white px-6 pb-16 md:pb-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 bg-[#c0532a] py-6 text-center text-3xl font-bold text-white md:text-4xl">
                The Process in a Nutshell
              </h2>

              <div className="space-y-5">
                {processSteps.map((step) => (
                  <div
                    key={step.title}
                    className="px-5 py-4"
                    style={{ backgroundColor: step.background }}
                  >
                    <h4
                      className={`mb-3 text-lg font-bold ${step.lightText ? "text-white" : "text-brown-dark"}`}
                    >
                      {step.title}
                    </h4>
                    <p
                      className={`leading-relaxed ${step.lightText ? "text-white/95" : "text-brown-dark"}`}
                    >
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-brown-dark px-6 py-8 text-center text-lg text-white">
                If interested please email us at:{" "}
                <a
                  href={links.email}
                  className="font-semibold underline-offset-2 hover:underline"
                >
                  breadbreakersinfo@gmail.com
                </a>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
