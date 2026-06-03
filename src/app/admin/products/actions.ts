"use server"

import { query } from "@/lib/db"
import { auth } from "@/auth"

export async function createProduct(formData: FormData) {
  try {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
      return { error: "Unauthorized" }
    }

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const baseUnit = formData.get("baseUnit") as string
    const basePricePerUnit = parseFloat(formData.get("basePricePerUnit") as string)
    const stockQuantity = parseFloat(formData.get("stockQuantity") as string)

    if (!name || !baseUnit || isNaN(basePricePerUnit) || isNaN(stockQuantity)) {
      return { error: "Missing required fields or invalid numbers" }
    }

    await query(
      `INSERT INTO products (name, description, base_unit, base_price_per_unit, stock_quantity)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, description, baseUnit, basePricePerUnit, stockQuantity]
    )

    return { success: true }
  } catch (error) {
    console.error("Failed to create product:", error)
    return { error: "Failed to save product" }
  }
}
