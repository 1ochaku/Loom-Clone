export type WorkspaceProps = {
    status: number;
    data: {
        data: {
            subscription: {
                plan: 'FREE' | 'PRO'
            } | null
            workspace: {
                id: string
                name: string
                type: 'PUBLIC' | 'PERSONAL'
            }[]
            members: {
                Workspace: {
                    id: string
                    name: string
                    type: 'PUBLIC' | 'PERSONAL'
                }
            }[]
        }
    }
}

export type NotificationProps = {
    _count: {
        notifications: number
    }
}