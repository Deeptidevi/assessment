import { auth, signOut } from "@/auth"
import Link from "next/link"
import { PackageSearch, ShoppingBag, LogOut, LayoutDashboard } from "lucide-react"

export default async function SellerLayout({
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
          <p className="text-sm text-blue-600 mt-1 font-medium">Customer Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/seller" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/seller/products" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
            <PackageSearch className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Browse Products</span>
          </Link>
          <Link href="/seller/orders" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            <span className="font-medium">My Orders</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
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
