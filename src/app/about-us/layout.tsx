import AboutUsSubnav from "@/components/AboutUsSubnav";

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AboutUsSubnav />
      {children}
    </>
  );
}
