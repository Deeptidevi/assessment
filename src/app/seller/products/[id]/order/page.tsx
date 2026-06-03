import { query } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import OrderForm from "./order-form"

export default async function OrderProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const res = await query('SELECT * FROM products WHERE id = $1', [resolvedParams.id])
  const product = res.rows[0]

  if (!product) notFound()

  // Data to pass to client component
  const productData = {
    id: product.id,
    name: product.name,
    baseUnit: product.base_unit,
    basePricePerUnit: product.base_price_per_unit.toString(),
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/seller/products" className="p-2 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Quotation</h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-50/50 p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h2>
          <p className="text-gray-600">{product.description || "No description."}</p>
        </div>
        
        <div className="p-6 md:p-8">
          <OrderForm product={productData} />
        </div>
      </div>
    </div>
  )
}
