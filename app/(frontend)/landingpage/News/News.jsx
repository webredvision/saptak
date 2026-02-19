export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import axios from "axios";
import NewsClient from "./NewsClient";

export default async function Page() {
  const apiBase = process.env.NEXT_PUBLIC_DATA_API;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const [ipoRes, marketRes, popularRes] = await Promise.all([
      axios.get(`${apiBase}/api/open-apis/upcoming-news/ipo-news?apikey=${apiKey}`),
      axios.get(`${apiBase}/api/open-apis/upcoming-news/market-news?apikey=${apiKey}`),
      axios.get(`${apiBase}/api/open-apis/upcoming-news/popular-news?apikey=${apiKey}`),
    ]);

    const ipoData = ipoRes?.data || [];
    const marketData = marketRes?.data || [];
    const popularData = popularRes?.data || [];

    return (
      <NewsClient
        newsData={{
          ipo: ipoData || [],
          market: marketData || [],
          popular: popularData || [],
        }}
      />
    );
  } catch (error) {
    console.error("⚠️ Error fetching news:", error);
    return <div>Error loading news</div>;
  }
}
