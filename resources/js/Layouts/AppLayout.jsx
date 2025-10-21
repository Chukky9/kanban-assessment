import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth } = usePage().props;

    const navigation = [
        { name: 'Overview', href: '/dashboard', icon: '📊', current: true },
        { name: 'Projects', href: '/projects', icon: '📁', current: false },
        { name: 'Users', href: '/users', icon: '👥', current: false, adminOnly: true },
        { name: 'Reports', href: '/reports', icon: '📈', current: false },
    ];

    const filteredNavigation = navigation.filter(item => 
        !item.adminOnly || auth?.user?.role === 'admin'
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Kanban Dashboard" />
            
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <SidebarContent navigation={filteredNavigation} auth={auth} />
                </div>
            </div>

            {/* Desktop layout */}
            <div className="hidden lg:flex lg:h-screen">
                {/* Desktop sidebar */}
                <div className="flex flex-col w-64 flex-shrink-0 h-screen">
                    <SidebarContent navigation={filteredNavigation} auth={auth} />
                </div>

                {/* Main content area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Page content */}
                    <main className="flex-1 overflow-y-auto">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile layout */}
            <div className="lg:hidden">
                {/* Top bar for mobile */}
                <div className="sticky top-0 z-10 pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
                    <button
                        type="button"
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Page content */}
                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function SidebarContent({ navigation, auth }) {
    return (
        <div className="flex flex-col h-screen border-r border-gray-200 bg-white">
            {/* Logo */}
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                    <h1 className="text-xl font-bold text-gray-900">Kanban Board</h1>
                </div>
                
                {/* Navigation */}
                <nav className="mt-5 flex-1 px-2 space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`${
                                item.current
                                    ? 'bg-indigo-100 text-indigo-900'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                        >
                            <span className="mr-3 text-lg">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* User profile */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                                {auth?.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">{auth?.user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 capitalize">{auth?.user?.role || 'member'}</p>
                    </div>
                </div>
                <div className="ml-auto">
                    <Link
                        href="/logout"
                        method="post"
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}