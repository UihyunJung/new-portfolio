export interface SocialLink {
  key: string;
  href: string;
  icon: 'github' | 'linkedin' | 'email';
}

export const socialLinks: SocialLink[] = [
  {
    key: 'github',
    href: 'https://github.com/UihyunJung',
    icon: 'github',
  },
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/in/uihyunjung',
    icon: 'linkedin',
  },
  {
    key: 'email',
    href: 'mailto:uihyun.jung@gmail.com',
    icon: 'email',
  },
];
