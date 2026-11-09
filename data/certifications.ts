// -----------------------------------------------------------------------------
// CERTIFICATIONS
// To add one: copy a block, fill it in.
// `image` = a certificate image in /public/certs/ (e.g. "/certs/google-da.png").
// `url`   = the credential link (LinkedIn / Coursera / Credly).
// Both are optional — a placeholder shows until you add a real image.
// -----------------------------------------------------------------------------

export type Certification = {
  name: string;
  issuer: string;
  url?: string;
  image?: string;
};

export const certifications: Certification[] = [
  {
    name: "Google Data Analytics Professional Certificate",
    issuer: "Google · Coursera",
    url: undefined,
    image: undefined,
  },
  {
    name: "Google Advanced Data Analytics Professional Certificate",
    issuer: "Google · Coursera",
    url: undefined,
    image: undefined,
  },
  {
    name: "Cloud Computing Fundamentals & Services",
    issuer: "AWS · Webinar",
    url: undefined,
    image: undefined,
  },
  {
    name: "Transfer Learning Demystified: Core Concepts Behind Modern Deep Learning",
    issuer: "Webinar",
    url: undefined,
    image: undefined,
  },
  {
    name: "CEIT-SC Webinars",
    issuer: "CEIT Student Council",
    url: undefined,
    image: undefined,
  },
];
