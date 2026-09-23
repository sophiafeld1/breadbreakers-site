-- AlterTable
ALTER TABLE "Rsvp" ADD COLUMN     "dietaryNotes" TEXT,
ADD COLUMN     "firstTime" TEXT,
ADD COLUMN     "hearAbout" TEXT,
ADD COLUMN     "mailingList" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT;
