// Edit this file to change company details used across the site.

export const site = {
  name: "Hirak Motion",
  shortName: "Hirak",
  tagline: "Motors, drives and actuators, engineered in India.",
  description:
    "Hirak Motion designs motors, drives and actuators that turn electricity into precise, measurable motion for robots, drones and machines. Engineered and tested in India.",
  url: "https://hirakmotion.com",
  // The inbox must exist (or forward to Gmail) before launch, or contact mail bounces.
  email: "hello@hirakmotion.com",
  location: "India",
  // Form backend: FormSubmit (no account). The first message sends an activation
  // email to the inbox; click it once. Afterwards FormSubmit emails a random alias
  // that can replace the address here so it isn't in the page source.
  // Set to "" to fall back to opening the visitor's email app instead.
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT || "https://formsubmit.co/ajax/hello@hirakmotion.com",
  // Links with an empty href are hidden in the footer.
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/hirakmotion" },
    { label: "GitHub", href: "https://github.com/hirakmotion" },
    { label: "YouTube", href: "https://www.youtube.com/@hirakmotion" },
    { label: "Instagram", href: "" },
    { label: "X", href: "https://x.com/hirakmotion" },
  ],
} as const;

export const nav = [
  { label: "Platform", href: "#platform" },
  { label: "Explorer", href: "#explorer" },
  { label: "Custom", href: "#custom" },
  { label: "Why India", href: "#why" },
  { label: "Lab", href: "#lab" },
  { label: "Roadmap", href: "#roadmap" },
] as const;
