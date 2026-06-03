"use server"

import { pool } from "@/lib/db"
import { auth } from "@/auth"

export async function createOrder(data: {
  productId: string
  requestedQuantity: string
  requestedUnit: string
  calculatedPrice: string
}) {
  const client = await pool.connect()
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const { productId, requestedQuantity, requestedUnit, calculatedPrice } = data

    await client.query('BEGIN')

    const orderRes = await client.query(
      `INSERT INTO orders (seller_id, total_amount, status) 
       VALUES ($1, $2, $3) RETURNING id`,
      [session.user.id, parseFloat(calculatedPrice), "PENDING"]
    )
    
    const orderId = orderRes.rows[0].id

    await client.query(
      `INSERT INTO order_items (order_id, product_id, requested_quantity, requested_unit, calculated_price) 
       VALUES ($1, $2, $3, $4, $5)`,
      [orderId, productId, parseFloat(requestedQuantity), requestedUnit, parseFloat(calculatedPrice)]
    )

    await client.query('COMMIT')
    return { success: true }
  } catch (error) {
    await client.query('ROLLBACK')
    console.error("Failed to create order:", error)
    return { error: "Failed to place order" }
  } finally {
    client.release()
  }
}
