export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "KotaCoffee.id",
  description: "KotaCoffee.id - Kopi Trotoar Berkualitas Tinggi. Nikmati pilihan kopi terbaik, minuman non-kopi segar, dan makanan lezat langsung dari toko kami.",
  keywords: [
    "Kopi",
    "Coffee",
    "KotaCoffee",
    "Kopi Trotoar",
    "Minuman Segar",
    "Makanan Penutup",
    "Coffee Shop Indonesia",
  ],
  ogImage: "https://kotacoffee.vercel.app/og-image.png",
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
  ],
  links: {
    github: "https://github.com/Ahmadfauzan280503/kotacoffee",
    instagram: "https://instagram.com/kotacoffee.id",
  },
};
