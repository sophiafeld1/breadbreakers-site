export const images = {
  logo: "/breadbreakersLogo.jpg",
  communityPhoto: "/community-photo.jpg",
  aboutMissionPhoto: "/about-mission.jpg",
  eventPhoto: "/DSC00573.jpg",
  eventPhotoAlt: "/unsplash-image.jpg",
  hostYourOwnPhoto: "/DSC00543.JPG",
  facebookIcon: "/facebook-icon.png",
  meetupLogo: "/meetup-logo.png",
};

export const aboutSlideshowImages = [
  {
    src: "/PXL_20250924_002502105.jpg",
    alt: "Ground rules sign at a BreadBreakers gathering",
  },
  {
    src: "/PXL_20251217_010925824.jpg",
    alt: "Community members sharing a meal together",
  },
  {
    src: "/about-mission.jpg",
    alt: "People gathered for a BreadBreakers event",
  },
] as const;

export const links = {
  restorationChurch: "https://restorationreston.org/",
  facebook: "https://www.facebook.com/profile.php?id=61564660176717",
  meetup: "https://www.meetup.com/breadbreakers/",
  email: "mailto:breadbreakersinfo@gmail.com",
  donate:
    "https://pushpay.com/g/restorationrestonumc?fnd=pO6G-N7oO7FH7Mp1u-x6mA&fndv=Lock&r=No&lang=en&src=pcgl",
};

export function donateUrl(amount?: number): string {
  if (!amount) return links.donate;
  return `${links.donate}&a=${amount}`;
}
