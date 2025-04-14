'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/poc')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Redirecting to POC page...</p>
    </div>
  )
}
