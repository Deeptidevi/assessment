import NewProductForm from "./new-product-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products" className="p-2 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <NewProductForm />
      </div>
    </div>
  )
}
