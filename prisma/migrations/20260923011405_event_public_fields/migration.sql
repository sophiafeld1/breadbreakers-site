-- CreateEnum
CREATE TYPE "EventFormVariant" AS ENUM ('standard', 'extended');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "calendarEnd" TEXT,
ADD COLUMN     "calendarStart" TEXT,
ADD COLUMN     "description" JSONB,
ADD COLUMN     "formVariant" "EventFormVariant" NOT NULL DEFAULT 'standard',
ADD COLUMN     "googleCalendarUrl" TEXT,
ADD COLUMN     "image" TEXT NOT NULL DEFAULT '/DSC00573.jpg',
ADD COLUMN     "imageAlt" TEXT NOT NULL DEFAULT 'BreadBreakers Community Dinner',
ADD COLUMN     "mapQuery" TEXT;
