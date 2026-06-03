import { query } from "@/lib/db"
import { auth } from "@/auth"
import { formatINR } from "@/lib/utils"

export default async function SellerOrdersPage() {
  const session = await auth()
  const res = await query(`
    SELECT o.id, o.created_at, o.total_amount, o.status, 
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', oi.id,
              'requested_quantity', oi.requested_quantity,
              'requested_unit', oi.requested_unit,
              'calculated_price', oi.calculated_price,
              'product_name', p.name
            )
          )
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ), '[]'::json
      ) as items
    FROM orders o
    WHERE o.seller_id = $1
    ORDER BY o.created_at DESC
  `, [session?.user?.id])

  const orders = res.rows

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total Amount</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    You haven't placed any orders yet.
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900 text-sm">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="p-4 text-gray-600 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-gray-600 text-sm">
                      <ul className="space-y-1">
                        {order.items.map((item: any) => (
                          <li key={item.id}>
                            {item.product_name} - {item.requested_quantity} {item.requested_unit}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 text-gray-900 font-bold">{formatINR(order.total_amount)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "PENDING" ? "bg-orange-100 text-orange-700" :
                        order.status === "APPROVED" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
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
