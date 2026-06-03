"use client"

import { useState, useMemo } from "react"
import { formatINR } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { createOrder } from "./actions"

type ProductData = {
  id: string
  name: string
  baseUnit: string
  basePricePerUnit: string
}

export default function OrderForm({ product }: { product: ProductData }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState<string>("1")
  const [unit, setUnit] = useState<string>(product.baseUnit === "GRAM" ? "G" : product.baseUnit === "MILLILITER" ? "ML" : "COUNT")
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allowedUnits = useMemo(() => {
    if (product.baseUnit === "GRAM") return [{ value: "G", label: "Grams (g)" }, { value: "KG", label: "Kilograms (kg)" }]
    if (product.baseUnit === "MILLILITER") return [{ value: "ML", label: "Milliliters (mL)" }, { value: "L", label: "Liters (L)" }]
    return [{ value: "COUNT", label: "Items / Units" }]
  }, [product.baseUnit])

  const calculatedBaseQuantity = useMemo(() => {
    const q = parseFloat(quantity)
    if (isNaN(q) || q <= 0) return 0
    if (unit === "KG" || unit === "L") return q * 1000
    return q
  }, [quantity, unit])

  const calculatedPrice = useMemo(() => {
    return calculatedBaseQuantity * parseFloat(product.basePricePerUnit)
  }, [calculatedBaseQuantity, product.basePricePerUnit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    
    try {
      const result = await createOrder({
        productId: product.id,
        requestedQuantity: quantity,
        requestedUnit: unit,
        calculatedPrice: calculatedPrice.toString()
      })
      
      if (result?.error) {
        setError(result.error)
      } else {
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/seller/orders")
        }, 1500)
      }
    } catch (err) {
      setError("Failed to create order.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {isSuccess && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium border border-green-200 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
          Order Quotation placed successfully! Redirecting to your orders...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
          <input 
            type="number" 
            required 
            min="0.0001" 
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
          <select 
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900"
          >
            {allowedUnits.map(u => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Pricing Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Base Rate</span>
            <span>{formatINR(product.basePricePerUnit)} / {product.baseUnit.toLowerCase()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Equivalent Base Quantity</span>
            <span>{calculatedBaseQuantity} {product.baseUnit.toLowerCase()}</span>
          </div>
          <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="font-bold text-gray-900 text-lg">Total Quotation</span>
            <span className="font-bold text-blue-600 text-2xl">{formatINR(calculatedPrice)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={isPending || isSuccess || calculatedPrice <= 0}
          className={`${isSuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50 text-lg shadow-sm`}
        >
          {isPending ? "Processing..." : isSuccess ? "Success!" : "Place Order Quotation"}
        </button>
      </div>
    </form>
  )
}
