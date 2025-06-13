'use server'

import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const onAuthenticateUser = async () => {
    try {
      const user = await currentUser();
      
      if (!user) {
        return { status: 401, message: "User not authenticated" };
      }
  
      // Use upsert to handle race conditions
      // This will either update existing user or create new one atomically
      const authenticatedUser = await client.user.upsert({
        where: {
          email: user.emailAddresses[0]?.emailAddress,
        },
        update: {
          // Update any fields if user exists (optional)
          clerkid: user.id,
        },
        create: {
          clerkid: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          // Add other required fields for user creation
          // name: user.firstName + " " + user.lastName,
          // etc.
        },
      });
  
      return { status: 200, user: authenticatedUser };
      
    } catch (error) {
      console.error("Authentication error:", error);
      return { status: 500, message: "Authentication failed" };
    }
  };


  export const getNotifications = async () => {
    try {
        const user = await currentUser()
       if (!user) return { status: 404}
       const notifications = await client.user.findUnique({
        where: {
          clerkid: user.id,
        },
        select:{
          notification: true,
          _count: {
            select: {
              notification: true,
            },
          },
        },
       })

       if (notifications && notifications._count.notification >0 )
        return { status :200, data : notifications}
      return { status : 404 , data: []}
    }catch (error){
      return { status : 400, data: []}
    }
  }

  export const searchUsers = async (query:string) => {
    try {
      const user = await currentUser()
      if (!user) return { status: 404}

      const users = await client.user.findMany({
        where: {
          OR: [
            {firstname: {contains: query}},
            {email: {contains: query}}
          ],
          NOT:[{clerkid: user.id}]
        },
        select:{
          id: true,
          firstname: true,
          lastname: true,
          image: true,
          email: true,
          subscription: {
            select: {
              plan: true
            }
          }
        },
       })
       if (users && users.length > 0){
        return { status: 200, data: users}
       }
      return { status: 404, data: undefined}
    } catch (error) {
      return { status: 500, data: undefined}
    }
  }