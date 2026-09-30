export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

/**
 * Central site configuration. Update these values once DAC Accounting
 * provides final contact details, and every component that references
 * them will stay in sync.
 */
export const siteConfig = {
  name: "DAC Accounting",
  shortName: "DAC",
  tagline: "Professional accounting and financial support for your business.",
  // TODO(DAC): replace with the firm's real contact details.
  email: "YOUR_EMAIL_HERE",
  phone: "YOUR_PHONE_HERE",
  whatsapp: "YOUR_WHATSAPP_NUMBER_HERE",
  address: "YOUR_ADDRESS_HERE",
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  {
    label: "Knowledge",
    href: "/knowledge",
    children: [
      { label: "Knowledge Hub", href: "/knowledge" },
      { label: "Calculators", href: "/knowledge/calculators" },
    ],
  },
  { label: "Contact Us", href: "/contact" },
];

export const loginNav: NavItem = {
  label: "Login",
  href: "/login",
};

export const primaryCta = {
  label: "Talk to an Expert",
  href: "/contact",
};

export const secondaryCta = {
  label: "Explore Our Services",
  href: "/services",
};
