"use client";

import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Download,
    Users,
    UserCheck,
    ChevronLeft,
    ChevronRight,
    Mail,
    Calendar,
    MessageSquare,
    Heart,
    FileText,
    Shield,
    Crown,
    Eye,
    Edit,
    Trash2,
    RefreshCw,
    MoreHorizontal,
    AlertTriangle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Interface based on your data structure
interface UsersWithStats {
    postCount: number;
    commentCount: number;
    reactionCount: number;
    collaborationsCount: number;
    invitesCount: number;
    id: string;
    clerkId: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    bio: string | null;
    siteRole: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
}

interface ApiResponse {
    users: UsersWithStats[];
    total: number;
}

const AdminUsersPage = () => {
    const [users, setUsers] = useState<UsersWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    // Filter and search states
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
    const [activityFilter, setActivityFilter] = useState<"all" | "none" | "published">("all");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // UI states
    const [showFilters, setShowFilters] = useState(false);
    const [confirmRoleChange, setConfirmRoleChange] = useState<{
        userId: string;
        userName: string;
        currentRole: string;
        newRole: string;
    } | null>(null);

    // Fetch users from API
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                search: searchTerm,
                role: roleFilter,
                postActivity: activityFilter,
                sortBy,
                sortDir,
                page: page.toString(),
                limit: limit.toString()
            });

            const res = await fetch(`/api/admin/users?${params.toString()}`);
            if (!res.ok) {
                throw new Error('Failed to fetch users');
            }
            const data: ApiResponse = await res.json();
            setUsers(data.users);
            setTotal(data.total);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when filters change
    useEffect(() => {
        fetchUsers();
    }, [searchTerm, roleFilter, activityFilter, sortBy, sortDir, page, limit]);

    // Handle role change with confirmation
    const handleRoleChangeRequest = (userId: string, userName: string, currentRole: string, newRole: string) => {
        // if (newRole === 'admin') {
        //     setConfirmRoleChange({ userId, userName, currentRole, newRole });
        // } else {
        //     confirmRoleChange && handleRoleChange(userId, newRole as "user" | "admin");
        // }
        // confirm all role changes
        setConfirmRoleChange({ userId, userName, currentRole, newRole });
    };

    const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ siteRole: newRole }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user role');
            }

            setUsers(prevUsers =>
                prevUsers.map(u => u.id === userId ? { ...u, siteRole: newRole } : u)
            );
            setConfirmRoleChange(null);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleExportUsers = () => {
        const csvContent = [
            ["Name", "Email", "Role", "Posts", "Comments", "Reactions", "Collaborations", "Invites", "Created At"].join(","),
            ...users.map(user => [
                `"${user.name}"`,
                `"${user.email}"`,
                user.siteRole,
                user.postCount,
                user.commentCount,
                user.reactionCount,
                user.collaborationsCount,
                user.invitesCount,
                new Date(user.createdAt).toLocaleDateString()
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getRoleIcon = (role: string) => {
        return role === "admin"
            ? <Crown className="w-4 h-4 text-amber-500" />
            : <Shield className="w-4 h-4 text-blue-500" />;
    };

    const getRoleBadge = (role: string) => {
        return role === "admin"
            ? "bg-amber-100 text-amber-800 border-amber-200"
            : "bg-blue-100 text-blue-800 border-blue-200";
    };

    const getActivityStatus = (postCount: number) => {
        if (postCount === 0) return { text: "Inactive", color: "bg-gray-100 text-gray-700" };
        if (postCount < 5) return { text: "New", color: "bg-blue-100 text-blue-700" };
        if (postCount < 15) return { text: "Active", color: "bg-green-100 text-green-700" };
        return { text: "Highly Active", color: "bg-purple-100 text-purple-700" };
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen bg-gray-50/50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Users", value: total, icon: Users, color: "text-blue-600" },
                        { label: "Active Writers", value: users.filter(u => u.postCount > 0).length, icon: FileText, color: "text-green-600" },
                        { label: "Administrators", value: users.filter(u => u.siteRole === "admin").length, icon: Crown, color: "text-amber-600" },
                        { label: "New This Month", value: users.filter(u => new Date(u.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000).length, icon: UserCheck, color: "text-purple-600" }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 space-y-4">
                        {/* Search and Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${showFilters
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <Filter className="w-4 h-4" />
                                    Filters
                                </button>

                                <button
                                    onClick={handleExportUsers}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>

                                <button
                                    onClick={fetchUsers}
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="border-t border-gray-200 pt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <select
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value as "all" | "user" | "admin")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="all">All Roles</option>
                                            <option value="user">Users</option>
                                            <option value="admin">Admins</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                                        <select
                                            value={activityFilter}
                                            onChange={(e) => setActivityFilter(e.target.value as "all" | "none" | "published")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="all">All Users</option>
                                            <option value="none">No Posts</option>
                                            <option value="published">Has Published</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="createdAt">Join Date</option>
                                            <option value="name">Name</option>
                                            <option value="email">Email</option>
                                            <option value="postCount">Posts</option>
                                            <option value="commentCount">Comments</option>
                                            <option value="reactionCount">Reactions</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                        <select
                                            value={sortDir}
                                            onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="desc">Descending</option>
                                            <option value="asc">Ascending</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Users Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Add a user-friendly title above the table */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Users List &mdash; Review, Search, and Manage
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Use the controls above to filter, search, or export users.
                        </p>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No users found
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No users match your criteria. Try searching by name, email, or adjust filters above.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => {
                                            const activityStatus = getActivityStatus(user.postCount);
                                            return (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0">
                                                                {user.avatarUrl ? (
                                                                    <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl} alt={user.name} />
                                                                ) : (
                                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                        <span className="text-sm font-medium text-gray-700"
                                                                            title={user.name}>
                                                                            {user.name.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                <div className="text-sm text-gray-500 flex items-center"
                                                                    title={`${user.email}`}>
                                                                    <Mail className="w-3 h-3 mr-1" />
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2"
                                                            title={`Current role: ${user.siteRole}\nClick to change role`}>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(user.siteRole)}`}>
                                                                {getRoleIcon(user.siteRole)}
                                                                <span className="ml-1 capitalize">{user.siteRole}</span>
                                                            </span>
                                                            <select
                                                                value={user.siteRole}
                                                                onChange={(e) => handleRoleChangeRequest(
                                                                    user.id,
                                                                    user.name,
                                                                    user.siteRole,
                                                                    e.target.value
                                                                )}
                                                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            >
                                                                <option value="user">User</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activityStatus.color}`}>
                                                            {activityStatus.text}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                            <div className="flex items-center">
                                                                <FileText className="w-4 h-4 mr-1" />
                                                                <span>{user.postCount}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <MessageSquare className="w-4 h-4 mr-1" />
                                                                <span>{user.commentCount}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Heart className="w-4 h-4 mr-1" />
                                                                <span>{user.reactionCount}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between items-center">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span>Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results</span>
                                        <select
                                            value={limit}
                                            onChange={(e) => {
                                                setLimit(parseInt(e.target.value));
                                                setPage(1);
                                            }}
                                            className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
                                        >
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </select>
                                        <span className="ml-1">per page</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setPage(page - 1)}
                                            disabled={page === 1}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Previous
                                        </button>

                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                const pageNum = i + Math.max(1, page - 2);
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setPage(pageNum)}
                                                        className={`px-3 py-2 text-sm rounded-md ${page === pageNum
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => setPage(page + 1)}
                                            disabled={page === totalPages}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Role Change Confirmation Modal */}
                {confirmRoleChange && (
                    <div className="fixed inset-0 bg-blue-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <div className="flex items-center mb-4">
                                <AlertTriangle className="w-6 h-6 text-amber-600 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">Confirm Role Change</h3>
                            </div>
                            <p className="text-sm text-gray-700 mb-4">
                                Are you sure you want to change <strong>{confirmRoleChange.userName}</strong> to <strong>{confirmRoleChange.newRole.toLocaleUpperCase()}</strong>?
                                This will give them {confirmRoleChange.newRole === 'admin' ? 'full administrative access' : 'standard user permissions'}.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setConfirmRoleChange(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleRoleChange(confirmRoleChange.userId, confirmRoleChange.newRole as "user" | "admin")}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                                    title="Changing roles can impact user access and permissions. Proceed with caution."
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;