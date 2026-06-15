"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Products", href: "/admin/products" },
    { name: "Customers", href: "/admin/customers" },
  ];
  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 sticky top-0 h-screen flex flex-col justify-between p-6">
      <div className="space-y-7">
        {/* Logo / Nama Toko */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-between shadow-xs" />
          <span className="font-bold text-slate-900 tracking-tight text-base">
            Hannan Store
          </span>
        </div>

        {/* Grup Menu */}
        <nav className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block px-2 mb-2">
            Main Menu
          </span>

          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:text-slate-900 hover:bg-slate-50 transition-colors ${isActive ? "font-semibold text-blue-600 bg-blue-50/70" : "font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
            `}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bagian Bawah Sidebar (User/Settings) */}
      <div className="pt-4 border-t border-slate-100 flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
          A
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-800">Admin Hannan</p>
          <p className="text-[10px] text-slate-400">Store Manager</p>
        </div>
      </div>
    </aside>
  );
}
