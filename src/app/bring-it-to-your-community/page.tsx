import type { Metadata } from "next";
import HostYourOwn from "@/components/HostYourOwn";

export const metadata: Metadata = {
  title: "Host Your Own | BreadBreakers",
  description:
    "Two ways to bring BreadBreakers to your community — we come to you, or we train you to start a chapter.",
};

export default function BringItToYourCommunityPage() {
  return <HostYourOwn />;
}
