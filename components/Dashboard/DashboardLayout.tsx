"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    BarChart3,
    BookOpen,
    Bookmark,
    Bell,
    HelpCircle,
    Image as ImageIcon,
    LayoutDashboard,
    Menu,
    Settings,
    User,
    X,
    ChevronDown,
    LogOut,
    UserCircle,
    PenTool,
    CheckSquare,
    Users,
    MessageSquareWarning,
    FileText,
    Tags,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs'

// Navigation items configuration
const navItems = [
    {
        title: 'Overview',
        description: 'Get a quick overview of your blog performance and recent activity.',
        href: '/dashboard',
        icon: LayoutDashboard,
        exact: true
    },
    {
        title: 'Analytics',
        description: 'Dive deep into your blog analytics and track your growth.',
        href: '/dashboard/analytics',
        icon: BarChart3
    },
    {
        title: 'My Blogs',
        description: 'Manage and edit your blog posts all in one place.',
        href: '/dashboard/blogs',
        icon: BookOpen
    },
    {
        title: 'Media Library',
        description: 'Organize and manage your media files efficiently.',
        href: '/dashboard/media',
        icon: ImageIcon
    },
    {
        title: 'Notifications',
        description: 'Stay updated with the latest notifications and alerts.',
        href: '/dashboard/notifications',
        icon: Bell
    },
    {
        title: 'Bookmarks',
        description: 'Save and manage your favorite blog posts.',
        href: '/dashboard/bookmarks',
        icon: Bookmark
    },
    {
        title: 'Profile & Settings',
        description: 'Manage your profile settings and preferences.',
        href: '/dashboard/settings',
        icon: Settings
    },
    {
        title: 'Help / Tips',
        description: 'Access help resources and useful tips for using the dashboard.',
        href: '/dashboard/help',
        icon: HelpCircle
    }
];

const adminNavItems = [
    {
        title: 'Admin Overview',
        description: 'Quick summary of site activity, pending reviews, and system stats.',
        href: '/admin',
        icon: LayoutDashboard,
        exact: true
    },
    {
        title: 'Post Review & Approvals',
        description: 'Review, approve, reject, or schedule submitted blog posts.',
        href: '/admin/reviews',
        icon: CheckSquare
    },
    {
        title: 'Users Management',
        description: 'Manage users, roles, and site permissions.',
        href: '/admin/users',
        icon: Users
    },
    {
        title: 'Categories & Tags',
        description: 'Create and manage content categories and tags.',
        href: '/admin/taxonomy',
        icon: Tags
    },
    {
        title: 'Media Library',
        description: 'Access and moderate uploaded media files.',
        href: '/admin/media',
        icon: ImageIcon
    },
    {
        title: 'User Queries',
        description: 'Manage and respond to user-submitted queries and feedback.',
        href: '/admin/comments',
        icon: MessageSquareWarning
    },
    {
        title: 'Site Notifications',
        description: 'Send or broadcast announcements to all users.',
        href: '/admin/notifications',
        icon: Bell
    },
    {
        title: 'Audit Logs',
        description: 'Track all critical actions and changes across the platform.',
        href: '/admin/audit-logs',
        icon: FileText
    },
    {
        title: 'System Settings',
        description: 'Configure platform-level preferences and integrations.',
        href: '/admin/settings',
        icon: Settings
    }
];


interface DashboardLayoutProps {
    children: React.ReactNode;
}

interface SidebarProps {
    loggedInUser: {
        name: string;
        email: string;
        imageUrl: string;
    };
    isAdminRoute: boolean;
    isCollapsed: boolean;
    onToggle: () => void;
    isMobile: boolean;
    isOpen: boolean;
    onClose: () => void;
}

interface TopNavbarProps {
    loggedInUser: {
        name: string;
        email: string;
        imageUrl: string;
    };
    currentPageTitle: string;
    currentPageDescription: string;
    onMobileMenuToggle: () => void;
    onLogout: () => void;
}

// Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ loggedInUser, isAdminRoute, isCollapsed, onToggle, isMobile, isOpen, onClose }) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (item: typeof navItems[0] | typeof adminNavItems[0]) => {
        if (item.exact) {
            return pathname === item.href;
        }
        return pathname.startsWith(item.href);
    };

    const sidebarContent = (
        <>
            {/* Logo and Brand */}
            <div className={cn(
                "flex items-center justify-between p-4 border-b border-slate-200",
                isCollapsed && !isMobile && "justify-center"
            )}>
                <div
                    className={cn(
                        // Always row, single line for responsiveness
                        "flex flex-row items-center space-x-3 select-none cursor-pointer justify-center w-full"
                    )}
                    onClick={() => {
                        router.push("/");
                    }}
                    title='Go to Home Page'
                >{(!isCollapsed || isMobile) && (
                    <div className="flex flex-row items-center space-x-3 w-full">
                        <div className="flex items-center justify-center w-10 h-10 bg-sky-500 rounded-xl shadow-lg cursor-pointer select-none">
                            <PenTool className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-xl font-bold text-slate-800">Promptly Blog</h1>
                            <p className="text-xs text-slate-500">{isAdminRoute ? 'Admin' : 'User'} Dashboard</p>
                        </div>
                    </div>
                )}
                </div>
                {/* Toggle button for desktop, close button for mobile */}
                <button
                    onClick={isMobile ? onClose : onToggle}
                    className={cn(
                        "p-2 hover:bg-slate-100 rounded-lg transition-colors",
                        isCollapsed && !isMobile && "mx-auto"
                    )}
                >
                    {isMobile ? (
                        <X className="w-5 h-5 text-slate-600" />
                    ) : (
                        <Menu className="w-5 h-5 text-slate-600" />
                    )}
                </button>
            </div>
            {/* Navigation Items */}
            <nav
                className={cn(
                    "flex-1 p-4 space-y-2 overflow-y-auto",
                    "hide-scrollbar",
                    isCollapsed && !isMobile && "px-2"
                )}
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none"
                }}
            >
                {(isAdminRoute ? adminNavItems : navItems).map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={isMobile ? onClose : undefined}
                            className={cn(
                                "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative",
                                active
                                    ? "bg-sky-100 text-sky-700 shadow-sm"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800",
                                isCollapsed && !isMobile && "justify-center px-0"
                            )}
                            title={isCollapsed && !isMobile ? item.title : undefined}
                            prefetch={true}
                        >
                            <Icon
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    active
                                        ? "text-sky-600"
                                        : "text-slate-500 group-hover:text-slate-700"
                                )}
                            />
                            {
                                (!isCollapsed || isMobile) && (
                                    <span className="font-medium ml-3">{item.title}</span>
                                )}
                            {active && (!isCollapsed || isMobile) && (
                                <div className={cn(
                                    "ml-auto w-2 h-2 bg-sky-500 rounded-full",
                                    !isCollapsed && !isMobile && "absolute right-3"
                                )} />
                            )}
                        </Link>
                    );
                })}
            </nav>
            {/* User Profile Section */}
            <div className={cn(
                "p-4 border-t border-slate-200",
                isCollapsed && !isMobile && "flex justify-center p-2"
            )}>
                {(!isCollapsed || isMobile) ? (
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center">
                            {loggedInUser.imageUrl ? (
                                <img
                                    src={loggedInUser.imageUrl}
                                    alt={loggedInUser.name}
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <User className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{loggedInUser.name}</p>
                            <p className="text-xs text-slate-500 truncate">{loggedInUser.email}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center">
                            {loggedInUser.imageUrl ? (
                                <img
                                    src={loggedInUser.imageUrl}
                                    alt={loggedInUser.name}
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <User className="w-5 h-5 text-white" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );

    // Add a collapse/expand button for desktop
    // const CollapseButton = () => (
    //     <button
    //         onClick={onToggle}
    //         className={cn(
    //             "absolute z-400 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 shadow transition-all hover:bg-slate-100",
    //             isCollapsed ? "left-12" : "left-55"
    //         )}
    //         style={{
    //             top: 80 // below logo
    //         }}
    //         aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    //         tabIndex={0}
    //     >
    //         {isCollapsed ? <ChevronRight className="w-5 h-5 text-slate-600" /> : <ChevronLeft className="w-5 h-5 text-slate-600" />}
    //     </button>
    // );

    if (isMobile) {
        return (
            <>
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 block sm:hidden"
                        onClick={onClose}
                    />
                )}

                <aside className={cn(
                    "fixed left-0 top-0 h-full w-4/5 max-w-xs bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out block sm:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <div className="flex flex-col h-full overflow-y-auto hide-scrollbar">
                        {sidebarContent}
                    </div>
                </aside>
            </>
        );
    }

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-full bg-white shadow-lg z-30 transition-all duration-300 ease-in-out hidden md:block",
            isCollapsed
                ? "w-14 md:w-16"
                : "w-56 md:w-64",
            "overflow-y-hidden"
        )}>
            <div className="flex flex-col h-full relative">
                {sidebarContent}
                {/* Desktop collapse/expand button */}
                {/* <CollapseButton /> */}
            </div>
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </aside>
    );
};

const TopNavbar: React.FC<TopNavbarProps> = ({ currentPageTitle, currentPageDescription, onMobileMenuToggle, loggedInUser, onLogout }) => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-20">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onMobileMenuToggle}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors block lg:hidden"
                    >
                        <Menu className="w-6 h-6 text-slate-600" />
                    </button>
                    <div className="min-w-0">
                        <h2 className="text-lg sm:text-2xl font-bold text-slate-800 truncate">{currentPageTitle}</h2>
                        <p className="text-xs sm:text-sm text-slate-500 truncate">{currentPageDescription}</p>
                    </div>
                </div>

                <div className="relative hidden sm:block">
                    <button
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="flex items-center space-x-3 p-2 hover:bg-slate-100 rounded-xl transition-colors group"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center ring-2 ring-sky-200 group-hover:ring-sky-400 transition">
                            {loggedInUser.imageUrl ? (
                                <img
                                    src={loggedInUser.imageUrl}
                                    alt={loggedInUser.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-slate-800">{loggedInUser.name}</p>
                            <p className="text-xs text-slate-500">User</p>
                        </div>
                        <ChevronDown className={cn(
                            "w-4 h-4 text-slate-500 transition-transform duration-200",
                            isUserDropdownOpen && "rotate-180"
                        )} />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsUserDropdownOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-20 animate-fade-in">
                                <div className="px-4 py-3 flex items-center space-x-3 border-b border-slate-100">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                                        {loggedInUser.imageUrl ? (
                                            <img
                                                src={loggedInUser.imageUrl}
                                                alt={loggedInUser.name}
                                                className="w-9 h-9 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 truncate">{loggedInUser.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{loggedInUser.email}</p>
                                    </div>
                                </div>

                                <Link
                                    href="/dashboard/settings"
                                    className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-sky-50 transition-colors"
                                    onClick={() => setIsUserDropdownOpen(false)}
                                >
                                    <Settings className="w-5 h-5" />
                                    <span>Settings</span>
                                </Link>
                                <hr className="my-2 border-slate-100" />
                                <button
                                    className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                    onClick={() => {
                                        onLogout();
                                        toast.success("Logged out successfully");
                                    }}
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

// Main Dashboard Layout Component
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isAdminRoute, setIsAdminRoute] = useState(false);
    const pathname = usePathname();
    const { user } = useUser();
    const [loggedInUser, setLoggedInUser] = useState({
        name: '',
        email: '',
        imageUrl: '',
    });
    const { signOut } = useClerk();
    useEffect(() => {
        if (user) {
            setLoggedInUser({
                name: user.fullName || '',
                email: user.primaryEmailAddress?.emailAddress || '',
                imageUrl: user.imageUrl || ''
            });
        }
    }, [user]);

    useEffect(() => {
        setIsAdminRoute(pathname.startsWith('/admin'));
    }, [pathname]);

    // Get current page title based on pathname
    const getCurrentPageTitle = () => {
        const currentItem = isAdminRoute ? adminNavItems.find(item => {
            if (item.exact) {
                return pathname === item.href;
            }
            return pathname.startsWith(item.href);
        }) : navItems.find(item => item.href === pathname);
        return currentItem?.title || 'Dashboard';
    };
    const getCurrentPageDescription = () => {
        const currentItem = isAdminRoute ? adminNavItems.find(item => {
            if (item.exact) {
                return pathname === item.href;
            }
            return pathname.startsWith(item.href);
        }) : navItems.find(item => item.href === pathname);
        return currentItem?.description || 'Manage your blog and settings here.';
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const closeMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-slate-50 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-sky-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
            </div>

            {/* Sidebar for desktop */}
            <Sidebar
                loggedInUser={loggedInUser}
                isAdminRoute={isAdminRoute}
                isCollapsed={isSidebarCollapsed}
                onToggle={toggleSidebar}
                isMobile={false}
                isOpen={isMobileSidebarOpen}
                onClose={closeMobileSidebar}
            />

            {/* Sidebar for mobile */}
            <Sidebar
                loggedInUser={loggedInUser}
                isAdminRoute={isAdminRoute}
                isCollapsed={false}
                onToggle={toggleSidebar}
                isMobile={true}
                isOpen={isMobileSidebarOpen}
                onClose={closeMobileSidebar}
            />

            {/* Main Content Area */}
            <div className={cn(
                "transition-all duration-300 ease-in-out relative",
                "md:ml-64", // default sidebar width for md+
                isSidebarCollapsed && "md:ml-16",
                "sm:ml-0" // no sidebar margin on small screens
            )}>
                {/* Top Navbar */}
                <TopNavbar
                    loggedInUser={loggedInUser}
                    currentPageTitle={getCurrentPageTitle()}
                    currentPageDescription={getCurrentPageDescription()}
                    onMobileMenuToggle={toggleMobileSidebar}
                    onLogout={() => { signOut({ redirectUrl: '/' }); toast.success("Logged out successfully"); }}
                />

                {/* Page Content */}
                <main className="relative ml-0 p-3 sm:p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;