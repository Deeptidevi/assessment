import { auth, signOut } from "@/auth"
import Link from "next/link"
import { Package, ShoppingCart, LogOut, LayoutDashboard } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">AasaMedChem</h2>
          <p className="text-sm text-gray-500 mt-1">Admin Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Package className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Products</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Orders</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </div>
            <form action={async () => {
              "use server"
              await signOut()
            }}>
              <button type="submit" className="text-gray-400 hover:text-red-500 transition-colors p-2" title="Sign out">
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </aside>
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
