import { query } from "@/lib/db"
import { auth } from "@/auth"
import Link from "next/link"
import { PackageSearch, ShoppingBag, ArrowRight } from "lucide-react"

export default async function SellerDashboard() {
  const session = await auth()
  
  const res = await query('SELECT COUNT(*) FROM orders WHERE seller_id = $1', [session?.user?.id])
  const myOrdersCount = res.rows[0].count

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Welcome, {session?.user?.name}</h1>
      <p className="text-gray-500">What would you like to do today?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Link href="/seller/products" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PackageSearch className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Browse Products</h2>
            <p className="text-gray-500 mb-6">Search our catalog and place a new quotation or order.</p>
            <span className="text-blue-600 font-medium flex items-center">
              Start Shopping <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>

        <Link href="/seller/orders" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">My Orders</h2>
            <p className="text-gray-500 mb-6">You have {myOrdersCount} order(s) in your history. Track their status here.</p>
            <span className="text-green-600 font-medium flex items-center">
              View History <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}
