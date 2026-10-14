import { config } from "dotenv";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { scheduleToCalendarFields } from "../src/lib/event-datetime";

config({ path: ".env.local" });
config({ path: ".env" });

const MASTER_USERNAME = "master-access";

const sharedDescription = [
  "In a time of division and isolation, come be part of the community that's rebuilding the town square, one table at a time.",
  'At this dinner, participants will get to choose between three different topics, including some current events. Topics range from the political, to the "slice of life", to the spiritual, to the philosophical, to the off-the-wall - but no matter which table you choose to sit at, you can be sure it\'ll be like no dinner conversation you\'ve had before! You can also suggest a topic by emailing us at BreadBreakersInfo@gmail.com.',
  "Food will be provided for free. We'll have vegetarian and gluten-free options available. If you have any additional dietary restrictions (Celiac Disease, vegan, etc.) please let us know at BreadBreakersInfo@gmail.com so that we can implement the appropriate food handling procedures.",
  "Join us, invite a friend, and be a part of the movement to mend our fractured society and normalize a better way of talking with one another.",
];

const venueName = "Reston Community Center Lake Anne";
const mapQuery =
  "1609-A Washington Plaza North Reston, Virginia, 20190 United States";
const googleLocation =
  "1609-A Washington Plaza North, Reston, Virginia, 20190, United States";

function buildEvent(input: {
  slug: string;
  month: string;
  day: string;
  dateLabel: string;
  formName: string;
}) {
  const timeLabel = "6:30 PM – 8:30 PM";
  const { calendarStart, calendarEnd } = scheduleToCalendarFields({
    dateLabel: input.dateLabel,
    timeLabel,
  });

  return {
    slug: input.slug,
    chapter: "Reston",
    title: "BreadBreakers Community Dinner",
    month: input.month,
    day: input.day,
    dateLabel: input.dateLabel,
    timeLabel,
    venueName,
    mapQuery,
    googleCalendarUrl: `http://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent("BreadBreakers Community Dinner")}&dates=${calendarStart}/${calendarEnd}&location=${encodeURIComponent(googleLocation)}`,
    image: "/DSC00573.jpg",
    imageAlt: "BreadBreakers Community Dinner",
    isUpcoming: true,
    formName: input.formName,
    formVariant: "standard" as const,
    calendarStart,
    calendarEnd,
    description: sharedDescription,
  };
}

export const seedEvents = [
  buildEvent({
    slug: "october-27-2026",
    month: "Oct",
    day: "27",
    dateLabel: "Tuesday, October 27, 2026",
    formName: "RSVP BB 10/27",
  }),
  buildEvent({
    slug: "november-19-2026",
    month: "Nov",
    day: "19",
    dateLabel: "Thursday, November 19, 2026",
    formName: "RSVP BB 11/19",
  }),
  buildEvent({
    slug: "december-17-2026",
    month: "Dec",
    day: "17",
    dateLabel: "Thursday, December 17, 2026",
    formName: "RSVP BB 12/17",
  }),
];

async function main() {
  const { UserRole, EventFormVariant } = await import(
    "../src/generated/prisma/client"
  );
  const { encryptPassword } = await import("../src/lib/auth/password-vault");
  const { prisma } = await import("../src/lib/db");

  const existing = await prisma.user.findUnique({
    where: { username: MASTER_USERNAME },
    select: { id: true, passwordEncrypted: true },
  });

  if (existing) {
    if (!existing.passwordEncrypted && process.env.MASTER_PASSWORD) {
      const passwordHash = await bcrypt.hash(process.env.MASTER_PASSWORD, 12);

      await prisma.user.update({
        where: { username: MASTER_USERNAME },
        data: {
          passwordHash,
          passwordEncrypted: encryptPassword(process.env.MASTER_PASSWORD),
        },
      });

      console.log("Updated master user with retrievable password storage.");
    } else {
      console.log("Master user already exists.");
    }
  } else {
    const password =
      process.env.MASTER_PASSWORD ?? randomBytes(18).toString("base64url");
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        username: MASTER_USERNAME,
        passwordHash,
        passwordEncrypted: encryptPassword(password),
        role: UserRole.MASTER,
      },
    });

    console.log("Master user created.");
    console.log(`Username: ${MASTER_USERNAME}`);

    if (process.env.MASTER_PASSWORD) {
      console.log("Password: set from MASTER_PASSWORD env var.");
    } else {
      console.log(`Password (save this — shown once): ${password}`);
    }
  }

  await prisma.event.deleteMany({
    where: { slug: { in: ["july-30-2026", "july-30"] } },
  });

  for (const event of seedEvents) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {
        ...event,
        formVariant: EventFormVariant.standard,
      },
      create: {
        ...event,
        formVariant: EventFormVariant.standard,
      },
    });
  }

  console.log(
    `Seeded ${seedEvents.length} Reston events: ${seedEvents.map((event) => event.dateLabel).join("; ")}`,
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
