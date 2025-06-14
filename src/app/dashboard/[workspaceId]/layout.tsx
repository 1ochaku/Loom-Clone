import { onAuthenticateUser, getNotifications } from '@/actions/user'
import { verifyAccessToWorkspace, getWorkspaceFolders, getAllUserVideos, getWorkSpaces } from '@/actions/workspace'
import { redirect } from 'next/navigation'
import React from 'react'
import { 
  dehydrate,
  HydrationBoundary,
  QueryClient,
}from '@tanstack/react-query'
import Sidebar from '@/components/global/sidebar'

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
 // if (!auth.user?.workspace) redirect ('/auth/sign-in')
  // if (!auth.user.workspace.length) redirect ('/auth/sign-in')

  // checking if the user has access to the workspace
  const hasAccess = await verifyAccessToWorkspace(workspaceId)
  if (!hasAccess) {
    return redirect('/auth/sign-in')
  }
  if (hasAccess.status !== 200){
    redirect('/dashboard/${auth.user?.workspace[0].id}')
  }

  const query = new QueryClient()

  await query.prefetchQuery({
    queryKey:['workspace-folders'],
    queryFn:() => getWorkspaceFolders(workspaceId),
  })

  await query.prefetchQuery({
    queryKey: ['user-videos'],
    queryFn:() => getAllUserVideos(workspaceId),
  })

  await query.prefetchQuery({
    queryKey:['user-workspaces'],
    queryFn:() => getWorkSpaces(),
  })

  await query.prefetchQuery({
    queryKey:['user-notifications'],
    queryFn:() => getNotifications(),
  })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkspaceId={workspaceId}/>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </HydrationBoundary>
  )
}

export default Layout