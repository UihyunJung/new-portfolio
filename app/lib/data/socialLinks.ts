export interface SocialLink {
  key: string;
  href: string;
  icon: 'github' | 'linkedin' | 'email';
}

export const socialLinks: SocialLink[] = [
  {
    key: 'github',
    href: 'https://github.com/jung-euihyun',
    icon: 'github',
  },
  {
    key: 'linkedin',
    href: 'https://linkedin.com/in/jung-euihyun',
    icon: 'linkedin',
  },
  {
    key: 'email',
    href: 'mailto:uihyun.jung@gmail.com',
    icon: 'email',
  },
];
