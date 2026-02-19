export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { getBlogBySlug, getBlogs } from "@/lib/functions/index.js";
import BlogsClient from "@/app/(frontend)/blogs/BlogDetails/BlogsClient.jsx";


export default async function Page({ params }) {
   const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  const blogs = await getBlogs();
  return <BlogsClient blog={blog} blogs={blogs} />;
}
