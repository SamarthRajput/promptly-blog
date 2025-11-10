import { serializeDocument } from '@/utils/date-formatter';
import BlogEditor from '@/components/Write/BlogEditor';
import { fetchAllCategories, fetchPostWithCategories } from '@/utils/blog-helper';
import { getCurrentUser } from '@/actions/syncUser';

// Define the expected type for the props
interface BlogPageProps {
    params: Promise<{
        id: string;
    }>;
}

const getBlogData = async (id: string) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error("User not authenticated.");

        const [postData, allCategories] = await Promise.all([
            fetchPostWithCategories(id, currentUser.id, true),
            fetchAllCategories()
        ]);

        if (!postData) return null;

        const { coverImage, categories, comments, reactionCounts, userReactions, ...postFields } = postData;
        const serializedPost = {
            ...serializeDocument(postFields),
            coverImage: coverImage ? serializeDocument(coverImage) : null,
            categories: categories,
            comments: comments,
            reactionCounts: reactionCounts,
            userReactions: userReactions,
            totalComments: postData.totalComments,
            totalReactions: postData.totalReactions,
        };
        return {
            post: serializedPost,
            category: categories,
            categories: allCategories
        };
    } catch (error) {
        console.error('Error fetching blog data:', error);
        return null;
    }
};

const EditBlog = async ({ params }: BlogPageProps) => {
    const { id } = await params;
    const result = await getBlogData(id);

    if (!result || !result.post) {
        return showError(`Blog post not found or you do not have permission to edit this post.
            ${JSON.stringify(result)}
            ${id}
            ${result?.post}`);
    }

    return (
        <div>
            <BlogEditor post={result.post} mode="edit" categories={result.categories} />
        </div>
    );
};

export default EditBlog;

// Error display component
export const showError = (message: string) => (
    <div className="max-w-3xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative
        min-h-[200px] flex items-center justify-center" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{message}</span>
        </div>
    </div>
);