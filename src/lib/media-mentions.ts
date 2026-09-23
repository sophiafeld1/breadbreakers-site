export type ArticleCard = {
  title: string;
  description: string;
  excerpt: string;
  url: string;
  imageUrl: string;
  authors: string[];
  publication: string;
  date: string;
  ctaLabel: string;
};

export const ministryMattersPost: ArticleCard = {
  title: "Building bridges one table at a time",
  description:
    "A Fresh Expression bringing people across political, racial, and religious divides together for community dinners focused on civil discourse.",
  excerpt:
    "In an era of unprecedented division and isolation, a pastor-layperson duo discovered that the simple act of sharing a meal could become a powerful ministry of reconciliation and connection. BreadBreakers is a Fresh Expression—a reimagined form of church where Christians and people who would not be part of established churches and worship spaces can create blended communities together...",
  url: "https://ministrymatters.com/2025-06-06_building_bridges_one_table_at_a_time/",
  imageUrl:
    "https://ministrymatters.com/2025-06-06_building_bridges_one_table_at_a_time/24iirov/%7Estream",
  authors: ["Daniel Park", "Michael Graham"],
  publication: "Ministry Matters",
  date: "June 6, 2025",
  ctaLabel: "Read on Ministry Matters",
};
