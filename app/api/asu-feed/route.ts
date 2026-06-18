import { NextResponse } from "next/server";

// FASB publishes ASUs at a known URL pattern — we fetch their news feed
// and filter for ASU announcements
export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  try {
    // Fetch FASB news RSS feed
    const res = await fetch("https://www.fasb.org/rss/news_and_media_rss.jsp", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("FASB feed unavailable");

    const xml = await res.text();

    // Parse items from RSS XML
    const items: { title: string; link: string; pubDate: string; description: string }[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
                    itemXml.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const link  = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || "";
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      const description = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
                          itemXml.match(/<description>(.*?)<\/description>/)?.[1] || "";

      // Only include ASU announcements
      if (title.toLowerCase().includes("accounting standards update") ||
          title.toLowerCase().includes("asu 20")) {
        items.push({ title, link, pubDate, description });
      }
    }

    return NextResponse.json({ items: items.slice(0, 10) });
  } catch {
    // Return empty gracefully — UI handles no-data state
    return NextResponse.json({ items: [], error: "Could not reach FASB feed" });
  }
}
