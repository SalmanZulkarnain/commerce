import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* SIDEBAR (Sticky kiri, lebarnya dikunci biar pas) */}
      <aside className="w-64 bg-white border-r border-slate-200/80 sticky top-0 h-screen flex flex-col justify-between p-6">
        <div className="space-y-7">
          {/* Logo / Nama Toko */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-between shadow-xs" />
            <span className="font-bold text-slate-900 tracking-tight text-base">Hannan Store</span>
          </div>

          {/* Grup Menu */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block px-2 mb-2">
              Main Menu
            </span>
            
            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Dashboard
            </Link>

            {/* Menu Orders dibuat aktif warnanya karena ini halaman utama lu sekarang */}
            <Link 
              href="/admin" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-blue-600 bg-blue-50/70 transition-colors"
            >
              Orders
            </Link>

            <Link 
              href="/admin/products" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Products
            </Link>

            <Link 
              href="/admin/customers" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Customers
            </Link>
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

      {/* AREA KONTEN UTAMA (Kanan, otomatis ngisi sisa space h-screen) */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
