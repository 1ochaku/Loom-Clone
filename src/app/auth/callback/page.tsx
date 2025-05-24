'use client'

import { Spinner } from '@/components/global/loader/spinner'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthCallback() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (isLoaded && user) {
      // Check if there's a redirect URL from the middleware
      const redirectUrl = searchParams.get('redirect_url')
      if (redirectUrl) {
        router.push(redirectUrl)
      } else {
        // Default redirect to user's dashboard
        router.push(`/dashboard/${user.id}`)
      }
    }
  }, [isLoaded, user, router, searchParams])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return <Spinner/>
}