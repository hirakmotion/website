// Edit this file to change company details used across the site.

export const site = {
  name: "Hirak Motion",
  shortName: "Hirak",
  tagline: "Motors, drives and actuators, engineered in India.",
  description:
    "Hirak Motion designs motors, drives and actuators that turn electricity into precise, measurable motion for robots, drones and machines. Engineered and tested in India.",
  // TODO: replace with your real domain and inbox before launch.
  url: "https://hirakmotion.com",
  email: "hello@hirakmotion.com",
  location: "India",
  // Optional: a form backend URL (for example a Formspree endpoint). When empty,
  // the contact form opens the visitor's email app with the message filled in.
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",
  socials: [
    { label: "LinkedIn", href: "" },
    { label: "GitHub", href: "" },
    { label: "YouTube", href: "" },
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
