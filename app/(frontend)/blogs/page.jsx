export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { getBlogs } from "@/lib/functions/index.js";
import BlogsClient from "./Blogs/BlogsClient.jsx";


export default async function Page() {
  const blogs = await getBlogs();
  
  return <BlogsClient blogs={blogs} />;
}
