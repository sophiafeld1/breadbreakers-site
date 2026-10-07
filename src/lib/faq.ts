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
            "Yes! We have in person volunteer opportunities in Reston, Virginia but anyone can volunteer virtually. Volunteers can help with social media, outreach, website maintenance, development, and more. Email us at ",
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
            "Everyone - and we mean it. All races, sexualities, political affiliations, and cultures are not only welcomed at BreadBreakers, but encouraged!",
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
            "We are a religiously-pluralistic endeavor, a collaboration between the church and people in the community of all beliefs and backgrounds. Restoration Church, a United Methodist Congregation in Reston, VA, initiated and supports BreadBreakers as a part of its Fresh Expressions program because the members of Restoration believe in building greater wholeness in our communities and making sure each person is seen and treated as a human being with inherent, infinite worth. Read more: ",
        },
        {
          type: "link",
          href: "https://restorationreston.org/breadbreakers",
          label: "https://restorationreston.org/breadbreakers",
        },
      ],
      [
        {
          type: "text",
          content:
            "Our BreadBreakers community in Reston has members, volunteers, and leaders of all backgrounds; some from Restoration, and some not. Gifts to BreadBreakers are always put toward BreadBreakers, never other church programs.",
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
            "Guided by experienced table hosts, we'll tell our stories, focus on hearing and seeing one another, and practice being in community with those with different views or backgrounds.",
        },
      ],
      [
        {
          type: "text",
          content:
            'At each dinner of the Reston community of BreadBreakers, participants will get to choose between different topic categories, including some current events. Topics range from the political, to the "slice of life", to the spiritual, to the philosophical, to the off-the-wall - but no matter which table you choose to sit at, you can be sure it\'ll be like no dinner conversation you\'ve had before!',
        },
      ],
    ],
  },
];
