import {
    Shield,
    Heart,
    Users,
    BookOpen,
    AlertTriangle,
    XCircle,
    Eye,
    Lock,
    Globe,
    FileText,
    Image,
    MessageCircle,
    Target,
    Clock,
    Award,
    Star,
    UserCheck,
    Camera,
    Link as LinkIcon,
    Hash,
    Edit3,
    Trash2
} from 'lucide-react';

const sections = [
    { id: 'overview', title: 'Overview', icon: BookOpen },
    { id: 'content', title: 'Content Guidelines', icon: FileText },
    { id: 'community', title: 'Community Standards', icon: Users },
    { id: 'publishing', title: 'Publishing Rules', icon: Globe },
    { id: 'collaboration', title: 'Collaboration Ethics', icon: UserCheck },
    { id: 'media', title: 'Media & Images', icon: Image },
    { id: 'enforcement', title: 'Enforcement', icon: Shield },
    { id: 'best-practices', title: 'Best Practices', icon: Star }
];

const contentGuidelines = [
    {
        category: "Original Content",
        icon: Edit3,
        color: "from-blue-500 to-cyan-500",
        rules: [
            {
                type: "required",
                title: "Create Original Work",
                description: "All content must be your original creation or properly attributed to the original source.",
                examples: ["Write your own articles", "Share personal experiences", "Create unique tutorials"],
                violations: ["Copying from other websites", "Plagiarism", "Republishing without permission"]
            },
            {
                type: "required",
                title: "Proper Attribution",
                description: "When referencing or quoting others, always provide clear attribution and links to sources.",
                examples: ["Quote with source links", "Credit image creators", "Reference research papers"],
                violations: ["Using quotes without attribution", "Claiming others' work as your own"]
            }
        ]
    },
    {
        category: "Quality Standards",
        icon: Award,
        color: "from-green-500 to-emerald-500",
        rules: [
            {
                type: "recommended",
                title: "Well-Structured Content",
                description: "Use clear headings, proper formatting, and logical flow to make your content easy to read.",
                examples: ["Use H1, H2, H3 headings", "Break up long paragraphs", "Include bullet points"],
                violations: ["Wall of text", "No structure or headings", "Poor formatting"]
            },
            {
                type: "required",
                title: "Factual Accuracy",
                description: "Ensure your content is accurate and fact-checked, especially for educational or informational posts.",
                examples: ["Verify statistics", "Link to credible sources", "Update outdated information"],
                violations: ["Spreading misinformation", "Making false claims", "Sharing conspiracy theories"]
            }
        ]
    },
    {
        category: "Prohibited Content",
        icon: XCircle,
        color: "from-red-500 to-pink-500",
        rules: [
            {
                type: "prohibited",
                title: "Harmful Content",
                description: "Content that promotes violence, harassment, hate speech, or illegal activities is strictly prohibited.",
                examples: [],
                violations: ["Hate speech", "Violence promotion", "Harassment", "Illegal activities", "Self-harm content"]
            },
            {
                type: "prohibited",
                title: "Spam and Low-Quality",
                description: "Avoid posting repetitive, promotional, or low-effort content that doesn't add value.",
                examples: [],
                violations: ["Excessive self-promotion", "Keyword stuffing", "Clickbait titles", "AI-generated spam"]
            }
        ]
    }
];

const communityStandards = [
    {
        title: "Respectful Interaction",
        icon: Heart,
        description: "Treat all community members with respect and kindness",
        rules: [
            "Use respectful language in comments and discussions",
            "Disagree constructively without personal attacks",
            "Welcome new members and help them learn",
            "Respect different perspectives and backgrounds"
        ],
        violations: [
            "Personal attacks or insults",
            "Discriminatory language",
            "Trolling or harassment",
            "Gatekeeping behavior"
        ]
    },
    {
        title: "Constructive Feedback",
        icon: MessageCircle,
        description: "Provide helpful and constructive feedback to fellow writers",
        rules: [
            "Offer specific, actionable feedback",
            "Balance criticism with positive observations",
            "Focus on the content, not the person",
            "Ask questions to encourage discussion"
        ],
        violations: [
            "Purely negative criticism",
            "Vague or unhelpful comments",
            "Personal attacks disguised as feedback"
        ]
    },
    {
        title: "Community Support",
        icon: Users,
        description: "Help build a supportive writing community",
        rules: [
            "Share knowledge and resources",
            "Promote other writers' good content",
            "Participate in community discussions",
            "Report inappropriate content"
        ],
        violations: [
            "Deliberately undermining others",
            "Withholding help out of competition",
            "Ignoring community guidelines"
        ]
    }
];

