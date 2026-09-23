import { config } from "dotenv";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

config({ path: ".env.local" });
config({ path: ".env" });

const MASTER_USERNAME = "master-access";

const seedEvent = {
  slug: "july-30-2026",
  chapter: "Reston",
  title: "BreadBreakers Community Dinner",
  month: "Jul",
  day: "30",
  dateLabel: "Thursday, July 30, 2026",
  timeLabel: "6:30 PM – 8:30 PM",
  venueName: "Reston Community Center Lake Anne",
  mapQuery:
    "1609-A Washington Plaza North Reston, Virginia, 20190 United States",
  googleCalendarUrl:
    "http://www.google.com/calendar/event?action=TEMPLATE&text=BreadBreakers%20Community%20Dinner&dates=20260730T223000Z/20260731T003000Z&location=1609-A%20Washington%20Plaza%20North%2C%20Reston%2C%20Virginia%2C%2020190%2C%20United%20States",
  image: "/DSC00573.jpg",
  imageAlt: "BreadBreakers Community Dinner",
  isUpcoming: true,
  formName: "RSVP BB 07/30",
  formVariant: "standard" as const,
  calendarStart: "20260730T223000Z",
  calendarEnd: "20260731T003000Z",
  description: [
    "This dinner in particular will be very special as we celebrate America's 250th birthday. How better to honor a semiquincentennial of democracy that spending an evening practicing it?",
    "At this dinner, participants will get to choose between three different topics, including some current events. Topics range from the political, to the \"slice of life\", to the spiritual, to the philosophical, to the off-the-wall - but no matter which table you choose to sit at, you can be sure it'll be like no dinner conversation you've had before! You can also suggest a topic by emailing us at BreadBreakersInfo@gmail.com.",
    "Food will be provided for free. We'll have vegetarian and gluten-free options available. If you have any additional dietary restrictions (Celiac Disease, vegan, etc.) please let us know at BreadBreakersInfo@gmail.com so that we can implement the appropriate food handling procedures.",
    "Join us, invite a friend, and be a part of the movement to mend our fractured society and normalize a better way of talking with one another.",
  ],
};

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

  await prisma.event.upsert({
    where: { slug: seedEvent.slug },
    update: {
      ...seedEvent,
      formVariant: EventFormVariant.standard,
    },
    create: {
      ...seedEvent,
      formVariant: EventFormVariant.standard,
    },
  });

  console.log(`Seeded 1 Reston event: ${seedEvent.dateLabel}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
