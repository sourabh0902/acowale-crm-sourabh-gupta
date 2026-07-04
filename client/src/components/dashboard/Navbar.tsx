"use client";

import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { useSidebar } from "./SidebarContext";

export default function Navbar() {
  const router = useRouter();
  const { toggle } = useSidebar();

  function handleLogout() {
    console.log("logout");
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b border-gray-200 bg-white px-4 md:px-6">
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle sidebar"
        className="mr-3 rounded-lg p-2 text-gray-600 hover:bg-gray-50 md:hidden"
      >
        <Menu size={20} />
      </button>

      <h2 className="text-base font-semibold text-gray-900">Overview</h2>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Admin</span>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-50 hover:text-blue-600"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
