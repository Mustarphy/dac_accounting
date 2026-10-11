import { ClipboardList, LayoutDashboard, Users } from "lucide-react";

export const adminNavItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Requests", href: "/admin/requests", icon: ClipboardList, exact: false },
  { label: "Clients", href: "/admin/clients", icon: Users, exact: false },
] as const;
