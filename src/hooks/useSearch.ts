import { useEffect, useState } from 'react';
import { useQueryData } from './useQueryData';
import { searchUsers } from '@/actions/user';
import { Users } from 'lucide-react';

export const useSearch = (key:string, type:"USERS") => {

  const [query, setQuery] = useState('')
  const [debounce,setDebounce] = useState('')
  const [onUsers, setOnUsers] = useState<{
    id:string 
    subscription:{
      plan :"PRO" | "FREE"
    } | null
    firstName:string | null
    lastName:string | null
    image:string | null
    email:string | null
  }[]
  | undefined 
  >(undefined)

  const onSearchQuery = (e:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebounce(query)
    }, 1000)

    return () => clearTimeout(delayInputTimeoutId)
  }, [query])
  

  const {refetch,isFetching} = useQueryData(
    [key,debounce],
    async ({queryKey}) => {
      if (type === 'USERS'){
        const users = await searchUsers(queryKey[1] as string)
        if(users.status === 200 && users.data) {
          const transformedData = users.data.map(user => ({
            id: user.id,
            subscription: user.subscription,
            firstName: user.firstname,
            lastName: user.lastname,
            image: user.image,
            email: user.email
          }))
          setOnUsers(transformedData)
        }
      }
    },
    false
      
  )
  useEffect( () => {
    if(debounce) refetch ()
      if (!debounce) setOnUsers(undefined)
        return () => {
           debounce
        }
  }, [debounce])

  return {onSearchQuery, onUsers, isFetching,query}
}
