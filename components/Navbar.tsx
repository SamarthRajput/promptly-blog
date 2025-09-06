"use client";
import React, { useState } from 'react';
import { Search, Menu, X, PenTool, Home, FileText, BarChart3 } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'All Blogs', href: '/blogs', icon: FileText },
        { name: 'Write', href: '/write', icon: PenTool },
        { name: 'Dashboard', href: '/dashboard', icon: BarChart3 }
    ];

    return (
        <nav className="bg-gradient-to-r from-sky-50 to-sky-100 border-b border-sky-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section - Always visible */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-sky-500 rounded-lg shadow-md">
                            <PenTool className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-sky-800">
                            Promptly Blog
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-2 text-sky-700 hover:text-sky-900 transition-colors duration-200 font-medium group"
                                >
                                    <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>{item.name}</span>
                                </a>
                            );
                        })}
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="flex-1 max-w-md mx-4 hidden lg:block">
                        <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sky-400" />
                            <input
                                type="text"
                                placeholder="Search blogs..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-sky-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200"
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                        </div>
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <div className="flex items-center space-x-3">
                                <UserButton />
                            </div>
                        </SignedIn>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-md text-sky-600 hover:text-sky-800 hover:bg-sky-200 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden bg-white border-t border-sky-200 shadow-lg`}>
                <div className="px-4 py-4 space-y-4">
                    {/* Mobile Search Bar - First in menu */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sky-400" />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            className="w-full pl-11 pr-4 py-3 bg-sky-50 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sky-800 placeholder-sky-500"
                        />
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-2">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-3 text-sky-700 hover:text-sky-900 hover:bg-sky-50 px-4 py-3 rounded-xl transition-colors font-medium group"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>{item.name}</span>
                                </a>
                            );
                        })}
                    </div>

                    {/* Mobile Auth Section */}
                    <div className="pt-4 border-t border-sky-200">
                        <SignedOut>
                            <div className="px-4">
                                <SignInButton>
                                    <button className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 px-4 rounded-xl font-medium transition-colors">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </div>
                        </SignedOut>
                        <SignedIn>
                            <div className="flex items-center justify-between px-4 py-3 bg-sky-50 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <UserButton />
                                    <span className="text-sky-700 font-medium">My Account</span>
                                </div>
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;