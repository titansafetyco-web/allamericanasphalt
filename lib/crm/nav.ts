import {
  CalendarDays,
  CircleUser,
  FileText,
  HardHat,
  LayoutDashboard,
  MessageSquare,
  UserPlus,
  Users,
} from "lucide-react";

export const crmNav = [
  { href: "/crm", label: "Overview", icon: LayoutDashboard },
  { href: "/crm/leads", label: "Leads", icon: UserPlus },
  { href: "/crm/estimates", label: "Estimates", icon: FileText },
  { href: "/crm/messages", label: "Messages", icon: MessageSquare },
  { href: "/crm/jobs", label: "Jobs", icon: HardHat },
  { href: "/crm/customers", label: "Customers", icon: Users },
  { href: "/crm/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/crm/profile", label: "Profile", heading: "Settings", icon: CircleUser },
] as const;
