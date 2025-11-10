"use client";

import React from 'react';
import { X, Calendar, Clock, User, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface BlogPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    coverImageUrl?: string;
    author?: string;
    readingTime?: number;
}

export default function BlogPreviewModal({
    isOpen,
    onClose,
    title,
    content,
    coverImageUrl,
    author = "You",
    readingTime
}: BlogPreviewModalProps) {
    if (!isOpen) return null;

    // Calculate reading time if not provided
    const estimatedReadingTime = readingTime || Math.ceil(content.split(/\s+/).length / 200);

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative h-full flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Eye className="w-5 h-5 text-sky-500" />
                            <h2 className="text-lg font-semibold text-slate-800">Preview</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            aria-label="Close preview"
                        >
                            <X className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                        <article className="px-6 py-8 max-w-3xl mx-auto">
                            {/* Cover Image */}
                            {coverImageUrl && (
                                <div className="mb-8 rounded-xl overflow-hidden shadow-md">
                                    <img
                                        src={coverImageUrl}
                                        alt={title || "Cover image"}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                {title || "Untitled Post"}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-slate-600">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4" />
                                    <span>{author}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date().toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{estimatedReadingTime} min read</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-slate-200 mb-8" />

                            {/* Blog Content - Using your exact ReactMarkdown styling */}
                            {content ? (
                                <div className="prose prose-lg prose-slate max-w-none py-8">
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ children }) => (
                                                <h1 className="text-3xl font-bold text-slate-900 mt-12 mb-6 scroll-mt-20">
                                                    {children}
                                                </h1>
                                            ),
                                            h2: ({ children }) => (
                                                <h2 className="text-2xl font-semibold text-slate-800 mt-10 mb-5 scroll-mt-20">
                                                    {children}
                                                </h2>
                                            ),
                                            h3: ({ children }) => (
                                                <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4 scroll-mt-20">
                                                    {children}
                                                </h3>
                                            ),
                                            p: ({ children }) => (
                                                <p className="mb-6 text-slate-700 leading-relaxed text-lg">
                                                    {children}
                                                </p>
                                            ),
                                            a: ({ href, children }) => (
                                                <a
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 hover:decoration-blue-400 transition-colors"
                                                >
                                                    {children}
                                                </a>
                                            ),
                                            blockquote: ({ children }) => (
                                                <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-8 bg-blue-50 rounded-r-lg">
                                                    <div className="text-slate-700 italic text-lg">{children}</div>
                                                </blockquote>
                                            ),
                                            code: ({ children, className }) => {
                                                const isInline = !className;
                                                if (isInline) {
                                                    return (
                                                        <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm font-mono">
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                                return (
                                                    <div className="my-6 rounded-lg overflow-hidden">
                                                        <code className="block bg-slate-900 text-slate-100 p-6 overflow-x-auto text-sm leading-relaxed">
                                                            {children}
                                                        </code>
                                                    </div>
                                                );
                                            },
                                            ul: ({ children }) => (
                                                <ul className="list-disc list-inside space-y-2 my-6 text-slate-700">
                                                    {children}
                                                </ul>
                                            ),
                                            ol: ({ children }) => (
                                                <ol className="list-decimal list-inside space-y-2 my-6 text-slate-700">
                                                    {children}
                                                </ol>
                                            ),
                                            img: ({ src, alt }) => (
                                                <div className="my-8">
                                                    <img
                                                        src={src}
                                                        alt={alt}
                                                        className="w-full rounded-lg shadow-md"
                                                    />
                                                    {alt && (
                                                        <p className="text-center text-sm text-slate-500 mt-2 italic">
                                                            {alt}
                                                        </p>
                                                    )}
                                                </div>
                                            ),
                                        }}
                                    >
                                        {content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p className="text-slate-400 italic text-center py-12">
                                    No content to preview yet. Start writing!
                                </p>
                            )}
                        </article>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent px-6 py-4 border-t border-slate-200">
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
