"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Settings } from "lucide-react";
import { useSidebar } from "./SidebarContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  // { href: "/dashboard/feedback", label: "Feedback", icon: MessageSquare },
  // { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out md:static md:z-auto md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <span className="text-lg font-bold tracking-tight text-blue-600">
            Acowale CRM
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-gray-100 font-medium text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
