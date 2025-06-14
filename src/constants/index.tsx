import { BookOpenIcon, HomeIcon } from "lucide-react";
import { BellIcon } from "lucide-react";
import { CreditCardIcon } from "lucide-react";
import { SettingsIcon } from "lucide-react";

export const MENU_ITEMS = (workspaceId: string):{title: string; href: string; icon: React.ReactNode}[] => [
    {title: "Home",href: `/dashboard/${workspaceId}/home`,icon: <HomeIcon />},
    {title: "My Library",href: `/dashboard/${workspaceId}`,icon: <BookOpenIcon />},
    {title: "Notifications",href: `/dashboard/${workspaceId}/notifications`,icon: <BellIcon />},
    {title: "Billing",href: `/dashboard/${workspaceId}/billing`,icon: <CreditCardIcon />},
    {title: "Settings",href: `/dashboard/${workspaceId}/settings`,icon: <SettingsIcon />},
    
]