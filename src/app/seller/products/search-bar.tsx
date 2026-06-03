"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useTransition, useState, useEffect } from "react"
import { Search } from "lucide-react"

export default function SearchBar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    // Only trigger if query is different from URL to avoid loop on initial load
    const currentUrlQuery = searchParams.get('q') || ""
    if (query === currentUrlQuery) return

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set('q', query)
      } else {
        params.delete('q')
      }
      
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [query, pathname, router, searchParams])

  return (
    <div className="w-full md:w-auto relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input 
        type="search" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..." 
        className="w-full md:w-80 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors"
      />
      {isPending && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  )
}
