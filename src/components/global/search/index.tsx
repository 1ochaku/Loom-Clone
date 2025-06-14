import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useSearch } from '@/hooks/useSearch'
import { Loader, User } from 'lucide-react'
import React from 'react'
import { useMutationData } from '@/hooks/useMutationData'

type Props = {
    workspaceId: string
}

const Search = ({workspaceId}: Props) => {
  
  const {onSearchQuery, onUsers, isFetching,query} = useSearch(
    'get-users', 'USERS'
)
  const {mutate, isPending} = useMutationData(['invite-member'], async (data:{receiverId:string; email:string}) => {
     // invitemembers
     return Promise.resolve();
  })
    return (
    <div className='flex flex-col gap-y-5'>
      <Input 
        onChange={onSearchQuery}
        value={query}
        className='bg-transparent border-2 outline-none'
        placeholder='Search for your user....'
        type='text'
      />
       
          
        
       {isFetching ? (
  <div className="flex flex-col gap-y-2">
    <Skeleton className="w-full h-8 rounded-xl" />
  </div>
) : !onUsers ? (
  <p className="text-center text-sm text-[#a4a4a4]">No Users Found</p>
) : (
  <div>
    {onUsers.map((user) => (
        <div
         key={user.id} 
         className=" flex-gap-x-3 items-center border-2 w-full p-3 rounded-xl ">
          <Avatar>
            <AvatarImage src={user.image as string}/>
            <AvatarFallback>
              <User />
              </AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-y-2'>
            <h3 className="text-bold text-lg capitalize" > {user.firstName} {user.lastName}</h3>
            <p className = "lowercase text-xs bg-white px-2 rounded-lg text-[#1e1e1e] w-fit">
              {user.subscription?.plan}
            </p>
            </div>
            <div className = "flex-1 flex justify-end items-center">
              <Button onClick={() => {}} variant ={'default'} className="w-5/12 font-bold">
                {isPending ? <Loader className="animate-spin" /> : "Invite"}
              </Button>
            </div>
        </div>
    ))}
  </div>
)}
    </div>
  )
}

export default Search




