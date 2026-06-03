import { query } from "@/lib/db"
import Link from "next/link"
import { formatINR, getBaseUnitLabel } from "@/lib/utils"
import { Plus } from "lucide-react"

export default async function AdminProductsPage() {
  const res = await query('SELECT * FROM products ORDER BY created_at DESC')
  const products = res.rows

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link 
          href="/admin/products/new" 
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Base Unit</th>
                <th className="p-4 font-medium">Price (Per Base Unit)</th>
                <th className="p-4 font-medium">Stock (Base Unit)</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No products found. Add one to get started!
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{product.name}</td>
                    <td className="p-4 text-gray-600">{getBaseUnitLabel(product.base_unit)}</td>
                    <td className="p-4 text-gray-900 font-medium">{formatINR(product.base_price_per_unit)}</td>
                    <td className="p-4 text-gray-600">{product.stock_quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
