"use server"

import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const verifyAccessToWorkspace = async (workspaceId: string) => { 
    try {
        const user = await currentUser()

        if (!user) return { status: 403 }
        
        const isUserInWorkspace = await client.workSpace.findUnique({
            where: {
                id: workspaceId,
                OR: [
                    {
                        User: {
                            clerkid: user.id,
                        }
                    },
                    {
                        members: {
                            every: {
                                User: {
                                    clerkid: user.id,
                                },
                            },
                        },
                    },
                ],
            },
        })
        return {
            status: 200,
            data: { workspace: isUserInWorkspace }
        }
    } catch (error) {
        return {
            status: 403,
            data: { workspace: null }
        }
    }
}

export const getWorkspaceFolders = async (workSpaceId: string) => {
    try {
        const isFolders = await client.folder.findMany({
            where: {
                workSpaceId,
            },
            include:{
                _count: {
                    select: {
                         videos:true,
                    },
                   
                },
            },
        })
        if (isFolders && isFolders.length >0){
            return {status :200 , data :isFolders}
        }
        return {status: 404, data: []}

    } catch (error){
        return { status:403 , data:[]}
    }
}

export const getAllUserVideos = async (workSpaceId : string) => {
    try{
        const user = await currentUser()
        if (!user) return {status: 404}
        const videos = await client.video.findMany({
            where:{
                OR:[{workSpaceId}, {folderId: workSpaceId}],
            },
            select :{
                id: true,
                title: true,
                createdAt: true,
                source: true,
                processing: true,
                folder: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                User: {
                    select: {
                        firstname:true,
                        lastname: true,
                        image: true,
                    },
                },
               
            },
             orderBy:{
                    createdAt: 'asc',
                },


        })
         if (videos && videos.length >0){
            return {status :200 , data :videos}
        }
        return {status: 404, data: []}

    } catch (error){
        return { status:400 , data:[]}
    }
    
}

export const getWorkSpaces = async () => {
    try {
        const user = await currentUser()
        if (!user) return {status: 404, data: null}
        
        // First get the user record from our database
        const dbUser = await client.user.findUnique({
            where: {
                clerkid: user.id
            }
        })

        if (!dbUser) {
            return {status: 404, data: null}
        }

        // Get user's workspaces
        const userWorkspaces = await client.workSpace.findMany({
            where: {
                OR: [
                    { userId: dbUser.id },
                    {
                        members: {
                            some: {
                                userId: dbUser.id
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                type: true,
            }
        })

        // Get user's subscription
        const userData = await client.user.findUnique({
            where: {
                id: dbUser.id
            },
            select: {
                subscription: {
                    select: {
                        plan: true
                    }
                }
            }
        })

        const transformedData = {
            data: {
                subscription: userData?.subscription || null,
                workspace: userWorkspaces || [],
                members: [] // We'll handle members separately if needed
            }
        }

        return {status: 200, data: transformedData}
    } catch (error) {
        return {status: 400, data: null}
    }
}

