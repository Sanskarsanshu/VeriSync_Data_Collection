import * as React from "react";
import { cn } from "@/lib/utils";
import { Settings, FileText, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Profile {
    name: string;
    email: string;
    avatar: string;
    title?: string;
}

interface MenuItem {
    label: string;
    value?: string;
    href: string;
    icon: React.ReactNode;
    external?: boolean;
}

const ADMIN_PROFILE_DATA: Profile = {
    name: "Dr. Bhawna Sinha",
    title: "HOD",
    email: "bhawna.mca@patnawomenscollege.in",
    avatar: "/features/Bhawnasinha.png", 
};

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    data?: Profile;
}

export function ProfileDropdown({
    data = ADMIN_PROFILE_DATA,
    className,
    ...props
}: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();

    const menuItems: MenuItem[] = [
        {
            label: "My Profile",
            href: "/admin/profile",
            icon: <User className="w-4 h-4" />,
        },
        {
            label: "Settings",
            href: "/admin/settings",
            icon: <Settings className="w-4 h-4" />,
        },
        {
            label: "Terms & Policies",
            href: "/admin/settings",
            icon: <FileText className="w-4 h-4" />,
        },
    ];

    const handleLogout = () => {
        // Implement logout logic here
        navigate('/login');
    };

    return (
        <div className={cn("relative", className)} {...props}>
            <DropdownMenu onOpenChange={setIsOpen}>
                <div className="group relative z-50">
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-4 p-2 rounded-2xl bg-card border border-border hover:border-emerald-500/50 hover:bg-muted/50 hover:shadow-sm transition-all duration-200 focus:outline-none"
                        >
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-foreground tracking-tight leading-tight flex items-center gap-1.5 justify-end">
                                    {data.name} <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded uppercase font-bold">{data.title}</span>
                                </div>
                                <div className="text-xs text-muted-foreground tracking-tight leading-tight mt-0.5">
                                    {data.email}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-0.5">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                        <img
                                            src={data.avatar}
                                            alt={data.name}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="w-64 p-2 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-xl shadow-black/10 origin-top-right z-50"
                    >
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <DropdownMenuItem key={item.label} asChild>
                                    <Link
                                        to={item.href}
                                        className="flex items-center p-3 hover:bg-muted rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-border/50 focus:bg-muted focus:outline-none"
                                    >
                                        <div className="flex items-center gap-3 flex-1 text-muted-foreground group-hover:text-foreground transition-colors">
                                            {item.icon}
                                            <span className="text-sm font-medium tracking-tight leading-tight whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </div>

                        <DropdownMenuSeparator className="my-2 bg-border" />

                        <DropdownMenuItem asChild>
                            <button
                                onClick={handleLogout}
                                type="button"
                                className="w-full flex items-center gap-3 p-3 duration-200 bg-destructive/10 rounded-xl hover:bg-destructive/20 cursor-pointer border border-transparent hover:border-destructive/30 hover:shadow-sm transition-all group focus:outline-none"
                            >
                                <LogOut className="w-4 h-4 text-destructive group-hover:text-destructive" />
                                <span className="text-sm font-medium text-destructive group-hover:text-destructive">
                                    Sign Out
                                </span>
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </div>
            </DropdownMenu>
        </div>
    );
}
