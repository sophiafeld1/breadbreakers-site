export type NavChildLink = {
  href: string;
  label: string;
};

export type NavLink = {
  href: string;
  label: string;
  children?: NavChildLink[];
};

export const aboutUsLinks: NavChildLink[] = [
  { href: "/about-us", label: "Our Mission" },
  { href: "/about-us/media-mentions", label: "Media Mentions" },
  { href: "/about-us/blog", label: "Blog" },
];

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us", children: aboutUsLinks },
  { href: "/events", label: "Events" },
  { href: "/bring-it-to-your-community", label: "Bring it to your Community" },
  { href: "/faq", label: "FAQ" },
  { href: "/donate", label: "Donate" },
];

export function isAboutUsPath(pathname: string): boolean {
  return pathname === "/about-us" || pathname.startsWith("/about-us/");
}

export function isNavItemActive(pathname: string, link: NavLink): boolean {
  if (link.children) {
    return isAboutUsPath(pathname);
  }

  return pathname === link.href;
}
