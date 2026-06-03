import { query } from "@/lib/db"
import { formatINR } from "@/lib/utils"
import Link from "next/link"

import SearchBar from "./search-bar"

export default async function SellerProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.q || ""
  
  let res;
  if (searchQuery) {
    res = await query('SELECT * FROM products WHERE name ILIKE $1 ORDER BY name ASC', [`%${searchQuery}%`])
  } else {
    res = await query('SELECT * FROM products ORDER BY name ASC')
  }
  
  const products = res.rows

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Browse Catalog</h1>
        <SearchBar initialQuery={searchQuery} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500 text-lg">No products found matching "{searchQuery}".</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                  {product.description || "No description provided."}
                </p>
                <div className="bg-gray-50 rounded-lg p-3 inline-block">
                  <p className="text-sm font-medium text-gray-700">
                    Base Rate: <span className="text-blue-600 font-bold">{formatINR(product.base_price_per_unit)}</span> / {product.base_unit.toLowerCase()}
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Link 
                  href={`/seller/products/${product.id}/order`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Create Quotation
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
