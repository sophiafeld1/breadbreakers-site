export type FaqInlinePart =
  | { type: "text"; content: string }
  | { type: "email"; address: string }
  | { type: "link"; href: string; label: string }
  | { type: "internal-link"; href: string; label: string };

export type FaqItem = {
  question: string;
  paragraphs: FaqInlinePart[][];
};

export const faqItems: FaqItem[] = [
  {
    question: "Can I volunteer?",
    paragraphs: [
      [
        {
          type: "text",
          content:
            "Yes! We have in person volunteer opportunities in Reston, Virginia but anyone can volunteer virtually. Volunteers can help with social media, outreach, website maintenance, development, and more. Email us @",
        },
        { type: "email", address: "BreadBreakersInfo@gmail.com" },
        { type: "text", content: " to learn more." },
      ],
    ],
  },
  {
    question: "Who is welcome at a dinner?",
    paragraphs: [
      [
        {
          type: "text",
          content:
            "All races, sexualities, political affiliations, and cultures are not only welcomed at BreadBreakers, but encouraged!",
        },
      ],
    ],
  },
  {
    question: "Can I host my own dinner?",
    paragraphs: [
      [
        { type: "text", content: "Yes! Check out more under the " },
        {
          type: "internal-link",
          href: "/bring-it-to-your-community",
          label: "Bring it to your Community",
        },
        { type: "text", content: " tab" },
      ],
    ],
  },
  {
    question: "What is the role of the church in BreadBreakers?",
    paragraphs: [
      [
        {
          type: "text",
          content:
            "We are a religiously-inclusive endeavor, Church-initiated and Community-cultivated, a shared venture where those of all traditions and beliefs join together in fellowship and leadership. We are a pluralist movement at the intersection of the spiritual and the secular; a town square for all and blended ecology of biodiverse walks of life.",
        },
      ],
      [
        {
          type: "text",
          content:
            "Restoration Church Reston supports BreadBreakers as part of its Fresh Expressions program. Read more: ",
        },
        {
          type: "link",
          href: "https://restorationreston.org/breadbreakers",
          label: "https://restorationreston.org/breadbreakers",
        },
      ],
    ],
  },
  {
    question: "How does a typical dinner work?",
    paragraphs: [
      [
        {
          type: "text",
          content:
            "Guided by experienced table hosts, we'll tell our stories, try to understand each other, and practice being in community with those with different views or backgrounds.",
        },
      ],
      [
        {
          type: "text",
          content:
            'At this dinner, participants will get to choose between three different topics, including some current events. Topics range from the political, to the "slice of life", to the spiritual, to the philosophical, to the off-the-wall - but no matter which table you choose to sit at, you can be sure it\'ll be like no dinner conversation you\'ve had before!',
        },
      ],
    ],
  },
];
