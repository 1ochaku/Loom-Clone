import { onAuthenticateUser } from '@/actions/user'
import { verifyAccessToWorkspace } from '@/actions/workspace'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: {
    workspaceId: string
  }
  children: React.ReactNode
}

const Layout = async ({ params, children }: Props) => {
  // we come to this page when the user is authenticated
  const { workspaceId } = await params;

  const auth = await onAuthenticateUser()


  // checking if the user has access to the workspace
  const hasAccess = await verifyAccessToWorkspace(workspaceId)
  if (!hasAccess) {
    return redirect('/auth/sign-in')
  }
  
  return (
    <div>Layout</div>
  )
}

export default Layout