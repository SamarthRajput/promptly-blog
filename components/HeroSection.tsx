"use client";
import React, { useState, useEffect } from 'react';
import { Search, PenTool, ArrowRight, Sparkles, BookOpen, Users, TrendingUp } from 'lucide-react';

const HeroSection = () => {
    const [searchValue, setSearchValue] = useState('');
    const [currentWord, setCurrentWord] = useState(0);

    const rotatingWords = ['Stories', 'Ideas', 'Thoughts', 'Insights', 'Dreams'];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % rotatingWords.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const stats = [
        { icon: BookOpen, number: '10K+', label: 'Blog Posts' },
        { icon: Users, number: '5K+', label: 'Writers' },
        { icon: TrendingUp, number: '100K+', label: 'Readers' },
    ];

    const featuredTopics = [
        'Web Development', 'AI & Machine Learning', 'Cloud Computing', 'DevOps', 'Programming Languages', 'Open Source'
    ];

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                    {/* Main Hero Content */}
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-200 shadow-sm">
                                <Sparkles className="w-4 h-4 text-sky-500" />
                                <span className="text-sm font-medium text-sky-700">Welcome to Promptly Blog</span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Share Your{' '}
                            <span className="relative">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 inline-block transform transition-all duration-500">
                                    {rotatingWords[currentWord]}
                                </span>
                            </span>
                            <br />
                            <span className="text-3xl md:text-5xl font-semibold text-gray-700">
                                With the World
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of writers sharing their passion, expertise, and creativity.
                            Start your blogging journey today and connect with readers worldwide.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <button className="group bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2">
                                <PenTool className="w-5 h-5" />
                                <span>Start Writing</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button className="bg-white/80 backdrop-blur-sm hover:bg-white text-sky-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 border border-sky-200 hover:border-sky-300 hover:shadow-lg">
                                Explore Blogs
                            </button>
                        </div>

                        {/* Hero Search Bar */}
                        <div className="max-w-2xl mx-auto mb-16">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sky-400 group-focus-within:text-sky-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Discover amazing stories..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 text-lg bg-white/80 backdrop-blur-sm border border-sky-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl"
                                />
                                {searchValue && (
                                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                                        Search
                                    </button>
                                )}
                            </div>

                            {/* Featured Topics */}
                            <div className="mt-6">
                                <p className="text-sm text-gray-500 mb-3">Popular topics:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {featuredTopics.map((topic) => (
                                        <button
                                            key={topic}
                                            className="px-4 py-2 bg-white/60 backdrop-blur-sm text-sky-700 rounded-full text-sm font-medium hover:bg-white/80 hover:scale-105 transition-all duration-200 border border-sky-100 hover:border-sky-200"
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-sky-200 hover:bg-white/60 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-500 rounded-xl mb-4 shadow-md">
                                    <IconComponent className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HeroSection;