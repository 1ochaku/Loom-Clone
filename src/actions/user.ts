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