const publishingRules = [
    {
        category: "Visibility Settings",
        icon: Eye,
        items: [
            {
                setting: "Public",
                icon: Globe,
                description: "Visible to everyone on the internet",
                guidelines: [
                    "Ensure content meets all community guidelines",
                    "Consider SEO and discoverability",
                    "Use appropriate tags and categories",
                    "Include compelling meta descriptions"
                ]
            },
            {
                setting: "Unlisted",
                icon: LinkIcon,
                description: "Only accessible via direct link",
                guidelines: [
                    "Perfect for sharing with specific audiences",
                    "Still subject to community guidelines",
                    "Won't appear in search results",
                    "Useful for drafts or limited sharing"
                ]
            },
            {
                setting: "Private",
                icon: Lock,
                description: "Only visible to you and collaborators",
                guidelines: [
                    "Use for personal drafts and notes",
                    "Share with trusted collaborators only",
                    "Can be changed to public later",
                    "Perfect for work-in-progress content"
                ]
            }
        ]
    },
    {
        category: "Tagging & Categories",
        icon: Hash,
        items: [
            {
                guideline: "Relevant Tags Only",
                description: "Use tags that accurately describe your content",
                examples: ["Technology, Tutorial, Review", "Personal Story, Travel, Food", "Business, Marketing, Tips"],
                avoid: ["Popular tags just for visibility", "Irrelevant trending tags", "Excessive tag stuffing"]
            },
            {
                guideline: "Appropriate Categories",
                description: "Choose the most fitting category for your post",
                examples: ["Tech articles in Technology", "Personal stories in Lifestyle", "Tutorials in Education"],
                avoid: ["Miscategorizing for visibility", "Using multiple unrelated categories"]
            }
        ]
    }
];

const mediaGuidelines = [
    {
        type: "Images",
        icon: Image,
        color: "bg-purple-100 text-purple-600",
        rules: [
            {
                title: "Copyright Compliance",
                description: "Only use images you own or have permission to use",
                allowed: ["Your own photos", "Creative Commons with attribution", "Stock photos with license", "Screenshots of your own work"],
                prohibited: ["Copyrighted images without permission", "Images from Google search", "Screenshots of others' content"],
                requirements: []//an empty array to fix the error
            },
            {
                title: "Quality Standards",
                description: "Use high-quality, relevant images that enhance your content",
                specs: ["Minimum 800px width recommended", "JPG, PNG, WebP formats", "Maximum 10MB file size", "Proper alt text for accessibility"],
                requirements: [],
                allowed: [],
                prohibited: []
            }
        ]
    },
    {
        type: "Videos & Audio",
        icon: Camera,
        color: "bg-green-100 text-green-600",
        rules: [
            {
                title: "File Requirements",
                description: "Follow technical specifications for media uploads",
                specs: ["MP4, WebM for video", "MP3, WAV for audio", "Maximum 100MB for videos", "Maximum 25MB for audio files"],
                requirements: [],
                allowed: [],
                prohibited: []
            },
            {
                title: "Content Standards",
                description: "Ensure media content follows the same guidelines as written content",
                requirements: ["Original or licensed content", "Appropriate for all audiences", "Good audio/video quality", "Relevant to the article"],
                allowed: [],
                prohibited: []
            }
        ]
    }
];

const enforcementActions = [
    {
        level: "Warning",
        icon: AlertTriangle,
        color: "text-yellow-600 bg-yellow-100",
        description: "First-time or minor violations receive a warning",
        actions: ["Educational notification", "Opportunity to edit content", "Guidelines clarification"],
        examples: ["Minor formatting issues", "Unclear attribution", "Borderline content quality"]
    },
    {
        level: "Content Removal",
        icon: Trash2,
        color: "text-orange-600 bg-orange-100",
        description: "Content that violates guidelines will be removed",
        actions: ["Post hidden from public view", "Author notification", "Appeal process available"],
        examples: ["Plagiarized content", "Spam", "Inappropriate material"]
    },
    {
        level: "Account Suspension",
        icon: Clock,
        color: "text-red-600 bg-red-100",
        description: "Repeated violations may result in temporary suspension",
        actions: ["Temporary account restriction", "Content review period", "Re-education requirements"],
        examples: ["Multiple content violations", "Community harassment", "Spam campaigns"]
    },
    {
        level: "Permanent Ban",
        icon: XCircle,
        color: "text-red-700 bg-red-100",
        description: "Severe or repeated violations result in permanent removal",
        actions: ["Account permanently disabled", "All content removed", "IP address blocked"],
        examples: ["Hate speech", "Doxxing", "Severe harassment", "Illegal content"]
    }
];

const bestPractices = [
    {
        category: "Writing Excellence",
        icon: Edit3,
        tips: [
            "Start with a compelling headline that accurately represents your content",
            "Use the first paragraph to hook readers and preview what's coming",
            "Break up long content with subheadings and bullet points",
            "End with a clear conclusion or call-to-action",
            "Proofread before publishing - use spell check and grammar tools"
        ]
    },
    {
        category: "Engagement",
        icon: Heart,
        tips: [
            "Respond to comments on your posts within 24-48 hours",
            "Ask questions to encourage reader interaction",
            "Share your posts on social media with proper context",
            "Engage with other writers' content authentically",
            "Join community discussions and provide value"
        ]
    },
    {
        category: "Growth",
        icon: Target,
        tips: [
            "Publish consistently to build an audience",
            "Collaborate with other writers on joint projects",
            "Cross-reference your own relevant posts",
            "Update and improve your older content",
            "Analyze your post performance and learn from successful content"
        ]
    }
];

export { sections, contentGuidelines, communityStandards, bestPractices, enforcementActions, mediaGuidelines, publishingRules };