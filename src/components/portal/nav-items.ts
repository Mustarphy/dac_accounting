import {
  Bell,
  CheckCircle2,
  ClipboardList,
  FolderOpen,
  LayoutDashboard,
  MessageCircleQuestion,
  UserCircle,
} from "lucide-react";

export const portalNavItems = [
  { label: "Overview", href: "/portal", icon: LayoutDashboard, exact: true },
  { label: "My Requests", href: "/portal/requests", icon: ClipboardList, exact: false },
  { label: "Document Centre", href: "/portal/documents", icon: FolderOpen, exact: false },
  {
    label: "Information Requests",
    href: "/portal/information-requests",
    icon: MessageCircleQuestion,
    exact: false,
  },
  { label: "Completed Work", href: "/portal/completed", icon: CheckCircle2, exact: false },
  { label: "Notifications", href: "/portal/notifications", icon: Bell, exact: false },
  { label: "Account", href: "/portal/account", icon: UserCircle, exact: false },
] as const;
