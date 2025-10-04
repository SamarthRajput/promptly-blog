"use server";

import { db } from "@/lib/db";
import {
  posts,
  postReactions,
  comments,
  postCategories,
  categories,
  user
} from "@/db/schema";
import { and, eq, sql, gte, lte, inArray, desc } from "drizzle-orm";
import { AnalyticsData, MonthlyData, TopPost } from "../types/analytics";
import { syncUser } from "./syncUser";

// Use the actual enum type if available, otherwise use 'as const' to narrow the type
const POST_STATUS_ANALYTICS = [
  "approved",
  "scheduled",
  "under_review",
  "rejected"
] as const; // Adjust as needed
type PostStatus = typeof POST_STATUS_ANALYTICS[number];

export async function getAnalyticsData(
  startDate: Date,
  endDate: Date
): Promise<AnalyticsData> {
  const currentUser = await syncUser();
  if (!currentUser) throw new Error("Unauthorized");

  // Get user from database
  const [dbUser] = await db
    .select()
    .from(user)
    .where(eq(user.clerkId, currentUser.id));

  if (!dbUser) throw new Error("User not found");

  // Total Blogs (published posts: non-archived, non-draft, non-deleted)
  const [totalBlogsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .where(
      and(
        eq(posts.authorId, dbUser.id),
        inArray(posts.status, POST_STATUS_ANALYTICS),
        gte(posts.publishedAt, startDate),
        lte(posts.publishedAt, endDate),
        sql`${posts.deletedAt} IS NULL` // Not deleted
      )
    );

  // Total Likes (by reaction)
  const [totalLikesResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(postReactions)
    .innerJoin(posts, eq(posts.id, postReactions.postId))
    .where(
      and(
        eq(posts.authorId, dbUser.id),
        eq(postReactions.type, "like"), // For "like" only
        gte(postReactions.createdAt, startDate),
        lte(postReactions.createdAt, endDate),
        sql`${posts.deletedAt} IS NULL`
      )
    );

  // Placeholder Views (to be implemented)
  const totalViews = 0;

  // Monthly Data (last 6 months)
  const monthlyData = await getMonthlyEngagementData(
    dbUser.id,
    startDate,
    endDate
  );

  // Top Performing Posts
  const topPosts = await getTopPerformingPosts(
    dbUser.id,
    startDate,
    endDate
  );

  const totalLikes = totalLikesResult.count;
  const engagementRate = totalViews > 0 ? (totalLikes / totalViews) * 100 : 0;

  return {
    totalBlogs: totalBlogsResult.count,
    totalViews,
    totalLikes,
    engagementRate: Number(engagementRate.toFixed(2)),
    monthlyData,
    topPosts
  };
}

async function getMonthlyEngagementData(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<MonthlyData[]> {
  const monthlyResults = await db
    .select({
      month: sql<string>`to_char(${posts.publishedAt}, 'YYYY-MM')`,
      posts: sql<number>`count(*)`,
      likes: sql<number>`coalesce(sum(reaction_counts.like_count), 0)`
    })
    .from(posts)
    .leftJoin(
      sql`(
        SELECT 
          post_id,
          count(*) FILTER (WHERE type = 'like') as like_count
        FROM ${postReactions}
        GROUP BY post_id
      ) as reaction_counts`,
      sql`reaction_counts.post_id = ${posts.id}`
    )
    .where(
      and(
        eq(posts.authorId, userId),
        inArray(posts.status, POST_STATUS_ANALYTICS),
        gte(posts.publishedAt, startDate),
        lte(posts.publishedAt, endDate),
        sql`${posts.deletedAt} IS NULL`
      )
    )
    .groupBy(sql`to_char(${posts.publishedAt}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${posts.publishedAt}, 'YYYY-MM')`);

  return monthlyResults.map((row) => ({
    month: row.month,
    views: 0, // Placeholder until view tracking implemented
    likes: row.likes,
    posts: row.posts
  }));
}

async function getTopPerformingPosts(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<TopPost[]> {
  const topPostsData = await db
    .select({
      id: posts.id,
      title: posts.title,
      categoryName: categories.name,
      publishedAt: posts.publishedAt,
      likes: sql<number>`coalesce(reaction_counts.like_count, 0)`,
      comments: sql<number>`coalesce(comment_counts.comment_count, 0)`
    })
    .from(posts)
    .leftJoin(postCategories, eq(posts.id, postCategories.postId))
    .leftJoin(categories, eq(postCategories.categoryId, categories.id))
    .leftJoin(
      sql`(
        SELECT 
          post_id,
          count(*) FILTER (WHERE type = 'like') as like_count
        FROM ${postReactions}
        GROUP BY post_id
      ) as reaction_counts`,
      sql`reaction_counts.post_id = ${posts.id}`
    )
    .leftJoin(
      sql`(
        SELECT 
          post_id,
          count(*) as comment_count
        FROM ${comments}
        WHERE status = 'visible'
        GROUP BY post_id
      ) as comment_counts`,
      sql`comment_counts.post_id = ${posts.id}`
    )
    .where(
      and(
        eq(posts.authorId, userId),
        inArray(posts.status, POST_STATUS_ANALYTICS),
        gte(posts.publishedAt, startDate),
        lte(posts.publishedAt, endDate),
        sql`${posts.deletedAt} IS NULL`
      )
    )
    .orderBy(desc(sql`coalesce(reaction_counts.like_count, 0)`))
    .limit(10);

  return topPostsData.map((post) => {
    const views = 0; // Placeholder until you implement view tracking
    const engagementRate =
      views > 0 ? ((post.likes + post.comments) / views) * 100 : 0;

    return {
      id: post.id,
      title: post.title,
      category: post.categoryName || "Uncategorized",
      views,
      likes: post.likes,
      comments: post.comments,
      engagementRate: Number(engagementRate.toFixed(2)),
      publishedAt: post.publishedAt!
    };
  });
}
