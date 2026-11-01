import type { Profile, SocialLink } from "@/lib/queries/types";

export const DEFAULT_PROFILE: Profile = {
  id: "00000000-0000-0000-0000-000000000000",
  full_name: "Adi Alfian Hafis",
  professional_title: "Full-Stack Developer",
  short_intro:
    "Building web applications, enterprise systems, and digital tools with a focus on clean architecture and reliable engineering.",
  long_bio:
    "Full-stack software developer with experience in developing web applications, enterprise systems, and backend services.",
  location: null,
  timezone: "Asia/Jakarta",
  available_for_work: true,
  availability_text: "Available for work",
  email: "adialfianhafiz@gmail.com",
  resume_url: null,
  portrait_path: null,
  updated_at: new Date().toISOString(),
};

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    id: "default-github",
    profile_id: "00000000-0000-0000-0000-000000000000",
    platform: "GitHub",
    label: "GitHub",
    url: "https://github.com/adialfyan",
    sort_order: 1,
    is_visible: true,
  },
  {
    id: "default-linkedin",
    profile_id: "00000000-0000-0000-0000-000000000000",
    platform: "LinkedIn",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/adialfianhafis",
    sort_order: 2,
    is_visible: true,
  },
];
