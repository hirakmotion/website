// Edit this file to change company details used across the site.

export const site = {
  name: "Hirak Motion",
  shortName: "Hirak",
  tagline: "Motors, drives and actuators, engineered in India.",
  description:
    "H-02 is a 40:1 cycloidal actuator: a 5010 motor, two opposed cycloidal discs and 41 pins in a 70 mm housing. Designed, printed and tested in India by Hirak Motion.",
  url: "https://hirakmotion.com",
  // The inbox must exist (or forward to Gmail) before launch, or contact mail bounces.
  email: "hello@hirakmotion.com",
  location: "India",
  // Form backend: FormSubmit (no account). The first message sends an activation
  // email to the inbox; click it once. Afterwards FormSubmit emails a random alias
  // that can replace the address here so it isn't in the page source.
  // Set to "" to fall back to opening the visitor's email app instead.
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT || "https://formsubmit.co/ajax/ceeea61cd375cc18c1f421191afcecd6",
  // Links with an empty href are hidden in the footer.
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/hirakmotion" },
    { label: "GitHub", href: "https://github.com/hirakmotion" },
    { label: "YouTube", href: "https://www.youtube.com/@hirakmotion" },
    { label: "Instagram", href: "" },
    { label: "X", href: "https://x.com/hirakmotion" },
  ],
} as const;
