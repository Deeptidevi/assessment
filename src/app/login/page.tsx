import { Suspense } from "react"
import LoginForm from "./login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">AasaMedChem</h1>
            <p className="text-gray-500">Inventory & Order Management</p>
          </div>
          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
        <div className="bg-gray-50 p-6 border-t border-gray-100 text-sm text-gray-500">
          <p className="font-medium text-gray-700 mb-2">Test Credentials:</p>
          <ul className="space-y-1">
            <li><span className="inline-block w-16 font-medium">Admin:</span> admin@example.com / admin123</li>
            <li><span className="inline-block w-16 font-medium">User:</span> user@example.com / user123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
