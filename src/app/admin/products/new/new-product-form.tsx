"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProduct } from "../actions"

export default function NewProductForm() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await createProduct(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push("/admin/products")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          required 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder="e.g. Paracetamol"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
        <textarea 
          id="description" 
          name="description" 
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder="Product details..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="baseUnit" className="block text-sm font-medium text-gray-700 mb-1">Base Unit</label>
          <select 
            id="baseUnit" 
            name="baseUnit"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          >
            <option value="GRAM">Gram (g) - For solid weights</option>
            <option value="MILLILITER">Milliliter (mL) - For liquids</option>
            <option value="COUNT">Unit (Count) - For items</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">This is how the system stores the quantity internally.</p>
        </div>

        <div>
          <label htmlFor="basePricePerUnit" className="block text-sm font-medium text-gray-700 mb-1">Price per Base Unit (INR)</label>
          <input 
            type="number" 
            id="basePricePerUnit" 
            name="basePricePerUnit" 
            required 
            step="0.0001"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="e.g. 0.50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">Initial Stock (in Base Unit)</label>
        <input 
          type="number" 
          id="stockQuantity" 
          name="stockQuantity" 
          required 
          step="0.0001"
          min="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder="e.g. 10000"
        />
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  )
}
