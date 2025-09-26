"use client";
import React, { useState } from 'react';
import {
    Shield,
    Heart,
    Users,
    CheckCircle,
    XCircle,
    Scale,
    Lightbulb,
    Target,
    ThumbsUp,
    ThumbsDown,
    Info,
    Star,
    Zap,
    UserCheck,
    Copyright
} from 'lucide-react';
import Link from 'next/link';

import { sections, contentGuidelines, communityStandards, bestPractices, enforcementActions, mediaGuidelines, publishingRules } from './RawData';

const GuidelinesPage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const toggleExpanded = (section: string, item: string) => {
        const key = `${section}-${item}`;
        setExpandedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-sky-50 via-white to-indigo-50 border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Shield className="w-4 h-4" />
                            Community Guidelines
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-6">
                            Creating a{' '}
                            <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                                Positive Community
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                            These guidelines help maintain a respectful, creative, and supportive environment
                            for all writers and readers on Promptly Blogs. Please read them carefully.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Navigation Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-8">
                            <nav className="space-y-2">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeSection === section.id
                                            ? 'bg-sky-100 text-sky-700 font-medium'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <section.icon className="w-4 h-4" />
                                        <span className="text-sm">{section.title}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Overview Section */}
                        {activeSection === 'overview' && (
                            <div className="space-y-8">
                                <div className="bg-white rounded-xl border border-slate-200 p-8">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Welcome to Promptly Blogs</h2>
                                    <div className="prose prose-slate max-w-none">
                                        <p className="text-slate-600 leading-relaxed mb-6">
                                            Promptly Blogs is a platform where writers, creators, and readers come together to share
                                            knowledge, stories, and ideas. Our community guidelines ensure that everyone can
                                            participate in a safe, respectful, and inspiring environment.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                                            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                                                <Heart className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                                                <h3 className="font-semibold text-slate-900 mb-2">Respectful</h3>
                                                <p className="text-sm text-slate-600">Treat everyone with kindness and respect</p>
                                            </div>
                                            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                                                <Star className="w-8 h-8 text-green-600 mx-auto mb-3" />
                                                <h3 className="font-semibold text-slate-900 mb-2">Quality</h3>
                                                <p className="text-sm text-slate-600">Create valuable, well-crafted content</p>
                                            </div>
                                            <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                                                <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                                                <h3 className="font-semibold text-slate-900 mb-2">Supportive</h3>
                                                <p className="text-sm text-slate-600">Help others learn and grow</p>
                                            </div>
                                        </div>

                                        <div className="bg-sky-50 border border-sky-200 rounded-lg p-6">
                                            <div className="flex gap-3">
                                                <Info className="w-5 h-5 text-sky-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-sky-900 mb-2">Quick Start</h4>
                                                    <p className="text-sky-700 text-sm">
                                                        New to Promptly Blogs? Start by reading our Content Guidelines and Best Practices
                                                        sections to understand how to create great content that resonates with our community.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content Guidelines Section */}
                        {activeSection === 'content' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-slate-200 p-8">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Content Guidelines</h2>
                                    <p className="text-slate-600 mb-8">
                                        These guidelines ensure that all content on Promptly Blogs meets our quality standards
                                        and contributes positively to our community.
                                    </p>

                                    {contentGuidelines.map((category, index) => (
                                        <div key={index} className="mb-8 last:mb-0">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                                                    <category.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-slate-900">{category.category}</h3>
                                            </div>

                                            <div className="space-y-4">
                                                {category.rules.map((rule, ruleIndex) => (
                                                    <div key={ruleIndex} className="border border-slate-200 rounded-lg p-6">
                                                        <div className="flex items-start gap-3 mb-4">
                                                            {rule.type === 'required' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
                                                            {rule.type === 'recommended' && <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />}
                                                            {rule.type === 'prohibited' && <XCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                                                            <div>
                                                                <h4 className="font-semibold text-slate-900 mb-2">{rule.title}</h4>
                                                                <p className="text-slate-600 mb-4">{rule.description}</p>

                                                                {rule.examples.length > 0 && (
                                                                    <div className="mb-4">
                                                                        <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                                                                            <ThumbsUp className="w-3 h-3" />
                                                                            Good Examples:
                                                                        </h5>
                                                                        <ul className="text-sm text-slate-600 space-y-1">
                                                                            {rule.examples.map((example, i) => (
                                                                                <li key={i} className="flex items-start gap-2">
                                                                                    <span className="text-green-500 mt-1">•</span>
                                                                                    {example}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                {rule.violations.length > 0 && (
                                                                    <div>
                                                                        <h5 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                                                                            <ThumbsDown className="w-3 h-3" />
                                                                            Violations:
                                                                        </h5>
                                                                        <ul className="text-sm text-slate-600 space-y-1">
                                                                            {rule.violations.map((violation, i) => (
                                                                                <li key={i} className="flex items-start gap-2">
                                                                                    <span className="text-red-500 mt-1">•</span>
                                                                                    {violation}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Community Standards Section */}
                        {activeSection === 'community' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-slate-200 p-8">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Community Standards</h2>
                                    <p className="text-slate-600 mb-8">
                                        Our community standards define how we interact with each other to maintain a
                                        positive and supportive environment for all users.
                                    </p>

                                    <div className="space-y-6">
                                        {communityStandards.map((standard, index) => (
                                            <div key={index} className="border border-slate-200 rounded-lg p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <standard.icon className="w-5 h-5 text-sky-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{standard.title}</h3>
                                                        <p className="text-slate-600 mb-4">{standard.description}</p>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center gap-1">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    Expected Behavior:
                                                                </h4>
                                                                <ul className="space-y-2">
                                                                    {standard.rules.map((rule, i) => (
                                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                            <span className="text-green-500 mt-1">•</span>
                                                                            {rule}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center gap-1">
                                                                    <XCircle className="w-4 h-4" />
                                                                    Violations:
                                                                </h4>
                                                                <ul className="space-y-2">
                                                                    {standard.violations.map((violation, i) => (
                                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                            <span className="text-red-500 mt-1">•</span>
                                                                            {violation}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Publishing Rules Section */}
                        {activeSection === 'publishing' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-slate-200 p-8">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Publishing Rules</h2>
                                    <p className="text-slate-600 mb-8">
                                        Understanding these publishing rules will help you make informed decisions about
                                        how to share your content effectively and appropriately.
                                    </p>

                                    {publishingRules.map((section, index) => (
                                        <div key={index} className="mb-8 last:mb-0">
                                            <div className="flex items-center gap-3 mb-6">
                                                <section.icon className="w-6 h-6 text-sky-600" />
                                                <h3 className="text-xl font-semibold text-slate-900">{section.category}</h3>
                                            </div>

                                            <div className="space-y-4">
                                                {section.items.map((item, itemIndex) => (
                                                    <div key={itemIndex} className="border border-slate-200 rounded-lg p-6">
                                                        {'setting' in item ? (
                                                            <>
                                                                <div className="flex items-center gap-3 mb-4">
                                                                    <item.icon className="w-5 h-5 text-slate-600" />
                                                                    <h4 className="font-semibold text-slate-900">{item.setting}</h4>
                                                                    <span className="text-sm text-slate-500">— {item.description}</span>
                                                                </div>
                                                                <ul className="space-y-2">
                                                                    {item.guidelines.map((guideline, i) => (
                                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                            <span className="text-sky-500 mt-1">•</span>
                                                                            {guideline}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <h4 className="font-semibold text-slate-900 mb-2">{item.guideline}</h4>
                                                                <p className="text-slate-600 mb-4">{item.description}</p>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    <div>
                                                                        <h5 className="text-sm font-medium text-green-700 mb-2">Examples:</h5>
                                                                        <ul className="space-y-1">
                                                                            {item.examples.map((example, i) => (
                                                                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                                    <span className="text-green-500 mt-1">•</span>
                                                                                    {example}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>

                                                                    <div>
                                                                        <h5 className="text-sm font-medium text-red-700 mb-2">Avoid:</h5>
                                                                        <ul className="space-y-1">
                                                                            {item.avoid.map((avoid, i) => (
                                                                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                                    <span className="text-red-500 mt-1">•</span>
                                                                                    {avoid}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Collaboration Ethics Section */}
                        {activeSection === 'collaboration' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-slate-200 p-8">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Collaboration Ethics</h2>
                                    <p className="text-slate-600 mb-8">
                                        When collaborating with others, it's important to maintain clear communication,
                                        respect boundaries, and ensure fair attribution of work.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-6">
                                            <div className="border border-slate-200 rounded-lg p-6">
                                                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                                    <UserCheck className="w-5 h-5 text-green-600" />
                                                    Best Practices
                                                </h3>
                                                <ul className="space-y-3">
                                                    {[
                                                        "Clearly define roles and responsibilities",
                                                        "Respect others' writing styles and voices",
                                                        "Communicate openly about expectations",
                                                        "Give proper credit to all contributors",
                                                        "Respect confidentiality agreements",
                                                        "Be responsive to collaboration requests"
                                                    ].map((practice, i) => (
                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            {practice}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="border border-slate-200 rounded-lg p-6">
                                                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                                    <XCircle className="w-5 h-5 text-red-600" />
                                                    Avoid These Issues
                                                </h3>
                                                <ul className="space-y-3">
                                                    {[
                                                        "Taking sole credit for collaborative work",
                                                        "Making major changes without discussion",
                                                        "Sharing private drafts without permission",
                                                        "Ignoring feedback or collaboration requests",
                                                        "Overriding others' contributions unfairly",
                                                        "Breaking confidentiality or trust"
                                                    ].map((issue, i) => (
                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                            <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                            {issue}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5" />
                                            Collaboration Roles
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <h4 className="font-medium text-blue-900 mb-2">Co-Author</h4>
                                                <p className="text-sm text-blue-700">Can edit content and is listed as a co-creator</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-blue-900 mb-2">Contributor</h4>
                                                <p className="text-sm text-blue-700">Can suggest edits and provide feedback</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-blue-900 mb-2">Reviewer</h4>
                                                <p className="text-sm text-blue-700">Can review content and approve for publishing</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Media & Images Section */}
                        {activeSection === 'media' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-slate-200 p-8">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Media & Images Guidelines</h2>
                                    <p className="text-slate-600 mb-8">
                                        Proper use of media enhances your content while respecting copyright and
                                        maintaining quality standards across the platform.
                                    </p>

                                    <div className="space-y-8">
                                        {mediaGuidelines.map((media, index) => (
                                            <div key={index}>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className={`w-10 h-10 rounded-lg ${media.color} flex items-center justify-center`}>
                                                        <media.icon className="w-5 h-5" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-slate-900">{media.type}</h3>
                                                </div>

                                                <div className="space-y-6">
                                                    {media.rules.map((rule, ruleIndex) => (
                                                        <div key={ruleIndex} className="border border-slate-200 rounded-lg p-6">
                                                            <h4 className="font-semibold text-slate-900 mb-3">{rule.title}</h4>
                                                            <p className="text-slate-600 mb-4">{rule.description}</p>

                                                            {rule.allowed && (
                                                                <div className="mb-4">
                                                                    <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                                                                        <CheckCircle className="w-4 h-4" />
                                                                        Allowed:
                                                                    </h5>
                                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                        {rule.allowed.map((item, i) => (
                                                                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                                <span className="text-green-500 mt-1">•</span>
                                                                                {item}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {rule.prohibited && Array.isArray(rule.prohibited) && rule.prohibited.length > 0 && (
                                                                <div className="mb-4">
                                                                    <h5 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                                                                        <XCircle className="w-4 h-4" />
                                                                        Prohibited:
                                                                    </h5>
                                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                        {rule.prohibited.map((item, i) => (
                                                                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                                <span className="text-red-500 mt-1">•</span>
                                                                                {item}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {rule.specs && (
                                                                <div>
                                                                    <h5 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-1">
                                                                        <Info className="w-4 h-4" />
                                                                        Technical Specifications:
                                                                    </h5>
                                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                        {rule.specs.map((spec, i) => (
                                                                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                                <span className="text-blue-500 mt-1">•</span>
                                                                                {spec}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {rule.requirements && (
                                                                <div>
                                                                    <h5 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-1">
                                                                        <Info className="w-4 h-4" />
                                                                        Requirements:
                                                                    </h5>
                                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                        {rule.requirements.map((req, i) => (
                                                                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                                <span className="text-blue-500 mt-1">•</span>
                                                                                {req}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                        <div className="flex gap-3">
                                            <Copyright className="w-5 h-5 text-yellow-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-yellow-900 mb-2">Copyright Notice</h4>
                                                <p className="text-yellow-800 text-sm">
                                                    When in doubt about copyright, don't use the image. Stick to your own content,
                                                    Creative Commons with proper attribution, or properly licensed stock photos.
                                                    Copyright violations can result in immediate content removal and account penalties.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Enforcement Section */}
                        {activeSection === 'enforcement' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-slate-200 p-8">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Enforcement & Consequences</h2>
                                    <p className="text-slate-600 mb-8">
                                        We enforce our guidelines fairly and consistently. The severity of action depends on
                                        the nature and frequency of violations, with an emphasis on education and improvement.
                                    </p>

                                    <div className="space-y-6">
                                        {enforcementActions.map((action, index) => (
                                            <div key={index} className="border border-slate-200 rounded-lg p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                                                        <action.icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{action.level}</h3>
                                                        <p className="text-slate-600 mb-4">{action.description}</p>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <h4 className="text-sm font-medium text-slate-700 mb-2">Actions Taken:</h4>
                                                                <ul className="space-y-1">
                                                                    {action.actions.map((actionItem, i) => (
                                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                            <span className="text-slate-400 mt-1">•</span>
                                                                            {actionItem}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-sm font-medium text-slate-700 mb-2">Common Examples:</h4>
                                                                <ul className="space-y-1">
                                                                    {action.examples.map((example, i) => (
                                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                            <span className="text-slate-400 mt-1">•</span>
                                                                            {example}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                                        <div className="flex gap-3">
                                            <Scale className="w-5 h-5 text-green-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-green-900 mb-2">Appeal Process</h4>
                                                <p className="text-green-800 text-sm mb-3">
                                                    If you believe your content was unfairly moderated, you can appeal the decision:
                                                </p>
                                                <ol className="text-sm text-green-700 space-y-1">
                                                    <li>1. Review the specific guideline that was cited</li>
                                                    <li>2. Submit an appeal through your account settings</li>
                                                    <li>3. Provide additional context or corrections</li>
                                                    <li>4. Wait for review (typically 2-5 business days)</li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Best Practices Section */}
                        {activeSection === 'best-practices' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-slate-200 p-8">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Best Practices for Success</h2>
                                    <p className="text-slate-600 mb-8">
                                        Follow these best practices to create engaging content, build an audience,
                                        and contribute positively to the Promptly Blogs community.
                                    </p>

                                    <div className="space-y-8">
                                        {bestPractices.map((practice, index) => (
                                            <div key={index} className="border border-slate-200 rounded-lg p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                                                        <practice.icon className="w-5 h-5 text-sky-600" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-slate-900">{practice.category}</h3>
                                                </div>

                                                <ul className="space-y-3">
                                                    {practice.tips.map((tip, i) => (
                                                        <li key={i} className="text-slate-600 flex items-start gap-3">
                                                            <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                                            {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                                <Zap className="w-5 h-5" />
                                                Quick Tips for New Writers
                                            </h4>
                                            <ul className="space-y-2 text-sm text-blue-700">
                                                <li>• Start with topics you're passionate about</li>
                                                <li>• Keep your first few posts shorter and focused</li>
                                                <li>• Engage with other writers to build relationships</li>
                                                <li>• Don't worry about perfection - consistency matters more</li>
                                                <li>• Ask for feedback from the community</li>
                                            </ul>
                                        </div>

                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                            <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                                                <Target className="w-5 h-5" />
                                                Growing Your Audience
                                            </h4>
                                            <ul className="space-y-2 text-sm text-purple-700">
                                                <li>• Use relevant tags and categories consistently</li>
                                                <li>• Write compelling headlines that deliver on their promise</li>
                                                <li>• Include a clear call-to-action in your posts</li>
                                                <li>• Share your content on social media appropriately</li>
                                                <li>• Collaborate with other writers in your niche</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <section className="bg-gradient-to-r from-sky-600 to-indigo-600 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Ready to Start Creating?
                    </h2>
                    <p className="text-sky-100 mb-8 max-w-2xl mx-auto">
                        Now that you understand our guidelines, you're ready to join our community
                        and start sharing your unique voice with the world.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white hover:bg-slate-50 text-sky-600 px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer">
                            <Link href="/write">
                                Write Your First Post
                            </Link>
                        </button>
                        <button className="bg-sky-700 hover:bg-sky-800 text-white px-8 py-3 rounded-lg font-semibold border-2 border-sky-500 transition-colors cursor-pointer">
                            <Link href="/community">
                                Join the Community
                            </Link>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GuidelinesPage;