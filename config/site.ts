export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Kotacoffee.id",
  description: "Kopi Trotoar",
  navItems: [
    {
      label: "Beranda",
      href: "/",
    },
    {
      label: "Jelajahi",
      href: "/explore",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Admin Dashboard",
      href: "/admin/dashboard",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
