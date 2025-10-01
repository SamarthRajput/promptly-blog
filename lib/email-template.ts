export const BlogApprovedTemplate = (title: string, author: string, link: string) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #0070f3;">Your blog post "${title}" has been approved!</h1>
        <p>Congratulations ${author}, your blog post has been approved and is now live!</p>
        <p>You can view it here: <a href="${link}" style="color: #0070f3;">${link}</a></p>
    </div>
    `;
};

export const BlogRejectedTemplate = (title: string, author: string, reason: string) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #ff0000;">Your blog post "${title}" has been rejected</h1>
        <p>Hi ${author}, unfortunately, your blog post has been rejected.</p>
        <p>Reason: ${reason}</p>
    </div>
    `;
};

