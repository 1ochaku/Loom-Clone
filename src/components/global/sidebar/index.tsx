'use client'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectLabel, SelectGroup, SelectItem } from '@/components/ui/select'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { useQueryData } from '@/hooks/useQueryData'
import { getWorkSpaces } from '@/actions/workspace'
import { NotificationProps, WorkspaceProps } from '@/types/index.type'
import { Loader, Menu, PlusCircle } from 'lucide-react'
import Modal from '@/components/global/Modal'
import Search from '../search'
import { MENU_ITEMS } from '@/constants'
import SidebarItem from './sidebar-items'
import { getNotifications } from '@/actions/user'
import WorkspacePlaceholder from './workspace-placeholder'
import GlobalCard from '../global-card'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import {  SheetTrigger } from '@/components/ui/sheet'


type Props = {  
  activeWorkspaceId: string
}

const Sidebar = ({ activeWorkspaceId }: Props) => {
  // add the upgrade button to the sidebar
  const router = useRouter()
  const pathname = usePathname()
  const { data, isFetched, isPending, refetch } = useQueryData(['user-workspaces'], getWorkSpaces)
  const workspacesData = data as WorkspaceProps | undefined

  useEffect(() => {
    if (isPending) {
      refetch()
    }
  }, [isPending, refetch])

  // Add debug logs
  useEffect(() => {
    console.log('Complete Workspaces Data:', JSON.stringify(workspacesData, null, 2))
    console.log('Data Structure:', {
      hasData: !!workspacesData,
      hasDataData: !!workspacesData?.data,
      hasNestedData: !!workspacesData?.data?.data,
      subscription: workspacesData?.data?.data?.subscription,
      plan: workspacesData?.data?.data?.subscription?.plan,
      rawData: data
    })
  }, [workspacesData, data])

  const currentWorkspace = workspacesData?.data?.data?.workspace?.find((s) => s.id === activeWorkspaceId)

  const {data: notifications} = useQueryData(['user-notifications'], getNotifications)
  const {_count} = notifications as NotificationProps
  const menuItems = MENU_ITEMS(activeWorkspaceId)
  
  const onChangeActiveWorkspace = (value: string) => {
    if (!value || value === "placeholder") return;
    router.push(`/dashboard/${value}`);
  }

  if (!isFetched) {
    return (
      <div className='bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden'>
        <div className="bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0">
          <Image src='/loom.png' alt='logo' width={40} height={40} />
          <p className="text-xl">Loom</p>
        </div>
        <div className="mt-16 text-neutral-400">Loading...</div>
      </div>
    )
  }
  
  const SidebarSection = (
    <div className='bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden'>
      <div className="bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0">
        <Image src='/loom.png' alt='logo' width={40} height={40} />
        <p className="text-xl">Loom</p>
      </div>

      <Select defaultValue={activeWorkspaceId || "placeholder"} onValueChange={onChangeActiveWorkspace}>
        <SelectTrigger className='mt-16 text-neutral-400 bg-transparent w-full'>
          <SelectValue>
            {activeWorkspaceId && currentWorkspace ? currentWorkspace.name : "Select a workspace"}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent className='bg-[#111111] backdrop-blur-xl'>
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator/>
            {workspacesData?.data?.data?.workspace?.map((workspace) => (
              <SelectItem  
              value={workspace.id}
              key={workspace.id}>
                {workspace.name}
              </SelectItem>
            ))}
            {workspacesData?.data?.data?.members && workspacesData.data.data.members.length > 0 &&
              workspacesData.data.data.members.map((member) =>
                member.Workspace && (
                  <SelectItem value={member.Workspace.id} key={member.Workspace.id}>
                    {member.Workspace.name}
                  </SelectItem>
                )
              )}
          </SelectGroup>
        </SelectContent>
      </Select>

      { currentWorkspace?.type=== "PUBLIC" && workspacesData?.data?.data?.subscription?.plan  === "PRO"&& (
        <Modal
        trigger={
          <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90 hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
            <PlusCircle size={15} className="text-neutral-800/90 fill-neutral-500" />
            <span className="text-neutral-400 font-semibold text-xs">
              Invite to workspace
            </span>
          </span>
        }
        title="Invite to workspace"
        description="Invite other users to your workspace"
      >
        <div>Invite form content</div>
        <Search workspaceId={activeWorkspaceId} />
      </Modal>
      )}
      <p className = "w-full text-[#9D9D9D] font-bold mt-4">Menu</p>
      <nav className = "w-full">
        <ul>
          {menuItems.map((item) => (
            <SidebarItem 
            href= {item.href}
            title={item.title}
            icon={item.icon}
            selected={pathname === item.href}
            key={item.title}
            notifications={
              (item.title === 'Notifications' && _count && _count.notifications) ||0
            }
            />
          ))}
        </ul>
      </nav>
      <Separator className = "w-4/5" />
      <p className="w-full text-[#9D9D9D] font-bold mt-4">Workspace</p>

      {
            workspacesData?.data?.data?.workspace?.length ===1 && workspacesData?.data?.data?.members?.length === 0 && (
              <div className = "w-full mt-[-10px]">
               <p className = "text-[#3c3c3c] font-medium text-sm">{workspacesData.data.data.subscription?.plan === 'FREE'? 'Upgrade to create workpsace':'No workspaces'}</p>
              </div>
            )
          }

      <nav className="w-full">
        <ul className="h-[158px] overflow-auto overflow-x-hidden fade-layer">
          {workspacesData?.data?.data?.workspace && workspacesData.data.data.workspace.length > 0 ? (
            workspacesData.data.data.workspace.map((item) => (
              item.type === "PERSONAL" && (
              <SidebarItem
                href={`/dashboard/${item.id}`}
                selected={pathname === `/dashboard/${item.id}`}
                title={item.name}
                notifications={0}
                key={item.id}
                icon={<WorkspacePlaceholder>{item.name.charAt(0)}</WorkspacePlaceholder>}
              />
              )
            ))
          ) : null}
          {workspacesData?.data?.data?.members && workspacesData.data.data.members.length > 0 && workspacesData.data.data.members.map((member) => (
            <SidebarItem
              href={`/dashboard/${member.Workspace.id}`}
              selected={pathname === `/dashboard/${member.Workspace.id}`}
              title={member.Workspace.name}
              notifications={0}
              key={member.Workspace.id}
              icon={<WorkspacePlaceholder>{member.Workspace.name.charAt(0)}</WorkspacePlaceholder>}
            />
          ))}
          
        </ul>
      </nav>
      <Separator className = "w-4/5" />
      {workspacesData?.data?.data?.subscription?.plan === "FREE" && 
      <GlobalCard title="Upgrade to PRO" description="Upgrade to PRO to create unlimited workspaces">
        <Button className ="text-sm w-full h-6 mt-2">
          <Loader className="mr-2 h-4 w-4" /> Upgrade
        </Button>
        </GlobalCard>}
    </div>  
    )

    return <div className = "full">
      {/* {INFOBAR} */}
      {/* {Sheet mobile and desktop} */}
      <div className =" md:hidden fixed my-4">
      <Sheet>
        <SheetTrigger asChild className="ml-2">
          <Button variant ={"ghost"} className ="mt-[2px]"> <Menu/></Button>

        </SheetTrigger>
        <SheetContent side = "left" className = "p-0 w-fit h-full">
          {SidebarSection}
        </SheetContent>
      </Sheet>
      </div>
      <div className = " md:block hidden h-full">
        {SidebarSection}
      </div>
    </div>
}

export default Sidebar
