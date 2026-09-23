import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";
import { faqItems } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FAQ | BreadBreakers",
};

export default function FaqPage() {
  return (
    <section className="bg-sand px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <FaqAccordion items={faqItems} />
      </div>
    </section>
  );
}
